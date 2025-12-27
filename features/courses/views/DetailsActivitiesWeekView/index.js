/**
 * @file DetailsActivitiesWeekView.js
 * @description Índice navegável de atividades com scroll automático
 * @architecture Screaming Architecture - View Layer
 *
 * Navegação: Minhas Matérias > Semanas > [Ver Atividades]
 * Funcionalidade: Lista clicável que faz scroll até a atividade no AVA
 */

import { categorizeTask } from '../../logic/TaskCategorizer.js';
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';
import { NavigationService } from '../../../../shared/services/NavigationService.js';
import { HistoryService } from '../../../../shared/services/HistoryService.js';
import { SkeletonManager } from './SkeletonManager.js';
import { ClearHandler } from './handlers/ClearHandler.js';
import { RefreshHandler } from './handlers/RefreshHandler.js';
import { ActivityItemFactory } from './ActivityItemFactory.js';
import { ActivityRenderer } from './ActivityRenderer.js';
import { ChipsManager } from './ChipsManager.js';

export class DetailsActivitiesWeekView {
  /**
   * @param {Object} callbacks - { onBack }
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
    div.innerHTML = `
      <div class="details-header">
        <button id="backBtn" class="btn-back">← Voltar</button>
        <div class="details-header-info">
          <div class="details-breadcrumb"><strong>${this.week.courseName || 'Matéria'}</strong></div>
          <h2 class="details-title">${this.week.name}</h2>
        </div>
        <div class="details-header-actions">
          <button id="clearBtn" class="btn-clear" title="Limpar cache e voltar">🗑️</button>
          <button id="refreshBtn" class="btn-refresh" title="Atualizar lista">↻</button>
        </div>
        <!-- Contextual Navigation Chips (inside header, bottom) -->
        <div id="chipsContainer" class="chips-container"></div>
      </div>
      <div id="activitiesContainer" class="activities-container"></div>
    `;
    return div;
  }

  /**
   * Hook pós-renderização
   */
  afterRender() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.onclick = () => this.callbacks.onBack();
    }

    const refreshBtn = /** @type {HTMLButtonElement} */ (document.getElementById('refreshBtn'));
    if (refreshBtn) {
      refreshBtn.onclick = () => this.handleRefresh(refreshBtn);
    }

    const clearBtn = /** @type {HTMLButtonElement} */ (document.getElementById('clearBtn'));
    if (clearBtn) {
      clearBtn.onclick = () => this.handleClear();
    }

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

  /**
   * Retorna ícone para o tipo
   */
  getTypeIcon(type) {
    const icons = {
      VIDEOAULA: '🎬',
      QUIZ: '📝',
      VIDEO_BASE: '📹',
      TEXTO_BASE: '📄',
      APROFUNDANDO: '📚',
      OUTROS: '📎',
    };
    return icons[type] || '📄';
  }
}
