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

    // Tenta extrair o course_id da URL (suporta com ou sem underscore)
    // Regex ajustada: course_id=([^&]+) pega tudo até o próximo & ou fim
    const courseMatch = url.match(/course_id=([^&]+)(&|$)/);
    const contentMatch = url.match(/content_id=([^&]+)(&|$)/);
    const targetCourseId = courseMatch ? courseMatch[1] : null;
    const targetContentId = contentMatch ? contentMatch[1] : null;

    chrome.tabs.query({}, (tabs) => {
      let existingTab = null;

      // 0. Prioridade Absoluta: Match Pattern Customizado
      if (matchPattern) {
        existingTab = tabs.find((t) => {
          if (!t.url) return false;
          if (matchPattern instanceof RegExp) {
            return matchPattern.test(t.url);
          }
          return t.url.includes(matchPattern);
        });
      }

      // 1. Busca aba que contenha AMBOS: course_id E content_id
      if (!existingTab && targetCourseId && targetContentId) {
        existingTab = tabs.find(
          (t) => t.url && t.url.includes(targetCourseId) && t.url.includes(targetContentId)
        );
      }
      // 2. Busca apenas course_id
      else if (!existingTab && targetCourseId) {
        existingTab = tabs.find((t) => t.url && t.url.includes(targetCourseId));
      }

      // 3. Fallback: URL exata ou prefixo
      if (!existingTab) {
        // Prioridade 1: Match Exato
        existingTab = tabs.find((t) => t.url === url);

        // Prioridade 2: Match Hierárquico (startsWith) com SEGURANÇA
        if (!existingTab) {
          existingTab = tabs.find((t) => {
            if (!t.url) return false;

            // Verifica se é prefixo
            const isPrefix = t.url.startsWith(url);
            if (!isPrefix) return false;

            // SAFETY CHECK: Se a aba candidata tem um course_id, E a URL alvo tem OUTRO, rejeita.
            // Isso evita que uma navegação genérica sequestre uma aba específica,
            // ou que uma matéria A (se detectada aqui por engano) sequestre a B.
            const tabCourseMatch = t.url.match(/course_id=([^&]+)(&|$)/);
            const tabCourseId = tabCourseMatch ? tabCourseMatch[1] : null;

            if (tabCourseId && targetCourseId && tabCourseId !== targetCourseId) {
              return false; // Rejeita match (IDs conflitantes)
            }

            // Se a URL alvo não tem ID (é genérica, ex: login), mas a aba tem (ex: curso),
            // talvez devêssemos rejeitar também para não perder o contexto do curso?
            // Por enquanto, rejeita apenas conflito explícito.

            return true;
          });
        }
      }

      if (existingTab) {
        chrome.tabs.update(existingTab.id, { url: url, active: true });
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
