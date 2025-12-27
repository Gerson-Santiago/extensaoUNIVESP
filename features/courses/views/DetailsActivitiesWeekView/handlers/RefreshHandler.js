/**
 * @file RefreshHandler.js
 * @description Gerencia atualização de atividades via re-scraping
 * @architecture View Layer - Handler
 */

/**
 * Gerencia refresh de atividades
 */
export class RefreshHandler {
  /**
   * @param {Object} week - Dados da semana
   * @param {Function} onRefreshComplete - Callback após refresh
   */
  constructor(week, onRefreshComplete) {
    this.week = week;
    this.onRefreshComplete = onRefreshComplete;
  }

  /**
   * Atualiza lista re-executando scraping
   * @param {HTMLButtonElement} btn - Botão de refresh (para loading state)
   */
  async handleRefresh(btn) {
    if (!this.week) return;

    const method = this.week.method || 'DOM';
    const originalText = btn.textContent;

    try {
      // Loading state
      btn.disabled = true;
      btn.textContent = '⏳';

      // Re-executar scraping baseado no método
      let items = [];
      if (method === 'QuickLinks') {
        const { QuickLinksScraper } = await import('../../../services/QuickLinksScraper.js');
        items = await QuickLinksScraper.scrapeFromQuickLinks(this.week.url);
      } else {
        const { WeekContentScraper } = await import('../../../services/WeekContentScraper.js');
        items = await WeekContentScraper.scrapeWeekContent(this.week.url);
      }

      // Atualizar week.items
      this.week.items = items;

      // Chamar callback para re-renderizar
      if (this.onRefreshComplete) {
        this.onRefreshComplete();
      }
    } catch (error) {
      console.error('[RefreshHandler] Erro ao atualizar:', error);
      const { Toaster } = await import('../../../../../shared/ui/feedback/Toaster.js');
      const toaster = new Toaster();
      toaster.show('Erro ao atualizar lista. Tente novamente.', 'error');
    } finally {
      // Restaurar estado
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}
