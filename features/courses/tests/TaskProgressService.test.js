import { TaskProgressService } from '../services/TaskProgressService.js';
import { ActivityProgressRepository } from '../repository/ActivityProgressRepository.js';

// Mock Repository
jest.mock('../repository/ActivityProgressRepository.js');

describe('TaskProgressService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toggleTask', () => {
    it('should toggle task using ActivityProgressRepository', async () => {
      /** @type {jest.Mock} */ (ActivityProgressRepository.toggle).mockResolvedValue({
      activityId: 'course_week_task1',
      status: 'DONE',
      markedByUser: true,
      completedInAVA: false,
      lastUpdated: Date.now(),
    });

      const result = await TaskProgressService.toggleTask('courseId', 'weekId', 'task1');

      expect(result).toBe(true);
      expect(ActivityProgressRepository.toggle).toHaveBeenCalledWith('courseId_weekId_task1');
    });

    it('should return false when toggling to TODO', async () => {
      /** @type {jest.Mock} */ (ActivityProgressRepository.toggle).mockResolvedValue({
      activityId: 'course_week_task2',
      status: 'TODO',
      markedByUser: true,
      completedInAVA: false,
      lastUpdated: Date.now(),
    });

      const result = await TaskProgressService.toggleTask('courseId', 'weekId', 'task2');

      expect(result).toBe(false);
    });
  });

  describe('calculateProgress', () => {
    it('should calculate progress using repository', async () => {
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
        // task3 não tem progresso
      });

      const result = await TaskProgressService.calculateProgress(mockWeek, 'courseId');

      expect(result).toEqual({
        completed: 1, // apenas task1
        total: 3,
        percentage: 33, // Math.round(1/3 * 100)
      });
    });

    it('should handle empty weeks', async () => {
      /** @type {import('../models/Week.js').Week} */
      const emptyWeek = { name: 'Empty Week', items: [] };

      const result = await TaskProgressService.calculateProgress(emptyWeek, 'courseId');

      expect(result).toEqual({
        completed: 0,
        total: 0,
        percentage: 0,
      });
    });

    it('should fallback to scraped status if no repository data', async () => {
      /** @type {import('../models/Week.js').Week} */
      const mockWeek = {
        name: 'Week 1',
        items: [
          { id: 'task1', name: 'Task 1', url: '#', type: 'video', status: 'DONE' },
          { id: 'task2', name: 'Task 2', url: '#', type: 'quiz', status: 'TODO' },
        ],
      };

      // Repository retorna vazio
      /** @type {jest.Mock} */ (ActivityProgressRepository.getMany).mockResolvedValue({});

      const result = await TaskProgressService.calculateProgress(mockWeek, 'courseId');

      expect(result).toEqual({
        completed: 1, // task1 scraped como DONE
        total: 2,
        percentage: 50,
      });
    });
  });

  describe('isTaskCompleted', () => {
    it('should return true when task is completed', async () => {
      /** @type {jest.Mock} */ (ActivityProgressRepository.get).mockResolvedValue({
      activityId: 'course_week_task1',
      status: 'DONE',
      markedByUser: true,
      completedInAVA: false,
      lastUpdated: Date.now(),
    });

      const result = await TaskProgressService.isTaskCompleted('courseId', 'weekId', 'task1');

      expect(result).toBe(true);
    });

    it('should return false when task is not completed', async () => {
      /** @type {jest.Mock} */ (ActivityProgressRepository.get).mockResolvedValue({
      activityId: 'course_week_task2',
      status: 'TODO',
      markedByUser: true,
      completedInAVA: false,
      lastUpdated: Date.now(),
    });

      const result = await TaskProgressService.isTaskCompleted('courseId', 'weekId', 'task2');

      expect(result).toBe(false);
    });

    it('should return false when no progress found', async () => {
      /** @type {jest.Mock} */ (ActivityProgressRepository.get).mockResolvedValue(null);

      const result = await TaskProgressService.isTaskCompleted('courseId', 'weekId', 'task3');

      expect(result).toBe(false);
    });
  });
});
