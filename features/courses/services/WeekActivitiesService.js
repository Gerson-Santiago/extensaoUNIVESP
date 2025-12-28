import { WeekContentScraper } from './WeekContentScraper.js';
import { QuickLinksScraper } from './QuickLinksScraper.js';
import { Tabs } from '../../../shared/utils/Tabs.js';
import { Toaster } from '../../../shared/ui/feedback/Toaster.js';
import { DomUtils } from '../../../shared/utils/DomUtils.js';

/**
 * Service to manage fetching week activities.
 * Decouples scraping orchestration from the View layer.
 */
export class WeekActivitiesService {
  /** @type {Set<string>} IDs de weeks sendo scrapadas (previne race condition) */
  static #activeScraping = new Set();

  /**
   * Get activities for a week, using cache if available for the same method.
   * @param {Object} week - The week object (from course.weeks).
   * @param {'DOM' | 'QuickLinks'} method - The scraping method to use.
   * @returns {Promise<Array>} List of activities.
   */
  static async getActivities(week, method = 'DOM') {
    // Cache Hit: Return if already scraped with the SAME method
    if (week.items && week.items.length > 0 && week.method === method) {
      return week.items;
    }

    // 🔒 LOCK: Previne scraping simultâneo da mesma semana
    const lockKey = `${week.courseId}_${week.contentId}`;
    if (this.#activeScraping.has(lockKey)) {
      // Aguarda 100ms e tenta de novo (espera o scraping atual terminar)
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.getActivities(week, method); // Retry
    }

    let toaster = null;

    try {
      console.warn('[DEBUG-RACE] ========================================');
      console.warn('[DEBUG-RACE] Iniciando scraping:', week.name);
      console.warn('[DEBUG-RACE] URL alvo:', week.url);
      console.warn('[DEBUG-RACE] Método:', method);

      // 🆕 1. Garantir que aba correta está aberta ANTES do scraping
      const tab = await Tabs.openOrSwitchTo(week.url);

      if (!tab || !tab.id) {
        throw new Error('Falha ao abrir aba da semana');
      }

      console.warn(
        '[DEBUG-RACE] Tabs.openOrSwitchTo retornou: id=' + tab.id + ', status=' + tab.status
      );

      // 🆕 2. Aguardar carregamento completo se aba estiver carregando
      if (tab.status === 'loading') {
        // 🎨 Feedback visual: Informa usuário que está aguardando
        toaster = new Toaster();
        toaster.show(
          `⏳ Aguardando "${week.name}" carregar para buscar atividades...`,
          'info',
          5000
        );

        await this.waitForTabComplete(tab.id);
      }

      // 🆕 3. Pequeno delay adicional para garantir que scripts da página estejam prontos
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 🆕 4. CRÍTICO: Fechar modal do Blackboard que pode bloquear scraping
      try {
        this.#activeScraping.add(lockKey); // Marca como em progresso APÓS garantir aba
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: DomUtils.ensureModalClosed,
        });
      } catch {
        // Não bloqueia execução se falhar
      }

      // 5. Executar scraping (agora com modal fechado e aba correta)
      const scraper = method === 'QuickLinks' ? QuickLinksScraper : WeekContentScraper;
      const scrapeMethod = method === 'QuickLinks' ? 'scrapeFromQuickLinks' : 'scrapeWeekContent';

      const items = await scraper[scrapeMethod](week.url);
      console.warn('[DEBUG-RACE] Scraping retornou:', items.length, 'itens');

      // 🎨 Feedback de sucesso
      if (toaster && items.length > 0) {
        toaster.show(`✅ ${items.length} atividades carregadas de "${week.name}"`, 'success', 3000);
      }

      // 6. Atualizar cache
      week.items = items;
      week.method = method;

      return items;
    } finally {
      // 🔓 UNLOCK: Libera lock independente de sucesso/erro
      this.#activeScraping.delete(lockKey);
    }
  }

  /**
   * Aguarda o carregamento completo de uma aba.
   * @param {number} tabId - ID da aba a aguardar
   * @param {number} timeout - Timeout em ms (padrão: 10000)
   * @returns {Promise<void>}
   */
  static async waitForTabComplete(tabId, timeout = 10000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }, timeout);

      const listener = (updatedTabId, changeInfo) => {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });
  }

  /**
   * Limpa o cache de atividades de uma semana.
   * @param {Object} week - Objeto da semana
   */
  static clearCache(week) {
    if (week) {
      week.items = [];
      week.method = undefined;
    }
  }
}
