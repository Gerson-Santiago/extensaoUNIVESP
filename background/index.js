// background.js
import { initTrustedTypes } from '../shared/security/TrustedTypesPolicy.js';

// Inicializar política de segurança imediatamente
initTrustedTypes();

function updatePanelBehavior(behavior) {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel
      .setPanelBehavior({
        openPanelOnActionClick: behavior === 'sidepanel',
      })
      .catch((err) => {
        /**#LOG_SYSTEM*/
        console.error('Error setting panel behavior:', err);
      });
  }

  // Restrição de Domínio: Desabilita por padrão, habilita via onUpdated
  if (behavior === 'sidepanel') {
    chrome.action.setPopup({ popup: '' });
  } else {
    chrome.action.setPopup({ popup: 'popup/popup.html' });
  }
}

/**
 * Verifica se a URL pertence aos domínios permitidos da UNIVESP
 * @param {string} url
 * @returns {boolean}
 */
const isUnivespDomain = (url) => {
  return url && (url.includes('ava.univesp.br') || url.includes('sei.univesp.br'));
};

// Gerenciar disponibilidade do sidePanel por aba (Least Intrusion)
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;

  const clickBehavior =
    (await chrome.storage.sync.get(['clickBehavior'])).clickBehavior || 'sidepanel';

  if (clickBehavior === 'sidepanel') {
    const enabled = isUnivespDomain(tab.url);
    chrome.sidePanel
      .setOptions({
        tabId,
        path: 'sidepanel/sidepanel.html',
        enabled,
      })
      .catch(() => {
        /* Silencioso para abas internas de sistema */
      });
  }
});

// Initial
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['clickBehavior'], (result) => {
    // Padrão agora é 'sidepanel'
    updatePanelBehavior(result.clickBehavior || 'sidepanel');
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['clickBehavior'], (result) => {
    // Padrão agora é 'sidepanel'
    updatePanelBehavior(result.clickBehavior || 'sidepanel');
  });
});

// Ouvir mudanças nas configurações
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.clickBehavior) {
    updatePanelBehavior(changes.clickBehavior.newValue);
  }
});
