import { openOrSwitchToTab } from '../sidepanel/logic/tabs.js';

// Mock chrome global
global.chrome = {
  tabs: {
    query: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  windows: {
    update: jest.fn(),
  },
};

describe('Logic - Tabs Switching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should switch to tab matching course_id exactly', () => {
    const targetUrl =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_12345_1&content_id=_67890_1';

    chrome.tabs.query.mockImplementation((query, callback) => {
      callback([
        {
          id: 101,
          url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_99999_1&content_id=_11111_1',
          windowId: 888,
        },
        {
          id: 102,
          url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_12345_1&content_id=_67890_1',
          windowId: 999,
        },
      ]);
    });

    openOrSwitchToTab(targetUrl);

    // Should update tab 102 (possui AMBOS course_id E content_id)
    expect(chrome.tabs.update).toHaveBeenCalledWith(102, { active: true });
    expect(chrome.windows.update).toHaveBeenCalledWith(999, { focused: true });
    expect(chrome.tabs.create).not.toHaveBeenCalled();
  });

  test('Should fallback to startsWith if no course_id match found', () => {
    const targetUrl = 'https://google.com/search?q=test';

    const mockTabs = [
      { id: 201, windowId: 888, url: 'https://google.com/search?q=test&page=2' }, // Starts with same base
    ];

    chrome.tabs.query.mockImplementation((_, callback) => callback(mockTabs));

    openOrSwitchToTab(targetUrl);

    expect(chrome.tabs.update).toHaveBeenCalledWith(201, { active: true });
    expect(chrome.tabs.create).not.toHaveBeenCalled();
  });

  test('Should create new tab if no match found at all', () => {
    const targetUrl = 'https://example.com';

    chrome.tabs.query.mockImplementation((query, callback) => {
      callback([
        {
          id: 101,
          url: 'https://ava.univesp.br/other',
          windowId: 888,
        },
      ]);
    });

    openOrSwitchToTab(targetUrl);

    expect(chrome.tabs.create).toHaveBeenCalledWith({ url: targetUrl }, expect.any(Function));
    expect(chrome.tabs.update).not.toHaveBeenCalled();
  });
});
