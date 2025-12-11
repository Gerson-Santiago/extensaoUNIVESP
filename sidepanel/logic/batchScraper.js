/**
 * Scraper para importação em lote de matérias.
 * Foca na página de cursos do AVA (/ultra/course).
 */

// Função injetada na página para ler o DOM
function DOM_scanTerms_Injected() {
    // 1. Validação simples de URL (embora o sidepanel já deva ter verificado)
    if (!window.location.href.includes('ultra/course')) {
        return { error: 'Você precisa estar na página de Cursos do AVA.' };
    }

    // 2. Verificação do Filtro "Cursos abertos"
    // O elemento pode variar, tentamos detectar pelo input hidden ou pelo texto visual
    const filterInput = document.querySelector('input[value="filter-open-courses"]');
    const filterTextDiv = document.getElementById('courses-overview-filter-filters');

    let isFilterCorrect = false;
    if (filterInput) isFilterCorrect = true;
    if (filterTextDiv && filterTextDiv.innerText.toLowerCase().includes('abertos')) isFilterCorrect = true;

    if (!isFilterCorrect) {
        return { error: 'Por favor, selecione o filtro "Cursos abertos" na página.' };
    }

    // 3. Mapeamento de Termos e Matérias
    // A estrutura do AVA geralmente agrupa cursos por Termos (h3 headers)
    const termsFound = [];

    // Seleciona todos os headers de termo
    const termHeaders = document.querySelectorAll('h3[ng-switch-when="REGULAR_TERM"]');

    termHeaders.forEach(header => {
        const termName = header.innerText.trim();
        const courses = [];

        // O container de cursos geralmente é o próximo irmão ou pai próximo. 
        // No Ultra, a estrutura é complexa. Geralmente o h3 está dentro de um container de termo.
        // Vamos tentar achar o container pai que engloba a lista de cursos deste termo.
        // Estrutura comum: div.term-group > h3 + ul.course-list
        // Ou o h3 está solto e os cursos vêm e seguida.

        // Estratégia: Pegar o elemento pai do h3 e buscar cursos dentro dele? 
        // Não, as vezes o pai é só um wrapper do título.
        // Vamos buscar o container 'group-courses-term-*' ou similar que siga este header.

        // Tentativa de navegação DOM: Subir até achar o bloco do termo
        let termBlock = header.closest('.term-group') || header.closest('section') || header.parentElement;

        if (termBlock) {
            // Busca cursos dentro deste bloco
            const courseLinks = termBlock.querySelectorAll('a.course-title');

            courseLinks.forEach(link => {
                const h4 = link.querySelector('h4.js-course-title-element');
                if (h4) {
                    const cName = h4.innerText.trim();
                    let cUrl = link.href;

                    // Limpeza de URL (algumas vêm como javascript: ou relativas)
                    if (cUrl && cUrl.includes('javascript:')) {
                        // Tenta pegar id do curso no onclick se não tiver href limpo, 
                        // mas geralmente o href é javascript:void(0) e o click é angular.
                        // Mas o AVA costuma ter o ID no id do elemento: course-link-_12345_1
                        // E a URL real é /ultra/courses/_12345_1/cl/outline ??
                        // NÃO, o link direto para o curso clássico é:
                        // /webapps/blackboard/execute/launcher?type=Course&id=_12345_1&url=

                        // Vamos tentar extrair o ID do curso do atributo id="course-link-_15307_1"
                        const idAttr = link.id; // ex: course-link-_15307_1
                        if (idAttr && idAttr.startsWith('course-link-')) {
                            const courseId = idAttr.replace('course-link-', '');
                            // Monta URL padrão de acesso ao curso
                            cUrl = `https://ava.univesp.br/webapps/blackboard/execute/launcher?type=Course&id=${courseId}&url=`;
                        }
                    }

                    if (cName && cUrl && !cUrl.includes('javascript:')) {
                        courses.push({ name: cName, url: cUrl });
                    }
                }
            });
        }

        if (courses.length > 0) {
            termsFound.push({
                termName: termName,
                courses: courses
            });
        }
    });

    return { terms: termsFound };
}


export async function scanAvailableTerms(tabId) {
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: DOM_scanTerms_Injected
        });

        if (results && results[0] && results[0].result) {
            return results[0].result;
        }
        return { error: 'Falha ao comunicar com a página.' };

    } catch (error) {
        console.error(error);
        return { error: 'Erro interno ao executar script: ' + error.message };
    }
}
