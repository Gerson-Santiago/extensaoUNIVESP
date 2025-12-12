import { BatchImportModal } from '../../sidepanel/components/Modals/BatchImportModal.js';

describe('Integration: Batch Import Flow', () => {
    let container;
    const mockSuccess = jest.fn();

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        container = document.getElementById('app');
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
        // 1. Setup Mock Batch Result
        const mockBatchResult = {
            success: true,
            courses: [
                { name: 'Curso Batch 1', url: 'https://ava.univesp.br/course1' },
                { name: 'Curso Batch 2', url: 'https://ava.univesp.br/course2' }
            ],
            message: 'Encontrados 2 cursos.'
        };

        // Note: scrapeCourseList returns results[0].result
        /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
            { result: mockBatchResult }
        ]);

        // 2. Open Modal
        const modal = new BatchImportModal(mockSuccess);
        modal.open();

        // Modal appends to body
        const modalEl = document.querySelector('.modal-overlay');
        expect(modalEl).toBeTruthy();
        expect(/** @type {HTMLElement} */(modalEl).style.display).not.toBe('none');

        const btnRun = document.getElementById('btnRunBatch');
        expect(btnRun).toBeTruthy();

        // 3. Trigger Import
        btnRun.click();

        // 4. Wait for Async
        await Promise.resolve(); // microtasks
        await Promise.resolve();

        // 5. Verify Script Execution
        expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
            target: { tabId: 999 },
            func: expect.any(Function),
            args: expect.any(Array)
        });

        // 6. Verify Storage Save
        // We mocked get -> returns [], so it should save 2 courses
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        const setCall = /** @type {jest.Mock} */ (chrome.storage.sync.set).mock.calls[0][0];
        expect(setCall.savedCourses).toHaveLength(2);
        expect(setCall.savedCourses[0].name).toBe('Curso Batch 1');
        expect(setCall.savedCourses[1].name).toBe('Curso Batch 2');

        // 7. Verify Success Callback (after timeout)
        jest.runAllTimers();
        expect(mockSuccess).toHaveBeenCalled();

        // Verify Modal Closed
        // Modal.close() usually removes element or hides it. 
        // Checking if it's gone or hidden would require checking Modal implementation details 
        // but typically it calls remove().
        expect(document.querySelector('.modal-overlay')).toBeNull();
    });

    test('should handle incorrect page', async () => {
        /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((query, callback) => {
        // Wrong URL
        callback([{ id: 999, url: 'https://google.com', active: true }]);
    });

        const modal = new BatchImportModal(mockSuccess);
        modal.open();

        const btnRun = document.getElementById('btnRunBatch');
        btnRun.click();

        await Promise.resolve(); // microtasks

        // Should try to update tab to correct URL
        expect(chrome.tabs.update).toHaveBeenCalledWith(999, { url: 'https://ava.univesp.br/ultra/course' });

        const status = document.getElementById('batchStatus');
        expect(status.textContent).toContain('Abrindo Cursos');
    });
});
