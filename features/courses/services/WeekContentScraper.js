export class WeekContentScraper {
  /**
   * Extrai itens de tarefa do DOM atual (uma página de curso no AVA)
   * @returns {Array<import('../models/Week.js').WeekItem>}
   */
  static extractItemsFromDOM() {
    const items = [];
    const listItems = document.querySelectorAll('li[id^="contentListItem:"]');

    listItems.forEach((li) => {
      try {
        const anchor = /** @type {HTMLAnchorElement} */ (li.querySelector('h3 a'));
        if (!anchor) return;

        const name = anchor.textContent.trim();
        const url = anchor.href;

        // Detect Status
        let status = undefined;
        // O botão tem classe 'button-5'. O texto dentro pode variar ou ter imagem.
        // O texto geralmente "Revisto" ou "Marca Revista".
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
          ...(status && { status }), // Só adiciona status se definido
        });
      } catch (e) {
        console.error('Error parsing week item:', e);
      }
    });

    return items;
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
