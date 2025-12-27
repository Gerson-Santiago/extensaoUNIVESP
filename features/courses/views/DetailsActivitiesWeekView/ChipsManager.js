/**
 * @file ChipsManager.js
 * @description Gerencia chips de navegação contextual
 * @architecture View Layer - Chips Manager
 */

import { ContextualChips } from '../../../../shared/ui/ContextualChips.js';
import { HistoryService } from '../../../../shared/services/HistoryService.js';

/**
 * Gerencia chips de navegação contextual com histórico
 */
export class ChipsManager {
  /**
   * @param {HTMLElement} container - Container dos chips
   * @param {Object} week - Dados da semana atual
   */
  constructor(container, week) {
    this.container = container;
    this.week = week;
    this.chipsComponent = null;
    this.historyService = null;
  }

  /**
   * Renderiza chips de navegação
   */
  async renderChips() {
    console.warn('[ChipsManager] renderChips() chamado');
    console.warn('[ChipsManager] Container?', !!this.container, 'Week?', !!this.week);

    if (!this.container || !this.week) return;

    // Load user settings
    const settings = await this.loadChipsSettings();
    console.warn('[ChipsManager] Settings carregados:', settings);

    // Skip if disabled
    if (!settings.enabled) {
      console.warn('[ChipsManager] Chips DESATIVADOS por settings.enabled =', settings.enabled);
      this.container.innerHTML = '';
      return;
    }

    // Obter course ID
    const courseId = this.week.courseId || this.week.courseName || 'default';
    console.warn('[ChipsManager] courseId extraído:', courseId);

    // Inicializar/atualizar HistoryService
    if (!this.historyService || this.historyService.maxItems !== settings.maxItems) {
      this.historyService = new HistoryService(settings.maxItems);
    }

    // Salvar acesso atual
    await this.historyService.push(courseId, {
      id: this.week.url || this.week.name,
      label: this.week.name,
      targetId: this.week.url,
      url: this.week.url,
    });

    // Buscar histórico
    const recentWeeks = await this.historyService.getRecent(courseId);
    console.warn('[ChipsManager] Histórico recente:', recentWeeks);

    // Inicializar componente
    if (!this.chipsComponent) {
      this.chipsComponent = new ContextualChips(this.container);

      // Evento de navegação
      this.chipsComponent.on('navigate', (item) => {
        this.navigateToWeek(item);
      });

      // Evento de remoção
      this.chipsComponent.on('remove', async (itemId) => {
        await this.historyService.remove(courseId, itemId);
        this.renderChips(); // Re-render
      });
    }

    // Renderizar
    console.warn('[ChipsManager] Renderizando', recentWeeks.length, 'chips');
    this.chipsComponent.render(recentWeeks);
  }

  /**
   * Navega para semana selecionada via chip
   * @param {Object} item - Item do histórico
   */
  async navigateToWeek(item) {
    if (!item.url) return;

    try {
      const { Tabs } = await import('../../../../shared/utils/Tabs.js');
      await Tabs.openOrSwitchTo(item.url);
      console.warn('[ChipsManager] Navegando para:', item.label);
    } catch (error) {
      console.error('[ChipsManager] Erro ao navegar:', error);
    }
  }

  /**
   * Carrega configurações de chips do storage
   * @returns {Promise<{enabled: boolean, maxItems: number}>}
   */
  async loadChipsSettings() {
    const result = await chrome.storage.local.get('chips_settings');
    return /** @type {{enabled: boolean, maxItems: number}} */ (
      result.chips_settings || { enabled: true, maxItems: 3 }
    );
  }

  /**
   * Atualiza dados da semana (para re-render)
   * @param {Object} week - Nova semana
   */
  setWeek(week) {
    this.week = week;
  }
}
