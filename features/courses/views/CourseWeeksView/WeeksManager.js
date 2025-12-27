/**
 * @file WeeksManager.js
 * @description Gerencia a renderização e interação com a lista de semanas.
 */

import { createWeekElement } from '../../components/WeekItem.js';
import { WeekActivitiesService } from '../../services/WeekActivitiesService.js';
import { CourseRepository } from '../../data/CourseRepository.js';
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';
import { PreviewManager } from './PreviewManager.js';

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
  render() {
    const weeksList = this.container.querySelector('#weeksList');
    if (!weeksList) return;

    weeksList.innerHTML = '';
    if (this.course.weeks && this.course.weeks.length > 0) {
      this.course.weeks.forEach((week) => {
        const wDiv = createWeekElement(week, {
          onClick: (url) => {
            this.setActiveWeek(week, wDiv);
            if (typeof this.callbacks.onOpenCourse === 'function') {
              this.callbacks.onOpenCourse(url);
            }
          },
          onViewTasks: (w) => this.showPreview(w, wDiv),
          onViewActivities: (w) => this.handleViewActivities(w, 'DOM'),
          onViewQuickLinks: (w) => this.handleViewActivities(w, 'QuickLinks'),
        });
        weeksList.appendChild(wDiv);
      });
    } else {
      weeksList.innerHTML =
        '<div style="padding:15px; text-align:center; color:#999;">Nenhuma semana detectada.</div>';
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
  }

  /**
   * Gerencia a visualização de atividades com tratamento de erro e feedback.
   * @param {Object} week - Objeto da semana
   * @param {string} method - Método de scraping ('DOM' ou 'QuickLinks')
   */
  async handleViewActivities(week, method) {
    week.courseName = this.course.name;

    if (typeof this.callbacks.onViewActivities === 'function') {
      this.callbacks.onViewActivities(week);
    }

    try {
      // Cast explícito para o tipo esperado pelo serviço
      const scrapingMethod = method === 'QuickLinks' ? 'QuickLinks' : 'DOM';
      await WeekActivitiesService.getActivities(week, scrapingMethod);

      if (typeof this.callbacks.onViewActivities === 'function') {
        this.callbacks.onViewActivities(week);
      }

      if (this.course && this.course.id) {
        await CourseRepository.update(this.course.id, { weeks: this.course.weeks });
      }
    } catch (error) {
      console.error(`[CourseWeeksView] Erro ao carregar atividades [${method}]:`, error);
      this.toaster.show('Erro ao carregar atividades. Tente novamente.', 'error');
      week.items = [];
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
      const items = await WeekActivitiesService.getActivities(week, 'DOM');
      week.items = items;
      PreviewManager.renderPreview(week, weekElement);
    } catch (error) {
      console.error('Erro ao carregar preview:', error);
      this.toaster.show('Erro ao carregar preview. Tente novamente.', 'error');
      if (weekElement) weekElement.classList.remove('week-item-active');
      this.activeWeek = null;
      this.activeElement = null;
    }
  }
}
