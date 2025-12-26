/**
 * @jest-environment jsdom
 */
import { CourseWeeksView } from '../../../views/CourseWeeksView/index.js';

describe('CourseWeeksView - Progress Calculation', () => {
  let view;
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onBack: jest.fn(),
      onOpenCourse: jest.fn(),
    };
    view = new CourseWeeksView(mockCallbacks);
    document.body.innerHTML = '';
  });

  describe('calculateProgress', () => {
    it('should return 0% for empty items', () => {
      const progress = view.calculateProgress([]);
      expect(progress).toBe(0);
    });

    it('should return 100% when all items are DONE', () => {
      const items = [
        { name: 'T1', status: 'DONE' },
        { name: 'T2', status: 'DONE' },
      ];
      const progress = view.calculateProgress(items);
      expect(progress).toBe(100);
    });

    it('should return 0% when all items are TODO', () => {
      const items = [
        { name: 'T1', status: 'TODO' },
        { name: 'T2', status: 'TODO' },
      ];
      const progress = view.calculateProgress(items);
      expect(progress).toBe(0);
    });

    it('should handle items without status (default to TODO)', () => {
      const items = [
        { name: 'T1', status: 'DONE' },
        { name: 'T2' }, // no status
      ];
      const progress = view.calculateProgress(items);
      expect(progress).toBe(50);
    });
  });

  describe('renderStatusIcons', () => {
    it('should render correct icons for each status', () => {
      const items = [
        { name: 'T1', status: 'DONE' },
        { name: 'T2', status: 'TODO' },
        { name: 'T3' }, // no status = TODO
      ];
      const icons = view.renderStatusIcons(items);
      expect(icons).toBe('✅🔵🔵');
    });

    it('should return empty string for empty items', () => {
      const icons = view.renderStatusIcons([]);
      expect(icons).toBe('');
    });
  });
});
