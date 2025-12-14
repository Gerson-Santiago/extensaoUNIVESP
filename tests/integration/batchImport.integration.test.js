import { BatchImportModal } from '../../sidepanel/components/Modals/BatchImportModal.js';

describe('Integration: Batch Import Flow', () => {
    const mockSuccess = jest.fn();

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Mock Storage
        /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => callback({ savedCourses: [] }));
        /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((items, callback) => callback());

        // Mock Tabs
        /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((query, callback) => {
            callback([{ id: 999, url: 'https://ava.univesp.br/ultra/course', active: true }]);
        });

        // Mock Scripting
        chrome.scripting = /** @type {any} */ ({
            executeScript: jest.fn()
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should scrape multiple courses and save them', async () => {
        // 1. Setup Mock Terms Result (First Step)
        const mockTermsResult = {
            success: true,
            terms: [
                {
                    name: '2025/1 - 1º Bimestre',
                    courses: [
                        { name: 'Curso Batch 1', url: 'https://ava.univesp.br/course1', courseId: 'c1' },
                        { name: 'Curso Batch 2', url: 'https://ava.univesp.br/course2', courseId: 'c2' }
                    ]
                }
            ],
            message: ''
        };

        // 2. Setup Mock Deep Scrape Result (Second Step)
        const mockDeepScrapeResult = [
            { name: 'Curso Batch 1', url: 'https://ava.univesp.br/course1_final', weeks: [] },
            { name: 'Curso Batch 2', url: 'https://ava.univesp.br/course2_final', weeks: [] }
        ];

        // Mock ExecuteScript to return Terms first, then Deep Scrape result
        /** @type {jest.Mock} */ (chrome.scripting.executeScript)
            .mockResolvedValueOnce([{ result: mockTermsResult }]) // 1st call: scrapeAvailableTerms
            .mockResolvedValueOnce([{ result: mockDeepScrapeResult }]); // 2nd call: processSelectedCourses

        // 3. Open Modal
        const modal = new BatchImportModal(mockSuccess);
        modal.open();

        // Wait for autoLoadTerms (microtasks)
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        // 4. Verify Terms Loaded and UI Updated
        const termsList = document.getElementById('terms-list');
        expect(termsList.innerHTML).toContain('2025/1 - 1º Bimestre');
        expect(termsList.innerHTML).toContain('2025/1 - 1º Bimestre');

        const btnRun = document.getElementById('btnRunBatch');
        expect(btnRun.disabled).toBe(false);

        // 5. Trigger Import
        btnRun.click();

        // 6. Wait for Deep Scrape (microtasks)
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        // 7. Verify Script Execution
        // Call 1: scrapeAvailableTerms (no args)
        // Call 2: processSelectedCourses (args: [courses])
        expect(chrome.scripting.executeScript).toHaveBeenCalledTimes(2);

        // Check 2nd call args
        const secondCall = /** @type {jest.Mock} */ (chrome.scripting.executeScript).mock.calls[1][0];
        expect(secondCall.args[0]).toHaveLength(2); // 2 courses to scrape

        // 8. Verify Storage Save
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        const setCall = /** @type {jest.Mock} */ (chrome.storage.sync.set).mock.calls[0][0];
        expect(setCall.savedCourses).toHaveLength(2);

        // 9. Verify Success Callback
        jest.runAllTimers();
        expect(mockSuccess).toHaveBeenCalled();

        expect(document.querySelector('.modal-overlay')).toBeNull();
    });

    test('should handle incorrect page', async () => {
        /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((query, callback) => {
        // Wrong URL
        callback([{ id: 999, url: 'https://google.com', active: true }]);
    });

        const modal = new BatchImportModal(mockSuccess);
        modal.open(); // Triggers autoLoadTerms immediately

        await Promise.resolve(); // microtasks

        // Should try to update tab to correct URL
        expect(chrome.tabs.update).toHaveBeenCalledWith(999, { url: 'https://ava.univesp.br/ultra/course' });

        const status = document.getElementById('batchStatus');
        expect(status.textContent).toContain('Redirecionando para Cursos');
    });
});
