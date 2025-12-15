import { Tabs } from './Tabs.js';

export class BrowserUtils {
  /**
   * Tenta abrir o Side Panel na janela atual.
   * Fecha o popup (window) se tiver sucesso e for solicitado.
   * @param {boolean} closeWindowOnSuccess - Se deve fechar a janela atual (popup) ao abrir o painel.
   */
  static async openSidePanel(closeWindowOnSuccess = true) {
    // Verifica suporte à API
    if (!chrome.sidePanel || !chrome.sidePanel.open) {
      throw new Error('Navegador não suporta abertura automática do Painel Lateral.');
    }

    const currentTab = await Tabs.getCurrentTab();
    if (currentTab) {
      const windowId = currentTab.windowId;
      await chrome.sidePanel.open({ windowId: windowId });

      if (closeWindowOnSuccess) {
        window.close();
      }
    } else {
      throw new Error('Nenhuma aba ativa encontrada para vincular o painel.');
    }
  }
}
