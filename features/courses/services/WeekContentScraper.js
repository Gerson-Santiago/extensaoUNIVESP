/**
 * @typedef {import('../models/Week.js').WeekItem} WeekItem
 */

import { StrategyRegistry } from './WeekContentScraper/StrategyRegistry.js';

export class WeekContentScraper {
  /**
   * Scrapes week content from AVA by injecting script into active tab
   * @param {string} _weekUrl - URL da semana
   * @returns {Promise<WeekItem[]>}
   */
  static async scrapeWeekContent(_weekUrl) {
    try {
      // For testing: mock in jest will intercept this
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        throw new Error('Chrome APIs not available');
      }

      // 0. Parse target Course ID and Content ID from week URL
      let targetCourseId = null;
      let targetContentId = null;

      if (_weekUrl) {
        const courseMatch = _weekUrl.match(/course_id=(_\d+_\d+)/);
        const contentMatch = _weekUrl.match(/content_id=(_\d+_\d+)/);
        if (courseMatch) targetCourseId = courseMatch[1];
        if (contentMatch) targetContentId = contentMatch[1];
      }

      // 1. Get all AVA tabs
      const tabs = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });

      let tab = null;

      // 2. Try to find EXACT match (course AND week)
      if (targetCourseId && targetContentId) {
        tab = tabs.find(
          (t) => t.url && t.url.includes(targetCourseId) && t.url.includes(targetContentId)
        );

        // 3. If exact not found, find course tab and navigate
        if (!tab) {
          console.warn(
            `WeekContentScraper: Aba exata não encontrada (course: ${targetCourseId}, content: ${targetContentId})`
          );
          tab = tabs.find((t) => t.url && t.url.includes(targetCourseId));
          if (tab && _weekUrl) {
            // eslint-disable-next-line no-console
            console.log(`WeekContentScraper: Navegando aba ${tab.id} para ${_weekUrl}`);
            await chrome.tabs.update(tab.id, { url: _weekUrl, active: true });

            // Wait for navigation using chrome.tabs.onUpdated listener (more reliable)
            await WeekContentScraper.waitForTabLoad(tab.id, 10000);

            // Validate navigation succeeded
            const isValid = await WeekContentScraper.validateTabUrl(
              tab.id,
              targetCourseId,
              targetContentId
            );
            if (!isValid) {
              console.warn(
                `WeekContentScraper: Navegação falhou - URL não corresponde ao esperado após ${tab.id}`
              );
            }
          }
        }
      }

      // 4. Fallback: Active Tab or First Available
      if (!tab) {
        console.warn('WeekContentScraper: Fallback para aba ativa ou primeira disponível');
        tab = tabs.find((t) => t.active) || tabs[0];
      }

      if (!tab || !tab.id) {
        throw new Error('Nenhuma aba do AVA encontrada para realizar o scraping.');
      }

      console.error('🔍 WeekContentScraper: ANTES de executeScript, tab:', tab.id, tab.url);

      // Wait for page to be fully loaded (more robust approach)
      let retries = 3;
      let items = [];

      while (retries > 0) {
        // Wait a bit between retries
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.error(
          `🔍 WeekContentScraper: Tentativa ${4 - retries} - Executando script na aba ${tab.id}`
        );

        // AQUI ESTÁ A MUDANÇA PRINCIPAL:
        // Como o script executado no contexto da página não tem acesso aos nossos módulos JS importados,
        // precisamos injetar a lógica de extração de uma forma que ela funcione "inline".
        // Porém, como refatoramos para Strategy Pattern com várias classes, não podemos injetar classes facilmente via `func`.
        //
        // SOLUÇÃO HYBRID:
        // O `executeScript` vai extrair APENAS o HTML bruto dos itens (serializado) ou
        // continuaremos a usar a lógica de DOM parsing, mas agora vamos replicar o comportamento simplificado
        // OU (melhor), vamos usar `extractItemsFromDOM` localmente se estivermos rodando em teste unitário (JSDOM),
        // mas em produção (Chrome), precisamos injetar o código concatenado ou manter uma versão simplificada inline.
        //
        // PERA! `extractItemsFromDOM` é estático e usado tanto no teste quanto (potencialmente) injetado?
        // No código original, `executeScript` tinha uma função `func` GIGANTE que duplicava a lógica.
        // E `extractItemsFromDOM` TAMBÉM existia repetindo código.
        //
        // Abordagem Segura para Refatoração Green-Green:
        // O `WeekContentScraper.scrapeWeekContent` (Contexto Chrome) precisa injetar código que rode na página.
        // Se usarmos classes ES6 no `func`, o Chrome pode reclamar se não bundlarmos.
        //
        // VAMOS MANTER A LÓGICA DE INJEÇÃO EXTRAINDO DADOS ESTRUTURADOS SIMPLES (JSON),
        // E PROCESSAR COM AS ESTRATÉGIAS NO LADO DA EXTENSÃO?
        //
        // Não, porque elementos do DOM como `element.querySelector` só existem lá.
        //
        // NOVA ESTRATÉGIA:
        // O `func` dentro de `executeScript` vai coletar dados brutos (básicos) do DOM
        // e retornar para o contexto da extensão (Service Worker / Popup).
        // Aí sim, no lado de cá, passamos pelas Strategies?
        // Não, porque as Strategies dependem de analisar a estrutura do DOM (classes, ícones, hrefs).
        //
        // VOLTANDO AO PLANO: O `extractItemsFromDOM` é o método testável.
        // O `executeScript` deve injetar e chamar `extractItemsFromDOM`?
        // Não tem como injetar métodos estáticos complexos com dependências sem bundler.

        // VAMOS FAZER O SEGUINTE:
        // Vamos focar em limpar o `extractItemsFromDOM` que roda no ambiente de TESTE (JSDOM) e que provavelmente
        // é usado em outros lugares (como `DetailsActivitiesWeekView` se ele fizer parse local).
        //
        // Mas espere, o `scrapeWeekContent` chama `chrome.scripting.executeScript`.
        // A função passada para `func` NÃO tem acesso ao escopo externo.
        // Então minhas Strategies criadas em arquivos separados NÃO VÃO FUNCIONAR dentro do `executeScript`
        // a menos que eu as injete como arquivos (`files: [...]`).
        //
        // CORREÇÃO DE ROTA AUTOMÁTICA (SELF-CORRECTION):
        // Para usar Strategy Pattern dentro do Content Script (injetado), precisamos carregar os arquivos JS na página
        // OU bundlar tudo num arquivo só.
        // Como o projeto não usa Webpack/Rollup para esse "injected script", a injeção via `func` fica limitada.
        //
        // Alternative: Usar `files` em vez de `func` no executeScript.
        // await chrome.scripting.executeScript({ target: { tabId }, files: ['scraper-bundle.js'] });
        // Mas não temos bundler.
        //
        // PLANO ATUALIZADO (ADAPTIVE):
        // Vou refatorar `extractItemsFromDOM` para usar as Strategies.
        // No `scrapeWeekContent`, em vez de `func: () => { ...código duplicado... }`,
        // eu vou fazer algo mais inteligente:
        // Vou ler o DOM bruto da página através de um script simples que retorna o HTML do `ul.content`.
        // E aí, no lado seguro da extensão (onde minhas classes existem), eu crio um DOM virtual (DOMParser)
        // e rodo o `extractItemsFromDOM` refatorado.
        //
        // ISSO RESOLVE TUDO!
        // 1. Remove código duplicado e inseguro de dentro do `executeScript`.
        // 2. Traz a lógica para o ambiente controlado da extensão onde módulos funcionam.
        // 3. Facilita testes (não precisa mockar injeção de script, só input HTML).

        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // Script levíssimo que só extrai o HTML relevante
            const root1 = document.querySelector('ul.content');
            if (root1) return root1.outerHTML;

            const root2 = document.querySelector('#contentList');
            if (root2) return root2.outerHTML;

            // Fallback: retornar body (caro, mas garantido) ou null
            return document.body.outerHTML;
          },
        });

        const htmlContent = results[0]?.result;

        if (htmlContent) {
          // Parse no lado da extensão
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, 'text/html');
          items = WeekContentScraper.extractItemsFromDOM(doc);
        }

        console.error(
          `🔍 WeekContentScraper: Tentativa ${4 - retries} RETORNOU ${items.length} itens`
        );

        if (items.length > 0) {
          break; // Success!
        }

        retries--;
      }

      return items;
    } catch (error) {
      console.error('Error scraping week content:', error);
      throw error;
    }
  }

  /**
   * Extrai itens de tarefa do DOM atual usando Strategy Pattern
   * @param {Document} dom - Documento onde buscar (padrão: document global)
   * @returns {WeekItem[]}
   */
  static extractItemsFromDOM(dom = document) {
    try {
      // Registrar estratégias
      const registry = new StrategyRegistry();
      const items = [];

      // Seletores de lista (mantidos da lógica original para compatibilidade)
      let listItems = dom.querySelectorAll('li[id^="contentListItem:"]');
      if (listItems.length === 0) listItems = dom.querySelectorAll('li.liItem');
      if (listItems.length === 0)
        listItems = dom.querySelectorAll('#contentList li, .contentList li, ul.contentList li');

      console.warn(`[WeekContentScraper] Total de elementos para processar: ${listItems.length}`);

      listItems.forEach((li) => {
        try {
          const strategy = registry.getStrategy(/** @type {HTMLElement} */ (li));
          if (strategy) {
            const item = strategy.extract(/** @type {HTMLElement} */ (li));
            if (item) {
              items.push(item);
            }
          }
        } catch (e) {
          console.error('[WeekContentScraper] Erro ao processar item individual:', e);
        }
      });

      return items;
    } catch (error) {
      console.error('[WeekContentScraper] Erro ao extrair dados do DOM:', error);
      return [];
    }
  }

  // Métodos auxiliares de navegação (mantidos idênticos)

  /**
   * Valida se a URL da aba corresponde aos IDs esperados
   * @param {number} tabId - ID da aba
   * @param {string} expectedCourseId - ID do curso esperado
   * @param {string} expectedContentId - ID do conteúdo esperado
   * @returns {Promise<boolean>}
   */
  static async validateTabUrl(tabId, expectedCourseId, expectedContentId) {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (!tab || !tab.url) return false;

      const hasCourse = expectedCourseId ? tab.url.includes(expectedCourseId) : true;
      const hasContent = expectedContentId ? tab.url.includes(expectedContentId) : true;

      return hasCourse && hasContent;
    } catch (error) {
      console.error('WeekContentScraper: Erro ao validar URL da aba:', error);
      return false;
    }
  }

  /**
   * Aguarda o carregamento completo da aba usando chrome.tabs.onUpdated
   * @param {number} tabId - ID da aba
   * @param {number} timeout - Timeout em ms (padrão: 10000)
   * @returns {Promise<void>}
   */
  static async waitForTabLoad(tabId, timeout = 10000) {
    return new Promise((resolve, _reject) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(); // Não rejeitamos, apenas resolvemos após timeout
      }, timeout);

      const listener = (updatedTabId, changeInfo, _tab) => {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          // eslint-disable-next-line no-console
          console.log(`WeekContentScraper: Aba ${tabId} carregada completamente`);
          resolve();
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });
  }
}
