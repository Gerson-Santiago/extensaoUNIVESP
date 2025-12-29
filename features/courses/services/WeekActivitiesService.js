import { WeekContentScraper } from './WeekContentScraper.js';
import { QuickLinksScraper } from './QuickLinksScraper.js';
import { Tabs } from '../../../shared/utils/Tabs.js';
import { Toaster } from '../../../shared/ui/feedback/Toaster.js';
import { DomUtils } from '../../../shared/utils/DomUtils.js';
import { ActivityRepository } from '../repositories/ActivityRepository.js';
import { trySafe } from '../../../shared/utils/ErrorHandler.js';

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
   * @returns {Promise<import('../../../shared/utils/ErrorHandler.js').SafeResult<Array>>} Resultado seguro.
   */
  static async getActivities(week, method = 'DOM') {
    return trySafe(
      (async () => {
        // 0. Garantir IDs para cache (extração de URL se necessário)
        let contentId = week.contentId;
        if (!contentId && week.url) {
          const match = week.url.match(/content_id=(_[^&]+)/);
          if (match && match[1]) {
            contentId = match[1];
            // Atualiza a referência original se possível, para consistência futura
            week.contentId = contentId;
          }
        }

        // 0.1. Garantir Course ID (extração de URL se necessário)
        let courseId = week.courseId;
        if (!courseId && week.url) {
          const match = week.url.match(/course_id=(_[^&]+)/);
          if (match && match[1]) {
            courseId = match[1];
            week.courseId = courseId;
          }
        }

        if (!courseId || !contentId) {
          console.warn(
            '[WeekActivitiesService] ID do curso ou contentId ausente. Abortando cache.',
            {
              courseId,
              contentId,
            }
          );
          // Se não tem ID, não tem como usar cache seguro. Prossegue para scraping se tiver URL.
        } else {
          // 1. Memória Cache Hit: Return if already scraped with the SAME method
          if (week.items && week.items.length > 0 && week.method === method) {
            // eslint-disable-next-line no-console
            console.debug('[WeekActivitiesService] Cache de memória utilizado.');
            return week.items;
          }

          // 2. Storage Cache Hit: Check persistent storage
          try {
            const cached = await ActivityRepository.get(courseId, contentId);
            // Verifica se o cache é válido E compatível com o método (ou se o cache é "melhor", ex: DOM > QuickLinks)
            // Se pediu DOM e tem DOM, usa. Se pediu Quick e tem DOM, usa (DOM é superset).
            const isCompatible = cached && (cached.method === method || cached.method === 'DOM');

            if (isCompatible && cached.items && cached.items.length > 0) {
              // eslint-disable-next-line no-console
              console.debug(
                '[WeekActivitiesService] Cache persistente encontrado e VÁLIDO:',
                cached.items.length,
                'items'
              );
              week.items = cached.items;
              week.method = cached.method; // Restaurar método original
              return week.items;
            } else if (cached) {
              // eslint-disable-next-line no-console
              console.debug('[WeekActivitiesService] Cache encontrado mas incompatível ou vazio.', {
                req: method,
                cached: cached.method,
              });
            }
          } catch (e) {
            console.warn('[WeekActivitiesService] Erro ao ler cache persistente:', e);
          }
        }

        // 🔒 LOCK: Previne scraping simultâneo da mesma semana
        const lockKey = `${week.courseId}_${week.contentId}`;
        if (this.#activeScraping.has(lockKey)) {
          // Aguarda 100ms e tenta de novo (espera o scraping atual terminar)
          await new Promise((resolve) => setTimeout(resolve, 100));
          const result = await this.getActivities(week, method); // Retry recursive
          if (result.success) return result.data;
          throw result.error;
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

          // 5. Executar scraping (agora com modal fechado e aba correta + ID ESTRITO)
          const scraper = method === 'QuickLinks' ? QuickLinksScraper : WeekContentScraper;
          const scrapeMethod =
            method === 'QuickLinks' ? 'scrapeFromQuickLinks' : 'scrapeWeekContent';

          // 🛑 STRICT TAB ENFORCEMENT: Passamos o tab.id explicitamente
          let items = [];
          try {
            items = await scraper[scrapeMethod](week.url, tab.id);
          } catch (error) {
            console.error('[WeekActivitiesService] Scraping falhou:', error);
            if (toaster) {
              toaster.show('❌ Falha ao ler atividades da aba.', 'error', 4000);
            }
            throw error; // Propaga erro para impedir atualização de cache com dados vazios
          }
          console.warn('[DEBUG-RACE] Scraping retornou:', items.length, 'itens');

          // 🎨 Feedback de sucesso ou FALLBACK
          if (items.length > 0) {
            if (toaster)
              toaster.show(
                `✅ ${items.length} atividades carregadas de "${week.name}"`,
                'success',
                3000
              );
          } else if (method === 'QuickLinks') {
            // ⚠️ FALLBACK AUTOMÁTICO: QuickLinks falhou (0 itens), tentar DOM
            console.warn('[DEBUG-RACE] QuickLinks retornou 0 itens. Tentando fallback para DOM...');
            if (toaster)
              toaster.show('⚠️ Modo rápido vazio. Buscando modo completo...', 'info', 4000);

            // Executar fallback (passando tab.id também!)
            items = await WeekContentScraper.scrapeWeekContent(week.url, tab.id);
            console.warn('[DEBUG-RACE] Fallback DOM retornou:', items.length, 'itens');

            // Atualizar método para refletir a fonte real dos dados
            method = 'DOM';

            if (toaster && items.length > 0) {
              toaster.show(
                `✅ ${items.length} atividades recuperadas (Modo Completo)`,
                'success',
                3000
              );
            }
          }

          // 6. Atualizar cache em MEMÓRIA
          week.items = items;
          week.method = method;

          // 7. Salvar cache PERSISTENTE
          if (items.length > 0) {
            await ActivityRepository.save(week.courseId, week.contentId, items, method);
            console.warn('[WeekActivitiesService] Atividades persistidas com sucesso.');
          }

          return items;
        } finally {
          // 🔓 UNLOCK: Libera lock independente de sucesso/erro
          this.#activeScraping.delete(lockKey);
        }
      })()
    );
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
