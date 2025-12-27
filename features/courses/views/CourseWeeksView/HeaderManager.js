/**
 * @file HeaderManager.js
 * @description Gerencia os botões de cabeçalho da view de semanas.
 */

import { CourseRefresher } from '../../services/CourseRefresher.js';

export class HeaderManager {
  /**
   * @param {Object} course - Objeto do curso
   * @param {HTMLElement} container - Container da view
   * @param {Object} callbacks - Objeto com callbacks (onBack, onOpenCourse, onRefresh)
   */
  constructor(course, container, callbacks = {}) {
    this.course = course;
    this.container = container;
    this.callbacks = callbacks;
  }

  /**
   * Configura os listeners de eventos dos botões.
   */
  setup() {
    const backBtn = this.container.querySelector('#backBtn');
    const openCourseBtn = this.container.querySelector('#openCourseBtn');
    const refreshWeeksBtn = this.container.querySelector('#refreshWeeksBtn');

    if (backBtn instanceof HTMLElement) {
      backBtn.onclick = () => {
        if (typeof this.callbacks.onBack === 'function') {
          this.callbacks.onBack();
        }
      };
    }

    if (openCourseBtn instanceof HTMLElement) {
      openCourseBtn.onclick = () => {
        if (typeof this.callbacks.onOpenCourse === 'function') {
          this.callbacks.onOpenCourse(this.course.url);
        }
      };
    }

    if (refreshWeeksBtn instanceof HTMLButtonElement) {
      refreshWeeksBtn.onclick = async () => {
        const result = await CourseRefresher.refreshCourse(this.course, refreshWeeksBtn);
        if (result.success) {
          this.course.weeks = result.weeks;
          if (typeof this.callbacks.onRefresh === 'function') {
            this.callbacks.onRefresh(result.weeks);
          }
        }
      };
    }
  }
}
