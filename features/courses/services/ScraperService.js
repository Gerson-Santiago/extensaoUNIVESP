import { WEEK_IDENTIFIER_REGEX, sortWeeks } from '../logic/CourseStructure.js';
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

/**
 * Serviço de Scraping via Mensageria / Injeção.
 * Comunica-se com a página do AVA para extrair semanas e conteúdos.
 */
export class ScraperService {
  /**
   * Extrai semanas de um documento HTML (DOM Parser).
   * @param {Document} doc - Documento HTML parseado.
   * @param {string} baseUrl - URL base para resolver links relativos.
   * @returns {{weeks: Array<{name: string, url: string}>, title: string|null}}
   */
  static extractWeeksFromDoc(doc, baseUrl) {
    const weeks = [];
    const links = doc.querySelectorAll('a');

    links.forEach((a) => {
      const text = (a.innerText || a.textContent || '').trim();
      const title = (a.title || '').trim();

      let href = a.href;
      // Fix relative links if using DOMParser where base might be different or empty
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

      const weekRegex = WEEK_IDENTIFIER_REGEX;

      // Verifica no texto visível
      let match = cleanText.match(weekRegex);
      let nameToUse = cleanText;

      // Se não achou no texto, verifica no title
      if (!match && cleanTitle) {
        match = cleanTitle.match(weekRegex);
        nameToUse = cleanTitle;
      }

      if (match && href) {
        // Auditoria de Atributos: Sanitização rigorosa contra protocolos perigosos (XSS)
        const sanitizedUrl = DOMSafe.sanitizeUrl(href);
        if (!sanitizedUrl) return;

        // Se for semana numerada, valida intervalo 1-15
        const weekNum = match[2] ? parseInt(match[2], 10) : null;

        const isValidWeek = weekNum === null || (weekNum >= 1 && weekNum <= 15);

        if (isValidWeek) {
          // Filtra links javascript puros sem handler conhecido
          if (!href.startsWith('javascript:')) {
            weeks.push({ name: nameToUse, url: href });
          } else if (a.onclick) {
            // Extração avançada de onclick se necessário
            const onClickText = a.getAttribute('onclick');
            const urlMatch = onClickText && onClickText.match(/'(\/webapps\/.*?)'/);
            if (urlMatch && urlMatch[1]) {
              weeks.push({ name: nameToUse, url: baseUrl + urlMatch[1] });
            }
          }
        }
      }
    });

    // Tenta extrair o título da matéria
    let pageTitle = null;

    // Prioridade: p.discipline-title
    const pDisc = doc.querySelector('p.discipline-title');
    if (pDisc) {
      pageTitle = /** @type {HTMLElement} */ (pDisc).innerText.trim();
    } else {
      // Fallback: h1.panel-title
      const h1 = doc.querySelector('h1.panel-title');
      if (h1) {
        pageTitle = /** @type {HTMLElement} */ (h1).innerText.trim();
      }
    }

    return { weeks: weeks, title: pageTitle };
  }

  /**
   * Realiza a raspagem de semanas de uma aba específica.
   * @param {number} tabId - ID da aba do Chrome.
   * @returns {Promise<{weeks: Array, title: string|null}>}
   */
  static async scrapeWeeksFromTab(tabId) {
    try {
      let allWeeks = [];
      let detectedTitle = null;

      // Injeta a função em TODOS os frames usando scripting
      // Nota: Precisei manter a função DOM_extractWeeks_Injected aqui dentro como string ou referenciá-la duplicada
      // Para manter o original funcionando, vamos manter a lógica de injeção que já existia no arquivo original,
      // mas como Método Estático é dificil injetar "this.method".
      // Solução: Definir a função auxiliar fora da classe (mas no mesmo arquivo) para ser injetada.

      const results = await chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        func: DOM_extractWeeks_Injected,
        args: [WEEK_IDENTIFIER_REGEX.source], // .source = string da regex
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

      sortWeeks(uniqueWeeks);

      return { weeks: uniqueWeeks, title: detectedTitle };
    } catch {
      return { weeks: [], title: null };
    }
  }
}

/**
 * Função auxiliar para injeção no navegador.
 * Mantida fora da classe para ser serializável pelo Chrome Scripting API.
 *
 * Nota: RegExp é reconstruído a partir da string porque objetos RegExp não podem
 * ser serializados para injeção via chrome.scripting.executeScript.
 *
 * @param {string} weekRegexSource - Pattern regex validado (WEEK_IDENTIFIER_REGEX.source)
 */
function DOM_extractWeeks_Injected(weekRegexSource) {
  // eslint-disable-next-line security/detect-non-literal-regexp -- Necessário: weekRegexSource é constante validada passada via executeScript (limitação da API Chrome)
  const weekRegex = new RegExp(weekRegexSource, 'i');
  const weeks = []; // Array para armazenar semanas encontradas
  const links = document.querySelectorAll('a');

  links.forEach((a) => {
    const text = (a.innerText || '').trim();
    const title = (a.title || '').trim();

    let href = a.href;
    if (href && !href.startsWith('http')) {
      const rawHref = a.getAttribute('href');
      if (rawHref && !rawHref.startsWith('http')) {
        href = window.location.origin + rawHref;
      }
    }

    const cleanText = (text || '').trim();
    const cleanTitle = (title || '').trim();

    let match = cleanText.match(weekRegex);
    let nameToUse = cleanText;

    if (!match && cleanTitle) {
      match = cleanTitle.match(weekRegex);
      nameToUse = cleanTitle;
    }

    if (match && href) {
      // match[1] = toda a captura, match[2] = grupo do número (se existir)
      const weekNum = match[2] ? parseInt(match[2], 10) : null;

      // Válido se: for Revisão (sem número) OU semana numerada entre 1-15
      const isValidWeek = weekNum === null || (weekNum >= 1 && weekNum <= 15);

      if (isValidWeek) {
        if (!href.startsWith('javascript:')) {
          weeks.push({ name: nameToUse, url: href });
        } else if (a.onclick) {
          const onClickText = a.getAttribute('onclick');
          const urlMatch = onClickText.match(/'(\/webapps\/.*?)'/);
          if (urlMatch && urlMatch[1]) {
            weeks.push({ name: nameToUse, url: window.location.origin + urlMatch[1] });
          }
        }
      }
    }
  });

  let pageTitle = null;
  const pDisc = document.querySelector('p.discipline-title');
  if (pDisc instanceof HTMLElement) {
    pageTitle = pDisc.innerText.trim();
  } else {
    const h1 = document.querySelector('h1.panel-title');
    if (h1 instanceof HTMLElement) {
      pageTitle = h1.innerText.trim();
    }
  }

  return { weeks: weeks, title: pageTitle };
}
