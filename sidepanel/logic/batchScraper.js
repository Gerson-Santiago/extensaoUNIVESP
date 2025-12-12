/**
 * Lógica para scraping em lote de cursos na página /ultra/course
 */

// Função injetável que roda no contexto da página
async function DOM_extractCourses_Injected(maxCourses) {
  const results = {
    success: false,
    courses: [],
    message: '',
  };

  // 1. Verifica se estamos na URL correta
  if (!window.location.href.includes('/ultra/course')) {
    results.message = 'Por favor, acesse a página de Cursos do AVA (Menu Lateral > Cursos).';
    return results;
  }

  // 2. Verifica Filtro "Cursos Abertos"
  const filterInput = document.querySelector('input[data-analytics-id="course.overview.filter"]');
  if (!filterInput || filterInput.value !== 'filter-open-courses') {
    const currentFilterName = document.getElementById('courses-overview-filter-filters');
    const filterName = currentFilterName ? currentFilterName.innerText : 'Desconhecido';

    if (filterName !== 'Cursos abertos') {
      results.message = `O filtro atual é "${filterName}". Por favor, mude para "Cursos abertos" na página antes de importar.`;
      return results;
    }
  }

  // 3. Localiza o Bimestre Atual
  const termHeaders = Array.from(document.querySelectorAll('h3[ng-switch-when="REGULAR_TERM"]'));
  let termHeader = null;

  if (termHeaders.length > 0) {
    termHeader = termHeaders[0];
  }

  if (!termHeader) {
    results.message =
      'Não foi possível identificar o grupo de bimestres. Verifique se há cursos listados.';
    return results;
  }

  // 4. Extração inicial dos candidatos
  const courseTitles = Array.from(document.querySelectorAll('h4.js-course-title-element'));
  const candidates = [];
  let count = 0;

  for (const titleEl of courseTitles) {
    if (count >= maxCourses) break;

    if (titleEl.offsetParent === null) continue;

    const linkEl = titleEl.closest('a');
    if (!linkEl) continue;

    const name = titleEl.innerText.trim();
    let url = linkEl.href;
    let courseId = null;

    if (url.startsWith('javascript') || !url.includes('http')) {
      const idAttr = linkEl.id;
      if (idAttr && idAttr.startsWith('course-link-')) {
        courseId = idAttr.replace('course-link-', '');
        // URL base temporária
        url =
          window.location.origin +
          `/webapps/blackboard/execute/launcher?type=Course&id=${courseId}&url=`;
      }
    } else if (url.includes('course_id=')) {
      const match = url.match(/course_id=(_.+?)(&|$)/);
      if (match) courseId = match[1];
    }

    if (name && url && courseId) {
      candidates.push({ name, url, courseId });
      count++;
    }
  }

  if (candidates.length === 0) {
    results.message = 'Nenhum curso encontrado visível. Tente recarregar a página.';
    return results;
  }

  // 5. Deep Scrape: Buscar link "Página Inicial"
  results.message = "Refinando links (buscando 'Página Inicial')...";

  const processedCourses = await Promise.all(
    candidates.map(async (c) => {
      try {
        const fetchUrl =
          window.location.origin +
          `/webapps/blackboard/execute/launcher?type=Course&id=${c.courseId}&url=`;
        const response = await fetch(fetchUrl);
        const text = await response.text();

        // Parser DOM virtual para facilitar a busca (mais seguro que regex complexo)
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Estratégia: Encontrar link que contenha texto "Página Inicial"
        // O usuario informou: <span title="Página Inicial">Página Inicial</span> dentro de <a href="...">

        // Busca todos os spans com título ou texto "Página Inicial"
        const spans = Array.from(doc.querySelectorAll('span'));
        const targetSpan = spans.find((s) => {
          const title = (s.getAttribute('title') || '').toLowerCase();
          const textContent = s.innerText.toLowerCase();
          return title.includes('página inicial') || textContent.includes('página inicial');
        });

        let finalUrl = null;
        if (targetSpan) {
          const parentLink = targetSpan.closest('a');
          if (parentLink) {
            const href = parentLink.getAttribute('href'); // Pega o atributo relativo
            if (href && href.includes('listContent.jsp')) {
              // Constrói URL absoluta
              finalUrl = window.location.origin + href;
            }
          }
        }

        // Fallback: Tenta achar qualquer link de listContent se o "Página Inicial" falhar?
        // Não, o usuário foi específico. Se falhar, melhor cair no fallback do launcher ou avisos.
        // Mas podemos tentar achar "Início" ou similar.

        if (finalUrl) {
          return { name: c.name, url: finalUrl };
        } else {
          // Fallback para Launcher simples (Avisos) se não achar a página inicial
          return { name: c.name, url: c.url };
        }
      } catch (err) {
        console.error(`Erro ao processar curso ${c.name}:`, err);
        return { name: c.name, url: c.url };
      }
    })
  );

  processedCourses.forEach((pc) => {
    if (!results.courses.some((exist) => exist.url === pc.url)) {
      results.courses.push(pc);
    }
  });

  if (results.courses.length > 0) {
    results.success = true;
    results.message = `Encontrados ${results.courses.length} cursos.`;
  } else {
    results.message = 'Falha ao processar cursos.';
  }

  return results;

  function coursesExists(list, url) {
    return list.some((c) => c.url === url);
  }
}

export async function scrapeCourseList(tabId, maxCourses = 6) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: DOM_extractCourses_Injected,
      args: [maxCourses],
    });

    if (results && results[0] && results[0].result) {
      return results[0].result;
    }
    return { success: false, message: 'Falha na comunicação com a página.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro ao executar script: ' + error.message };
  }
}
