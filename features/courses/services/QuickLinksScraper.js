/**
 * @file QuickLinksScraper.js
 * @description Scraper alternativo usando modal "Links Rápidos" do Blackboard
 * @architecture Screaming Architecture - Service Layer
 */

/**
 * @typedef {import('../models/Week.js').WeekItem} WeekItem
 */

export class QuickLinksScraper {
  /**
   * Extrai items do modal "Links Rápidos" (executado inline na página)
   * @param {Document} dom - Documento onde buscar (padrão: document global)
   * @returns {Partial<WeekItem>[]}
   */
  static extractFromModal(dom = document) {
    try {
      const items = [];
      const links = dom.querySelectorAll('li.quick_links_header_h3 a');

      links.forEach((link) => {
        // Extrai texto limpo
        const name = link.textContent.trim().replace(/\s+/g, ' ');

        if (!name) return; // Pula links vazios

        // Tenta extrair ID do onclick
        const onclick = link.getAttribute('onclick');
        let id = null;

        if (onclick) {
          // onclick format: quickLinks.messageHelper.activateElement("2641727", "anonymous_element_9", ...)
          // Extrair SEGUNDO parâmetro (elementId), não o primeiro (frameId)
          const match = onclick.match(
            /activateElement\s*\(\s*["'][^"']+["']\s*,\s*["']([^"']+)["']/
          );
          if (match && match[1]) {
            id = match[1];
          }
        }

        items.push({
          name,
          id,
          type: 'document', // Tipo padrão, pode ser categorizado depois
        });
      });

      return items;
    } catch {
      return [];
    }
  }

  /**
   * Scrape items do modal "Links Rápidos" em uma página do AVA
   * @param {string} _weekUrl - URL da semana (usado para contexto, mas scraping é na aba AVA atual)
   * @returns {Promise<Array>} - Items extraídos
   */
  static async scrapeFromQuickLinks(_weekUrl) {
    // 1. Encontrar aba do AVA
    // 1. Prioridade: Aba Ativa (onde o usuário está olhando)
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    let tab = tabs.find((t) => t.url && t.url.includes('ava.univesp.br'));

    // 2. Fallback: Qualquer aba do AVA (se o usuário estiver na extensão fora do contexto)
    if (!tab) {
      tabs = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });
      tab = tabs[0];
    }

    if (!tab) {
      throw new Error('Nenhuma aba do AVA encontrada para scraping de Links Rápidos.');
    }

    // 2. Executar scraping inline (com abertura automática do modal)
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async () => {
        // 1. Verificar se modal já está populado
        let links = document.querySelectorAll('li.quick_links_header_h3 a');

        // 2. Se vazio, abrir modal Links Rápidos
        if (links.length === 0) {
          const quickLinksBtn = document.getElementById('quick_links_lightbox_link');

          if (!quickLinksBtn) {
            return [];
          }

          quickLinksBtn.click();

          // 3. Aguardar modal popular (polling com timeout extendido para 10s)
          const maxAttempts = 100; // 10 segundos (100 x 100ms)
          let attempts = 0;

          while (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            links = document.querySelectorAll('li.quick_links_header_h3 a');

            if (links.length > 0) {
              break;
            }

            attempts++;
          }

          if (links.length === 0) {
            return [];
          }
        }

        // 4. Scraping dos links
        const items = [];

        links.forEach((link, _index) => {
          const name = link.textContent.trim().replace(/\s+/g, ' ');

          if (!name) return;

          // Extrai ID do onclick (SEGUNDO parâmetro = elementId)
          const onclick = link.getAttribute('onclick');
          let id = null;

          if (onclick) {
            const match = onclick.match(
              /activateElement\s*\(\s*["'][^"']+["']\s*,\s*["']([^"']+)["']/
            );
            if (match && match[1]) {
              id = match[1];
            }
          }

          items.push({ name, id, type: 'document' });
        });

        // 5. Limpeza de casa: Fechar o modal para evitar bloqueios futuros
        const closeBtn = document.querySelector('a.lbAction[href="#close"]');
        if (closeBtn) {
          /** @type {HTMLElement} */ (closeBtn).click();
        }

        return items;
      },
    });

    const items = results[0]?.result || [];
    return items;
  }
}
