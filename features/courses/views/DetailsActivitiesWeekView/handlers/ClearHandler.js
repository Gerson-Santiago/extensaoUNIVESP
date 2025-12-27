/**
 * @file ClearHandler.js
 * @description Gerencia limpeza de cache de atividades
 * @architecture View Layer - Handler
 */

import { WeekActivitiesService } from '../../../services/WeekActivitiesService.js';

/**
 * Gerencia limpeza de cache de atividades
 */
export class ClearHandler {
  /**
   * @param {Object} week - Dados da semana
   * @param {Function} onBack - Callback para voltar à lista
   */
  constructor(week, onBack) {
    this.week = week;
    this.onBack = onBack;
  }

  /**
   * Limpa cache de atividades e volta para lista de semanas
   */
  async handleClear() {
    if (!this.week) return;

    // Confirmar com usuário
    const confirmed = confirm(
      `Deseja limpar o cache de atividades de "${this.week.name}"?\n\n` +
        'Isso forçará um novo scraping na próxima vez.'
    );

    if (!confirmed) return;

    try {
      // Limpar cache via service
      await WeekActivitiesService.clearCache(this.week);

      // Voltar para lista de semanas
      if (this.onBack) {
        this.onBack();
      }
    } catch (error) {
      console.error('[ClearHandler] Erro ao limpar cache:', error);
      alert('Erro ao limpar cache. Tente novamente.');
    }
  }
}
