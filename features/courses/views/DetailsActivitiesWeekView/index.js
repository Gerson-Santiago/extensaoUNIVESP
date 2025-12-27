/**
 * @file DetailsActivitiesWeekView.js
 * @description Índice navegável de atividades com scroll automático
 * @architecture Screaming Architecture - View Layer
 *
 * Navegação: Minhas Matérias > Semanas > [Ver Atividades]
 * Funcionalidade: Lista clicável que faz scroll até a atividade no AVA
 */

import { NavigationService } from '../../../../shared/services/NavigationService.js';
import { HistoryService } from '../../../../shared/services/HistoryService.js';
import { SkeletonManager } from './SkeletonManager.js';
import { RefreshHandler } from './handlers/RefreshHandler.js';
import { ClearHandler } from './handlers/ClearHandler.js';
import { ActivityRenderer } from './ActivityRenderer.js';
import { ChipsManager } from './ChipsManager.js';
import { ActivityItemFactory } from './ActivityItemFactory.js';
import { ViewTemplate } from './ViewTemplate.js';
import { HeaderManager } from './HeaderManager.js';

export class DetailsActivitiesWeekView {
  /**
   * @param {Object} callbacks - { onBack, onNavigateToWeek }
   */
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.week = null;
    this.historyService = new HistoryService(5); // DEPRECATED - migrado para ChipsManager
    this.chipsComponent = null; // DEPRECATED - migrado para ChipsManager
    this.chipsManager = null; // Inicializado após render
    this.itemFactory = new ActivityItemFactory((activityId, fallbackUrl) =>
      this.scrollToActivity(activityId, fallbackUrl)
    );
    this.activityRenderer = null; // Inicializado após render
  }

  /**
   * Define a semana a ser exibida
   * @param {Object} week - { name, url, items: [{name, url, id}] }
   */
  setWeek(week) {
    this.week = week;
  }

  /**
   * Renderiza a view
   * @returns {HTMLElement}
   */
  render() {
    if (!this.week) {
      return document.createElement('div');
    }

    const div = document.createElement('div');
    div.className = 'view-details-activities';
    div.innerHTML = ViewTemplate.render(this.week.courseName, this.week.name);
    return div;
  }

  /**
   * Hook pós-renderização
   */
  afterRender() {
    // 🎯 Header Manager: Configura botões (Voltar, Refresh, Clear)
    const headerManager = new HeaderManager({
      onBack: () => this.callbacks.onBack(),
      onRefresh: (e) => this.handleRefresh(e.target),
      onClear: () => this.handleClear(),
    });
    headerManager.setupListeners();

    // 🎯 Contextual Chips: Renderizar navegação recente
    this.renderChips();

    // 🎯 UX Otimizada: Se tem cache, mostra imediatamente. Senão, mostra skeleton.
    if (this.week?.items && this.week.items.length > 0) {
      // Cache hit: Mostra dados imediatamente (rápido!)
      this.renderActivities();
    } else {
      // Cache miss: Mostra skeleton enquanto carrega
      this.renderSkeleton();
    }
  }

  /**
   * Renderiza chips de navegação contextual
   */
  async renderChips() {
    const container = document.getElementById('chipsContainer');
    if (!container || !this.week) return;

    // Inicializar ChipsManager se necessário
    if (!this.chipsManager) {
      this.chipsManager = new ChipsManager(container, this.week);
      if (this.callbacks.onNavigateToWeek) {
        this.chipsManager.setOnNavigate(this.callbacks.onNavigateToWeek);
      }
    } else {
      // Atualizar week no manager
      this.chipsManager.setWeek(this.week);
    }

    await this.chipsManager.renderChips();
  }

  /**
   * Atualiza lista de atividades re-executando scraping
   * @param {HTMLButtonElement} btn - Botão de refresh (para loading state)
   */
  async handleRefresh(btn) {
    const handler = new RefreshHandler(this.week, () => this.renderActivities());
    await handler.handleRefresh(btn);
  }

  /**
   * Limpa cache de atividades e volta para lista de semanas
   */
  handleClear() {
    const handler = new ClearHandler(this.week, this.callbacks.onBack);
    handler.handleClear();
  }

  /**
   * Renderiza skeleton screen enquanto atividades carregam
   * Técnica de UX para melhorar velocidade percebida
   */
  renderSkeleton() {
    const container = document.getElementById('activitiesContainer');
    SkeletonManager.renderSkeleton(container, 5);
  }

  /**
   * Renderiza lista de atividades (ordem DOM original)
   */
  renderActivities() {
    const container = document.getElementById('activitiesContainer');
    if (!container) return;

    // Inicializar renderer se necessário
    if (!this.activityRenderer) {
      this.activityRenderer = new ActivityRenderer(container, this.itemFactory);
    }

    // Delegar renderização ao ActivityRenderer
    this.activityRenderer.renderActivities(this.week?.items || []);
  }

  /**
   * Faz scroll até a atividade na página do AVA usando o NavigationService.
   * @param {string} activityId - ID único da atividade
   * @param {string} fallbackUrl - URL de fallback (não usada se week.url existir)
   */
  async scrollToActivity(activityId, fallbackUrl) {
    try {
      if (this.week && this.week.url) {
        await NavigationService.openActivity(this.week.url, activityId);
      } else {
        // Fallback se não tiver URL da semana (abre direto)
        NavigationService.openCourse(fallbackUrl);
      }
    } catch (error) {
      console.error('[DetailsActivitiesWeekView] Erro ao navegar:', error);
      // Fallback final
      window.open(fallbackUrl, '_blank');
    }
  }
}
