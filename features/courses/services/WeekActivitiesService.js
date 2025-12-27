import { WeekContentScraper } from './WeekContentScraper.js';
import { QuickLinksScraper } from './QuickLinksScraper.js';
import { Tabs } from '../../../shared/utils/Tabs.js';
import { Toaster } from '../../../shared/ui/feedback/Toaster.js';

/**
 * Service to manage fetching week activities.
 * Decouples scraping orchestration from the View layer.
 */
export class WeekActivitiesService {
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

    let toaster = null;

    try {
      console.warn(`[WeekActivitiesService] Scraping via ${method}...`);

      // 🆕 1. Garantir que aba correta está aberta ANTES do scraping
      console.warn(`[WeekActivitiesService] Abrindo/focando aba: ${week.url}`);
      const tab = await Tabs.openOrSwitchTo(week.url);

      if (!tab || !tab.id) {
        throw new Error('Falha ao abrir aba da semana');
      }

      // 🆕 2. Aguardar carregamento completo se aba estiver carregando
      if (tab.status === 'loading') {
        console.warn(`[WeekActivitiesService] Aguardando carregamento da aba ${tab.id}...`);

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

      // 4. Executar scraping (agora com garantia de aba correta)
      const scraper = method === 'QuickLinks' ? QuickLinksScraper : WeekContentScraper;
      const scrapeMethod = method === 'QuickLinks' ? 'scrapeFromQuickLinks' : 'scrapeWeekContent';

      const items = await scraper[scrapeMethod](week.url);

      // 🎨 Feedback de sucesso
      if (toaster && items.length > 0) {
        toaster.show(`✅ ${items.length} atividades carregadas de "${week.name}"`, 'success', 3000);
      }

      // 5. Atualizar cache
      week.items = items;
      week.method = method;

      return items;
    } catch (error) {
      console.error(`[WeekActivitiesService] Error fetching activities via ${method}:`, error);
      // Propagate error so View can handle UI state (e.g. remove active class)
      throw error;
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
        console.warn(`[WeekActivitiesService] Timeout aguardando aba ${tabId}`);
        resolve();
      }, timeout);

      const listener = (updatedTabId, changeInfo) => {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          console.warn(`[WeekActivitiesService] Aba ${tabId} carregada completamente`);
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
      console.warn(`[WeekActivitiesService] Cache limpo para: ${week.name}`);
    }
  }
}
