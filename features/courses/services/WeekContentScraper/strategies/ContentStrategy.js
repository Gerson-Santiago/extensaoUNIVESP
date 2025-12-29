/**
 * @typedef {import('../../../models/Week.js').WeekItem} WeekItem
 */

/**
 * Interface base para estratégias de scraping de conteúdo.
 * Cada estratégia é responsável por identificar e extrair um tipo específico de conteúdo.
 */
export class ContentStrategy {
  /**
   * Verifica se esta estratégia pode processar o elemento fornecido.
   * @param {HTMLElement} _element - O elemento LI da lista de conteúdos.
   * @returns {boolean}
   */
  matches(_element) {
    throw new Error('Method "matches" must be implemented.');
  }

  /**
   * Extrai os dados do item da semana a partir do elemento.
   * @param {HTMLElement} _element - O elemento LI da lista de conteúdos.
   * @returns {WeekItem | null} O item extraído ou null se falhar.
   */
  extract(_element) {
    throw new Error('Method "extract" must be implemented.');
  }

  /**
   * Helper para limpar strings.
   * @param {string} text
   * @returns {string}
   */
  cleanText(text) {
    return text ? text.trim().replace(/\s+/g, ' ') : '';
  }

  /**
   * Helper para determinar status (TODO/DONE) baseado no botão.
   * @param {HTMLElement} element
   * @returns {'TODO' | 'DONE' | undefined}
   */
  extractStatus(element) {
    const button = element.querySelector('.button-5');
    if (button) {
      const btnText = button.textContent.trim();
      if (btnText.includes('Revisto')) return 'DONE';
      if (btnText.includes('Marca Revista')) return 'TODO';
    }
    return undefined;
  }

  /**
   * Helper para extrair o ID do conteúdo (usado para navegação/scroll).
   * @param {HTMLElement} element
   * @returns {string|null}
   */
  extractContentId(element) {
    if (element.id && element.id.startsWith('contentListItem:')) {
      return element.id.replace('contentListItem:', '');
    }
    // Fallback: tentar pegar do div.item interno
    const itemDiv = element.querySelector('.item');
    if (itemDiv && itemDiv.id) {
      return itemDiv.id;
    }
    return null;
  }
}
