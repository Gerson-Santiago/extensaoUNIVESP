/**
 * Abre uma URL numa nova aba ou foca na aba existente se já estiver aberta.
 * @param {string} url - A URL para abrir
 */
export async function openOrSwitchToTab(url) {
    if (!url) return;

    try {
        // Normaliza a URL para comparação (remove hash/query se necessário? 
        // Por enquanto vamos tentar match exato ou startsWith para ser útil)
        // O ideal é remover o hash para comparação se for âncora, mas o usuário pode querer especificamente a âncora.
        // Vamos buscar exatamente a URL primeiro.

        // chrome.tabs.query requer permissão "tabs" ou host permissions para ver a URL
        const tabs = await chrome.tabs.query({});

        // Procura aba com URL igual ou contendo
        // Como a URL salva pode ser curta ou redirecionada, vamos fazer uma comparação permissiva mas segura
        const existingTab = tabs.find(tab => {
            return tab.url === url || (tab.url && tab.url.startsWith(url)) || (url.includes(tab.url));
            // Cuidado com contains reverso, pode ser perigoso (ex: url "google.com" matchar "google.com.br")
            // Vamos testar: tab.url === url
        });

        // Tentar encontrar match exato primeiro
        const exactMatch = tabs.find(tab => tab.url === url);

        if (exactMatch) {
            chrome.tabs.update(exactMatch.id, { active: true });
            chrome.windows.update(exactMatch.windowId, { focused: true });
            return;
        }

        // Se não achou exato, tenta ignorar trailing slash ou hash
        // Ex: "site.com/page" vs "site.com/page/"
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
