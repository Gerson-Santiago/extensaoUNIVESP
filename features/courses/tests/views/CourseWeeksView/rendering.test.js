/**
 * @jest-environment jsdom
 */
import { CourseWeeksView } from '../../../views/CourseWeeksView/index.js';
import { WeekActivitiesService } from '../../../services/WeekActivitiesService.js';

// Mock dependencies
jest.mock('../../../services/WeekActivitiesService.js');

describe('CourseWeeksView - Dynamic Preview Behavior', () => {
  let view;

  beforeEach(() => {
    view = new CourseWeeksView({ onBack: jest.fn(), onOpenCourse: jest.fn() });
    jest.clearAllMocks();
  });

  it('should toggle preview when clicking same week twice', async () => {
    const mockItems = [{ name: 'T1', status: 'DONE', type: 'video', url: 'http://test.com/1' }];
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

    const week = { name: 'Semana 1', url: 'http://ava.com/week1' };
    const mockElement = {
      classList: { add: jest.fn(), remove: jest.fn() },
      insertAdjacentElement: jest.fn(),
    };

    // First click: show
    await view.showPreview(week, mockElement);
    expect(view.activeWeek).toBe(week);
    expect(mockElement.classList.add).toHaveBeenCalledWith('week-item-active');

    // Second click: hide preview BUT keep highlight (UX improvement)
    await view.showPreview(week, mockElement);
    expect(view.activeWeek).toBe(week); // Still active!
    expect(mockElement.classList.remove).not.toHaveBeenCalled(); // Highlight stays!
  });

  it('should remove previous preview when clicking different week', async () => {
    const mockItems = [{ name: 'T1', status: 'DONE' }];
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

    const week1 = { name: 'Semana 1', url: 'http://ava.com/week1' };
    const week2 = { name: 'Semana 2', url: 'http://ava.com/week2' };
    const mockElement1 = {
      classList: { add: jest.fn(), remove: jest.fn() },
      insertAdjacentElement: jest.fn(),
    };
    const mockElement2 = {
      classList: { add: jest.fn(), remove: jest.fn() },
      insertAdjacentElement: jest.fn(),
    };

    // Click week 1
    await view.showPreview(week1, mockElement1);
    expect(view.activeWeek).toBe(week1);

    // Click week 2 - should switch
    await view.showPreview(week2, mockElement2);
    expect(view.activeWeek).toBe(week2);
    expect(mockElement2.classList.add).toHaveBeenCalledWith('week-item-active');
  });

  it('should handle scraping errors and remove active state', async () => {
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockRejectedValue(
      new Error('Failed')
    );

    const week = { name: 'Semana Error', url: 'http://ava.com/error' };
    const mockElement = {
      classList: { add: jest.fn(), remove: jest.fn() },
      insertAdjacentElement: jest.fn(),
    };

    await view.showPreview(week, mockElement);

    // Should remove active state on error
    expect(mockElement.classList.remove).toHaveBeenCalledWith('week-item-active');
    expect(view.activeWeek).toBe(null);
  });
});
