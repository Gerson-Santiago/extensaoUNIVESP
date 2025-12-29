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
      this.element = document.createElement('div');
      return this.element;
    }

    const div = document.createElement('div');
    div.className = 'view-details-activities';
    div.innerHTML = ViewTemplate.render(this.week.courseName, this.week.name);

    this.element = div;
    return div;
  }

  /**
   * Hook pós-renderização
   */
  async afterRender() {
    // 🎯 Header Manager: Configura botões (Voltar, Refresh, Clear)
    const headerManager = new HeaderManager({
      onBack: () => this.callbacks.onBack(),
      onRefresh: (e) => this.handleRefresh(e.target),
      onClear: () => this.handleClear(),
    });
    headerManager.setupListeners();

    // 🎯 Contextual Chips: Renderizar navegação recente
    this.renderChips();

    // 🎯 UX Otimizada: Primeiro mostra Skeleton
    this.renderSkeleton();

    // 🆕 Verificação de Persistência (Resgate de dados salvos)
    // 🎯 UX Otimizada: Primeiro mostra Skeleton

    // 🎯 UX Otimizada: Se tem erro, mostra estado de erro
    if (this.week?.error) {
      this.renderErrorState();
      return;
    }

    // 🎯 UX Otimizada: Se tem dados (memória ou restaurados), mostra imediatamente
    if (this.week?.items && this.week.items.length > 0) {
      this.renderActivities();
    }
  }

  /**
   * Renderiza chips de navegação contextual
   */
  async renderChips() {
    const container = this.element
      ? /** @type {HTMLElement} */ (this.element.querySelector('#chipsContainer'))
      : null;
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
    const container = this.element
      ? /** @type {HTMLElement} */ (this.element.querySelector('#activitiesContainer'))
      : null;
    SkeletonManager.renderSkeleton(container, 5);
  }

  /**
   * Renderiza lista de atividades (ordem DOM original)
   */
  renderActivities() {
    const container = this.element
      ? /** @type {HTMLElement} */ (this.element.querySelector('#activitiesContainer'))
      : null;
    if (!container) return;

    // 🔧 FIX: Sempre criar novo renderer com container fresco
    // Isso evita renderizar em um container "zumbi" se a view for re-renderizada
    const renderer = new ActivityRenderer(container, this.itemFactory);
    renderer.renderActivities(this.week?.items || []);
  }

  /**
   * Renderiza estado de erro no container de atividades
   */
  renderErrorState() {
    const container = this.element
      ? /** @type {HTMLElement} */ (this.element.querySelector('#activitiesContainer'))
      : null;
    if (!container) return;

    container.innerHTML = `
      <div class="state-error" style="text-align: center; padding: 40px 20px; color: #666;">
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #333;">Não foi possível carregar as atividades</h3>
        <p style="margin: 0; font-size: 14px;">Verifique se a aba da matéria está aberta e carregada corretamente.</p>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          Erro: ${this.week.error || 'Falha na comunicação'}
        </div>
      </div>
    `;
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
