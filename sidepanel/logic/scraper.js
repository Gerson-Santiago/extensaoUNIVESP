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

        // Lógica de Detecção refinada:
        // 1. Verifica Texto direto
        // 2. Verifica Title do link
        // 3. Verifica Title de spans filhas (estrutura Blackboard)
        let foundTitle = title;
        if (!foundTitle && a.querySelector('span[title]')) {
            foundTitle = a.querySelector('span[title]').title;
        }

        const cleanText = (text || "").trim();
        const cleanTitle = (foundTitle || "").trim();

        if ((cleanText.includes('Semana') || cleanTitle.includes('Semana')) && href) {
            let name = cleanText;
            if (cleanTitle.includes('Semana')) {
                name = cleanTitle;
            }
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
