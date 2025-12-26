/**
 * @file scraping.test.js
 * @description Testes para scraping completo usando modal "Links Rápidos"
 */

import { QuickLinksScraper } from '../../../services/QuickLinksScraper.js';

describe('QuickLinksScraper - Scraping', () => {
  let mockChrome;

  beforeEach(() => {
    // Mock global chrome API
    mockChrome = {
      tabs: {
        query: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
      },
      scripting: {
        executeScript: jest.fn(),
      },
    };
    // @ts-ignore - Mock parcial para testes
    global.chrome = mockChrome;
  });

  afterEach(() => {
    delete global.chrome;
  });

  describe('scrapeFromQuickLinks', () => {
    it('should find AVA tab and execute scraping', async () => {
      const mockTab = {
        id: 123,
        url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1',
      };

      mockChrome.tabs.query.mockResolvedValue([mockTab]);
      mockChrome.scripting.executeScript.mockResolvedValue([
        {
          result: [
            { name: 'Videoaula 1', id: '7722825', type: 'document' },
            { name: 'Quiz 1', id: '7722826', type: 'document' },
          ],
        },
      ]);

      const items = await QuickLinksScraper.scrapeFromQuickLinks(
        'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1'
      );

      expect(mockChrome.tabs.query).toHaveBeenCalledWith({
        active: true,
        currentWindow: true,
      });
      expect(items).toHaveLength(2);
      expect(items[0].name).toBe('Videoaula 1');
    });

    it('should fallback to background tab query if active tab is not AVA', async () => {
      const mockActiveTab = { id: 999, url: 'https://google.com' };
      const mockAvaTab = { id: 123, url: 'https://ava.univesp.br/webapps/...' };

      // 1ª chamada (active tab) retorna Google
      mockChrome.tabs.query.mockResolvedValueOnce([mockActiveTab]);
      // 2ª chamada (url pattern) retorna AVA
      mockChrome.tabs.query.mockResolvedValueOnce([mockAvaTab]);

      mockChrome.scripting.executeScript.mockResolvedValue([
        { result: [{ name: 'Fallback Item', id: '1', type: 'document' }] },
      ]);

      const items = await QuickLinksScraper.scrapeFromQuickLinks('https://ava.univesp.br/...');

      // Deve ter tentado a ativa primeiro
      expect(mockChrome.tabs.query).toHaveBeenNthCalledWith(1, {
        active: true,
        currentWindow: true,
      });
      // E depois o fallback
      expect(mockChrome.tabs.query).toHaveBeenNthCalledWith(2, {
        url: '*://ava.univesp.br/*',
      });

      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Fallback Item');
    });

    it('should throw error if no AVA tab found', async () => {
      mockChrome.tabs.query.mockResolvedValue([]);

      await expect(QuickLinksScraper.scrapeFromQuickLinks('https://example.com')).rejects.toThrow(
        'Nenhuma aba do AVA encontrada'
      );
    });

    it('should return empty array if modal returns no items', async () => {
      const mockTab = { id: 123, url: 'https://ava.univesp.br/' };
      mockChrome.tabs.query.mockResolvedValue([mockTab]);
      mockChrome.scripting.executeScript.mockResolvedValue([{ result: [] }]);

      const items = await QuickLinksScraper.scrapeFromQuickLinks('https://ava.univesp.br/');

      expect(items).toEqual([]);
    });
  });
});
