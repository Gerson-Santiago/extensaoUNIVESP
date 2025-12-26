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

    // Mock Service behavior (now async)
    /** @type {jest.Mock} */ (TaskProgressService.calculateProgress).mockResolvedValue({
      completed: 1,
      total: 2,
      percentage: 50,
    });
    /** @type {jest.Mock} */ (TaskProgressService.isTaskCompleted).mockImplementation(
      async (courseId, weekId, taskId) => {
        // Return false for t1, true for t2 (matching mock data)
        return taskId === 't2';
      }
    );
    /** @type {jest.Mock} */ (TaskProgressService.toggleTask).mockResolvedValue(true);
  });

  describe('render', () => {
    it('should render items correctly', async () => {
      const element = view.render();
      document.body.appendChild(element);
      await view.afterRender(); // afterRender now calls async methods

      // Wait for async renders to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      const taskItems = document.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(2);
      expect(taskItems[0].textContent).toContain('Task 1');
      expect(taskItems[1].textContent).toContain('Task 2');
    });

    it('should calculate progress via Service', async () => {
      const element = view.render();
      document.body.appendChild(element);
      await view.renderProgress();

      expect(TaskProgressService.calculateProgress).toHaveBeenCalledWith(mockWeek, 'http://c1.com');
      const progressInfo = document.querySelector('.progress-info');
      expect(progressInfo.textContent).toContain('50%');
    });
  });

  describe('Interaction', () => {
    it('should call Service.toggleTask when clicking a task', async () => {
      const element = view.render();
      document.body.appendChild(element);
      await view.afterRender();

      const firstTask = /** @type {HTMLElement} */ (document.querySelectorAll('.task-item')[0]);
      firstTask.dispatchEvent(new PointerEvent('click', { bubbles: true }));

      // Wait for async handleToggle to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(TaskProgressService.toggleTask).toHaveBeenCalledWith('http://c1.com', 'Week 1', 't1');
    });

    it('should re-render progress after toggle', async () => {
      const renderSpy = jest.spyOn(view, 'renderProgress');
      const element = view.render();
      document.body.appendChild(element);
      await view.afterRender();

      const firstTask = /** @type {HTMLElement} */ (document.querySelectorAll('.task-item')[0]);
      firstTask.dispatchEvent(new PointerEvent('click', { bubbles: true }));

      // Wait for async handleToggle to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(renderSpy).toHaveBeenCalled();
    });
  });
});
