import { openOrSwitchToTab } from '../sidepanel/logic/tabs.js';

describe('Lógica - Troca de Abas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve alternar para aba correspondente ao course_id exatamente', () => {
    const targetUrl =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_12345_1&content_id=_67890_1';

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((query, callback) => {
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

  test('Deve usar startsWith se course_id não for encontrado', () => {
    const targetUrl = 'https://google.com/search?q=test';

    const mockTabs = [
      { id: 201, windowId: 888, url: 'https://google.com/search?q=test&page=2' }, // Starts with same base
    ];

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) =>
      callback(mockTabs)
    );

    openOrSwitchToTab(targetUrl);

    expect(chrome.tabs.update).toHaveBeenCalledWith(201, { active: true });
    expect(chrome.tabs.create).not.toHaveBeenCalled();
  });

  test('Deve criar nova aba se nenhuma correspondência for encontrada', () => {
    const targetUrl = 'https://example.com';

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((query, callback) => {
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

  test('Deve priorizar content_id exato quando múltiplas abas tiverem o mesmo course_id', () => {
    const targetUrl =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_12345_1&content_id=_EXACT_1';

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback([
        {
          id: 101,
          url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_12345_1&content_id=_OTHER_1',
          windowId: 888,
        },
        {
          id: 102,
          url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_12345_1&content_id=_EXACT_1',
          windowId: 999,
        },
      ]);
    });

    openOrSwitchToTab(targetUrl);

    expect(chrome.tabs.update).toHaveBeenCalledWith(102, { active: true });
    expect(chrome.windows.update).toHaveBeenCalledWith(999, { focused: true });
  });

  test('Deve lidar com URL sem course_id ou content_id usando startsWith', () => {
    const targetUrl = 'https://ava.univesp.br/ultra/courses';

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback([
        {
          id: 301,
          url: 'https://ava.univesp.br/ultra/courses/list',
          windowId: 777,
        },
      ]);
    });

    openOrSwitchToTab(targetUrl);

    expect(chrome.tabs.update).toHaveBeenCalledWith(301, { active: true });
  });

  test('Deve focar na janela ao alternar abas', () => {
    const targetUrl = 'https://example.com';

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback([
        {
          id: 401,
          url: 'https://example.com',
          windowId: 555,
        },
      ]);
    });

    openOrSwitchToTab(targetUrl);

    expect(chrome.tabs.update).toHaveBeenCalledWith(401, { active: true });
    expect(chrome.windows.update).toHaveBeenCalledWith(555, { focused: true });
  });

  test('Deve criar nova aba quando query retornar array vazio', () => {
    const targetUrl = 'https://newsite.com';

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback([]);
    });

    openOrSwitchToTab(targetUrl);

    expect(chrome.tabs.create).toHaveBeenCalledWith({ url: targetUrl }, expect.any(Function));
    expect(chrome.tabs.update).not.toHaveBeenCalled();
  });
});
