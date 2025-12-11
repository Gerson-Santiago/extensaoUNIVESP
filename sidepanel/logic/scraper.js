/**
 * Extrai as semanas da página atual.
 * @returns {Array} Lista de semanas encontradas neste frame.
 */
export function DOM_extractWeeks() {
    const weeks = [];
    const links = document.querySelectorAll('a');

    links.forEach(a => {
        const text = (a.innerText || "").trim();
        const title = (a.title || "").trim();
        const href = a.href;

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

    return weeks;
}

async function fetchCourseMenuWeeks(tabUrl, logs) {
    try {
        if (!tabUrl) {
            logs.push("Fallback: Sem URL da aba para analisar.");
            return [];
        }

        const match = tabUrl.match(/course_id=(_[\d_]+)/) || tabUrl.match(/\/courses\/(_[\d_]+)\//);

        if (!match || !match[1]) {
            logs.push("Fallback: ID do curso não encontrado na URL: " + tabUrl);
            return [];
        }

        const courseId = match[1];
        logs.push(`Fallback: ID do curso detectado: ${courseId}`);

        const menuUrl = `https://ava.univesp.br/webapps/blackboard/content/courseMenu.jsp?course_id=${courseId}&newWindow=true&openInParentWindow=true`;
        logs.push(`Fallback: Fetching ${menuUrl}`);

        const response = await fetch(menuUrl);
        if (!response.ok) {
            logs.push(`Fallback: Erro HTTP ${response.status}`);
            return [];
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const links = doc.querySelectorAll('a');
        const weeks = [];

        links.forEach(a => {
            const text = (a.innerText || "").trim();
            const title = (a.title || "").trim();

            let href = a.href;
            if (href && !href.startsWith('http')) {
                const rawHref = a.getAttribute('href');
                if (rawHref && !rawHref.startsWith('http')) {
                    href = 'https://ava.univesp.br' + rawHref;
                }
            }

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

        logs.push(`Fallback: Encontrados ${weeks.length} links.`);
        return weeks;
    } catch (e) {
        logs.push(`Fallback Error: ${e.message}`);
        console.error("Erro no fallback fetchCourseMenuWeeks:", e);
        return [];
    }
}


/**
 * Executa o scraper na aba ativa (em todos os frames)
 * Retorna { weeks: [], logs: [] }
 */
export async function scrapeWeeksFromTab(tabId) {
    let allWeeks = [];
    const logs = [];
    logs.push(`Iniciando Scraper para Tab ID: ${tabId}`);

    // 1. TENTATIVA DOM (All Frames)
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            func: DOM_extractWeeks,
        });

        if (results && results.length > 0) {
            logs.push(`DOM: Executado em ${results.length} frames.`);
            results.forEach((frameResult, index) => {
                if (frameResult.result && Array.isArray(frameResult.result) && frameResult.result.length > 0) {
                    logs.push(`DOM Frame ${index}: Encontrou ${frameResult.result.length} itens.`);
                    allWeeks = allWeeks.concat(frameResult.result);
                }
            });
        } else {
            logs.push("DOM: Nenhum resultado retornado do scripting.");
        }
    } catch (e) {
        logs.push(`DOM Error: ${e.message}`);
        console.error("Erro ao extrair via DOM:", e);
    }

    // 2. TENTATIVA FALLBACK (Fetch)
    try {
        logs.push(`Verificando necessidade de Fallback. Semanas atuais: ${allWeeks.length}`);
        // Tenta fallback mesmo se achou algo? Geralmente o Course Menu é mais completo.
        // Se achou 0, COM CERTEZA tenta. Se achou, talvez não precise.
        if (allWeeks.length === 0) {
            const tab = await chrome.tabs.get(tabId);
            if (tab && tab.url) {
                const fallbackWeeks = await fetchCourseMenuWeeks(tab.url, logs);
                if (fallbackWeeks.length > 0) {
                    allWeeks = allWeeks.concat(fallbackWeeks);
                }
            } else {
                logs.push("Fallback: Não foi possível obter URL da aba.");
            }
        }
    } catch (e) {
        logs.push(`Fallback Fatal Error: ${e.message}`);
        console.error("Erro ao tentar fallback:", e);
    }

    // 3. PROCESSAMENTO FINAL
    const uniqueWeeks = [];
    const map = new Map();

    for (const item of allWeeks) {
        if (!item.url) continue;
        if (!map.has(item.url)) {
            map.set(item.url, true);
            uniqueWeeks.push(item);
        }
    }

    uniqueWeeks.sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
        return numA - numB;
    });

    logs.push(`Finalizado. Total Semanas Únicas: ${uniqueWeeks.length}`);

    // Retorna Objeto com Logs
    return {
        weeks: uniqueWeeks,
        logs: logs
    };
}
