// Variável para controlar logs de debug (desativar em produção)

export class Tabs {
  /**
   * Abre uma nova aba ou troca para uma existente se a URL corresponder a um curso/conteúdo alvo.
   * @param {string} url
   */
  static openOrSwitchTo(url) {
    if (!url) {
      return;
    }

    // Tenta extrair o course_id E content_id da URL
    const courseMatch = url.match(/course_id=(_.+?)(&|$)/);
    const contentMatch = url.match(/content_id=(_.+?)(&|$)/);
    const targetCourseId = courseMatch ? courseMatch[1] : null;
    const targetContentId = contentMatch ? contentMatch[1] : null;

    chrome.tabs.query({}, (tabs) => {
      let existingTab = null;

      // Busca aba que contenha AMBOS: course_id E content_id (página específica)
      if (targetCourseId && targetContentId) {
        existingTab = tabs.find(
          (t) => t.url && t.url.includes(targetCourseId) && t.url.includes(targetContentId)
        );
      } else if (targetCourseId) {
        // Fallback: apenas course_id (para páginas principais sem content_id)
        existingTab = tabs.find((t) => t.url && t.url.includes(targetCourseId));
      }

      // Fallback adicional: tenta por URL exata
      if (!existingTab) {
        const cleanUrl = url.split('&mode=')[0];
        existingTab = tabs.find(
          (t) => t.url && (t.url.startsWith(url) || t.url.startsWith(cleanUrl))
        );
      }

      if (existingTab) {
        chrome.tabs.update(existingTab.id, { active: true });
        chrome.windows.update(existingTab.windowId, { focused: true });
      } else {
        chrome.tabs.create({ url: url });
      }
    });
  }
  /**
   * Retorna a aba ativa na janela atual.
   * @returns {Promise<chrome.tabs.Tab|null>}
   */
  static async getCurrentTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs && tabs.length > 0 ? tabs[0] : null);
      });
    });
  }

  /**
   * Cria uma nova aba com a URL especificada.
   * @param {string} url
   */
  static create(url) {
    chrome.tabs.create({ url: url });
  }
}
