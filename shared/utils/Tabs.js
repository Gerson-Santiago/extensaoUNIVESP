// Variável para controlar logs de debug (desativar em produção)

export class Tabs {
  /**
   * Abre uma nova aba ou troca para uma existente se a URL corresponder a um curso/conteúdo alvo.
   * @param {string} url
   * @param {string|RegExp} [matchPattern] Pattern opcional para identificar a aba (ex: ignora query params ou sub-rotas)
   * @returns {Promise<chrome.tabs.Tab|undefined>} Retorna a aba focada ou criada
   */
  static async openOrSwitchTo(url, matchPattern = null) {
    if (!url) {
      return;
    }

    // Tenta extrair o course_id da URL (suporta com ou sem underscore)
    // Regex ajustada: course_id=([^&]+) pega tudo até o próximo & ou fim
    const courseMatch = url.match(/course_id=([^&]+)(&|$)/);
    const contentMatch = url.match(/content_id=([^&]+)(&|$)/);
    const targetCourseId = courseMatch ? courseMatch[1] : null;
    const targetContentId = contentMatch ? contentMatch[1] : null;

    // Converte callback antiga para Promise (ou usa await se a API suportar, aqui usando wrapper manual para compatibilidade garantida)
    const tabs = await new Promise((resolve) => chrome.tabs.query({}, resolve));

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

    // Fallback: URL exata ou prefixo
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
          const tabCourseMatch = t.url.match(/course_id=([^&]+)(&|$)/);
          const tabCourseId = tabCourseMatch ? tabCourseMatch[1] : null;

          if (tabCourseId && targetCourseId && tabCourseId !== targetCourseId) {
            return false; // Rejeita match (IDs conflitantes)
          }

          return true;
        });
      }
    }

    if (existingTab) {
      // Update retorna promise no MV3 se callback for omitido, mas para garantir mock compatibility:
      // Se chrome.tabs.update retornar tab no callback, usamos isso.
      const updatedTab = await new Promise((resolve) => {
        // Se a URL for idêntica, NÃO atualiza a URL, apenas foca. Evita reload.
        const updateProperties = { active: true };
        if (existingTab.url !== url) {
          updateProperties.url = url;
        }
        chrome.tabs.update(existingTab.id, updateProperties, (tab) => resolve(tab || existingTab));
      });
      await new Promise((resolve) =>
        chrome.windows.update(existingTab.windowId, { focused: true }, resolve)
      );
      return updatedTab;
    } else {
      const createdTab = await new Promise((resolve) => {
        chrome.tabs.create({ url: url }, (tab) => resolve(tab));
      });
      return createdTab;
    }
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
