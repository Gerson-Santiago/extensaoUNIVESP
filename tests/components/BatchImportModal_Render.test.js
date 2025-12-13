
import { BatchImportModal } from '../../sidepanel/components/Modals/BatchImportModal.js';

// Mocks
jest.mock('../../sidepanel/logic/batchScraper.js', () => ({
    scrapeAvailableTerms: jest.fn(),
    processSelectedCourses: jest.fn(),
}));

jest.mock('../../sidepanel/logic/storage.js', () => ({
    addItemsBatch: jest.fn(),
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
        modal = new BatchImportModal(() => { });
    });

    test('Should sort terms descending (newest first) and render courses with checkboxes', () => {
        // Setup Data
        const mockTerms = [
            {
                name: '2024/1 - 1º Bimestre',
                courses: [{ name: 'Old Course', url: 'http://old', courseId: '1' }]
            },
            {
                name: '2025/2 - 4º Bimestre',
                courses: [
                    { name: 'Recent Course A', url: 'http://recA', courseId: '2' },
                    { name: 'Recent Course B', url: 'http://recB', courseId: '3' }
                ]
            },
            {
                name: '2025/1 - 1º Bimestre',
                courses: [{ name: 'Mid Course', url: 'http://mid', courseId: '4' }]
            }
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
