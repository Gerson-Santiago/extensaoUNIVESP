console.log("[Extension] Content Script AVA pronto.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SCRAPE_WEEKS") {
        const weeks = extractWeeks();
        sendResponse({ weeks: weeks });
    }
});

function extractWeeks() {
    const weeks = [];
    const links = document.querySelectorAll('a');

    links.forEach(a => {
        const text = (a.innerText || "").trim();
        const title = (a.title || "").trim();

        let href = a.href;
        if (href && !href.startsWith('http')) {
            // Tenta corrigir links relativos se o browser não tiver feito
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

        // Lógica específica para o padrão Blackboard ultra/classic misto
        if ((cleanText.includes('Semana') || cleanTitle.includes('Semana')) && href) {
            let name = cleanText;
            if (cleanTitle.includes('Semana')) {
                name = cleanTitle;
            }
            // Filtra links que são apenas âncoras vazias ou javascript puro se não tiver url real
            if (!href.startsWith('javascript:')) {
                weeks.push({ name: name, url: href });
            } else if (a.onclick) {
                // Se for javascript e tiver onclick, talvez possamos extrair a URL do onclick (avançado)
                // Exemplo: globalNavigation.openFullPageFromIframe(..., '/url...')
                const onClickText = a.getAttribute('onclick');
                const match = onClickText.match(/'(\/webapps\/.*?)'/);
                if (match && match[1]) {
                    weeks.push({ name: name, url: window.location.origin + match[1] });
                }
            }
        }
    });

    return weeks;
}
