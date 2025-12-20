import { Tabs } from '../Tabs.js';

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

    Tabs.openOrSwitchTo(targetUrl);

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

    Tabs.openOrSwitchTo(targetUrl);

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

    Tabs.openOrSwitchTo(targetUrl);

    expect(chrome.tabs.create).toHaveBeenCalledWith({ url: targetUrl });
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

    Tabs.openOrSwitchTo(targetUrl);

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

    Tabs.openOrSwitchTo(targetUrl);

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

    Tabs.openOrSwitchTo(targetUrl);

    expect(chrome.tabs.update).toHaveBeenCalledWith(401, { active: true });
    expect(chrome.windows.update).toHaveBeenCalledWith(555, { focused: true });
  });

  test('Deve criar nova aba quando query retornar array vazio', () => {
    const targetUrl = 'https://newsite.com';

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback([]);
    });

    Tabs.openOrSwitchTo(targetUrl);

    expect(chrome.tabs.create).toHaveBeenCalledWith({ url: targetUrl });
    expect(chrome.tabs.update).not.toHaveBeenCalled();
  });

  test('Deve priorizar match exato sobre startsWith quando ambos existem', () => {
    const targetUrl = 'https://site.com/app';

    // Ordem: Aba com sub-rota vem PRIMEIRO na lista.
    // Se a lógica não priorizar, pegaria a primeira (sub-rota) em vez da exata.
    const mockTabs = [
      { id: 901, url: 'https://site.com/app/deep', windowId: 111 },
      { id: 902, url: 'https://site.com/app', windowId: 111 }, // EXATO
    ];

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback(mockTabs);
    });

    Tabs.openOrSwitchTo(targetUrl);

    // Deve escolher o id 902 (Exato) e não o 901
    expect(chrome.tabs.update).toHaveBeenCalledWith(902, { active: true });
  });

  test('Deve usar matchPattern opcional quando fornecido', () => {
    const targetUrl = 'https://sei.univesp.br/index.xhtml';
    const matchPattern = 'sei.univesp.br';

    // Cenário: Usuário já logado no SEI (controlador.php), link da home aponta para index.xhtml
    // Sem o pattern, isso falharia pois index.xhtml != controlador.php e não é prefixo
    const mockTabs = [
      { id: 701, url: 'https://sei.univesp.br/sei/controlador.php?acao=x', windowId: 444 },
    ];

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback(mockTabs);
    });

    Tabs.openOrSwitchTo(targetUrl, matchPattern);

    expect(chrome.tabs.update).toHaveBeenCalledWith(701, { active: true });
  });
});
