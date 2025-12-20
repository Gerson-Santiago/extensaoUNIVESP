/**
 * Serviço responsável pela lógica de Auto-Scroll na página de Cursos do AVA.
 * OBS: A função `DOM_autoScroll_Injected` é executada NO CONTEXTO DA PÁGINA (Content Script),
 * por isso não pode ter dependências externas importadas.
 */

// Esta função será serializada e injetada na aba.
export function DOM_autoScroll_Injected() {
  const STEP = 300;
  const INTERVAL = 1500;
  const MAX_RETRIES = 5;

  if (window['_autoScrollRun']) {
    alert('O carregamento automático já está em andamento.');
    return;
  }

  /** @returns {HTMLElement | Window} */
  const getScrollElement = () => {
    const mainContainer = document.getElementById('main-content-inner');
    if (mainContainer && mainContainer.scrollHeight > mainContainer.clientHeight) {
      return mainContainer;
    }

    const allDivs = document.querySelectorAll('div');
    // Convert NodeList to Array for safe iteration
    for (const div of Array.from(allDivs)) {
      if (div.scrollHeight > div.clientHeight && div.clientHeight > 100) {
        const style = window.getComputedStyle(div);
        if (['auto', 'scroll'].includes(style.overflowY) || style.overflow === 'auto') {
          return /** @type {HTMLElement} */ (div);
        }
      }
    }
    return window;
  };

  const scrollTarget = getScrollElement();
  window['_autoScrollRun'] = true;
  let retries = 0;
  let lastHeight =
    scrollTarget === window
      ? document.documentElement.scrollHeight
      : /** @type {HTMLElement} */ (scrollTarget).scrollHeight;
  const originalTitle = document.title;
  document.title = '[Carregando...] ' + originalTitle;

  const scroll = () => {
    if (scrollTarget === window) {
      window.scrollBy({ top: STEP, behavior: 'smooth' });
    } else {
      scrollTarget.scrollBy({ top: STEP, behavior: 'smooth' });
    }

    setTimeout(() => {
      const currentHeight =
        scrollTarget === window
          ? document.documentElement.scrollHeight
          : /** @type {HTMLElement} */ (scrollTarget).scrollHeight;

      let isBottom = false;
      if (scrollTarget === window) {
        isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      } else {
        const el = /** @type {HTMLElement} */ (scrollTarget);
        isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
      }

      if (currentHeight > lastHeight) {
        lastHeight = currentHeight;
        retries = 0;
        scroll();
        return;
      }

      retries++;
      if (retries < MAX_RETRIES && !isBottom) {
        scroll();
        return;
      }

      window['_autoScrollRun'] = false;
      document.title = originalTitle;
      const count = document.querySelectorAll('.course-element-card, .element-card').length;
      alert(`Carregamento concluído! ${count} cursos encontrados.`);
    }, INTERVAL);
  };

  scroll();
}

export const AutoScrollService = {
  async run() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: DOM_autoScroll_Injected,
      });
    } catch (e) {
      console.error('Erro ao injetar auto-scroll:', e);
      alert('Não foi possível iniciar o scroll nesta página.');
    }
  },
};
