import { BatchImportFlow } from '@features/courses/import/logic/BatchImportFlow.js';

describe('Integração: Fluxo de Importação em Lote', () => {
  let mockBatchModal;
  let mockLoginWaitModal;
  let flow;

  beforeEach(() => {
    // Arrange (Setup)
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
        update: jest.fn(), // Mock definido por teste
      },
      windows: {
        update: jest.fn().mockImplementation((id, info, cb) => {
          if (cb) cb({});
          return Promise.resolve({});
        }),
      },
    };
    global.chrome = chromeMock;
  });

  test('Deve abrir BatchImportModal diretamente se a aba do curso no AVA for encontrada', async () => {
    // Arrange
    // Override update to return COMPLETE (No nav needed)
    // @ts-ignore
    chrome.tabs.update.mockImplementation((id, info, cb) => {
      if (cb)
        cb({
          id: 123,
          status: 'complete',
          url: 'https://ava.univesp.br/ultra/course',
          active: true,
        });
    });

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

    // Act
    await flow.start();

    // Assert
    // Expect: Switch to tab (Same URL -> Only active) + callback
    expect(chrome.tabs.update).toHaveBeenCalledWith(123, { active: true }, expect.any(Function));
    // Expect: Open BatchModal
    expect(mockBatchModal.open).toHaveBeenCalledWith(123);
    // Expect: NOT Open LoginWait
    expect(mockLoginWaitModal.open).not.toHaveBeenCalled();
  });

  test('Deve abrir LoginWaitModal se a aba do AVA for encontrada mas NÃO estiver na página de cursos', async () => {
    // Arrange
    // Override update to return LOADING (Nav started)
    // @ts-ignore
    chrome.tabs.update.mockImplementation((id, info, cb) => {
      if (cb)
        cb({ id: 123, status: 'loading', url: 'https://ava.univesp.br/ultra/course', ...info });
    });

    // @ts-ignore
    chrome.tabs.query = jest.fn((q, cb) => {
      /** @type {any[]} */
      const result = [{ id: 123, url: 'https://ava.univesp.br/login', active: false }];
      // @ts-ignore
      if (cb) cb(result);
      return Promise.resolve(result);
    });

    // Act
    await flow.start();

    // Assert
    // Expect: Switch to tab AND Update URL (Login -> Course) + callback
    expect(chrome.tabs.update).toHaveBeenCalledWith(
      123,
      { active: true, url: 'https://ava.univesp.br/ultra/course' },
      expect.any(Function)
    );
    // Expect: Open LoginWaitModal
    expect(mockLoginWaitModal.open).toHaveBeenCalled();
    // Expect: NOT Open BatchModal
    expect(mockBatchModal.open).not.toHaveBeenCalled();
  });

  test('Deve criar nova aba e abrir LoginWaitModal se nenhuma aba do AVA for encontrada', async () => {
    // Arrange
    // @ts-ignore
    chrome.tabs.query = jest.fn((q, cb) => {
      /** @type {any[]} */
      const result = [];
      // @ts-ignore
      if (cb) cb(result);
      return Promise.resolve(result);
    });

    // Act
    await flow.start();

    // Assert
    // Expect: Create Tab
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://ava.univesp.br/ultra/course' }),
      expect.any(Function)
    );

    // Expect: Open LoginWaitModal (because new tab is assumed not ready/login)
    expect(mockLoginWaitModal.open).toHaveBeenCalled();
  });
});
