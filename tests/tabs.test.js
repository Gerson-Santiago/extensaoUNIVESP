import { openOrSwitchToTab } from '../sidepanel/logic/tabs.js';

// Mock chrome global
global.chrome = {
    tabs: {
        query: jest.fn(),
        update: jest.fn(),
        create: jest.fn()
    },
    windows: {
        update: jest.fn()
    }
};

describe('Logic - Tabs Switching', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should switch to tab matching course_id exactly', () => {
        const targetUrl = 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_12345_1&content_id=_98765_1';

        // Mock existing tabs - One has the same course_id but different page (e.g. forum)
        const mockTabs = [
            { id: 101, windowId: 999, url: 'https://ava.univesp.br/other' },
            { id: 102, windowId: 999, url: 'https://ava.univesp.br/webapps/discussionboard?course_id=_12345_1' } // Matches ID!
        ];

        chrome.tabs.query.mockImplementation((_, callback) => callback(mockTabs));

        openOrSwitchToTab(targetUrl);

        // Should update tab 102
        expect(chrome.tabs.update).toHaveBeenCalledWith(102, { active: true });
        expect(chrome.windows.update).toHaveBeenCalledWith(999, { focused: true });
        expect(chrome.tabs.create).not.toHaveBeenCalled();
    });

    test('Should fallback to startsWith if no course_id match found', () => {
        const targetUrl = 'https://google.com/search?q=test';

        const mockTabs = [
            { id: 201, windowId: 888, url: 'https://google.com/search?q=test&page=2' } // Starts with same base
        ];

        chrome.tabs.query.mockImplementation((_, callback) => callback(mockTabs));

        openOrSwitchToTab(targetUrl);

        expect(chrome.tabs.update).toHaveBeenCalledWith(201, { active: true });
        expect(chrome.tabs.create).not.toHaveBeenCalled();
    });

    test('Should create new tab if no match found at all', () => {
        const targetUrl = 'https://example.com';

        chrome.tabs.query.mockImplementation((_, callback) => callback([]));

        openOrSwitchToTab(targetUrl);

        expect(chrome.tabs.create).toHaveBeenCalledWith({ url: targetUrl });
        expect(chrome.tabs.update).not.toHaveBeenCalled();
    });
});
