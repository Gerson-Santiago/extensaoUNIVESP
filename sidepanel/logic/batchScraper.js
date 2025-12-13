/**
 * Lógica para scraping em lote de cursos na página /ultra/course
 */

// Variável para controlar logs de debug (desativar em produção)
const DEBUG = false;

// -- FUNÇÃO INJETADA PARA LER BIMESTRES E CURSOS --
function DOM_scanTermsAndCourses_Injected() {
  const results = {
    success: false,
    terms: [],
    message: '',
  };

  if (!window.location.href.includes('/ultra/course') && !window.location.href.includes('bb_router')) {
    if (!document.getElementById('courses-overview-content')) {
      results.message = 'Por favor, acesse a página de Cursos do AVA.';
      return results;
    }
  }

  // 1. Encontrar todos os elementos de Título de Curso
  // Esse seletor parece ser o mais estável para identificar um "card" de curso.
  const courseTitles = Array.from(document.querySelectorAll('h4.js-course-title-element'));

  if (courseTitles.length === 0) {
    results.message = 'Nenhum curso encontrado na página.';
    return results;
  }

  const termsMap = new Map(); // Chave: "2025/1 - 1º Bimestre" -> Valor: [cursos]

  courseTitles.forEach(titleEl => {
    // Navegamos para cima para achar o container do curso (o "Card" ou "Linha")
    // Geralmente é um <li> ou <div>
    const card = titleEl.closest('li') || titleEl.closest('div.element-card') || titleEl.parentNode.parentNode;

    if (!card) return;

    // Dentro do card, buscamos o Link e o ID de Exibição
    const linkEl = titleEl.closest('a') ? titleEl.closest('a') : card.querySelector('a[href*="course_id="], a[href*="/launcher"]');

    if (!linkEl) return;

    // Extrair URL e ID interno
    const name = titleEl.innerText.trim();
    let url = linkEl.href;
    let internalId = null;

    if (url.startsWith('javascript') || !url.includes('http')) {
      const idAttr = linkEl.id;
      if (idAttr && idAttr.startsWith('course-link-')) {
        internalId = idAttr.replace('course-link-', '');
        url = window.location.origin + `/webapps/blackboard/execute/launcher?type=Course&id=${internalId}&url=`;
      }
    } else if (url.includes('course_id=')) {
      const match = url.match(/course_id=(_.+?)(&|$)/);
      if (match) internalId = match[1];
    }

    if (!name || !url || !internalId) return;

    // 2. Buscar o ID de Exibição (Display ID) para saber o bimestre
    // Exemplo: MMB002-2025S1B2-T006
    // Procuramos qualquer span que tenha id começando com 'course-id-' DENTRO do card
    let displayIdRaw = '';
    const idSpan = card.querySelector('span[id^="course-id-"]');

    if (idSpan) {
      displayIdRaw = idSpan.innerText.trim();
    } else {
      // Fallback: Tenta achar pelo texto padrao usando Regex no card todo
      // Padrão: 4 letras, 3 numeros - 4 digitos S 1 digito B 1 digito
      // Ex: ADM001-2024S2B1
      const matchText = card.innerText.match(/([A-Z]{3}\d{3}-\d{4}S\dB\d)/);
      if (matchText) displayIdRaw = matchText[1];
    }

    // 3. Parse do Bimestre
    // Padrão esperado: ...-YYYYSuBv... (Year, Semester, Bimestre)
    // Ex: 2025S2B1 -> Ano 2025, Sem 2, Bim 1
    const navMatch = displayIdRaw.match(/-(\d{4})S(\d)B(\d)/);

    let termKey = 'Outros Cursos';
    let sortOrder = 0; // Para ordenação posterior

    if (navMatch) {
      const year = navMatch[1];
      const semester = navMatch[2]; // 1 ou 2
      const bimestre = navMatch[3]; // 1 ou 2 (dentro do semestre)

      // Formatar Termo Amigável
      // Se semestre 1 -> Bimestres são 1 e 2
      // Se semestre 2 -> Bimestres são 3 e 4 (na logica da UNIVESP ou mantemos B1/B2 do semestre?)
      // O usuário mencionou "2025/2 - 4º Bimestre".
      // Se o ID diz 2025S2B2 -> Isso é Semestre 2, Bimestre 2 (logo, 4º do ano).
      // Logica:
      // S1B1 = 1º Bimestre
      // S1B2 = 2º Bimestre
      // S2B1 = 3º Bimestre
      // S2B2 = 4º Bimestre

      let realBimestre = parseInt(bimestre);

      if (semester === '1') {
        realBimestre = parseInt(bimestre);
      } else if (semester === '2') {
        realBimestre = parseInt(bimestre) + 2;
      }

      termKey = `${year}/${semester} - ${realBimestre}º Bimestre`;

      // Chave de ordenação: YYYY + S + B (Ex: 202522)
      sortOrder = parseInt(`${year}${semester}${bimestre}`);
    } else {
      // Tentar capturar termos sem esse padrao se houver cabeçalhos REGULAR_TERM (fallback hibrido)
      // Mas se o usuario quer por ID, ficamos no ID.
      // Se não tiver ID padrao, vai para 'Outros'.
      sortOrder = 0;
    }

    // Adicionar ao Mapa
    if (!termsMap.has(termKey)) {
      termsMap.set(termKey, {
        order: sortOrder,
        courses: []
      });
    }

    const group = termsMap.get(termKey);
    // Evita duplicatas (as vezes o mesmo curso aparece em listas diferentes no DOM mobile/desktop)
    if (!group.courses.some(c => c.courseId === internalId)) {
      group.courses.push({ name, url, courseId: internalId });
    }
  });

  // Converter Mapa para Array
  const termsArray = [];
  termsMap.forEach((val, key) => {
    termsArray.push({
      name: key,
      courses: val.courses,
      _sort: val.order
    });
  });

  // Ordenar Termos (Antigo -> Novo)
  termsArray.sort((a, b) => {
    if (a._sort === 0) return 1; // Outros pro fim
    if (b._sort === 0) return -1;
    return a._sort - b._sort;
  });

  // Limpar metadados auxiliares
  const finalTerms = termsArray.map(t => ({ name: t.name, courses: t.courses }));

  results.terms = finalTerms;
  results.success = finalTerms.length > 0;
  if (!results.success) results.message = 'Nenhum curso identificado com padrão de data.';

  return results;
}

// -- FUNÇÃO INJETADA PARA PROCESSAR LISTA --
async function DOM_deepScrapeSelected_Injected(coursesToScrape) {
  const results = [];

  // Função auxiliar de scraping de semanas (Duplicada aqui pois contexto injetado não tem imports)
  function extractWeeksFromHTML(doc, baseUrl) {
    const weeks = [];
    const links = doc.querySelectorAll('a');

    links.forEach((a) => {
      const text = (a.innerText || '').trim();
      const title = (a.title || '').trim();

      let href = a.href;
      if (a.getAttribute('href')) {
        const raw = a.getAttribute('href');
        if (!raw.startsWith('http') && !raw.startsWith('javascript:')) {
          href = baseUrl + (raw.startsWith('/') ? '' : '/') + raw;
        } else if (raw.startsWith('http')) {
          href = raw;
        }
      }

      const cleanText = (text || '').trim();
      const cleanTitle = (title || '').trim();
      const weekRegex = /^Semana\s+(\d{1,2})$/i;

      let match = cleanText.match(weekRegex);
      let nameToUse = cleanText;

      if (!match && cleanTitle) {
        match = cleanTitle.match(weekRegex);
        nameToUse = cleanTitle;
      }

      if (match && href) {
        const weekNum = parseInt(match[1], 10);
        if (weekNum >= 1 && weekNum <= 15) {
          if (!href.startsWith('javascript:')) {
            weeks.push({ name: nameToUse, url: href });
          } else if (a.onclick) {
            const onClickText = a.getAttribute('onclick');
            const urlMatch = onClickText && onClickText.match(/'(\/webapps\/.*?)'/);
            if (urlMatch && urlMatch[1]) {
              weeks.push({ name: nameToUse, url: baseUrl + urlMatch[1] });
            }
          }
        }
      }
    });

    // Remove duplicatas
    const uniqueWeeks = [];
    const map = new Map();
    for (const w of weeks) {
      if (!map.has(w.url)) {
        map.set(w.url, true);
        uniqueWeeks.push(w);
      }
    }

    // Ordena
    uniqueWeeks.sort((a, b) => {
      const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    return uniqueWeeks;
  }

  // Processamento sequencial para não sobrecarregar
  for (const course of coursesToScrape) {
    try {
      // 1. Fetch Course Entry
      const fetchUrl = window.location.origin + `/webapps/blackboard/execute/launcher?type=Course&id=${course.courseId}&url=`;
      const response = await fetch(fetchUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // 2. Find Homepage
      // Tenta achar link com "Página Inicial", "Início" ou "Home"
      const spans = Array.from(doc.querySelectorAll('span'));
      const targetSpan = spans.find((s) => {
        const title = (s.getAttribute('title') || '').toLowerCase();
        const textContent = s.innerText.toLowerCase();
        return title.includes('página inicial') || textContent.includes('página inicial') || textContent === 'início';
      });

      let finalUrl = course.url; // Default
      let weeks = [];

      if (targetSpan) {
        const parentLink = targetSpan.closest('a');
        if (parentLink) {
          const href = parentLink.getAttribute('href');
          if (href && href.includes('listContent.jsp')) {
            finalUrl = window.location.origin + href;
          }
        }
      }

      // 3. Deep Fetch Homepage for Weeks (Se achamos uma URL de conteudo)
      if (finalUrl && finalUrl.includes('listContent.jsp')) {
        const resp2 = await fetch(finalUrl);
        const text2 = await resp2.text();
        const doc2 = parser.parseFromString(text2, 'text/html');
        weeks = extractWeeksFromHTML(doc2, window.location.origin);
      }

      results.push({
        name: course.name,
        url: finalUrl,
        weeks: weeks,
        original: course
      });

    } catch (e) {
      console.error('Erro deep scraping', course.name, e);
      results.push({
        name: course.name,
        url: course.url,
        weeks: [],
        error: true
      });
    }
  }

  return results;
}


export async function scrapeAvailableTerms(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: DOM_scanTermsAndCourses_Injected,
    });

    if (results && results[0] && results[0].result) {
      return results[0].result;
    }
    return { success: false, message: 'Falha na comunicação com a página.' };
  } catch (error) {
    if (DEBUG) console.error(error);
    return { success: false, message: 'Erro ao executar script: ' + error.message };
  }
}

export async function processSelectedCourses(tabId, courses) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: DOM_deepScrapeSelected_Injected,
      args: [courses]
    });

    if (results && results[0] && results[0].result) {
      return results[0].result;
    }
    return [];
  } catch (error) {
    if (DEBUG) console.error(error);
    return [];
  }
}
