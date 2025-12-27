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
import { ContextualChips } from '../../../../shared/ui/ContextualChips.js';
import { HistoryService } from '../../../../shared/services/HistoryService.js';
import { SkeletonManager } from './SkeletonManager.js';
import { ClearHandler } from './handlers/ClearHandler.js';
import { RefreshHandler } from './handlers/RefreshHandler.js';
import { ActivityItemFactory } from './ActivityItemFactory.js';
import { ActivityRenderer } from './ActivityRenderer.js';

export class DetailsActivitiesWeekView {
  /**
   * @param {Object} callbacks - { onBack }
   */
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.week = null;
    this.historyService = new HistoryService(5); // Max 5 recent items
    this.chipsComponent = null;
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
    console.warn('[DetailsActivitiesWeekView] renderChips() chamado');
    const container = document.getElementById('chipsContainer');
    console.warn(
      '[DetailsActivitiesWeekView] Container encontrado?',
      !!container,
      'this.week?',
      !!this.week
    );

    if (!container || !this.week) return;

    // Load user settings
    const settings = await this.loadChipsSettings();
    console.warn('[DetailsActivitiesWeekView] Settings carregados:', settings);

    // Skip if user disabled chips
    if (!settings.enabled) {
      console.warn(
        '[DetailsActivitiesWeekView] Chips DESATIVADOS por settings.enabled =',
        settings.enabled
      );
      container.innerHTML = '';
      return;
    }

    // Obter course ID (extrair do courseId ou usar nome como fallback)
    const courseId = this.week.courseId || this.week.courseName || 'default';
    console.warn('[DetailsActivitiesWeekView] courseId extraído:', courseId);

    // Use dynamic maxItems from settings
    if (!this.historyService || this.historyService.maxItems !== settings.maxItems) {
      this.historyService = new HistoryService(settings.maxItems);
    }

    // Salvar acesso atual no histórico
    await this.historyService.push(courseId, {
      id: this.week.url || this.week.name,
      label: this.week.name,
      targetId: this.week.url,
      url: this.week.url,
    });

    // Buscar histórico recente
    const recentWeeks = await this.historyService.getRecent(courseId);
    console.warn('[DetailsActivitiesWeekView] Histórico recente:', recentWeeks);

    // Inicializar componente se necessário
    if (!this.chipsComponent) {
      this.chipsComponent = new ContextualChips(container);

      // Conectar evento de navegação
      this.chipsComponent.on('navigate', (item) => {
        this.navigateToWeek(item);
      });

      // Conectar evento de remoção
      this.chipsComponent.on('remove', async (itemId) => {
        await this.historyService.remove(courseId, itemId);
        this.renderChips(); // Re-render após remover
      });
    }

    // Renderizar chips
    console.warn('[DetailsActivitiesWeekView] Renderizando chips com', recentWeeks.length, 'items');
    this.chipsComponent.render(recentWeeks);
  }

  /**
   * Navega para uma semana selecionada via chip
   * @param {Object} item - Item do histórico { id, label, url }
   */
  async navigateToWeek(item) {
    if (!item.url) return;

    try {
      // Abrir/focar aba da semana no navegador
      const { Tabs } = await import('../../../../shared/utils/Tabs.js');
      await Tabs.openOrSwitchTo(item.url);

      // TODO: Atualizar view da extensão para mostrar essa semana
      // (Requer refatoração do fluxo de navegação - fora do escopo atual)
      console.warn('[DetailsActivitiesWeekView] Navegando para:', item.label);
    } catch (error) {
      console.error('[DetailsActivitiesWeekView] Erro ao navegar:', error);
    }
  }

  /**
   * Load chips settings from storage
   * @returns {Promise<{enabled: boolean, maxItems: number}>}
   */
  async loadChipsSettings() {
    const result = await chrome.storage.local.get('chips_settings');
    return /** @type {{enabled: boolean, maxItems: number}} */ (
      result.chips_settings || { enabled: true, maxItems: 3 }
    );
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
    try {
      const container = document.getElementById('activitiesContainer');
      if (!container) {
        console.error('[DetailsActivitiesWeekView] Container activitiesContainer não encontrado!');
        return;
      }

      // Limpar container antes de renderizar (evita duplicação no refresh)
      container.innerHTML = '';

      if (!this.week?.items || this.week.items.length === 0) {
        container.innerHTML = '<p style="color:#999;">Nenhuma atividade encontrada.</p>';
        return;
      }

      // Lista na ordem exata do DOM
      const list = document.createElement('ul');
      list.className = 'activities-list';

      this.week.items.forEach((item, index) => {
        const categorized = categorizeTask(item);
        const li = this.itemFactory.createActivityItem(categorized, index + 1);
        list.appendChild(li);
      });

      container.appendChild(list);
    } catch (error) {
      console.error('[DetailsActivitiesWeekView] Erro ao renderizar atividades:', error);
      const toaster = new Toaster();
      toaster.show('Erro ao carregar atividades.', 'error');
    }
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
