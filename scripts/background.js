// background.js

function updatePanelBehavior(behavior) {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel
      .setPanelBehavior({
        openPanelOnActionClick: behavior === 'sidepanel',
      })
      .catch((err) => {
        /**#LOG_SYSTEM*/
        console.error(err);
      });
  }

  // Explicitly set/unset popup to avoid conflicts
  if (behavior === 'sidepanel') {
    chrome.action.setPopup({ popup: '' }); // Disable popup
  } else {
    chrome.action.setPopup({ popup: 'popup/popup.html' }); // Enable popup
  }
}

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
