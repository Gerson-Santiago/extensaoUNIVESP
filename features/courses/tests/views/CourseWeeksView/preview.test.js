/**
 * @jest-environment jsdom
 */
import { CourseWeeksView } from '../../../views/CourseWeeksView/index.js';
import { WeekActivitiesService } from '../../../services/WeekActivitiesService.js';

// Mock dependencies
jest.mock('../../../services/WeekActivitiesService.js');

describe('CourseWeeksView - Preview', () => {
  let view;
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onBack: jest.fn(),
      onOpenCourse: jest.fn(),
    };
    view = new CourseWeeksView(mockCallbacks);
    document.body.innerHTML = '';

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('showPreview', () => {
    it('should show preview when week tasks button clicked', async () => {
      const mockItems = [
        { name: 'T1', status: 'DONE', type: 'video', url: 'http://test.com/1' },
        { name: 'T2', status: 'TODO', type: 'pdf', url: 'http://test.com/2' },
      ];

      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

      const week = { name: 'Semana 1', url: 'http://ava.com/week1', items: [] };
      view.setCourse({ name: 'Test Course', weeks: [week] });

      const element = view.render();
      document.body.appendChild(element);
      view.afterRender();

      await view.showPreview(week);

      const preview = document.getElementById('activeWeekPreview');
      expect(preview).toBeTruthy();
      expect(preview.style.display).toBe('block');
      expect(preview.textContent).toContain('Semana 1');
    });

    it('should render status icons correctly', async () => {
      const mockItems = [
        { name: 'T1', status: 'DONE', type: 'video', url: 'http://test.com/1' },
        { name: 'T2', status: 'DONE', type: 'pdf', url: 'http://test.com/2' },
        { name: 'T3', status: 'TODO', type: 'quiz', url: 'http://test.com/3' },
      ];

      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

      const week = { name: 'Semana 1', url: 'http://ava.com/week1', items: [] };
      view.setCourse({ name: 'Test Course', weeks: [week] });

      const element = view.render();
      document.body.appendChild(element);
      view.afterRender();

      await view.showPreview(week);

      const statusDiv = document.getElementById('previewStatus');
      expect(statusDiv).toBeTruthy();
      expect(statusDiv.textContent).toBe('✅✅🔵');
    });

    it('should calculate progress correctly', async () => {
      const mockItems = [
        { name: 'T1', status: 'DONE', type: 'video', url: 'http://test.com/1' },
        { name: 'T2', status: 'DONE', type: 'pdf', url: 'http://test.com/2' },
        { name: 'T3', status: 'TODO', type: 'quiz', url: 'http://test.com/3' },
      ];

      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

      const week = { name: 'Semana 1', url: 'http://ava.com/week1', items: [] };
      view.setCourse({ name: 'Test Course', weeks: [week] });

      const element = view.render();
      document.body.appendChild(element);
      view.afterRender();

      await view.showPreview(week);

      const progressDiv = document.getElementById('previewProgress');
      expect(progressDiv).toBeTruthy();
      // 2 DONE out of 3 = 67%
      expect(progressDiv.textContent).toContain('67%');
    });

    it('should handle scraping errors gracefully', async () => {
      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockRejectedValue(
        new Error('Scraping failed')
      );

      const week = { name: 'Semana 1', url: 'http://ava.com/week1', items: [] };
      view.setCourse({ name: 'Test Course', weeks: [week] });

      const element = view.render();
      document.body.appendChild(element);
      view.afterRender();

      // Should not throw
      await expect(view.showPreview(week)).resolves.not.toThrow();

      // UI should not break
      const preview = document.getElementById('activeWeekPreview');
      expect(preview).toBeTruthy();
    });

    it('should hide preview when hidePreview is called', () => {
      const week = { name: 'Semana 1', url: 'http://ava.com/week1', items: [] };
      view.setCourse({ name: 'Test Course', weeks: [week] });

      const element = view.render();
      document.body.appendChild(element);
      view.afterRender();

      const preview = document.getElementById('activeWeekPreview');
      preview.style.display = 'block';

      view.hidePreview();

      expect(preview.style.display).toBe('none');
    });
  });
});
