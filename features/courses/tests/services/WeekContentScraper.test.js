/**
 * @jest-environment jsdom
 */
import { WeekContentScraper } from '../../services/WeekContentScraper.js';

describe('WeekContentScraper', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should extract items from AVA DOM correctly', () => {
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

    const items = WeekContentScraper.extractItemsFromDOM();

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({
      name: 'Videoaula 1 - Introdução',
      url: 'https://ava.univesp.br/mod/url/view.php?id=123',
      type: 'url',
      status: 'DONE',
    });
  });

  it('should identify TODO items (Marca Revista)', () => {
    document.body.innerHTML = `
            <li id="contentListItem:456">
                <h3><a href="/quiz">Quiz Semanal</a></h3>
                <img class="item_icon" src="/icon/quiz" alt="Quiz" />
                <a class="button-5">
                    Marca Revista
                </a>
            </li>
        `;

    const items = WeekContentScraper.extractItemsFromDOM();
    expect(items[0].status).toBe('TODO');
    expect(items[0].type).toBe('quiz');
  });

  it('should handle items without status button (e.g. labels)', () => {
    document.body.innerHTML = `
            <li id="contentListItem:789">
                <h3><a href="/label">Aviso Importante</a></h3>
                <img class="item_icon" src="/icon/label" alt="Label" />
                <!-- No button-5 -->
            </li>
        `;

    const items = WeekContentScraper.extractItemsFromDOM();
    expect(items[0].status).toBeUndefined();
  });

  it('should detect different content types based on icon or url', () => {
    // Mocking only the type detection logic if needed, or full DOM
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

    const items = WeekContentScraper.extractItemsFromDOM();
    expect(items[0].type).toBe('forum');
    expect(items[1].type).toBe('pdf');
  });

  it('should be robust against missing elements', () => {
    document.body.innerHTML = `
            <li id="contentListItem:999">
                <!-- Missing H3 or A -->
            </li>
        `;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const items = WeekContentScraper.extractItemsFromDOM();

    expect(items).toHaveLength(0);
    consoleSpy.mockRestore();
  });

  it('should use detectTypeFromUrl when no icon is present', () => {
    document.body.innerHTML = `
            <li id="contentListItem:101">
                <h3><a href="https://ava.univesp.br/mod/quiz/view.php?id=101">Quiz da Semana</a></h3>
                <!-- No icon image -->
            </li>
        `;

    const items = WeekContentScraper.extractItemsFromDOM();
    expect(items[0].type).toBe('quiz');
    expect(items[0].name).toBe('Quiz da Semana');
  });

  it('should detect forum from URL', () => {
    document.body.innerHTML = `
            <li id="contentListItem:102">
                <h3><a href="https://ava.univesp.br/mod/forum/view.php?id=102">Fórum de Discussão</a></h3>
            </li>
        `;

    const items = WeekContentScraper.extractItemsFromDOM();
    expect(items[0].type).toBe('forum');
  });

  it('should detect resource/pdf from URL', () => {
    document.body.innerHTML = `
            <li id="contentListItem:103">
                <h3><a href="https://ava.univesp.br/mod/resource/view.php?id=103">Material Complementar</a></h3>
            </li>
        `;

    const items = WeekContentScraper.extractItemsFromDOM();
    expect(items[0].type).toBe('pdf');
  });

  it('should default to document for unknown URL types', () => {
    document.body.innerHTML = `
            <li id="contentListItem:104">
                <h3><a href="https://ava.univesp.br/mod/page/view.php?id=104">Página Web</a></h3>
            </li>
        `;

    const items = WeekContentScraper.extractItemsFromDOM();
    expect(items[0].type).toBe('document');
  });

  // ============================================================
  // NOVOS TESTES: Tab Selection & Navigation Logic
  // ============================================================

  describe('Tab Selection and Navigation', () => {
    let mockChrome;

    beforeEach(() => {
      // Mock global chrome API
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

    it('should validate tab URL matches expected course and content IDs', async () => {
      const tabId = 123;
      const expectedCourseId = '_12345_1';
      const expectedContentId = '_67890_1';

      mockChrome.tabs.get.mockResolvedValue({
        id: tabId,
        url: `https://ava.univesp.br/course/view.php?course_id=${expectedCourseId}&content_id=${expectedContentId}`,
      });

      const isValid = await WeekContentScraper.validateTabUrl(
        tabId,
        expectedCourseId,
        expectedContentId
      );

      expect(isValid).toBe(true);
      expect(mockChrome.tabs.get).toHaveBeenCalledWith(tabId);
    });

    it('should return false when tab URL does not match expected IDs', async () => {
      const tabId = 123;

      mockChrome.tabs.get.mockResolvedValue({
        id: tabId,
        url: 'https://ava.univesp.br/course/view.php?course_id=_99999_1&content_id=_88888_1',
      });

      const isValid = await WeekContentScraper.validateTabUrl(tabId, '_12345_1', '_67890_1');

      expect(isValid).toBe(false);
    });

    it('should extract courseId and contentId with precise regex', () => {
      const url = 'https://ava.univesp.br/course/view.php?course_id=_12345_1&content_id=_67890_1';

      const courseMatch = url.match(/course_id=(_\d+_\d+)/);
      const contentMatch = url.match(/content_id=(_\d+_\d+)/);

      expect(courseMatch).not.toBeNull();
      expect(courseMatch[1]).toBe('_12345_1');
      expect(contentMatch).not.toBeNull();
      expect(contentMatch[1]).toBe('_67890_1');
    });

    // Note: Teste de navegação completa removido pois requer mock complexo de chrome.tabs.onUpdated
    // Este comportamento é testado em testes de integração end-to-end
  });
});
