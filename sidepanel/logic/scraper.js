/**
 * Extrai as semanas da página atual.
 * Atenção: Esta função é serializada e injetada na página, então não pode depender de escopo externo.
 */
export function DOM_extractWeeks() {
    const weeks = [];
    // Seleciona todos os links da página
    const links = document.querySelectorAll('a');

    links.forEach(a => {
        const text = (a.innerText || "").trim();
        const title = (a.title || "").trim();
        const href = a.href;

        // Verifica se tem "Semana" no texto ou título
        if ((text.includes('Semana') || title.includes('Semana')) && href) {
            let name = text || title;
            weeks.push({ name: name, url: href });
        }
    });

    // Remove duplicatas baseado na URL
    const uniqueWeeks = [];
    const map = new Map();
    for (const item of weeks) {
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
}

/**
 * Executa o scraper na aba ativa
 */
export async function scrapeWeeksFromTab(tabId) {
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: DOM_extractWeeks,
        });

        if (results && results[0] && results[0].result) {
            return results[0].result;
        }
    } catch (e) {
        console.error("Erro ao extrair semanas:", e);
    }
    return [];
}
