/**
 * @file CourseWeekTasksView.js
 * @description View de Tarefas da Semana de um Curso.
 * Localizada em: features/courses/views/CourseWeekTasksView/index.js
 */
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

    this.renderTasks();
  }

  /**
   * Renderiza a lista de tarefas no container
   */
  renderTasks() {
    const container = document.getElementById('tasksList');
    if (!container) return;

    container.innerHTML = '';

    if (!this.week.items || this.week.items.length === 0) {
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
}
