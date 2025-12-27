/**
 * @file scraping.test.js
 * @description Testes para scraping completo usando modal "Links Rápidos"
 */

import { QuickLinksScraper } from '../../../services/QuickLinksScraper.js';

describe('QuickLinksScraper - Scraping (Coleta)', () => {
  let mockChrome;

  beforeEach(() => {
    // Preparar (Arrange) - Mock global chrome API
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
    it('deve encontrar a aba do AVA e executar a coleta (scraping)', async () => {
      // Preparar (Arrange)
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

      // Agir (Act)
      const items = await QuickLinksScraper.scrapeFromQuickLinks(
        'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1'
      );

      // Verificar (Assert)
      expect(mockChrome.tabs.query).toHaveBeenCalledWith({
        active: true,
        currentWindow: true,
      });
      expect(items).toHaveLength(2);
      expect(items[0].name).toBe('Videoaula 1');
    });

    it('deve recorrer (fallback) à busca de abas em segundo plano se a aba ativa não for do AVA', async () => {
      // Preparar (Arrange)
      const mockActiveTab = { id: 999, url: 'https://google.com' };
      const mockAvaTab = { id: 123, url: 'https://ava.univesp.br/webapps/...' };

      // 1ª chamada (active tab) retorna Google
      mockChrome.tabs.query.mockResolvedValueOnce([mockActiveTab]);
      // 2ª chamada (url pattern) retorna AVA
      mockChrome.tabs.query.mockResolvedValueOnce([mockAvaTab]);

      mockChrome.scripting.executeScript.mockResolvedValue([
        { result: [{ name: 'Fallback Item', id: '1', type: 'document' }] },
      ]);

      // Agir (Act)
      const items = await QuickLinksScraper.scrapeFromQuickLinks('https://ava.univesp.br/...');

      // Verificar (Assert)
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

    it('deve lançar erro se nenhuma aba do AVA for encontrada', async () => {
      // Preparar (Arrange)
      mockChrome.tabs.query.mockResolvedValue([]);

      // Agir & Verificar (Act & Assert)
      await expect(QuickLinksScraper.scrapeFromQuickLinks('https://example.com')).rejects.toThrow(
        'Nenhuma aba do AVA encontrada'
      );
    });

    it('deve retornar array vazio se o modal não retornar itens', async () => {
      // Preparar (Arrange)
      const mockTab = { id: 123, url: 'https://ava.univesp.br/' };
      mockChrome.tabs.query.mockResolvedValue([mockTab]);
      mockChrome.scripting.executeScript.mockResolvedValue([{ result: [] }]);

      // Agir (Act)
      const items = await QuickLinksScraper.scrapeFromQuickLinks('https://ava.univesp.br/');

      // Verificar (Assert)
      expect(items).toEqual([]);
    });
  });
});
