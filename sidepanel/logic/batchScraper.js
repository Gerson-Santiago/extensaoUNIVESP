/**
 * Lógica para scraping em lote de cursos na página /ultra/course
 */

// Função injetável que roda no contexto da página
function DOM_extractCourses_Injected(maxCourses) {
    const results = {
        success: false,
        courses: [],
        message: ""
    };

    // 1. Verifica se estamos na URL correta
    if (!window.location.href.includes('/ultra/course')) {
        results.message = "Por favor, acesse a página de Cursos do AVA (Menu Lateral > Cursos).";
        return results;
    }

    // 2. Verifica Filtro "Cursos Abertos"
    // O input hidden que guarda o valor do filtro
    const filterInput = document.querySelector('input[data-analytics-id="course.overview.filter"]');
    if (!filterInput || filterInput.value !== 'filter-open-courses') {
        const currentFilterName = document.getElementById('courses-overview-filter-filters');
        const filterName = currentFilterName ? currentFilterName.innerText : "Desconhecido";

        if (filterName !== "Cursos abertos") {
            results.message = `O filtro atual é "${filterName}". Por favor, mude para "Cursos abertos" na página antes de importar.`;
            return results;
        }
    }

    // 3. Localiza o Bimestre Atual
    // Procura headers de agrupamento (ex: "2025/2 - 4º Bimestre")
    // A estrutura é complexa, baseada em ng-switch-when
    const termHeaders = Array.from(document.querySelectorAll('h3[ng-switch-when="REGULAR_TERM"]'));
    let targetContainer = null;

    // Tenta achar o termo atual (isCurrentTerm) ou assume o primeiro da lista
    // O Angular remove as classes do DOM às vezes, então buscamos pelo texto ou estrutura

    // Se houver headers, pegamos o primeiro visible (que geralmente é o atual/mais recente)
    // Ou tentamos lógica de "Bimestre" no texto
    let termHeader = null;

    if (termHeaders.length > 0) {
        // Pega o primeiro termo listado (que costuma ser o atual na ordenação padrão)
        termHeader = termHeaders[0];
    }

    if (!termHeader) {
        // Fallback: se não achar header de termo, tenta pegar a lista geral (pode não estar agrupada)
        // Mas a UI do Ultra geralmente agrupa.
        results.message = "Não foi possível identificar o grupo de bimestres. Verifique se há cursos listados.";
        return results;
    }

    // O container de cursos geralmente é o próximo irmão ou pai próximo.
    // Na estrutura do Ultra, o h3 está dentro de um div que é irmão de uma <ul class="course-list"> ou similar.
    // Estrutura observada no request: 
    // div > h3 (termo)
    // logo depois tem uma lista de cards.

    // Vamos buscar os elementos de titulo de curso que estão VISÍVEIS
    const courseTitles = Array.from(document.querySelectorAll('h4.js-course-title-element'));

    let count = 0;

    for (const titleEl of courseTitles) {
        if (count >= maxCourses) break;

        // Verifica se o elemento está visível
        if (titleEl.offsetParent === null) continue;

        const linkEl = titleEl.closest('a');
        if (!linkEl) continue;

        const name = titleEl.innerText.trim();
        let url = linkEl.href;

        // Se for javascript:void(0), tenta extrair ID do ID do elemento e montar URL
        // id="course-link-_15307_1" -> CourseUUID = _15307_1
        if (url.startsWith('javascript') || !url.includes('http')) {
            const idAttr = linkEl.id; // course-link-_XXXXX_1
            if (idAttr && idAttr.startsWith('course-link-')) {
                const courseId = idAttr.replace('course-link-', '');
                // URL padrão do curso clássico/ultra
                url = window.location.origin + `/webapps/blackboard/execute/launcher?type=Course&id=${courseId}&url=`;
            }
        }

        if (name && url && !coursesExists(results.courses, url)) {
            // Limpeza do nome (remove código da turma se desejar, mas o usuário pediu para identificar materia)
            // Ex: "Inglês - LET100 - Turma 006" -> Mantemos full por enquanto para diferenciar
            results.courses.push({ name: name, url: url });
            count++;
        }
    }

    if (results.courses.length === 0) {
        results.message = "Nenhum curso encontrado visível. Verifique se os cursos carregaram.";
    } else {
        results.success = true;
        results.message = `Encontrados ${results.courses.length} cursos.`;
    }

    return results;

    function coursesExists(list, url) {
        return list.some(c => c.url === url);
    }
}

export async function scrapeCourseList(tabId, maxCourses = 6) {
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: DOM_extractCourses_Injected,
            args: [maxCourses]
        });

        if (results && results[0] && results[0].result) {
            return results[0].result;
        }
        return { success: false, message: "Falha na comunicação com a página." };

    } catch (error) {
        console.error(error);
        return { success: false, message: "Erro ao executar script: " + error.message };
    }
}
