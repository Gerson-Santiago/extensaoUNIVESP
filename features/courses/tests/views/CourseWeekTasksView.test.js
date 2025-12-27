import { CourseWeekTasksView } from '../../views/CourseWeekTasksView/index.js';
import { TaskProgressService } from '../../services/TaskProgressService.js';

// Mock dependencies
jest.mock('../../services/TaskProgressService.js');
jest.mock('../../../../shared/ui/feedback/Toaster.js', () => ({
  Toaster: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
  })),
}));

describe('CourseWeekTasksView', () => {
  let view;
  let mockCallbacks;
  let mockCourse;
  let mockWeek;

  beforeEach(() => {
    // Preparar (Arrange) - Configuração de Mocks e View
    jest.clearAllMocks();
    mockCallbacks = { onBack: jest.fn() };
    view = new CourseWeekTasksView(mockCallbacks);

    mockCourse = { name: 'Course 1', url: 'http://c1.com' };
    mockWeek = {
      name: 'Week 1',
      items: [
        { id: 't1', name: 'Task 1', completed: false },
        { id: 't2', name: 'Task 2', completed: true },
      ],
    };

    view.setWeek(mockWeek, mockCourse);

    // Mock Comportamento do Serviço (retorno assíncrono)
    /** @type {jest.Mock} */ (TaskProgressService.calculateProgress).mockResolvedValue({
      completed: 1,
      total: 2,
      percentage: 50,
    });
    /** @type {jest.Mock} */ (TaskProgressService.isTaskCompleted).mockImplementation(
      async (courseId, weekId, taskId) => {
        // Retorna falso para t1, verdadeiro para t2 (compatível com os dados do mock)
        return taskId === 't2';
      }
    );
    /** @type {jest.Mock} */ (TaskProgressService.toggleTask).mockResolvedValue(true);
  });

  describe('Renderização', () => {
    it('deve renderizar os itens corretamente', async () => {
      // Agir (Act)
      const element = view.render();
      document.body.appendChild(element);
      await view.afterRender(); // afterRender chama métodos assíncronos

      // Aguardar renderizações assíncronas
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verificar (Assert)
      const taskItems = document.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(2);
      expect(taskItems[0].textContent).toContain('Task 1');
      expect(taskItems[1].textContent).toContain('Task 2');
    });

    it('deve calcular e exibir o progresso via Serviço', async () => {
      // Agir (Act)
      const element = view.render();
      document.body.appendChild(element);
      await view.renderProgress();

      // Verificar (Assert)
      expect(TaskProgressService.calculateProgress).toHaveBeenCalledWith(mockWeek, 'http://c1.com');
      const progressInfo = document.querySelector('.progress-info');
      expect(progressInfo.textContent).toContain('50%');
    });
  });

  describe('Interação', () => {
    it('deve chamar Service.toggleTask ao clicar em uma tarefa', async () => {
      // Preparar (Arrange)
      const element = view.render();
      document.body.appendChild(element);
      await view.afterRender();

      // Agir (Act)
      const firstTask = /** @type {HTMLElement} */ (document.querySelectorAll('.task-item')[0]);
      firstTask.dispatchEvent(new PointerEvent('click', { bubbles: true }));

      // Aguardar handleToggle assíncrono terminar
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verificar (Assert)
      expect(TaskProgressService.toggleTask).toHaveBeenCalledWith('http://c1.com', 'Week 1', 't1');
    });

    it('deve re-renderizar o progresso após alternar uma tarefa', async () => {
      // Preparar (Arrange)
      const renderSpy = jest.spyOn(view, 'renderProgress');
      const element = view.render();
      document.body.appendChild(element);
      await view.afterRender();

      // Agir (Act)
      const firstTask = /** @type {HTMLElement} */ (document.querySelectorAll('.task-item')[0]);
      firstTask.dispatchEvent(new PointerEvent('click', { bubbles: true }));

      // Aguardar handleToggle assíncrono terminar
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verificar (Assert)
      expect(renderSpy).toHaveBeenCalled();
    });
  });
});
