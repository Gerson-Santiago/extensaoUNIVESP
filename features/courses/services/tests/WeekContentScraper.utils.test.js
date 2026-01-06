/**
 * @jest-environment jsdom
 */
import { WeekContentScraper } from '../../services/WeekContentScraper.js';

describe('WeekContentScraper', () => {
  beforeEach(() => {
    // Preparar (Arrange) - Limpar DOM
    document.body.innerHTML = '';
  });

  describe('extractItemsFromDOM', () => {
    it('deve extrair itens do DOM do AVA corretamente', () => {
      // Preparar (Arrange) - DOM Simulado com item de vídeo completo
      document.body.innerHTML = `
            <ul class="content">
                <li id="contentListItem:123" class="clearfix liItem read">
                    <div class="liItem-body">
                        <h3><a href="https://ava.univesp.br/mod/url/view.php?id=123">Videoaula 1 - Introdução</a></h3>
                    </div>
                    <div class="liItem-right">
                        <a href="#" class="button-5" title="Marcar como não revisto">
                            <img class="icon" src="/theme/image.php/univesp/core/123/i/completion-manual-y" />
                            Revisto
                        </a>
                    </div>
                    <img class="item_icon" src="https://ava.univesp.br/theme/image.php/univesp/url/1733226949/icon" alt="URL" />
                </li>
            </ul>
        `;

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({
        contentId: '123',
        name: 'Videoaula 1 - Introdução',
        url: 'https://ava.univesp.br/mod/url/view.php?id=123',
        type: 'url',
        status: 'DONE',
      });
    });

    it('deve identificar itens TODO (Marcar como Revista)', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
            <li id="contentListItem:456">
                <h3><a href="/quiz">Quiz Semanal</a></h3>
                <img class="item_icon" src="/icon/quiz" alt="Quiz" />
                <a class="button-5">
                    Marca Revista
                </a>
            </li>
        `;

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items[0].status).toBe('TODO');
      expect(items[0].type).toBe('quiz');
    });

    it('deve lidar com itens sem botão de status (ex: rótulos)', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
            <li id="contentListItem:789">
                <h3><a href="/label">Aviso Importante</a></h3>
                <img class="item_icon" src="/icon/label" alt="Label" />
                <!-- Sem button-5 -->
            </li>
        `;

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items[0].status).toBeUndefined();
    });

    it('deve detectar diferentes tipos de conteúdo baseados no ícone', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
            <li id="contentListItem:1">
                <h3><a href="/forum">Fórum de Dúvidas</a></h3>
                <img class="item_icon" src="/icon/forum" alt="Fórum" />
            </li>
            <li id="contentListItem:2">
                <h3><a href="/resource">PDF da Aula</a></h3>
                <img class="item_icon" src="/icon/pdf" alt="Arquivo" />
            </li>
        `;

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items[0].type).toBe('forum');
      expect(items[1].type).toBe('pdf');
    });

    it('deve ser robusto contra elementos faltantes', () => {
      // Preparar (Arrange) - Item incompleto
      document.body.innerHTML = `
            <li id="contentListItem:999">
                <!-- Falta H3 ou A -->
            </li>
        `;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items).toHaveLength(0);
      consoleSpy.mockRestore();
    });

    it('deve usar detectTypeFromUrl quando não houver ícone', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
            <li id="contentListItem:101">
                <h3><a href="https://ava.univesp.br/mod/quiz/view.php?id=101">Quiz da Semana</a></h3>
                <!-- Sem imagem de ícone -->
            </li>
        `;

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items[0].type).toBe('quiz');
      expect(items[0].name).toBe('Quiz da Semana');
    });

    it('deve detectar fórum pela URL', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
            <li id="contentListItem:102">
                <h3><a href="https://ava.univesp.br/mod/forum/view.php?id=102">Fórum de Discussão</a></h3>
            </li>
        `;

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items[0].type).toBe('forum');
    });

    it('deve detectar recurso/pdf pela URL', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
            <li id="contentListItem:103">
                <h3><a href="https://ava.univesp.br/mod/resource/view.php?id=103">Material Complementar</a></h3>
            </li>
        `;

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items[0].type).toBe('pdf');
    });

    it('deve usar "document" como padrão para URLs de tipo desconhecido', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
            <li id="contentListItem:104">
                <h3><a href="https://ava.univesp.br/mod/page/view.php?id=104">Página Web</a></h3>
            </li>
        `;

      // Agir (Act)
      const items = WeekContentScraper.extractItemsFromDOM();

      // Verificar (Assert)
      expect(items[0].type).toBe('document');
    });
  });

  describe('Lógica de Seleção de Aba e Navegação', () => {
    let mockChrome;

    beforeEach(() => {
      // Preparar (Arrange) - Mock da API chrome
      mockChrome = {
        tabs: {
          query: jest.fn(),
          get: jest.fn(),
          update: jest.fn(),
          onUpdated: {
            addListener: jest.fn(),
            removeListener: jest.fn(),
          },
        },
        scripting: {
          executeScript: jest.fn(),
        },
      };
      // @ts-ignore - Mock parcial do chrome para testes
      global.chrome = mockChrome;
    });

    afterEach(() => {
      delete global.chrome;
    });

    it('deve validar se a URL da aba corresponde aos IDs de curso e conteúdo esperados', async () => {
      // Preparar (Arrange)
      const tabId = 123;
      const expectedCourseId = '_12345_1';
      const expectedContentId = '_67890_1';

      mockChrome.tabs.get.mockResolvedValue({
        id: tabId,
        url: `https://ava.univesp.br/course/view.php?course_id=${expectedCourseId}&content_id=${expectedContentId}`,
      });

      // Agir (Act)
      const isValid = await WeekContentScraper.validateTabUrl(
        tabId,
        expectedCourseId,
        expectedContentId
      );

      // Verificar (Assert)
      expect(isValid).toBe(true);
      expect(mockChrome.tabs.get).toHaveBeenCalledWith(tabId);
    });

    it('deve retornar false quando a URL da aba não corresponder aos IDs', async () => {
      // Preparar (Arrange)
      const tabId = 123;
      mockChrome.tabs.get.mockResolvedValue({
        id: tabId,
        url: 'https://ava.univesp.br/course/view.php?course_id=_99999_1&content_id=_88888_1',
      });

      // Agir (Act)
      const isValid = await WeekContentScraper.validateTabUrl(tabId, '_12345_1', '_67890_1');

      // Verificar (Assert)
      expect(isValid).toBe(false);
    });

    it('deve extrair courseId e contentId com regex preciso', () => {
      // Preparar (Arrange)
      const url = 'https://ava.univesp.br/course/view.php?course_id=_12345_1&content_id=_67890_1';

      // Agir (Act)
      const courseMatch = url.match(/course_id=(_\d+_\d+)/);
      const contentMatch = url.match(/content_id=(_\d+_\d+)/);

      // Verificar (Assert)
      expect(courseMatch).not.toBeNull();
      expect(courseMatch[1]).toBe('_12345_1');
      expect(contentMatch).not.toBeNull();
      expect(contentMatch[1]).toBe('_67890_1');
    });
  });
});
