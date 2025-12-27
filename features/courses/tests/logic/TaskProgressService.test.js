import { TaskProgressService } from '../../services/TaskProgressService.js';
import { ActivityProgressRepository } from '../../repository/ActivityProgressRepository.js';

// Mock Repository
jest.mock('../../repository/ActivityProgressRepository.js');

describe('TaskProgressService (Serviço de Progresso de Tarefas)', () => {
  beforeEach(() => {
    // Preparar (Arrange) - Limpar Mocks
    jest.clearAllMocks();
  });

  describe('toggleTask', () => {
    it('deve alternar o status da tarefa usando ActivityProgressRepository', async () => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (ActivityProgressRepository.toggle).mockResolvedValue({
        activityId: 'course_week_task1',
        status: 'DONE',
        markedByUser: true,
        completedInAVA: false,
        lastUpdated: Date.now(),
      });

      // Agir (Act)
      const result = await TaskProgressService.toggleTask('courseId', 'weekId', 'task1');

      // Verificar (Assert)
      expect(result).toBe(true);
      expect(ActivityProgressRepository.toggle).toHaveBeenCalledWith('courseId_weekId_task1');
    });

    it('deve retornar false ao alternar para pendente (TODO)', async () => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (ActivityProgressRepository.toggle).mockResolvedValue({
        activityId: 'course_week_task2',
        status: 'TODO',
        markedByUser: true,
        completedInAVA: false,
        lastUpdated: Date.now(),
      });

      // Agir (Act)
      const result = await TaskProgressService.toggleTask('courseId', 'weekId', 'task2');

      // Verificar (Assert)
      expect(result).toBe(false);
    });
  });

  describe('calculateProgress', () => {
    it('deve calcular o progresso usando os dados do repositório', async () => {
      // Preparar (Arrange)
      const mockWeek = {
        name: 'Week 1',
        items: [
          { id: 'task1', name: 'Task 1', url: '#', type: 'video' },
          { id: 'task2', name: 'Task 2', url: '#', type: 'quiz' },
          { id: 'task3', name: 'Task 3', url: '#', type: 'document' },
        ],
      };

      /** @type {jest.Mock} */ (ActivityProgressRepository.getMany).mockResolvedValue({
        'courseId_Week 1_task1': { status: 'DONE' },
        'courseId_Week 1_task2': { status: 'TODO' },
        // task3 não tem registro (assumido TODO)
      });

      // Agir (Act)
      const result = await TaskProgressService.calculateProgress(mockWeek, 'courseId');

      // Verificar (Assert)
      expect(result).toEqual({
        completed: 1, // apenas task1
        total: 3,
        percentage: 33, // Math.round(1/3 * 100)
      });
    });

    it('deve lidar com semanas vazias', async () => {
      // Preparar (Arrange)
      /** @type {import('../../models/Week.js').Week} */
      const emptyWeek = { name: 'Empty Week', items: [] };

      // Agir (Act)
      const result = await TaskProgressService.calculateProgress(emptyWeek, 'courseId');

      // Verificar (Assert)
      expect(result).toEqual({
        completed: 0,
        total: 0,
        percentage: 0,
      });
    });

    it('deve usar o status do scraping (fallback) se não houver dados no repositório', async () => {
      // Preparar (Arrange)
      /** @type {import('../../models/Week.js').Week} */
      const mockWeek = {
        name: 'Week 1',
        items: [
          { id: 'task1', name: 'Task 1', url: '#', type: 'video', status: 'DONE' },
          { id: 'task2', name: 'Task 2', url: '#', type: 'quiz', status: 'TODO' },
        ],
      };

      /** @type {jest.Mock} */ (ActivityProgressRepository.getMany).mockResolvedValue({});

      // Agir (Act)
      const result = await TaskProgressService.calculateProgress(mockWeek, 'courseId');

      // Verificar (Assert)
      expect(result).toEqual({
        completed: 1, // task1 coletado como DONE
        total: 2,
        percentage: 50,
      });
    });
  });

  describe('isTaskCompleted', () => {
    it('deve retornar true quando a tarefa estiver concluída (DONE)', async () => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (ActivityProgressRepository.get).mockResolvedValue({
        activityId: 'course_week_task1',
        status: 'DONE',
        markedByUser: true,
        completedInAVA: false,
        lastUpdated: Date.now(),
      });

      // Agir (Act)
      const result = await TaskProgressService.isTaskCompleted('courseId', 'weekId', 'task1');

      // Verificar (Assert)
      expect(result).toBe(true);
    });

    it('deve retornar false quando a tarefa estiver pendente (TODO)', async () => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (ActivityProgressRepository.get).mockResolvedValue({
        activityId: 'course_week_task2',
        status: 'TODO',
        markedByUser: true,
        completedInAVA: false,
        lastUpdated: Date.now(),
      });

      // Agir (Act)
      const result = await TaskProgressService.isTaskCompleted('courseId', 'weekId', 'task2');

      // Verificar (Assert)
      expect(result).toBe(false);
    });

    it('deve retornar false quando nenhum progresso for encontrado', async () => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (ActivityProgressRepository.get).mockResolvedValue(null);

      // Agir (Act)
      const result = await TaskProgressService.isTaskCompleted('courseId', 'weekId', 'task3');

      // Verificar (Assert)
      expect(result).toBe(false);
    });
  });
});
