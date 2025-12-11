/**
 * Abre uma URL numa nova aba ou foca na aba existente se já estiver aberta.
 * @param {string} url - A URL para abrir
 */
export async function openOrSwitchToTab(url) {
    if (!url) return;

    try {
        // Tenta encontrar uma aba ativa que corresponda à URL.
        // Utiliza uma verificação flexível para pegar possíveis redirecionamentos ou variações de protocolo.
        const tabs = await chrome.tabs.query({});
        const existingTab = tabs.find(tab => {
            return tab.url === url || (tab.url && tab.url.startsWith(url)) || (url.includes(tab.url));
        });

        // Tentar encontrar match exato primeiro
        const exactMatch = tabs.find(tab => tab.url === url);

        if (exactMatch) {
            chrome.tabs.update(exactMatch.id, { active: true });
            chrome.windows.update(exactMatch.windowId, { focused: true });
            return;
        }

        // Se não houver correspondência exata, tenta encontrar ignorando a barra final.
        const looseMatch = tabs.find(tab => {
            const tUrl = tab.url.replace(/\/$/, "");
            const sUrl = url.replace(/\/$/, "");
            return tUrl === sUrl;
        });

        if (looseMatch) {
            chrome.tabs.update(looseMatch.id, { active: true });
            chrome.windows.update(looseMatch.windowId, { focused: true });
            return;
        }

        // Se não achou, abre nova
        chrome.tabs.create({ url });

    } catch (e) {
        console.error("Erro ao gerenciar abas:", e);
        // Fallback
        chrome.tabs.create({ url });
    }
}
