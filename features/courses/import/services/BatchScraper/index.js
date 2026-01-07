/**
 * @file BatchScraper/index.js
 * @description Serviço de raspagem em lote para importar múltiplas semanas/atividades.
 * Gerencia a fila de execução e o estado da importação.
 */
import { Logger } from '../../../../../shared/utils/Logger.js';
import { WEEK_IDENTIFIER_REGEX } from '../../../logic/CourseStructure.js';

/**
 * Extrai informações de bimestre e ordem de sorteio a partir do DisplayID do curso.
 * Exemplo: "MMB002-2025S1B2-T006" -> { termKey: "2025/1 - 1º Bimestre", sortOrder: 202512 }
 * @param {string} displayIdRaw
 * @returns {{ termKey: string, sortOrder: number }}
 */
export function parseCourseTerm(displayIdRaw) {
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

  return { termKey, sortOrder };
}

/**
 * Tenta encontrar o ID de exibição (Display ID) de um curso dentro do seu card.
 * @param {Element|HTMLElement} card
 * @returns {string}
 */
export function getCourseDisplayId(card) {
  const idSpan = card.querySelector('span[id^="course-id-"]');
  if (idSpan) return idSpan.textContent.trim();

  // Fallback: busca por padrão ADM001-2024S2B1
  const matchText = card.textContent.match(/([A-Z]{3}\d{3}-\d{4}S\dB\d)/);
  return matchText ? matchText[1] : '';
}

/**
 * Função auxiliar de raspagem de semanas de um HTML.
 * @param {Document} doc
 * @param {string} baseUrl
 * @param {string} weekRegexSource
 */
export function extractWeeksFromHTML(doc, baseUrl, weekRegexSource) {
  const weeks = [];
  const links = doc.querySelectorAll('a');

  links.forEach((a) => {
    const text = (a.innerText || a.textContent || '').trim();
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
    // eslint-disable-next-line security/detect-non-literal-regexp
    const weekRegex = new RegExp(weekRegexSource, 'i');

    let match = cleanText.match(weekRegex);
    let nameToUse = cleanText;

    if (!match && cleanTitle) {
      match = cleanTitle.match(weekRegex);
      nameToUse = cleanTitle;
    }

    if (!match || !href) return;

    // match[2] = grupo do número (undefined para "Revisão")
    const weekNum = match[2] ? parseInt(match[2], 10) : null;

    // Válido se: for Revisão (null) OU semana 1-15
    const isValidWeek = weekNum === null || (weekNum >= 1 && weekNum <= 15);

    if (isValidWeek) {
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

  // Função auxiliar: Extrai número da semana ou retorna 999 para "Revisão"
  function getWeekNumber(weekName) {
    if (/revisão/i.test(weekName)) {
      return 999; // Revisão sempre por último
    }
    const match = weekName.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  uniqueWeeks.sort((a, b) => {
    const numA = getWeekNumber(a.name);
    const numB = getWeekNumber(b.name);
    return numA - numB;
  });

  return uniqueWeeks;
}

// -- FUNÇÃO INJETADA PARA LER BIMESTRES E CURSOS --
export async function DOM_scanTermsAndCourses_Injected(locationContext = window.location) {
  const results = {
    success: false,
    terms: [],
    message: '',
  };

  // 1. Verificação de URL e Login
  if (
    !locationContext.href.includes('/ultra/course') &&
    !locationContext.href.includes('bb_router')
  ) {
    if (!document.getElementById('courses-overview-content')) {
      results.message = 'Por favor, acesse a página de Cursos do AVA e faça login.';
      return results;
    }
  }

  // Auto-Scroll para carregar "Infinite Scroll"
  try {
    const getScrollElement = () => {
      const main = document.getElementById('main-content-inner');
      if (main && main.scrollHeight > main.clientHeight) return main;

      return (
        Array.from(document.querySelectorAll('div')).find((div) => {
          if (div.scrollHeight <= div.clientHeight || div.clientHeight <= 100) return false;
          const style = window.getComputedStyle(div);
          return ['auto', 'scroll'].includes(style.overflowY) || style.overflow === 'auto';
        }) || window
      );
    };

    const scrollTarget = getScrollElement();
    let lastHeight =
      scrollTarget === window
        ? document.documentElement.scrollHeight
        : /** @type {HTMLElement} */ (scrollTarget).scrollHeight;
    let attempts = 0;

    while (attempts < 10) {
      if (scrollTarget === window) {
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        /** @type {HTMLElement} */ (scrollTarget).scrollTop = /** @type {HTMLElement} */ (
          scrollTarget
        ).scrollHeight;
      }

      await new Promise((r) => setTimeout(r, 1500));

      const newHeight =
        scrollTarget === window
          ? document.documentElement.scrollHeight
          : /** @type {HTMLElement} */ (scrollTarget).scrollHeight;

      if (newHeight === lastHeight) {
        await new Promise((r) => setTimeout(r, 1000)); // Double-check
        const retryHeight =
          scrollTarget === window
            ? document.documentElement.scrollHeight
            : /** @type {HTMLElement} */ (scrollTarget).scrollHeight;
        if (retryHeight === lastHeight) break;
        lastHeight = retryHeight;
      } else {
        lastHeight = newHeight;
      }
      attempts++;
    }
  } catch (e) {
    /**#LOG_SCRAPER*/
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
    /** @type {HTMLAnchorElement} */
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
    const idSpan = card.querySelector('span[id^="course-id-"]');
    let displayIdRaw = idSpan ? idSpan.textContent.trim() : '';

    if (!displayIdRaw) {
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
        realBimestre = parseInt(bimestre);
      } else if (semester === '2') {
        realBimestre = parseInt(bimestre) + 2;
      }
      termKey = `${year}/${semester} - ${realBimestre}º Bimestre`;
      sortOrder = parseInt(`${year}${semester}${bimestre}`);
    }

    // Adicionar Map
    if (!termsMap.has(termKey)) {
      termsMap.set(termKey, { order: sortOrder, courses: [] });
    }
    const group = termsMap.get(termKey);
    if (!group.courses.some((c) => c.courseId === internalId)) {
      group.courses.push({ name, url, courseId: internalId });
    }
  });

  // Mapa -> Array
  const termsArray = [];
  termsMap.forEach((val, key) => {
    termsArray.push({ name: key, courses: val.courses, _sort: val.order });
  });

  // Ordenar
  termsArray.sort((a, b) => {
    if (a._sort === 0) return 1;
    if (b._sort === 0) return -1;
    return a._sort - b._sort;
  });

  results.terms = termsArray.map((t) => ({ name: t.name, courses: t.courses }));
  results.success = results.terms.length > 0;
  if (!results.success) results.message = 'Nenhum curso identificado.';

  return results;
}

// -- FUNÇÃO INJETADA PARA PROCESSAR LISTA --
export async function DOM_deepScrapeSelected_Injected(
  coursesToScrape,
  weekRegexSource,
  locationContext = window.location
) {
  const results = [];

  // Redundante para o contexto injetado
  function extractWeeksInternal(doc, baseUrl) {
    const weeks = [];
    const links = doc.querySelectorAll('a');
    links.forEach((a) => {
      const text = (a.textContent || '').trim();
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
      // eslint-disable-next-line security/detect-non-literal-regexp -- weekRegexSource vem do parâmetro WEEK_IDENTIFIER_REGEX.source centralizado
      const weekRegex = new RegExp(weekRegexSource, 'i');
      let match = text.match(weekRegex);
      let nameToUse = text;
      if (!match && title) {
        match = title.match(weekRegex);
        nameToUse = title;
      }
      if (!match || !href) return;
      const weekNum = match[2] ? parseInt(match[2], 10) : null;
      if (weekNum === null || (weekNum >= 1 && weekNum <= 15)) {
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
    });

    const uniqueWeeks = [];
    const map = new Map();
    for (const w of weeks) {
      if (!map.has(w.url)) {
        map.set(w.url, true);
        uniqueWeeks.push(w);
      }
    }
    uniqueWeeks.sort((a, b) => {
      const getNum = (s) =>
        /revisão/i.test(s) ? 999 : s.match(/\d+/) ? parseInt(s.match(/\d+/)[0], 10) : 0;
      return getNum(a.name) - getNum(b.name);
    });
    return uniqueWeeks;
  }

  for (const course of coursesToScrape) {
    try {
      const fetchUrl =
        locationContext.origin +
        `/webapps/blackboard/execute/launcher?type=Course&id=${course.courseId}&url=`;
      const response = await fetch(fetchUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const spans = Array.from(doc.querySelectorAll('span'));
      const targetSpan = spans.find((s) => {
        const title = (s.getAttribute('title') || '').toLowerCase();
        const content = s.textContent.toLowerCase();
        return (
          title.includes('página inicial') ||
          content.includes('página inicial') ||
          content === 'início'
        );
      });

      let finalUrl = course.url;
      let weeks = [];
      if (targetSpan) {
        const parentLink = targetSpan.closest('a');
        if (parentLink) {
          const href = parentLink.getAttribute('href');
          if (href && href.includes('listContent.jsp')) finalUrl = locationContext.origin + href;
        }
      }
      if (finalUrl && finalUrl.includes('listContent.jsp')) {
        const resp2 = await fetch(finalUrl);
        const text2 = await resp2.text();
        const doc2 = parser.parseFromString(text2, 'text/html');
        weeks = extractWeeksInternal(doc2, locationContext.origin);
      }
      results.push({ name: course.name, url: finalUrl, weeks: weeks, original: course });
    } catch (e) {
      console.error('Erro deep scraping', course.name, e);
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
    if (results && results[0] && results[0].result) return results[0].result;
    return { success: false, message: 'Falha na comunicação com a página.' };
  } catch (error) {
    Logger.error('BatchScraper', error);
    return { success: false, message: 'Erro ao executar script: ' + error.message };
  }
}

export async function processSelectedCourses(tabId, courses) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: DOM_deepScrapeSelected_Injected,
      args: [courses, WEEK_IDENTIFIER_REGEX.source],
    });
    if (results && results[0] && results[0].result) return results[0].result;
    return [];
  } catch (error) {
    Logger.error('BatchScraper', error);
    return [];
  }
}
