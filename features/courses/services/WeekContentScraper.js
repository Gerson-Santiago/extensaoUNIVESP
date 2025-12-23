export class WeekContentScraper {
  /**
   * Scrapes week content from AVA by injecting script into active tab
   * @param {string} _weekUrl - URL da semana
   * @returns {Promise<Array<{name: string, url: string, type: string, status?: 'TODO'|'DOING'|'DONE'}>>}
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
      let needsNavigation = false;

      // 2. Try to find EXACT match (course AND week)
      if (targetCourseId && targetContentId) {
        tab = tabs.find(t =>
          t.url &&
          t.url.includes(targetCourseId) &&
          t.url.includes(targetContentId)
        );

        // 3. If exact not found, find course tab and navigate
        if (!tab) {
          console.warn(`WeekContentScraper: Aba exata não encontrada (course: ${targetCourseId}, content: ${targetContentId})`);
          tab = tabs.find(t => t.url && t.url.includes(targetCourseId));
          if (tab && _weekUrl) {
            // eslint-disable-next-line no-console
            console.log(`WeekContentScraper: Navegando aba ${tab.id} para ${_weekUrl}`);
            await chrome.tabs.update(tab.id, { url: _weekUrl, active: true });

            // Wait for navigation using chrome.tabs.onUpdated listener (more reliable)
            await WeekContentScraper.waitForTabLoad(tab.id, 10000);

            // Validate navigation succeeded
            const isValid = await WeekContentScraper.validateTabUrl(tab.id, targetCourseId, targetContentId);
            if (!isValid) {
              console.warn(`WeekContentScraper: Navegação falhou - URL não corresponde ao esperado após ${tab.id}`);
            }

            needsNavigation = true;
          }
        }
      }

      // 4. Fallback: Active Tab or First Available
      if (!tab) {
        console.warn('WeekContentScraper: Fallback para aba ativa ou primeira disponível');
        tab = tabs.find(t => t.active) || tabs[0];
      }

      if (!tab || !tab.id) {
        throw new Error('Nenhuma aba do AVA encontrada para realizar o scraping.');
      }

      // eslint-disable-next-line no-console
      console.log(`WeekContentScraper: Scraping na aba [${tab.id}] ${tab.url} (Alvo: course=${targetCourseId}, content=${targetContentId}, navegou=${needsNavigation})`);

      // eslint-disable-next-line no-console
      console.log('WeekContentScraper: Usando aba para scraping:', tab.url, tab.id);

      // Wait for page to be fully loaded (more robust approach)
      let retries = 3;
      let items = [];

      while (retries > 0) {
        // Wait a bit between retries
        await new Promise(resolve => setTimeout(resolve, 1500));

        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: WeekContentScraper.extractItemsFromDOM,
        });

        items = results[0]?.result || [];

        // eslint-disable-next-line no-console
        console.log(`WeekContentScraper: Tentativa ${4 - retries}: ${items.length} itens encontrados`);

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
   * Extrai itens de tarefa do DOM atual - VERSÃO ROBUSTA COM ESPERA
   * @param {Document} dom - Documento onde buscar (padrão: document global)
   * @returns {Array<{name: string, url: string, type: string, status?: 'TODO'|'DOING'|'DONE'}>}
   */
  static extractItemsFromDOM(dom = document) {
    try {
      // Debug: Verificar contexto
      console.warn('[WeekContentScraper] extractItemsFromDOM iniciado');
      console.warn('[WeekContentScraper] URL atual:', dom.location?.href || 'N/A');
      console.warn('[WeekContentScraper] DOM readyState:', dom.readyState);

      const items = [];

      // Tentar múltiplos seletores (fallback)
      let listItems = dom.querySelectorAll('li[id^="contentListItem:"]');

      if (listItems.length === 0) {
        console.warn('[WeekContentScraper] Seletor principal retornou 0. Tentando seletores alternativos...');

        // Fallback 1: Qualquer LI com class liItem
        listItems = dom.querySelectorAll('li.liItem');
        console.warn('[WeekContentScraper] Fallback 1 (li.liItem):', listItems.length, 'elementos');
      }

      if (listItems.length === 0) {
        // Fallback 2: Qualquer LI dentro de contentList
        listItems = dom.querySelectorAll('#contentList li, .contentList li, ul.contentList li');
        console.warn('[WeekContentScraper] Fallback 2 (contentList li):', listItems.length, 'elementos');
      }

      console.warn(`[WeekContentScraper] Total de elementos encontrados: ${listItems.length}`);

      listItems.forEach((li, _index) => {
        try {
          // Estratégia SIMPLES: pegar todo o texto e qualquer link
          const fullText = li.textContent || '';

          // Buscar QUALQUER link dentro do li
          const allLinks = li.querySelectorAll('a');
          let url = '';
          let name = '';

          // Prioridade: link dentro de h3, senão primeiro link, senão iframe
          const h3Link = /** @type {HTMLAnchorElement} */ (li.querySelector('h3 a'));
          if (h3Link && h3Link.href) {
            url = h3Link.href;
            // Pegar apenas o texto do SPAN ou do próprio link (ignorando imgs/outros elementos)
            const span = h3Link.querySelector('span');
            if (span) {
              name = span.textContent.trim();
            } else {
              name = h3Link.textContent.trim();
            }

            // Limpar possíveis espaços/quebras extras
            name = name.replace(/\s+/g, ' ').trim();
          } else if (allLinks.length > 0) {
            // Pega o primeiro link que não seja vazio ou "ally"
            for (const link of allLinks) {
              const anchorLink = /** @type {HTMLAnchorElement} */ (link);
              if (anchorLink.href && !anchorLink.href.includes('#') && !anchorLink.className.includes('ally')) {
                url = anchorLink.href;
                name = anchorLink.textContent.trim().replace(/\s+/g, ' ');
                break;
              }
            }
          }

          // Se ainda não tem URL, tenta iframe
          if (!url) {
            const iframe = li.querySelector('iframe');
            if (iframe && iframe.src) {
              url = iframe.src;
            }
          }

          // Se ainda não tem nome, extrai do h3 ou do texto completo
          if (!name) {
            const h3 = li.querySelector('h3');
            if (h3) {
              name = h3.textContent.trim().replace(/\s+/g, ' ');
            } else {
              // Última opção: primeiras 100 chars do texto
              name = fullText.substring(0, 100).trim().replace(/\s+/g, ' ');
            }
          }

          // Detect Status
          let status = undefined;
          const button = li.querySelector('.button-5');
          if (button) {
            const btnText = button.textContent.trim();
            if (btnText.includes('Revisto')) {
              status = 'DONE';
            } else if (btnText.includes('Marca Revista')) {
              status = 'TODO';
            }
          }

          // Detect Type
          let type = 'document';
          const iconImg = /** @type {HTMLImageElement} */ (li.querySelector('img.item_icon'));
          if (iconImg) {
            type = this.detectType(iconImg.src, iconImg.alt);
          } else {
            type = this.detectTypeFromUrl(url);
          }

          // Só adiciona item se tiver pelo menos nome E URL
          if (name && url) {
            items.push({
              name,
              url,
              type,
              ...(status && { status }),
            });
          } else {
            console.warn('[WeekContentScraper] Item ignorado (sem name ou url):', { name, url });
          }
        } catch (e) {
          console.error('[WeekContentScraper] Error parsing week item:', e);
        }
      });

      console.warn(`[WeekContentScraper] Retornando ${items.length} itens válidos`);
      return items;
    } catch (error) {
      console.error('[WeekContentScraper] Erro ao extrair dados do DOM:', error);
      console.error('[WeekContentScraper] Stack trace:', error.stack);
      return []; // Retorna array vazio em caso de erro
    }
  }

  /**
   * Detecta o tipo de tarefa baseado no ícone
   * @param {string} iconSrc - URL do ícone
   * @param {string} altText - Texto alternativo do ícone
   * @returns {string} - Tipo normalizado
   */
  static detectType(iconSrc, altText) {
    const src = (iconSrc || '').toLowerCase();
    const alt = (altText || '').toLowerCase();

    if (src.includes('video') || alt.includes('video')) return 'video';
    if (src.includes('pdf') || alt.includes('pdf') || alt.includes('arquivo')) return 'pdf';
    if (
      src.includes('quiz') ||
      alt.includes('quiz') ||
      alt.includes('questionário') ||
      alt.includes('questionario')
    )
      return 'quiz';
    if (src.includes('forum') || alt.includes('forum') || alt.includes('fórum')) return 'forum';
    if (src.includes('url') || alt.includes('url')) return 'url';

    return 'document';
  }

  static detectTypeFromUrl(url) {
    if (!url) return 'document';
    const lower = url.toLowerCase();
    if (lower.includes('/mod/quiz/')) return 'quiz';
    if (lower.includes('/mod/forum/')) return 'forum';
    if (lower.includes('/mod/url/')) return 'url';
    if (lower.includes('/mod/resource/')) return 'pdf';
    return 'document';
  }

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
