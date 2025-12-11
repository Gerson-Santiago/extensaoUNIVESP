export function openOrSwitchToTab(url) {
    if (!url) return;

    // Tenta extrair o course_id da URL alvo (ex: _15307_1)
    const match = url.match(/course_id=(_.+?)(&|$)/);
    const targetCourseId = match ? match[1] : null;

    chrome.tabs.query({}, (tabs) => {
        let existingTab = null;

        if (targetCourseId) {
            // Se temos um ID, buscamos qualquer aba que o contenha
            existingTab = tabs.find(t => t.url && t.url.includes(targetCourseId));
        }

        // Fallback: Se não achou pelo ID (ou não tem ID), tenta por match de início de URL
        if (!existingTab) {
            // Remove parametros de "mode=reset" ou similares para comparar
            const cleanUrl = url.split('&mode=')[0];
            existingTab = tabs.find(t => t.url && (t.url.startsWith(url) || t.url.startsWith(cleanUrl)));
        }

        if (existingTab) {
            chrome.tabs.update(existingTab.id, { active: true });
            chrome.windows.update(existingTab.windowId, { focused: true });
        } else {
            chrome.tabs.create({ url: url });
        }
    });
}
