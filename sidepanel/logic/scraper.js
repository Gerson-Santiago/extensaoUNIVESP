/**
 * Scraper via Mensageria.
 * Comunica-se com o script 'ava_scraper_content.js' já injetado na página.
 */

// Função que será injetada para rodar em cada frame
function DOM_extractWeeks_Injected() {
    const weeks = [];
    const links = document.querySelectorAll('a');

    links.forEach(a => {
        const text = (a.innerText || "").trim();
        const title = (a.title || "").trim();

        let href = a.href;
        if (href && !href.startsWith('http')) {
            const rawHref = a.getAttribute('href');
            if (rawHref && !rawHref.startsWith('http')) {
                href = window.location.origin + rawHref;
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
            if (!href.startsWith('javascript:')) {
                weeks.push({ name: name, url: href });
            } else if (a.onclick) {
                const onClickText = a.getAttribute('onclick');
                const match = onClickText.match(/'(\/webapps\/.*?)'/);
                if (match && match[1]) {
                    weeks.push({ name: name, url: window.location.origin + match[1] });
                }
            }
        }
    });

    // Tenta extrair o título da matéria
        let pageTitle = null;
        const h1 = document.querySelector('h1.panel-title');
        if (h1) {
            pageTitle = h1.innerText.trim();
        }

        return { weeks: weeks, title: pageTitle };
    }

export async function scrapeWeeksFromTab(tabId) {
        try {
            let allWeeks = [];
            let detectedTitle = null;

            // Injeta a função em TODOS os frames usando scripting
            const results = await chrome.scripting.executeScript({
                target: { tabId: tabId, allFrames: true },
                func: DOM_extractWeeks_Injected
            });

            if (results && results.length > 0) {
                results.forEach((frameResult) => {
                    if (frameResult.result) {
                        const res = frameResult.result;
                        // Suporte para novas e antigas estruturas se algo falhar, mas aqui garantimos o objeto
                        if (res && Array.isArray(res.weeks)) {
                            allWeeks = allWeeks.concat(res.weeks);
                        }
                        if (res && res.title && !detectedTitle) {
                            detectedTitle = res.title;
                        }
                    }
                });
            }

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

            return { weeks: uniqueWeeks, title: detectedTitle };

        } catch (error) {
            return { weeks: [], title: null };
        }
    }

// A função DOM_extractWeeks não é mais usada aqui, pois foi movida para o content script.
