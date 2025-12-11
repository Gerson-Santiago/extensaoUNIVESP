/**
 * Scraper via Mensageria.
 * Comunica-se com o script 'ava_scraper_content.js' já injetado na página.
 */

export async function scrapeWeeksFromTab(tabId) {
    try {
        // Envia mensagem para a aba, tentando atingir todos os frames possíveis.
        // O Content Script (ava_scraper_content.js) deve estar ouvindo.

        let allWeeks = [];

        // Estratégia: Tentar comunicar com todos os frames da aba
        const frames = await chrome.webNavigation.getAllFrames({ tabId: tabId });

        const promises = frames.map(async (frame) => {
            try {
                // Envia mensagem para cada frame específico
                const response = await chrome.tabs.sendMessage(tabId, { action: "SCRAPE_WEEKS" }, { frameId: frame.frameId });
                if (response && response.weeks) {
                    return response.weeks;
                }
            } catch (err) {
                // Ignorar frames que não respondem (ex: cross-origin ads ou iframes de sistema)
                return [];
            }
            return [];
        });

        const results = await Promise.all(promises);

        // Agrega resultados
        results.forEach(w => {
            if (w && w.length > 0) allWeeks = allWeeks.concat(w);
        });

        // Remove duplicatas (URL como chave)
        const uniqueWeeks = [];
        const map = new Map();
        for (const item of allWeeks) {
            if (!item.url) continue;
            if (!map.has(item.url)) {
                map.set(item.url, true);
                uniqueWeeks.push(item);
            }
        }

        // Ordena por número da semana
        uniqueWeeks.sort((a, b) => {
            const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
            return numA - numB;
        });

        return uniqueWeeks;

    } catch (error) {
        // Silêncio em caso de erro fatal, retornando vazio para tratamento na UI
        return [];
    }
}

// A função DOM_extractWeeks não é mais usada aqui, pois foi movida para o content script.
