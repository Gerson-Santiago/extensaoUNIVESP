/**
 * Scraper via Mensageria / Injeção.
 * Comunica-se com a página para extrair semanas.
 */

export function extractWeeksFromDoc(doc, baseUrl) {
  const weeks = [];
  const links = doc.querySelectorAll('a');

  links.forEach((a) => {
    const text = (a.innerText || '').trim();
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

    // 1. Tenta identificar se o texto é estritamente "Semana X"
    const weekRegex = /^Semana\s+(\d{1,2})$/i;

    // Verifica no texto visível
    let match = cleanText.match(weekRegex);
    let nameToUse = cleanText;

    // Se não achou no texto, verifica no title
    if (!match && cleanTitle) {
      match = cleanTitle.match(weekRegex);
      nameToUse = cleanTitle;
    }

    if (match && href) {
      const weekNum = parseInt(match[1], 10);

      // Filtra intervalo de 1 a 15 conforme solicitado
      if (weekNum >= 1 && weekNum <= 15) {
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
    pageTitle = pDisc.innerText.trim();
  } else {
    // Fallback: h1.panel-title
    const h1 = doc.querySelector('h1.panel-title');
    if (h1) {
      pageTitle = h1.innerText.trim();
    }
  }

  return { weeks: weeks, title: pageTitle };
}

function DOM_extractWeeks_Injected() {
  // Wrapper para chamar a função exportada no contexto da página (se injetado)
  // Nota: Funções injetadas via scripting.executeScript não têm acesso a imports.
  // Portanto, precisamos duplicar a lógica OU injetar o arquivo todo.
  // Pela arquitetura atual, duplicar a core logic dentro da injeção é mais seguro
  // ou usamos a approach de `func` que contem tudo.

  // COMO NÃO POSSO IMPORTAR DENTRO DE UMA FUNÇÃO INJETADA:
  // Vou manter o codigo original aqui para a injeção funcionar,
  // mas a `extractWeeksFromDoc` servirá para o BatchScraper usar no background/sidepane.

  // ... (Mantendo logica original para não quebrar tabs.js injection) ...
  // Na verdade, o ideal seria que extractWeeksFromDoc fosse usada pelo batchScraper.
  // O scraper.js injection continua autônomo.

  const weeks = [];
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

export async function scrapeWeeksFromTab(tabId) {
  try {
    let allWeeks = [];
    let detectedTitle = null;

    // Injeta a função em TODOS os frames usando scripting
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      func: DOM_extractWeeks_Injected,
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
  } catch {
    return { weeks: [], title: null };
  }
}
