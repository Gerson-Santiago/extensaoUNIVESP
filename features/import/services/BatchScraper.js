/**
 * Lógica para scraping em lote de cursos na página /ultra/course
 */

// Variável para controlar logs de debug (desativar em produção)
const DEBUG = false;

// -- FUNÇÃO INJETADA PARA LER BIMESTRES E CURSOS --

// -- FUNÇÃO INJETADA PARA LER BIMESTRES E CURSOS --
export async function DOM_scanTermsAndCourses_Injected() {
  const results = {
    success: false,
    terms: [],
    message: '',
  };

  // 1. Verificação de URL e Login
  if (
    !window.location.href.includes('/ultra/course') &&
    !window.location.href.includes('bb_router')
  ) {
    if (!document.getElementById('courses-overview-content')) {
      results.message = 'Por favor, acesse a página de Cursos do AVA e faça login.';
      return results;
    }
  }

  // 2. Auto-Scroll para carregar "Infinite Scroll"
  // 2. Auto-Scroll para carregar "Infinite Scroll" (Lógica Robusta v2.0)
  try {
    // Helper para achar o elemento que tem scroll
    const getScrollElement = () => {
      const mainContainer = document.getElementById('main-content-inner');
      if (mainContainer && mainContainer.scrollHeight > mainContainer.clientHeight) {
        return mainContainer;
      }
      // Tenta achar qualquer div grande com scroll
      const allDivs = document.querySelectorAll('div');
      for (const div of Array.from(allDivs)) {
        if (div.scrollHeight > div.clientHeight && div.clientHeight > 100) {
          const style = window.getComputedStyle(div);
          if (['auto', 'scroll'].includes(style.overflowY) || style.overflow === 'auto') {
            return div;
          }
        }
      }
      return window;
    };

    const scrollTarget = getScrollElement();
    let lastHeight =
      scrollTarget === window ? document.documentElement.scrollHeight : scrollTarget.scrollHeight;

    let attempts = 0;
    const MAX_RETRIES = 10;

    while (attempts < MAX_RETRIES) {
      if (scrollTarget === window) {
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        scrollTarget.scrollTop = scrollTarget.scrollHeight;
      }

      await new Promise((r) => setTimeout(r, 1500)); // Aguarda carga

      const newHeight =
        scrollTarget === window ? document.documentElement.scrollHeight : scrollTarget.scrollHeight;

      if (newHeight === lastHeight) {
        // Tenta mais uma vez antes de desistir (rede lenta)
        await new Promise((r) => setTimeout(r, 1000));
        const retryHeight =
          scrollTarget === window
            ? document.documentElement.scrollHeight
            : scrollTarget.scrollHeight;

        if (retryHeight === lastHeight) break; // Realmente acabou
        lastHeight = retryHeight;
      } else {
        lastHeight = newHeight;
      }
      attempts++;
    }
  } catch (e) {
    console.error('Erro no auto-scroll:', e);
  }

  // 3. Encontrar todos os elementos (H4 é o título do curso no card)
  const courseTitles = Array.from(document.querySelectorAll('h4.js-course-title-element'));

  if (courseTitles.length === 0) {
    results.message = 'Nenhum curso encontrado na página. Verifique se você está logado.';
    return results;
  }

  const termsMap = new Map(); // Chave: "2025/1 - 1º Bimestre" -> Valor: [cursos]

  courseTitles.forEach((titleEl) => {
    // Navegamos para cima para achar o container
    const card =
      titleEl.closest('li') || titleEl.closest('div.element-card') || titleEl.parentNode.parentNode;

    if (!card) return;

    // Link e ID
    const linkEl = titleEl.closest('a')
      ? titleEl.closest('a')
      : card.querySelector('a[href*="course_id="], a[href*="/launcher"]');

    if (!linkEl) return;

    const name = titleEl.textContent.trim();
    let url = linkEl.href;
    let internalId = null;

    // Extrair ID interno (course_id)
    if (url.startsWith('javascript') || !url.includes('http')) {
      const idAttr = linkEl.id;
      if (idAttr && idAttr.startsWith('course-link-')) {
        internalId = idAttr.replace('course-link-', '');
        url =
          window.location.origin +
          `/webapps/blackboard/execute/launcher?type=Course&id=${internalId}&url=`;
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
      displayIdRaw = idSpan.textContent.trim();
    } else {
      // Fallback: Tenta achar pelo texto padrao usando Regex no card todo
      // Padrão: 4 letras, 3 numeros - 4 digitos S 1 digito B 1 digito
      // Ex: ADM001-2024S2B1
      const matchText = card.textContent.match(/([A-Z]{3}\d{3}-\d{4}S\dB\d)/);
      if (matchText) displayIdRaw = matchText[1];
    }

    // 5. Parse do Bimestre (2025S2B1)
    const navMatch = displayIdRaw.match(/-(\d{4})S(\d)B(\d)/);

    let termKey = 'Outros Cursos';
    let sortOrder = 0;

    if (navMatch) {
      const year = navMatch[1];
      const semester = navMatch[2];
      const bimestre = navMatch[3];

      let realBimestre = parseInt(bimestre);
      if (semester === '1') {
        realBimestre = parseInt(bimestre); // 1 ou 2
      } else if (semester === '2') {
        realBimestre = parseInt(bimestre) + 2; // 3 ou 4
      }

      termKey = `${year}/${semester} - ${realBimestre}º Bimestre`;
      sortOrder = parseInt(`${year}${semester}${bimestre}`);
    }

    // Adicionar Map
    if (!termsMap.has(termKey)) {
      termsMap.set(termKey, {
        order: sortOrder,
        courses: [],
      });
    }

    const group = termsMap.get(termKey);
    if (!group.courses.some((c) => c.courseId === internalId)) {
      group.courses.push({ name, url, courseId: internalId });
    }
  });

  // Mapa -> Array
  const termsArray = [];
  termsMap.forEach((val, key) => {
    termsArray.push({
      name: key,
      courses: val.courses,
      _sort: val.order,
    });
  });

  // Ordenar
  termsArray.sort((a, b) => {
    if (a._sort === 0) return 1;
    if (b._sort === 0) return -1;
    return a._sort - b._sort; // Recentes primeiro na UI será invertido
  });

  const finalTerms = termsArray.map((t) => ({ name: t.name, courses: t.courses }));

  results.terms = finalTerms;
  results.success = finalTerms.length > 0;
  if (!results.success)
    results.message = 'Nenhum curso identificado. Tente rolar a página manualmente.';

  return results;
}

// -- FUNÇÃO INJETADA PARA PROCESSAR LISTA --
export async function DOM_deepScrapeSelected_Injected(coursesToScrape) {
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
      const fetchUrl =
        window.location.origin +
        `/webapps/blackboard/execute/launcher?type=Course&id=${course.courseId}&url=`;
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
        return (
          title.includes('página inicial') ||
          textContent.includes('página inicial') ||
          textContent === 'início'
        );
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
        original: course,
      });
    } catch (e) {
      console.error('Erro deep scraping', course.name, e);
      results.push({
        name: course.name,
        url: course.url,
        weeks: [],
        error: true,
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
      args: [courses],
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
