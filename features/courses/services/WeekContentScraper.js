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

      const [tab] = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });
      if (!tab || !tab.id) {
        throw new Error('AVA tab not found');
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: WeekContentScraper.extractItemsFromDOM,
      });

      return results[0]?.result || [];
    } catch (error) {
      console.error('Error scraping week content:', error);
      throw error;
    }
  }

  /**
   * Extrai itens de tarefa do DOM atual (uma página de curso no AVA)
   * @returns {Array<{name: string, url: string, type: string, status?: 'TODO'|'DOING'|'DONE'}>}
   */
  static extractItemsFromDOM(dom = document) {
    try {
      const items = [];
      const listItems = dom.querySelectorAll('li[id^="contentListItem:"]');

      listItems.forEach((li) => {
        try {
          const anchor = /** @type {HTMLAnchorElement} */ (li.querySelector('h3 a'));
          if (!anchor) return;

          const name = anchor.textContent.trim();
          const url = anchor.href;

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

          items.push({
            name,
            url,
            type,
            ...(status && { status }),
          });
        } catch (e) {
          console.error('Error parsing week item:', e);
        }
      });

      return items;
    } catch (error) {
      console.error('WeekContentScraper: Erro ao extrair dados do DOM', error);
      throw new Error('Falha ao processar conteúdo da semana.');
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
}
