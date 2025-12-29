/**
 * @file RefreshHandler.js
 * @description Gerencia atualização de atividades via re-scraping
 * @architecture View Layer - Handler
 */

import { Logger } from '../../../../../shared/utils/Logger.js';

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
      // Re-executar scraping via Service (garante consistência, retry e persistência)
      const { WeekActivitiesService } = await import('../../../services/WeekActivitiesService.js');
      const items = await WeekActivitiesService.getActivities(this.week, method);

      // Atualizar week.items
      this.week.items = items;

      // Chamar callback para re-renderizar
      if (this.onRefreshComplete) {
        this.onRefreshComplete();
      }
    } catch (error) {
      /**#LOG_UI*/
      Logger.error('RefreshHandler', 'Erro ao atualizar:', error);
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
