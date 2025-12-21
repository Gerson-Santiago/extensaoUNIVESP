import { BatchImportFlow } from '@features/courses/import/logic/BatchImportFlow.js';

describe('Integration: Batch Import Flow (Split Architecture)', () => {
  let mockBatchModal;
  let mockLoginWaitModal;
  let flow;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Modals
    mockBatchModal = { open: jest.fn() };
    mockLoginWaitModal = { open: jest.fn() };

    // Instantiate Flow with Mocks
    flow = new BatchImportFlow({
      batchImportModal: mockBatchModal,
      loginWaitModal: mockLoginWaitModal,
    });

    /** @type {any} */
    const chromeMock = {
      tabs: {
        query: jest.fn(),
        create: jest.fn().mockImplementation(({ url }, cb) => {
          const tab = { id: 888, url, active: true };
          if (cb) cb(tab);
          return Promise.resolve(tab);
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      windows: { update: jest.fn().mockResolvedValue({}) },
    };
    global.chrome = chromeMock;
  });

  test('Should open BatchImportModal directly if AVA course tab is found', async () => {
    // Setup: Existing Tab on Course Page
    // @ts-ignore
    chrome.tabs.query = jest.fn((q, cb) => {
      /** @type {any[]} */
      const result = [
        { id: 123, url: 'https://ava.univesp.br/ultra/course', active: false, windowId: 1 },
      ];
      // @ts-ignore
      if (cb) cb(result);
      return Promise.resolve(result);
    });

    await flow.start();

    // Expect: Switch to tab
    expect(chrome.tabs.update).toHaveBeenCalledWith(123, { active: true });
    // Expect: Open BatchModal
    expect(mockBatchModal.open).toHaveBeenCalledWith(123);
    // Expect: NOT Open LoginWait
    expect(mockLoginWaitModal.open).not.toHaveBeenCalled();
  });

  test('Should open LoginWaitModal if AVA tab is found but NOT on course page', async () => {
    // Setup: Existing Tab on Login Page
    // @ts-ignore
    chrome.tabs.query = jest.fn((q, cb) => {
      /** @type {any[]} */
      const result = [{ id: 123, url: 'https://ava.univesp.br/login', active: false }];
      // @ts-ignore
      if (cb) cb(result);
      return Promise.resolve(result);
    });

    await flow.start();

    // Expect: Switch to tab
    expect(chrome.tabs.update).toHaveBeenCalledWith(123, { active: true });
    // Expect: Open LoginWaitModal
    expect(mockLoginWaitModal.open).toHaveBeenCalled();
    // Expect: NOT Open BatchModal
    expect(mockBatchModal.open).not.toHaveBeenCalled();
  });

  test('Should create new tab and open LoginWaitModal if no AVA tab found', async () => {
    // Setup: No AVA tabs
    // @ts-ignore
    chrome.tabs.query = jest.fn((q, cb) => {
      /** @type {any[]} */
      const result = [];
      // @ts-ignore
      if (cb) cb(result);
      return Promise.resolve(result);
    });

    await flow.start();

    // Expect: Create Tab
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://ava.univesp.br/ultra/course' }),
      expect.any(Function)
    );

    // Expect: Open LoginWaitModal (because new tab is assumed not ready/login)
    expect(mockLoginWaitModal.open).toHaveBeenCalled();
  });
});
