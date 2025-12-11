export function openOrSwitchToTab(url) {
    if (!url) return;

    chrome.tabs.query({}, (tabs) => {
        // Tenta encontrar uma aba que comece com a URL ou seja igual
        // Simplificação: verifica se url da aba contem a url desejada (sem query params as vezes)
        // Mas para ser exato, vamos procurar match de URL base ou completa.

        const existingTab = tabs.find(t => t.url && t.url === url);

        if (existingTab) {
            chrome.tabs.update(existingTab.id, { active: true });
            chrome.windows.update(existingTab.windowId, { focused: true });
        } else {
            chrome.tabs.create({ url: url });
        }
    });
}
