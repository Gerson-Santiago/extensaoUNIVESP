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
import { SkeletonLoader } from '../../../../shared/ui/SkeletonLoader.js';
import { ContextualChips } from '../../../../shared/ui/ContextualChips.js';
import { HistoryService } from '../../../../shared/services/HistoryService.js';

export class DetailsActivitiesWeekView {
  /**
   * @param {Object} callbacks - { onBack }
   */
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.week = null;
    this.historyService = new HistoryService(5); // Max 5 recent items
    this.chipsComponent = null;
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

    const method = this.week.method || 'DOM';
    const methodLabel = method === 'QuickLinks' ? 'Links Rápidos' : 'Scraping DOM';

    const div = document.createElement('div');
    div.className = 'view-details-activities';
    div.innerHTML = `
      <div class="details-header">
        <button id="backBtn" class="btn-back">← Voltar</button>
        <div class="details-header-info">
          <div class="details-breadcrumb">${this.week.courseName || 'Matéria'}</div>
          <h2 class="details-title">${this.week.name} - Atividades</h2>
          <p class="details-subtitle">Clique em uma atividade para rolar até ela no AVA</p>
          <p class="method-indicator">Método: ${methodLabel}</p>
        </div>
        <div class="details-header-actions">
          <button id="clearBtn" class="btn-clear" title="Limpar cache e voltar">🗑️ Limpar</button>
          <button id="refreshBtn" class="btn-refresh" title="Atualizar lista">↻</button>
        </div>
      </div>
      <!-- Contextual Navigation Chips -->
      <div id="chipsContainer"></div>
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

    // Load user settings
    const settings = await this.loadChipsSettings();

    // Skip if user disabled chips
    if (!settings.enabled) {
      container.innerHTML = '';
      return;
    }

    // Obter course ID (extrair do courseId ou usar nome como fallback)
    const courseId = this.week.courseId || this.week.courseName || 'default';

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
    return (
      result.chips_settings ||
      /** @type {{enabled: boolean, maxItems: number}} */ ({ enabled: true, maxItems: 5 })
    );
  }

  /**
   * Atualiza lista de atividades re-executando scraping
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
        const { QuickLinksScraper } = await import('../../services/QuickLinksScraper.js');
        items = await QuickLinksScraper.scrapeFromQuickLinks(this.week.url);
      } else {
        const { WeekContentScraper } = await import('../../services/WeekContentScraper.js');
        items = await WeekContentScraper.scrapeWeekContent(this.week.url);
      }

      // Atualizar week.items
      this.week.items = items;

      // Re-renderizar lista
      this.renderActivities();
    } catch (error) {
      console.error('[DetailsActivitiesWeekView] Erro ao atualizar:', error);
      const { Toaster } = await import('../../../../shared/ui/feedback/Toaster.js');
      const toaster = new Toaster();
      toaster.show('Erro ao atualizar lista. Tente novamente.', 'error');
    } finally {
      // Restaurar estado
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }

  /**
   * Limpa cache de atividades e volta para lista de semanas
   */
  handleClear() {
    if (!this.week) return;

    // Confirmar com usuário
    const confirmed = confirm(
      `Deseja limpar o cache de atividades de "${this.week.name}"?\n\n` +
        'Isso forçará um novo scraping na próxima vez.'
    );

    if (!confirmed) return;

    // Limpar items do cache
    this.week.items = [];
    this.week.method = undefined;

    // Voltar para lista de semanas
    if (this.callbacks.onBack) {
      this.callbacks.onBack();
    }
  }

  /**
   * Renderiza skeleton screen enquanto atividades carregam
   * Técnica de UX para melhorar velocidade percebida
   */
  renderSkeleton() {
    const container = document.getElementById('activitiesContainer');
    if (!container) return;

    // Mostra skeleton imediatamente
    container.innerHTML = SkeletonLoader.renderActivitiesSkeleton(5);
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
        const li = this.createActivityItem(categorized, index + 1);
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
   * Cria item de atividade com scroll automático
   * @param {Object} task - Tarefa categorizada
   * @param {number} position - Posição na lista (1-indexed)
   * @returns {HTMLElement}
   */
  createActivityItem(task, position) {
    const li = document.createElement('li');
    li.className = 'activity-item';

    const icon = this.getTypeIcon(task.type);

    li.innerHTML = `
      <span class="activity-position">#${position}</span>
      <span class="activity-icon">${icon}</span>
      <span class="activity-name">${task.original.name}</span>
      <button class="btn-scroll" data-id="${task.id}">Ir →</button>
    `;

    // Evento de scroll
    const btn = /** @type {HTMLButtonElement} */ (li.querySelector('.btn-scroll'));
    btn.onclick = () => this.scrollToActivity(task.id, task.original.url);

    return li;
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
