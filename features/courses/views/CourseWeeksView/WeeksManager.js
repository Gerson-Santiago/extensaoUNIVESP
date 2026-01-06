/**
 * @file WeeksManager.js
 * @description Gerencia a renderização e interação com a lista de semanas.
 */

import { createWeekElement } from '../../components/WeekItem.js';
import { WeekActivitiesService } from '../../services/WeekActivitiesService.js';
import { CourseRepository } from '../../repositories/CourseRepository.js';
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';
import { PreviewManager } from './PreviewManager.js';
import { Logger } from '../../../../shared/utils/Logger.js';

export class WeeksManager {
  /**
   * @param {Object} course - Objeto do curso
   * @param {HTMLElement} container - Container da view
   * @param {Object} callbacks - Objeto com callbacks (onOpenCourse, onViewActivities)
   */
  constructor(course, container, callbacks = {}) {
    this.course = course;
    this.container = container;
    this.callbacks = callbacks;
    this.activeWeek = null;
    this.activeElement = null;
    this.toaster = new Toaster();
  }

  /**
   * Renderiza a lista de semanas no container.
   */
  async render() {
    const weeksList = this.container.querySelector('#weeksList');
    if (!weeksList) return;

    weeksList.replaceChildren();

    // Carregar configurações de UI e Preferências do Usuário (ISSUE-022)
    const storage = await chrome.storage.local.get(['ui_settings', 'user_preferences']);
    const flags = /** @type {{ showAdvancedButtons: boolean, showTasksButton: boolean }} */ (
      storage.ui_settings || { showAdvancedButtons: true, showTasksButton: true }
    );
    const storagePrefs = /** @type {any} */ (storage.user_preferences);
    /** @type {import('../../../../types/UserPreferences.js').UserPreferences} */
    const prefs =
      storagePrefs && storagePrefs.density
        ? storagePrefs
        : { density: 'comfortable', autoPinLastWeek: false };

    if (this.course.weeks && this.course.weeks.length > 0) {
      this.course.weeks.forEach((week) => {
        const wDiv = createWeekElement(
          week,
          {
            onClick: (url) => window.open(url, '_blank'),
            onViewTasks: (w) => this.showPreview(w, wDiv),
            onViewQuickLinks: (w) => this.handleViewActivities(w, 'QuickLinks'),
            onViewActivities: (w) => this.handleViewActivities(w, 'DOM'),
          },
          flags
        ); // Pass flags
        weeksList.appendChild(wDiv);

        // Auto-Pin logic: Se esta é a última semana visitada e o recurso está ativo
        if (prefs.autoPinLastWeek && week.number === prefs.lastWeekNumber) {
          // Pequeno delay para garantir que o DOM está pronto e evitar conflitos de renderização
          setTimeout(() => this.showPreview(week, wDiv), 100);
        }
      });
    } else {
      // Mensagem de semanas vazias (seguro - sem innerHTML)
      const emptyDiv = document.createElement('div');
      emptyDiv.style.cssText = 'padding:15px; text-align:center; color:#999;';
      emptyDiv.textContent = 'Nenhuma semana detectada.';
      weeksList.appendChild(emptyDiv);
    }
  }

  /**
   * Marca uma semana como ativa no estado e na UI.
   * @param {Object} week - Objeto da semana
   * @param {HTMLElement} weekElement - Elemento DOM da semana
   */
  setActiveWeek(week, weekElement) {
    if (this.activeElement === weekElement) {
      this.activeWeek = week;
      return;
    }

    if (this.activeElement && this.activeElement.classList) {
      this.activeElement.classList.remove('week-item-active');
    }

    // Fallback para garantir limpeza total no DOM real
    if (this.container && this.container.querySelectorAll) {
      this.container
        .querySelectorAll('.week-item')
        .forEach((el) => el.classList.remove('week-item-active'));
    }

    this.activeWeek = week;
    this.activeElement = weekElement;

    if (weekElement && weekElement.classList) {
      weekElement.classList.add('week-item-active');
    }

    // Persistir última semana se Auto-Pin estiver ativo (ISSUE-022)
    this.persistLastWeek(week.number);
  }

  /**
   * Salva o número da última semana no storage se o Auto-Pin estiver ativo.
   * @param {number} weekNumber
   */
  async persistLastWeek(weekNumber) {
    const result = await chrome.storage.local.get('user_preferences');
    const storagePrefs = /** @type {any} */ (result.user_preferences);
    /** @type {import('../../../../types/UserPreferences.js').UserPreferences} */
    const prefs =
      storagePrefs && storagePrefs.density
        ? storagePrefs
        : { density: 'comfortable', autoPinLastWeek: false };

    if (prefs && prefs.autoPinLastWeek) {
      prefs.lastWeekNumber = weekNumber;
      await chrome.storage.local.set({ user_preferences: prefs });
      /**#LOG_REPOSITORY*/
      Logger.info('WeeksManager', 'Última semana persistida para Auto-Pin:', weekNumber);
    }
  }

  /**
   * Gerencia a visualização de atividades com tratamento de erro e feedback.
   * @param {Object} week - Objeto da semana
   * @param {string} method - Método de scraping ('DOM' ou 'QuickLinks')
   */
  async handleViewActivities(week, method) {
    week.courseName = this.course.name;
    week.courseId = this.course.id; // Garantir ID para cache correto
    week.error = null; // Reset de erro antes de nova tentativa

    if (typeof this.callbacks.onViewActivities === 'function') {
      this.callbacks.onViewActivities(week);
    }

    try {
      // Cast explícito para o tipo esperado pelo serviço
      const scrapingMethod = method === 'QuickLinks' ? 'QuickLinks' : 'DOM';
      const { success, error } = await WeekActivitiesService.getActivities(week, scrapingMethod);

      if (!success) {
        throw error; // Re-throw to be caught by the catch block below (keeping catch logic consistent)
      }

      // Se sucesso, os dados já estão em week.items (via Service) mas também em data
      // O serviço já atualiza week.items e week.method.

      if (this.course && this.course.id) {
        // Run update in background, do not block
        CourseRepository.update(this.course.id, { weeks: this.course.weeks }).catch((err) => {
          /**#LOG_REPOSITORY*/
          Logger.error('WeeksManager', 'Erro ao persistir atualização:', err);
        });
      }
    } catch (error) {
      /**#LOG_UI*/
      Logger.error('WeeksManager', `Erro ao carregar atividades [${method}]:`, error);
      this.toaster.show('Erro ao carregar atividades. Tente novamente.', 'error');
      week.items = [];

      // Tratamento amigável para erro de Login/Permissão
      const isLoginError = error.message && error.message.includes('Cannot access contents of url');
      const friendlyError = isLoginError
        ? 'Acesso restrito. Verifique se você está logado no AVA.'
        : error.message || 'Erro ao carregar';

      week.error = friendlyError; // Flag de erro para a UI
    } finally {
      // ALWAYS update UI to remove loading skeletons
      if (typeof this.callbacks.onViewActivities === 'function') {
        this.callbacks.onViewActivities(week);
      }
    }
  }

  /**
   * Exibe ou oculta o preview de atividades de uma semana.
   * @param {Object} week - Objeto da semana
   * @param {HTMLElement} weekElement - Elemento DOM da semana
   */
  async showPreview(week, weekElement) {
    this.setActiveWeek(week, weekElement);

    const existingPreview = document.querySelector('.week-preview-dynamic');
    const hasPreview = existingPreview && existingPreview.previousElementSibling === weekElement;

    if (hasPreview) {
      PreviewManager.hidePreview();
      return;
    }

    PreviewManager.hidePreview();

    try {
      const { success, data, error } = await WeekActivitiesService.getActivities(week, 'DOM');

      if (!success) {
        throw error;
      }

      week.items = data;
      PreviewManager.renderPreview(week, weekElement);
    } catch (error) {
      /**#LOG_UI*/
      Logger.error('WeeksManager', 'Erro ao carregar preview:', error);
      this.toaster.show('Erro ao carregar preview. Tente novamente.', 'error');
      if (weekElement) weekElement.classList.remove('week-item-active');
      this.activeWeek = null;
      this.activeElement = null;
    } finally {
      // Garantir que o preview loading seja removido se houver
      // A lógica do PreviewManager deve lidar com isso, mas garantir o estado limpo é bom
    }
  }
}
