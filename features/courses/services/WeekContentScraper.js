/**
 * @typedef {import('../models/Week.js').WeekItem} WeekItem
 */

import { StrategyRegistry } from './WeekContentScraper/StrategyRegistry.js';

export class WeekContentScraper {
  /**
   * Scrapes week content from AVA by injecting script into active tab
   * @param {string} _weekUrl - URL da semana
   * @returns {Promise<WeekItem[]>}
   */
  static async scrapeWeekContent(_weekUrl) {
    // For testing: mock in jest will intercept this
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      throw new Error('Chrome APIs not available');
    }

    // 0. Parse target Course ID and Content ID from week URL
    let targetCourseId = null;
    let targetContentId = null;

    if (_weekUrl) {
      const courseMatch = _weekUrl.match(/course_id=(_\d+_\d+)/);
      const contentMatch = _weekUrl.match(/content_id=(_\d+_\d+)/);
      if (courseMatch) targetCourseId = courseMatch[1];
      if (contentMatch) targetContentId = contentMatch[1];
    }

    // 1. Get all AVA tabs
    const tabs = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });
    console.warn('[DEBUG-RACE] Total de abas AVA encontradas:', tabs.length);
    tabs.forEach((t, i) => console.warn(`[DEBUG-RACE] Aba ${i}: id=${t.id}, url=${t.url}`));

    let tab = null;

    // 2. Try to find EXACT match (course AND week)
    if (targetCourseId && targetContentId) {
      tab = tabs.find(
        (t) => t.url && t.url.includes(targetCourseId) && t.url.includes(targetContentId)
      );
      console.warn(
        '[DEBUG-RACE] Tentou match EXATO (course + content):',
        tab ? `ENCONTROU id=${tab.id}` : 'NÃO ENCONTROU'
      );

      // 3. If exact not found, find course tab and navigate
      if (!tab) {
        tab = tabs.find((t) => t.url && t.url.includes(targetCourseId));
        console.warn(
          '[DEBUG-RACE] Tentou match por CURSO:',
          tab ? `ENCONTROU id=${tab.id}` : 'NÃO ENCONTROU'
        );
        if (tab && _weekUrl) {
          await chrome.tabs.update(tab.id, { url: _weekUrl, active: true });

          // Wait for navigation using chrome.tabs.onUpdated listener (more reliable)
          await WeekContentScraper.waitForTabLoad(tab.id, 10000);

          // Validate navigation succeeded
          const isValid = await WeekContentScraper.validateTabUrl(
            tab.id,
            targetCourseId,
            targetContentId
          );
          if (!isValid) {
            throw new Error('Navegação falhou - URL não corresponde ao esperado');
          }
        }
      }
    }

    // 4. Fallback: Active Tab or First Available
    if (!tab) {
      tab = tabs.find((t) => t.active) || tabs[0];
      console.warn(
        '[DEBUG-RACE] FALLBACK para aba ativa ou primeira:',
        tab ? `id=${tab.id}` : 'NENHUMA'
      );
    }

    if (!tab || !tab.id) {
      throw new Error('Nenhuma aba do AVA encontrada para realizar o scraping.');
    }

    console.warn('[DEBUG-RACE] ✅ ABA ESCOLHIDA FINAL: id=' + tab.id + ', url=' + tab.url);
    console.warn('[DEBUG-RACE] URL esperada (week.url): ' + _weekUrl);

    // Wait for page to be fully loaded (more robust approach)
    let retries = 3;
    let items = [];

    while (retries > 0) {
      // Wait a bit between retries
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Extract HTML content from page
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Script levíssimo que só extrai o HTML relevante
          const root1 = document.querySelector('ul.content');
          if (root1) return root1.outerHTML;

          const root2 = document.querySelector('#contentList');
          if (root2) return root2.outerHTML;

          // Fallback: retornar body (caro, mas garantido) ou null
          return document.body.outerHTML;
        },
      });

      const htmlContent = results[0]?.result;

      if (htmlContent) {
        // Parse no lado da extensão
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        items = WeekContentScraper.extractItemsFromDOM(doc);
      }

      if (items.length > 0) {
        break; // Success!
      }

      retries--;
    }

    return items;
  }

  /**
   * Extrai itens de tarefa do DOM atual usando Strategy Pattern
   * @param {Document} dom - Documento onde buscar (padrão: document global)
   * @returns {WeekItem[]}
   */
  static extractItemsFromDOM(dom = document) {
    try {
      // Registrar estratégias
      const registry = new StrategyRegistry();
      const items = [];

      // Seletores de lista (mantidos da lógica original para compatibilidade)
      let listItems = dom.querySelectorAll('li[id^="contentListItem:"]');
      if (listItems.length === 0) listItems = dom.querySelectorAll('li.liItem');
      if (listItems.length === 0)
        listItems = dom.querySelectorAll('#contentList li, .contentList li, ul.contentList li');

      listItems.forEach((li) => {
        try {
          const strategy = registry.getStrategy(/** @type {HTMLElement} */ (li));
          if (strategy) {
            const item = strategy.extract(/** @type {HTMLElement} */ (li));
            if (item) {
              items.push(item);
            }
          }
        } catch {
          // Silently skip broken items
        }
      });

      return items;
    } catch {
      return [];
    }
  }

  // Métodos auxiliares de navegação (mantidos idênticos)

  /**
   * Valida se a URL da aba corresponde aos IDs esperados
   * @param {number} tabId - ID da aba
   * @param {string} expectedCourseId - ID do curso esperado
   * @param {string} expectedContentId - ID do conteúdo esperado
   * @returns {Promise<boolean>}
   */
  static async validateTabUrl(tabId, expectedCourseId, expectedContentId) {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (!tab || !tab.url) return false;

      const hasCourse = expectedCourseId ? tab.url.includes(expectedCourseId) : true;
      const hasContent = expectedContentId ? tab.url.includes(expectedContentId) : true;

      return hasCourse && hasContent;
    } catch {
      return false;
    }
  }

  /**
   * Aguarda o carregamento completo da aba usando chrome.tabs.onUpdated
   * @param {number} tabId - ID da aba
   * @param {number} timeout - Timeout em ms (padrão: 10000)
   * @returns {Promise<void>}
   */
  static async waitForTabLoad(tabId, timeout = 10000) {
    return new Promise((resolve, _reject) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(); // Não rejeitamos, apenas resolvemos após timeout
      }, timeout);

      const listener = (updatedTabId, changeInfo, _tab) => {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });
  }
}
