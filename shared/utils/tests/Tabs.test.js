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

    // Should update tab 102 with correct URL and active state
    expect(chrome.tabs.update).toHaveBeenCalledWith(102, { url: targetUrl, active: true });
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

    expect(chrome.tabs.update).toHaveBeenCalledWith(201, { url: targetUrl, active: true });
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

    expect(chrome.tabs.update).toHaveBeenCalledWith(102, { url: targetUrl, active: true });
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

    expect(chrome.tabs.update).toHaveBeenCalledWith(301, { url: targetUrl, active: true });
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

    expect(chrome.tabs.update).toHaveBeenCalledWith(401, { url: targetUrl, active: true });
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
    expect(chrome.tabs.update).toHaveBeenCalledWith(902, { url: targetUrl, active: true });
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

    expect(chrome.tabs.update).toHaveBeenCalledWith(701, { url: targetUrl, active: true });
  });

  // --- TESTES DE REPRODUÇÃO DE BUGS (EPIC 4) ---

  test('BUG REPRO: Não deve reusar aba se course_id for diferente (Matéria A vs Matéria B)', () => {
    const targetUrl =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_MAT_1&content_id=_123';

    const mockTabs = [
      {
        id: 999,
        url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_ING_1&content_id=_456',
        windowId: 111,
      },
    ];

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback(mockTabs);
    });

    Tabs.openOrSwitchTo(targetUrl);

    // Deve criar NOVA aba
    expect(chrome.tabs.create).toHaveBeenCalledWith({ url: targetUrl });
    expect(chrome.tabs.update).not.toHaveBeenCalled();
  });

  test('BUG REPRO: Botão Abrir Matéria deve funcionar mesmo se aba de semana estiver aberta', () => {
    const courseUrl =
      'https://ava.univesp.br/webapps/blackboard/execute/launcher?type=Course&id=_ING_1';

    const mockTabs = [
      {
        id: 888,
        url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_ING_1&content_id=_WEEK3',
        windowId: 111,
      },
    ];

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback(mockTabs);
    });

    Tabs.openOrSwitchTo(courseUrl);

    // Se a lógica permitir reuso (IDs batem), deve atualizar URL
    // Se a lógica não permitir reuso (prefixo não bate), deve criar nova
    const callsCreate = /** @type {jest.Mock} */ (chrome.tabs.create).mock.calls.length > 0;
    const callsUpdateWithUrl = /** @type {jest.Mock} */ (chrome.tabs.update).mock.calls.some(
      (call) => call[1].url === courseUrl
    );

    expect(callsCreate || callsUpdateWithUrl).toBe(true);
  });

  test('BUG REPRO 3: Deve lidar com course_id que NÃO começa com underscore', () => {
    // Agora que a regex suporta IDs variados, deve funcionar corretamente (reusando se ID bater, ou criando nova se não bater)
    // Se o ID for 12345 e a aba tiver 99999 -> IDs diferentes -> Nova Aba.

    const targetUrl =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=123456&content_id=_123';

    const mockTabs = [
      {
        id: 777,
        url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=99999&content_id=_456',
        windowId: 111,
      },
    ];

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((_, callback) => {
      callback(mockTabs);
    });

    Tabs.openOrSwitchTo(targetUrl);

    // Com a nova regex e proteção de segurança, deve criar nova aba
    expect(chrome.tabs.create).toHaveBeenCalledWith({ url: targetUrl });
    expect(chrome.tabs.update).not.toHaveBeenCalled();
  });
});
