/**
 * @file CourseWeekTasksView.js
 * @description View de Tarefas da Semana de um Curso.
 * Localizada em: features/courses/views/CourseWeekTasksView/index.js
 */
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';

export class CourseWeekTasksView {
  /**
   * @param {Object} callbacks - Callbacks { onBack }
   */
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.week = null;
  }

  /**
   * Define a semana a ser exibida
   * @param {Object} week - Objeto Week com name e items
   */
  setWeek(week) {
    this.week = week;
  }

  /**
   * Renderiza a estrutura HTML da view
   * @returns {HTMLElement}
   */
  render() {
    if (!this.week) {
      return document.createElement('div');
    }

    const div = document.createElement('div');
    div.className = 'view-week-tasks';
    div.innerHTML = `
            <div class="details-header">
                <button id="backBtn" class="btn-back">← Voltar</button>
                <h2>${this.week.name} - Tarefas</h2>
            </div>
            <div id="weekProgress" class="week-progress-container">
                <!-- Progress bar will be injected here -->
            </div>
            <div id="tasksList" class="tasks-container"></div>
        `;
    return div;
  }

  /**
   * Configuração após renderização (eventos, população de tarefas)
   */
  afterRender() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.onclick = () => this.callbacks.onBack();
    }

    this.renderProgress();
    this.renderTasks();
  }

  /**
   * Renderiza a barra de progresso
   */
  renderProgress() {
    const container = document.getElementById('weekProgress');
    if (!container) return;

    const { completed, total, percentage } = this.calculateProgress();

    // Se não houver itens, não mostra progresso ou mostra 0
    if (total === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
        <div class="progress-info">
            <span>Progresso: ${percentage}%</span>
            <span>${completed}/${total} tarefas</span>
        </div>
        <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
        </div>
    `;
  }

  /**
   * Renderiza a lista de tarefas no container
   */
  renderTasks() {
    try {
      const container = document.getElementById('tasksList');
      if (!container) return;

      container.innerHTML = '';

      if (!this.week || !this.week.items || this.week.items.length === 0) {
        container.innerHTML = '<p style="color:#999;">Nenhuma tarefa encontrada.</p>';
        return;
      }

      this.week.items.forEach((item) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';

        const statusIcon = this.getStatusIcon(item.status || 'TODO');

        taskDiv.innerHTML = `
                  <span class="task-status">${statusIcon}</span>
                  <span class="task-name">${item.name}</span>
              `;

        container.appendChild(taskDiv);
      });
    } catch (error) {
      console.error('CourseWeekTasksView: Erro ao renderizar tarefas', error);
      const toaster = new Toaster();
      toaster.show('Erro ao renderizar tarefas.', 'error');
    }
  }

  /**
   * Mapeia status para emoji correspondente
   * @param {string} status - Status da tarefa (DONE/DOING/TODO)
   * @returns {string} - Emoji do status
   */
  getStatusIcon(status) {
    const icons = {
      DONE: '🟢',
      DOING: '🔵',
      TODO: '⚪',
    };
    return icons[status] || '⚪';
  }

  /**
   * Calcula o progresso das tarefas da semana
   * @returns {{completed: number, total: number, percentage: number}}
   */
  calculateProgress() {
    if (!this.week || !this.week.items || this.week.items.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const total = this.week.items.length;
    const completed = this.week.items.filter((item) => item.status === 'DONE').length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  }
}
