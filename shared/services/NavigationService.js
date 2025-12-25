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
            await new Promise(r => setTimeout(r, 500));
        }

        // 2. Executar Scroll na Atividade
        // Injeta script para fazer scroll suave e highlight
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (id) => {
                    // Tenta fechar modal do AVA se existir (lightbox)
                    const closeBtn = document.querySelector('a.lbAction[href="#close"]');
                    if (closeBtn) {
                        try {
                            /** @type {HTMLElement} */ (closeBtn).click();
                            // eslint-disable-next-line no-console
                            console.log('[Extension] Modal fechado automaticamente');
                        } catch (e) { // eslint-disable-line no-unused-vars
                            /* ignore */
                        }
                    }

                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Highlight temporário
                        const originalBg = element.style.backgroundColor;
                        element.style.backgroundColor = '#fff3cd'; // Amarelo suave
                        element.style.transition = 'background-color 0.5s';

                        setTimeout(() => {
                            element.style.backgroundColor = originalBg || '';
                        }, 2000);
                    } else {
                        console.warn(`[NavigationService] Elemento ${id} não encontrado na página.`);
                    }
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
