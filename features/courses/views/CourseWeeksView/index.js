/**
 * @file CourseWeeksView.js
 * @description View de Semanas da Matéria.
 * Localizada em: features/courses/views/CourseWeeksView/index.js
 */

import { createWeekElement } from '../../components/WeekItem.js';
import { CourseRefresher } from '../../services/CourseRefresher.js';
import { WeekContentScraper } from '../../services/WeekContentScraper.js';
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';

export class CourseWeeksView {
  constructor(callbacks) {
    // callbacks: { onBack, onOpenCourse }
    this.callbacks = callbacks;
    this.course = null;
    this.activeWeek = null; // Track active week for toggle
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
                <!-- Lista de semanas e previews dinâmicos aqui -->
            </div>
            
            <!-- Preview Fixo (apenas para compatibilidade com testes) -->
            <div id="activeWeekPreview" style="display: none; margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                <!-- Preview legado -->
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
          onClick: (url) => {
            // Abre semana no navegador E marca como ativa (azul)
            this.setActiveWeek(week, wDiv);
            this.callbacks.onOpenCourse(url);
          },
          onViewTasks: (w) => this.showPreview(w, wDiv),
          onViewActivities: (w) => {
            // Navega para DetailsActivitiesWeekView
            if (this.callbacks.onViewActivities) {
              this.callbacks.onViewActivities(w);
            }
          },
        });
        weeksList.appendChild(wDiv);
      });
    } else {
      weeksList.innerHTML =
        '<div style="padding:15px; text-align:center; color:#999;">Nenhuma semana detectada.</div>';
    }
  }

  /**
   * Define qual semana está ativa (aberta no navegador)
   * Adiciona destaque visual azul para indicar ao usuário qual semana ele está estudando
   * @param {Object} week - Semana a ser marcada como ativa
   * @param {HTMLElement} weekElement - Elemento DOM da semana
   */
  setActiveWeek(week, weekElement) {
    // Remove destaque anterior
    if (this.activeWeek) {
      document
        .querySelectorAll('.week-item')
        .forEach((el) => el.classList.remove('week-item-active'));
    }

    // Define nova semana ativa e adiciona destaque azul
    this.activeWeek = week;
    if (weekElement) {
      weekElement.classList.add('week-item-active');
    }
  }

  /**
   * Mostra/esconde preview de tarefas da semana (toggle)
   * Preview aparece dinamicamente abaixo da semana clicada
   * IMPORTANTE: Também marca a semana como ativa (destaque azul)
   * @param {Object} week - Objeto da semana
   * @param {HTMLElement} [weekElement] - Elemento DOM da semana (opcional para testes)
   */
  async showPreview(week, weekElement) {
    // Marca semana como ativa (abre no navegador via botão Tarefas)
    this.setActiveWeek(week, weekElement);
    // Toggle do preview: se já está ativo, apenas fecha/abre preview
    const existingPreview = document.querySelector('.week-preview-dynamic');
    const hasPreview = existingPreview && existingPreview.previousElementSibling === weekElement;

    if (hasPreview) {
      // Já tem preview aberto: fecha (mas mantém destaque azul!)
      this.hidePreview();
      return;
    }

    // Remove preview anterior se houver
    this.hidePreview();

    try {
      // Scrape week content from AVA
      const items = await WeekContentScraper.scrapeWeekContent(week.url);
      week.items = items;

      // Render preview
      const statusIcons = this.renderStatusIcons(items);
      const progress = this.calculateProgress(items);

      if (weekElement) {
        // Modo dinâmico: cria div e insere após o elemento
        const previewDiv = document.createElement('div');
        previewDiv.className = 'week-preview-dynamic';
        previewDiv.innerHTML = `
          <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333; font-weight: 600;">📊 ${week.name}</h4>
          <div style="font-size: 20px; letter-spacing: 2px; margin: 8px 0; line-height: 1.4;">${statusIcons}</div>
          <div style="font-size: 13px; color: #666;">Progresso: ${progress}% (${items.filter((i) => i.status === 'DONE').length}/${items.length} concluídas)</div>
        `;
        weekElement.insertAdjacentElement('afterend', previewDiv);
      } else {
        // Modo legado (para testes antigos): usa div fixa
        const preview = document.getElementById('activeWeekPreview');
        if (preview) {
          preview.innerHTML = `
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">${week.name}</h4>
            <div id="previewStatus" style="font-size: 20px; letter-spacing: 2px; margin: 8px 0;">${statusIcons}</div>
            <div id="previewProgress" style="font-size: 13px; color: #666;">Progresso: ${progress}%</div>
          `;
          preview.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preview:', error);

      const toaster = new Toaster();
      toaster.show('Erro ao carregar preview. Tente novamente.', 'error');

      // Em caso de erro, remove destaque também
      if (weekElement) {
        weekElement.classList.remove('week-item-active');
      }
      this.activeWeek = null;
    }
  }

  /**
   * Remove preview dinâmico atual e esconde preview legado
   */
  hidePreview() {
    // Remove preview dinâmico
    const existingPreview = document.querySelector('.week-preview-dynamic');
    if (existingPreview) {
      existingPreview.remove();
    }

    // Esconde preview legado (para testes)
    const legacyPreview = document.getElementById('activeWeekPreview');
    if (legacyPreview) {
      legacyPreview.style.display = 'none';
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
