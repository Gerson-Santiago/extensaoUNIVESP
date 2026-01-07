import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';
import { TaskProgressService } from '../../services/TaskProgressService.js';
import { Logger } from '../../../../shared/utils/Logger.js';

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

    const header = document.createElement('div');
    header.className = 'details-header';

    const backBtn = document.createElement('button');
    backBtn.id = 'backBtn';
    backBtn.className = 'btn-back';
    backBtn.textContent = '← Voltar';

    const h2 = document.createElement('h2');
    h2.textContent = `${this.week.name} - Tarefas`;

    header.append(backBtn, h2);

    const weekProgress = document.createElement('div');
    weekProgress.id = 'weekProgress';
    weekProgress.className = 'week-progress-container';

    const tasksList = document.createElement('div');
    tasksList.id = 'tasksList';
    tasksList.className = 'tasks-container';

    div.append(header, weekProgress, tasksList);
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
  async renderProgress() {
    const container = document.getElementById('weekProgress');
    if (!container) return;

    // Delegate calculation to Service (now async)
    const { completed, total, percentage } = await TaskProgressService.calculateProgress(
      this.week,
      this.course.url
    );

    // Se não houver itens, não mostra progresso ou mostra 0
    if (total === 0) {
      container.replaceChildren();
      return;
    }

    container.replaceChildren(); // Clear container

    const infoDiv = document.createElement('div');
    infoDiv.className = 'progress-info';

    const spanPct = document.createElement('span');
    spanPct.textContent = `Progresso: ${percentage}%`;

    const spanCount = document.createElement('span');
    spanCount.textContent = `${completed}/${total} tarefas`;

    infoDiv.append(spanPct, spanCount);

    const bgDiv = document.createElement('div');
    bgDiv.className = 'progress-bar-bg';

    const fillDiv = document.createElement('div');
    fillDiv.className = 'progress-bar-fill';
    fillDiv.style.width = `${percentage}%`;

    bgDiv.appendChild(fillDiv);

    container.append(infoDiv, bgDiv);
  }

  /**
   * Renderiza a lista de tarefas no container
   */
  async renderTasks() {
    try {
      const container = document.getElementById('tasksList');
      if (!container) return;

      container.replaceChildren();

      if (!this.week || !this.week.items || this.week.items.length === 0) {
        const p = document.createElement('p');
        p.style.color = '#999';
        p.textContent = 'Nenhuma tarefa encontrada.';
        container.appendChild(p);
        return;
      }

      // Fetch all progress statuses at once for efficiency
      for (const item of this.week.items) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.style.cursor = 'pointer';
        taskDiv.addEventListener('click', (/** @type {PointerEvent} */ _e) => {
          this.handleToggle(item.id);
        });

        // Check progress from repository
        const isCompleted = await TaskProgressService.isTaskCompleted(
          this.course.url,
          this.week.name,
          item.id
        );

        const statusIcon = isCompleted ? '🟢' : '⚪';

        // Add visual feedback class
        if (isCompleted) {
          taskDiv.classList.add('completed');
        }

        const spanStatus = document.createElement('span');
        spanStatus.className = 'task-status';
        spanStatus.textContent = statusIcon;

        const spanName = document.createElement('span');
        spanName.className = 'task-name';
        spanName.textContent = item.name;

        taskDiv.append(spanStatus, spanName);

        container.appendChild(taskDiv);
      }
    } catch (error) {
      /**#LOG_UI*/
      Logger.error('CourseWeekTasksView', 'Erro ao renderizar tarefas', error);
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
      /**#LOG_UI*/
      Logger.error('CourseWeekTasksView', 'Missing context for toggle');
      return;
    }

    try {
      // Toggle using new unified model
      await TaskProgressService.toggleTask(this.course.url, this.week.name, taskId);

      // Re-render to show new state
      await this.renderProgress();
      await this.renderTasks();
    } catch (error) {
      /**#LOG_UI*/
      Logger.error('CourseWeekTasksView', 'Error toggling task:', error);
      new Toaster().show('Erro ao atualizar tarefa.', 'error');
    }
  }
}
