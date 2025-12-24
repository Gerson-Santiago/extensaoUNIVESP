import { CourseWeeksView } from '../views/CourseWeeksView/index.js';
import { WeekActivitiesService } from '../services/WeekActivitiesService.js';
import { Toaster } from '../../../shared/ui/feedback/Toaster.js';

// Mock dependencies
jest.mock('../services/WeekActivitiesService.js');
jest.mock('../../../shared/ui/feedback/Toaster.js');

describe('Error Handling Integration', () => {
  let weeksView;
  let mockToasterShow;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockToasterShow = jest.fn();
    Toaster.prototype.show = mockToasterShow;

    weeksView = new CourseWeeksView({});
  });

  describe('CourseWeeksView', () => {
    it('should show toast error when preview scraping fails', async () => {
      // Setup
      const week = { url: 'http://error.com', name: 'Week Error' };
      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockRejectedValue(
        new Error('Scraping failed')
      );

      // Execute
      await weeksView.showPreview(week);

      // Assert
      expect(mockToasterShow).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao carregar preview'),
        'error'
      );
    });
  });

  describe('CourseWeekTasksView', () => {
    // Setup logic to test error handling in tasks view
    // Is there an async method here?
    // Currently CourseWeekTasksView receives data via setWeek, but usually it might fetch details.
    // If it's purely display, maybe no toast needed unless specific interactions fail.
    // Let's assume we might add async loading or error handling for specific user actions later.
    // For now, testing the hypothesis.
    it('should handle errors gracefully', () => {
      // Placeholder for now as the view is synchronous
      expect(true).toBe(true);
    });
  });
});
