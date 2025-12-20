// Variável para controlar logs de debug (desativar em produção)

export class Tabs {
  /**
   * Abre uma nova aba ou troca para uma existente se a URL corresponder a um curso/conteúdo alvo.
   * @param {string} url
   * @param {string|RegExp} [matchPattern] Pattern opcional para identificar a aba (ex: ignora query params ou sub-rotas)
   */
  static openOrSwitchTo(url, matchPattern = null) {
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

      // 0. Prioridade Absoluta: Match Pattern Customizado (se fornecido)
      if (matchPattern) {
        existingTab = tabs.find((t) => {
          if (!t.url) return false;
          // Se for RegExp
          if (matchPattern instanceof RegExp) {
            return matchPattern.test(t.url);
          }
          // Se for string, usa includes (mais abrangente que startsWith para domínios)
          return t.url.includes(matchPattern);
        });
      }

      // 1. Busca aba que contenha AMBOS: course_id E content_id (página específica)
      if (!existingTab && targetCourseId && targetContentId) {
        existingTab = tabs.find(
          (t) => t.url && t.url.includes(targetCourseId) && t.url.includes(targetContentId)
        );
      }
      // 2. Busca apenas course_id (para páginas principais sem content_id)
      else if (!existingTab && targetCourseId) {
        existingTab = tabs.find((t) => t.url && t.url.includes(targetCourseId));
      }

      // 3. Fallback: Procura por URL exata ou prefixo (para links gerais como Home/AVA/SEI)
      if (!existingTab) {
        // Prioridade 1: Match Exato
        existingTab = tabs.find((t) => t.url === url);

        // Prioridade 2: Match Hierárquico (se não achou exato)
        if (!existingTab) {
          existingTab = tabs.find((t) => t.url && t.url.startsWith(url));
        }
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
