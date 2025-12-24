import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';
import { TaskProgressService } from '../../services/TaskProgressService.js';

export class CourseWeekTasksView {
  /**
   * @param {Object} callbacks - Callbacks { onBack }
   */
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.week = null;
    this.course = null; // Needed for persistence
  }

  /**
   * Define a semana e o curso a ser exibido
   * @param {Object} week - Objeto Week com name e items
   * @param {Object} course - Objeto Course pai (necessário para persistência)
   */
  setWeek(week, course) {
    this.week = week;
    this.course = course;
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
      backBtn.addEventListener('click', (/** @type {PointerEvent} */ _e) => {
        this.callbacks.onBack();
      });
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

    // Delegate calculation to Service
    const { completed, total, percentage } = TaskProgressService.calculateProgress(this.week);

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
        // Allow clicking the entire row to toggle
        taskDiv.style.cursor = 'pointer';
        taskDiv.addEventListener('click', (/** @type {PointerEvent} */ _e) => {
          this.handleToggle(item.id);
        });

        const isCompleted = item.completed || item.status === 'DONE';
        const statusIcon = isCompleted ? '🟢' : '⚪';

        // Add visual feedback class
        if (isCompleted) {
          taskDiv.classList.add('completed');
        }

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
   * Handle task toggle interaction using the Service
   * @param {string} taskId
   */
  async handleToggle(taskId) {
    if (!this.course || !this.week) {
      console.error('Missing context for toggle');
      return;
    }

    try {
      // Optimistic UI Update equivalent not needed if render is fast,
      // but let's call service then re-render.
      await TaskProgressService.toggleTask(this.course, this.week.name, taskId);

      // Re-render to show new state
      this.renderProgress();
      this.renderTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
      new Toaster().show('Erro ao atualizar tarefa.', 'error');
    }
  }
}
