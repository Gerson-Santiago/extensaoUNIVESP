import { TaskProgressService } from '../services/TaskProgressService.js';
import { CourseRepository } from '../data/CourseRepository.js';

// Mock Repository
jest.mock('../data/CourseRepository.js');

describe('TaskProgressService', () => {
  let mockCourse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCourse = {
      name: 'Test Course',
      url: 'http://course.com',
      weeks: [
        {
          name: 'Week 1',
          items: [
            { id: 'task1', name: 'Task 1', completed: false },
            { id: 'task2', name: 'Task 2', completed: true },
          ],
        },
      ],
    };

    // Mock loadItems to return our mockCourse so toggleTask can find it
    /** @type {jest.Mock} */ (CourseRepository.loadItems).mockResolvedValue([mockCourse]);
    /** @type {jest.Mock} */ (CourseRepository.saveItems).mockResolvedValue(true);
  });

  describe('toggleTask', () => {
    it('should toggle task status from false to true', async () => {
      const result = await TaskProgressService.toggleTask(mockCourse, 'Week 1', 'task1');

      expect(result).toBe(true);
      expect(mockCourse.weeks[0].items[0].completed).toBe(true);
      expect(CourseRepository.saveItems).toHaveBeenCalled(); // or saveCourse depending on repo API
    });

    it('should toggle task status from true to false', async () => {
      // Setup: task2 starts as true
      const result = await TaskProgressService.toggleTask(mockCourse, 'Week 1', 'task2');

      expect(result).toBe(false);
      expect(mockCourse.weeks[0].items[1].completed).toBe(false);
      expect(CourseRepository.saveItems).toHaveBeenCalled();
    });

    it('should throw error if week not found', async () => {
      await expect(
        TaskProgressService.toggleTask(mockCourse, 'Invalid Week', 'task1')
      ).rejects.toThrow('Week not found');
    });

    it('should throw error if task not found', async () => {
      await expect(
        TaskProgressService.toggleTask(mockCourse, 'Week 1', 'invalidTask')
      ).rejects.toThrow('Task not found');
    });
  });

  describe('calculateProgress', () => {
    it('should calculate progress correctly', () => {
      const week = mockCourse.weeks[0]; // 1 done, 1 todo
      const progress = TaskProgressService.calculateProgress(week);

      expect(progress).toEqual({
        completed: 1,
        total: 2,
        percentage: 50,
      });
    });

    it('should handle empty weeks', () => {
      const emptyWeek = { name: 'Empty Week', items: [] };
      const progress = TaskProgressService.calculateProgress(
        /** @type {import('../models/Week.js').Week} */ (emptyWeek)
      );

      expect(progress).toEqual({
        completed: 0,
        total: 0,
        percentage: 0,
      });
    });
  });
});
