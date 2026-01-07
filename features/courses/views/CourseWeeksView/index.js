/**
 * @file CourseWeeksView.js
 * @description View de Semanas da Matéria (Refatorada).
 * Localizada em: features/courses/views/CourseWeeksView/index.js
 */

import { ViewTemplate } from './ViewTemplate.js';
import { HeaderManager } from './HeaderManager.js';
import { WeeksManager } from './WeeksManager.js';
import { PreviewManager } from './PreviewManager.js';

export class CourseWeeksView {
  constructor(callbacks) {
    // callbacks: { onBack, onOpenCourse, onViewActivities }
    this.callbacks = callbacks;
    this.course = null;
    this.headerManager = null;
    this.weeksManager = null;
  }

  get activeWeek() {
    return this.weeksManager ? this.weeksManager.activeWeek : null;
  }

  _ensureWeeksManager() {
    if (!this.weeksManager) {
      this.weeksManager = new WeeksManager(this.course || {}, document.body, {
        onOpenCourse: (url) =>
          this.callbacks && this.callbacks.onOpenCourse ? this.callbacks.onOpenCourse(url) : null,
        onViewActivities: (w) =>
          this.callbacks && this.callbacks.onViewActivities
            ? this.callbacks.onViewActivities(w)
            : null,
      });
    }
    return this.weeksManager;
  }

  setCourse(course) {
    this.course = course;
    if (this.weeksManager) {
      this.weeksManager.course = course;
    }
  }

  render() {
    if (!this.course) return document.createElement('div');

    const templateElement = ViewTemplate.render(this.course.name);

    // ViewTemplate returns HTMLElement, not string
    return templateElement;
  }

  afterRender() {
    if (!this.course) return;

    const container = document.querySelector('.view-details');
    if (!(container instanceof HTMLElement)) return;

    // 1. Inicializar WeeksManager
    this.weeksManager = this._ensureWeeksManager();
    this.weeksManager.container = container;

    // 2. Inicializar HeaderManager
    this.headerManager = new HeaderManager(this.course, container, {
      onBack: () => this.callbacks.onBack(),
      onOpenCourse: (url) => this.callbacks.onOpenCourse(url),
      onRefresh: (weeks) => {
        this.course.weeks = weeks;
        this.weeksManager.render();
      },
    });

    // 3. Configurar e Renderizar
    this.headerManager.setup();
    this.weeksManager.render();
  }

  // --- Métodos de compatibilidade para testes legados ---

  calculateProgress(items) {
    return PreviewManager.calculateProgress(items);
  }

  renderStatusIcons(items) {
    return PreviewManager.renderStatusIcons(items);
  }

  async showPreview(week, weekElement) {
    const wm = this._ensureWeeksManager();
    return wm.showPreview(week, weekElement);
  }

  hidePreview() {
    PreviewManager.hidePreview();
  }
}
