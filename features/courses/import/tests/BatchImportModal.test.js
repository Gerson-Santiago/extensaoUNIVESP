import { BatchImportModal } from '@features/courses/import/components/BatchImportModal.js';

// Mocks
jest.mock('@features/courses/import/services/BatchScraper.js', () => ({
  scrapeAvailableTerms: jest.fn(),
  processSelectedCourses: jest.fn(),
}));

jest.mock('@features/courses/data/CourseRepository.js', () => ({
  CourseRepository: {
    addBatch: jest.fn(),
  },
}));

/**
 * Test Suite for BatchImportModal Rendering Logic
 * Verifies:
 * 1. Sorting order (Newest first)
 * 2. Grouping display
 * 3. Granular course checkboxes
 */
describe('BatchImportModal Render Logic', () => {
  let modal;
  let container;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    container = document.createElement('div');
    modal = new BatchImportModal(() => {});
  });

  test('Should sort terms descending (newest first) and render courses with checkboxes', () => {
    // Setup Data
    const mockTerms = [
      {
        name: '2024/1 - 1º Bimestre',
        courses: [{ name: 'Old Course', url: 'http://old', courseId: '1' }],
      },
      {
        name: '2025/2 - 4º Bimestre',
        courses: [
          { name: 'Recent Course A', url: 'http://recA', courseId: '2' },
          { name: 'Recent Course B', url: 'http://recB', courseId: '3' },
        ],
      },
      {
        name: '2025/1 - 1º Bimestre',
        courses: [{ name: 'Mid Course', url: 'http://mid', courseId: '4' }],
      },
    ];

    modal.foundTerms = mockTerms;

    // Execute
    modal.renderTerms(container);

    // Assertions
    const termHeaders = container.querySelectorAll('.term-header');
    expect(termHeaders.length).toBe(3);

    // Check Order: Expect 2025/2 - 4º Bimestre FIRST
    expect(termHeaders[0].textContent).toContain('2025/2 - 4º Bimestre');
    expect(termHeaders[1].textContent).toContain('2025/1 - 1º Bimestre');
    expect(termHeaders[2].textContent).toContain('2024/1 - 1º Bimestre');

    // Check Courses
    const recentGroup = container.querySelector('.term-group:nth-child(1)');
    const coursesInRecent = recentGroup.querySelectorAll('.course-item');
    expect(coursesInRecent.length).toBe(2);
    expect(coursesInRecent[0].textContent).toContain('Recent Course A');
    expect(coursesInRecent[1].textContent).toContain('Recent Course B');

    // Check Checkboxes
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    // We expect 1 checkbox per course = 1 + 2 + 1 = 4 checkboxes
    expect(checkboxes.length).toBe(4);
  });

  test('Should handle empty terms gracefully', () => {
    modal.foundTerms = [];
    modal.renderTerms(container);
    expect(container.textContent).toContain('Nenhum termo encontrado');
  });
});

describe('BatchImportModal Interactions', () => {
  let modal;

  beforeEach(() => {
    document.body.innerHTML = '';
    modal = new BatchImportModal(() => {});
  });

  test('Should have a reload button that triggers loadTerms', () => {
    // 1. Spy on loadTerms (the method we want to re-trigger)
    const loadTermsSpy = jest.spyOn(modal, 'loadTerms').mockImplementation(() => {});

    // 2. Open the modal (renders UI)
    modal.open();
    const overlay = document.querySelector('.modal-overlay');

    // 3. Find Reload Button
    const reloadBtn = overlay.querySelector('.btn-refresh');
    expect(reloadBtn).not.toBeNull();
    expect(reloadBtn.title).toBe('Recarregar Cursos');

    // 4. Click it
    reloadBtn.click();

    // 5. Assert loadTerms was called twice (once by open(), once by click)
    expect(loadTermsSpy).toHaveBeenCalledTimes(2);
  });
});
