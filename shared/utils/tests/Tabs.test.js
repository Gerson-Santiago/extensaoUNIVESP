import { Tabs } from '../Tabs.js';

// Note: global.chrome is already mocked in jest.setup.js which includes windows and tabs mocks.
// We just need to reset/mock specific implementations for our tests.

describe('Tabs.openOrSwitchTo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    /** @type {any} */ (chrome.tabs.create).mockImplementation((_, cb) => cb && cb({ id: 999 }));
    /** @type {any} */ (chrome.tabs.update).mockImplementation(
      (_, __, cb) => cb && cb({ id: 999 })
    );
    /** @type {any} */ (chrome.windows.update).mockImplementation((_, __, cb) => cb && cb());
  });

  describe('Regressão de Bug: Botão de Abrir Matéria (HomeView)', () => {
    const COURSE_DASHBOARD_URL = 'https://ava.univesp.br/ultra/course';
    const MATCH_PATTERN = 'ultra/course'; // O novo padrão fixo
    const WEEK_CONTENT_URL =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_123_1&content_id=_456_1';

    test('NÃO deve corresponder a uma aba de Semana ao procurar pelo Dashboard do Curso com padrão específico', async () => {
      // Preparar (Arrange)
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: WEEK_CONTENT_URL, windowId: 999 }]);
      });

      // Agir (Act)
      await Tabs.openOrSwitchTo(COURSE_DASHBOARD_URL, MATCH_PATTERN);

      // Verificar (Assert)
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: COURSE_DASHBOARD_URL }),
        expect.anything()
      );
      expect(chrome.tabs.update).not.toHaveBeenCalled();
    });

    test('deve corresponder corretamente a uma aba existente do Dashboard do Curso', async () => {
      // Preparar (Arrange)
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback)
          callback([
            { id: 101, url: WEEK_CONTENT_URL, windowId: 999 },
            { id: 202, url: COURSE_DASHBOARD_URL, windowId: 999 },
          ]);
      });

      // Agir (Act)
      await Tabs.openOrSwitchTo(COURSE_DASHBOARD_URL, MATCH_PATTERN);

      // Verificar (Assert)
      expect(chrome.tabs.update).toHaveBeenCalledWith(
        202, // ID da aba do Dashboard
        expect.objectContaining({ active: true }),
        expect.anything()
      );
      expect(chrome.tabs.create).not.toHaveBeenCalled();
    });
  });

  describe('Regressão de Bug: Navegação Entre Matérias (Lógica Tabs.js)', () => {
    const WEEK_A_URL =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_AAA_1&content_id=_111_1';
    const WEEK_B_URL =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_BBB_1&content_id=_222_1';

    test('NÃO deve reutilizar aba da Matéria A ao abrir a Matéria B (Check de Segurança)', async () => {
      // Preparar (Arrange)
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: WEEK_A_URL, windowId: 999 }]);
      });

      // Agir (Act): Tenta abrir a Semana B
      await Tabs.openOrSwitchTo(WEEK_B_URL);

      // Verificar (Assert)
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: WEEK_B_URL }),
        expect.anything()
      );
      expect(chrome.tabs.update).not.toHaveBeenCalled();
    });

    test('deve abrir NOVA aba para o mesmo curso mas conteúdo diferente', async () => {
      // Preparar (Arrange)
      const WEEK_A_PART2_URL =
        'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_AAA_1&content_id=_333_1';

      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: WEEK_A_URL, windowId: 999 }]);
      });

      // Agir (Act)
      await Tabs.openOrSwitchTo(WEEK_A_PART2_URL);

      // Verificar (Assert)
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: WEEK_A_PART2_URL }),
        expect.anything()
      );
      expect(chrome.tabs.update).not.toHaveBeenCalled();
    });
  });

  describe('Verificação de Checklist Detalhada', () => {
    // Constantes compartilhadas para estes testes
    const COURSE_X_ID = '_123_1';
    const COURSE_X_WEEK_1_URL = `https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=${COURSE_X_ID}&content_id=_111_1`;
    const COURSE_X_WEEK_2_URL = `https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=${COURSE_X_ID}&content_id=_222_1`;

    test('C2. Prevenção de Loop: NÃO deve recarregar se a URL for idêntica (apenas focar)', async () => {
      // Preparar (Arrange)
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: COURSE_X_WEEK_1_URL, windowId: 999 }]);
      });

      // Agir (Act): Ir para a mesma URL novamente
      await Tabs.openOrSwitchTo(COURSE_X_WEEK_1_URL);

      // Verificar (Assert): Update chamado APENAS com active:true, invalidando reload de URL
      expect(chrome.tabs.update).toHaveBeenCalledWith(
        101,
        expect.not.objectContaining({ url: COURSE_X_WEEK_1_URL }), // NÃO deve conter URL
        expect.anything()
      );
      expect(chrome.tabs.update).toHaveBeenCalledWith(
        101,
        expect.objectContaining({ active: true }),
        expect.anything()
      );
    });

    test('B1. Resiliência: Deve criar NOVA aba se a aba do AVA foi fechada manualmente (ID não encontrado)', async () => {
      // Preparar (Arrange): Mock do query retornando vazio (aba fechada pelo usuário)
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([]);
      });

      // Agir (Act)
      await Tabs.openOrSwitchTo(COURSE_X_WEEK_1_URL);

      // Verificar (Assert)
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: COURSE_X_WEEK_1_URL }),
        expect.anything()
      );
    });

    test('B2. Entre-Semanas: Deve abrir NOVA aba ao navegar Semana 1 -> Semana 2', async () => {
      // Preparar (Arrange): Browser tem a Semana 1 aberta
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: COURSE_X_WEEK_1_URL, windowId: 999 }]);
      });

      // Agir (Act): Usuário clica na Semana 2 na extensão
      await Tabs.openOrSwitchTo(COURSE_X_WEEK_2_URL);

      // Verificar (Assert): Criar NOVA aba para Semana 2 (não reutilizar Semana 1)
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: COURSE_X_WEEK_2_URL }),
        expect.anything()
      );
      expect(chrome.tabs.update).not.toHaveBeenCalled();
    });

    test('A2. Deep Link: Deve criar nova aba quando o hash muda (conteúdo diferente)', async () => {
      const URL_NO_HASH = COURSE_X_WEEK_1_URL;
      const URL_WITH_HASH = COURSE_X_WEEK_1_URL + '#video-123';

      // Preparar (Arrange): Browser tem a página aberta sem hash
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: URL_NO_HASH, windowId: 999 }]);
      });

      // Agir (Act): Clicar em um deep link
      await Tabs.openOrSwitchTo(URL_WITH_HASH);

      // Verificar (Assert): Criar nova aba (URLs não combinam exatamente)
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: URL_WITH_HASH }),
        expect.anything()
      );
    });
  });
});
