/**
 * @file shared/services/NavigationService.js
 * @description Serviço centralizado de navegação hierárquica (Breadcrumb Logic)
 * @architecture Service Layer
 */

import { Tabs } from '../utils/Tabs.js';

export class NavigationService {
  /**
   * Abre uma atividade garantindo o contexto da semana pai.
   * @param {string} weekUrl - URL da semana onde a atividade está listada
   * @param {string} activityId - ID do elemento HTML da atividade para scroll
   */
  static async openActivity(weekUrl, activityId) {
    // 1. Garantir Semana (Hierarquia do Breadcrumb)
    const tab = await Tabs.openOrSwitchTo(weekUrl);

    if (!tab || !tab.id) {
      console.warn('[NavigationService] Falha ao abrir aba da semana:', weekUrl);
      return;
    }

    // 1.5. Aguardar Carregamento (Se estiver carregando ou se mudou de URL)
    if (tab.status === 'loading') {
      await new Promise((resolve) => {
        const listener = (tabId, info) => {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
        // Timeout de segurança (10s)
        setTimeout(() => {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }, 10000);
      });
      // Pequeno delay extra para scripts da página
      await new Promise((r) => setTimeout(r, 500));
    }

    // 2. Executar Scroll na Atividade
    // Injeta script para fazer scroll suave e highlight
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (contentId) => {
          // Tenta fechar modal do AVA se existir (lightbox)
          const closeBtn = document.querySelector('a.lbAction[href="#close"]');
          if (closeBtn) {
            try {
              /** @type {HTMLElement} */ (closeBtn).click();
              // eslint-disable-next-line no-console
              console.log('[Extension] Modal fechado automaticamente');
            } catch {
              /* ignore */
            }
          }

          // CRITICAL: IDs do Blackboard têm formato 'contentListItem:_NNNN_N' ou 'contentListItem:_NNNN_N'
          // O contentId recebido pode ser apenas '_NNNN_N' ou conter o prefixo.
          // Estratégia Robusta: Tentar ambos ou detectar.

          const normalizeId = (id) => {
            if (id.includes('contentListItem:')) return id;
            return `contentListItem:${id}`;
          };

          const fullId = normalizeId(contentId);
          // Fallback ID (apenas ID numérico caso o prefixo varie)
          const shortId = contentId.replace('contentListItem:', '');

          // eslint-disable-next-line no-console
          console.log('[Extension] Tentando scroll para ID:', fullId);

          // Retry Logic: Tentar por até 5 segundos
          let attempts = 0;
          const maxAttempts = 10; // 5 segundos (10 * 500ms)

          const tryScroll = () => {
            attempts++;
            // Tenta seletor exato OU seletor parcial (robustez)
            const element =
              document.getElementById(fullId) ||
              document.getElementById(shortId) ||
              document.querySelector(`li[id*="${shortId}"]`);

            if (element) {
              // eslint-disable-next-line no-console
              console.log('[Extension] Elemento encontrado na tentativa', attempts);
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });

              const originalBg = element.style.backgroundColor;
              element.style.backgroundColor = '#fff3cd'; // Amarelo suave
              element.style.transition = 'background-color 0.5s';

              setTimeout(() => {
                element.style.backgroundColor = originalBg || '';
              }, 2000);
            } else if (attempts < maxAttempts) {
              // eslint-disable-next-line no-console
              console.log('[Extension] Elemento não encontrado, tentando novamente em 500ms...');
              setTimeout(tryScroll, 500);
            } else {
              console.warn(
                `[NavigationService] Elemento ${fullId} não encontrado após ${attempts} tentativas.`
              );
              // eslint-disable-next-line no-console
              console.log(
                '[Extension] IDs disponíveis na página (amostra final):',
                Array.from(document.querySelectorAll('li[id^="contentListItem"]'))
                  .slice(0, 3)
                  .map((el) => el.id)
              );
            }
          };

          tryScroll();
        },
        args: [activityId],
      });
    } catch (error) {
      console.error('[NavigationService] Erro ao executar script de scroll:', error);
    }
  }

  /**
   * Abre um curso na página principal (opcional, wrapper simples)
   * @param {string} courseUrl
   * @param {string|RegExp} [matchPattern] Pattern para identificar aba existente
   * @returns {Promise<chrome.tabs.Tab|undefined>}
   */
  static async openCourse(courseUrl, matchPattern = null) {
    return await Tabs.openOrSwitchTo(courseUrl, matchPattern);
  }
}
