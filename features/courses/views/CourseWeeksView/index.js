/**
 * @file CourseWeeksView.js
 * @description View de Semanas da Matéria.
 * Localizada em: features/courses/views/CourseWeeksView/index.js
 */

import { createWeekElement } from '../../components/WeekItem.js';
import { CourseRefresher } from '../../services/CourseRefresher.js';
import { WeekContentScraper } from '../../services/WeekContentScraper.js';

export class CourseWeeksView {
  constructor(callbacks) {
    // callbacks: { onBack, onOpenCourse }
    this.callbacks = callbacks;
    this.course = null;
  }

  setCourse(course) {
    this.course = course;
  }

  render() {
    if (!this.course) return document.createElement('div');

    const div = document.createElement('div');
    div.className = 'view-details';
    div.innerHTML = `
            <div class="details-header">
                <button id="backBtn" class="btn-back">← Voltar</button>
                <h2 id="detailsTitle" class="details-title">${this.course.name}</h2>
            </div>
            
            <div id="detailsActions" style="margin-bottom: 15px; display: flex; gap: 5px;">
                <button id="openCourseBtn" class="btn-open-course" style="flex: 1;">Abrir Matéria</button>
                <button id="refreshWeeksBtn" class="btn-refresh" title="Atualizar Semanas" style="width: 40px; cursor: pointer;">↻</button>
            </div>

            <h3 style="font-size: 14px; color: #555; margin-bottom: 10px;">Semanas Disponíveis:</h3>
            <div id="weeksList" class="weeks-container">
                <!-- Lista de semanas aqui -->
            </div>
            
            <div id="activeWeekPreview" style="display: none; margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                <!-- Mini preview aparece aqui -->
            </div>
        `;
    return div;
  }

  afterRender() {
    if (!this.course) return;

    // Setup Buttons
    const backBtn = document.getElementById('backBtn');
    const openCourseBtn = document.getElementById('openCourseBtn');
    const refreshWeeksBtn = document.getElementById('refreshWeeksBtn');
    const weeksList = document.getElementById('weeksList');

    if (backBtn) {
      backBtn.onclick = () => this.callbacks.onBack();
    }

    if (openCourseBtn) {
      openCourseBtn.onclick = () => this.callbacks.onOpenCourse(this.course.url);
    }

    if (refreshWeeksBtn instanceof HTMLButtonElement) {
      refreshWeeksBtn.onclick = async () => {
        const result = await CourseRefresher.refreshCourse(this.course, refreshWeeksBtn);
        if (result.success) {
          this.course.weeks = result.weeks;
          this.renderWeeksList(weeksList);
        }
      };
    }

    // Render Weeks
    this.renderWeeksList(weeksList);
  }

  renderWeeksList(weeksList) {
    if (!weeksList) return;
    weeksList.innerHTML = '';
    if (this.course.weeks && this.course.weeks.length > 0) {
      this.course.weeks.forEach((week) => {
        const wDiv = createWeekElement(week, {
          onClick: (url) => this.callbacks.onOpenCourse(url),
          onViewTasks: (w) => this.showPreview(w),
        });
        weeksList.appendChild(wDiv);
      });
    } else {
      weeksList.innerHTML =
        '<div style="padding:15px; text-align:center; color:#999;">Nenhuma semana detectada.</div>';
    }
  }

  /**
   * Mostra preview de tarefas da semana com scraping do AVA
   * @param {Object} week - Objeto da semana
   */
  async showPreview(week) {
    const preview = document.getElementById('activeWeekPreview');
    if (!preview) return;

    try {
      // Scrape week content from AVA
      const items = await WeekContentScraper.scrapeWeekContent(week.url);
      week.items = items;

      // Render preview
      const statusIcons = this.renderStatusIcons(items);
      const progress = this.calculateProgress(items);

      preview.innerHTML = `
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">${week.name}</h4>
        <div id="previewStatus" style="font-size: 20px; letter-spacing: 2px; margin: 8px 0;">${statusIcons}</div>
        <div id="previewProgress" style="font-size: 13px; color: #666;">Progresso: ${progress}%</div>
      `;
      preview.style.display = 'block';
    } catch (error) {
      console.error('Erro ao carregar preview:', error);
      // Don't break UI on error - just log
    }
  }

  /**
   * Esconde o preview
   */
  hidePreview() {
    const preview = document.getElementById('activeWeekPreview');
    if (preview) {
      preview.style.display = 'none';
    }
  }

  /**
   * Calcula progresso percentual baseado nos status
   * @param {Array} items - Array de items da semana
   * @returns {number} - Percentual de 0-100
   */
  calculateProgress(items) {
    if (!items || items.length === 0) return 0;

    const total = items.length;
    const done = items.filter((i) => i.status === 'DONE').length;

    return Math.round((done / total) * 100);
  }

  /**
   * Renderiza ícones de status para array de items
   * @param {Array} items - Array de items
   * @returns {string} - String com emojis concatenados
   */
  renderStatusIcons(items) {
    if (!items || items.length === 0) return '';

    return items
      .map((item) => {
        if (item.status === 'DONE') return '✅';
        return '🔵'; // TODO or undefined = 🔵
      })
      .join('');
  }
}
