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
    it('deve lançar erro se tabId não for fornecido', async () => {
      await expect(QuickLinksScraper.scrapeFromQuickLinks('https://any.url', null)).rejects.toThrow(
        'TabId é obrigatório'
      );
    });

    it('deve executar o script na aba fornecida', async () => {
      // Preparar (Arrange)
      const tabId = 123;
      const mockResult = [
        { name: 'Videoaula 1', id: '7722825', type: 'document' },
        { name: 'Quiz 1', id: '7722826', type: 'document' },
      ];

      mockChrome.scripting.executeScript.mockResolvedValue([
        {
          result: mockResult,
        },
      ]);

      // Agir (Act)
      const items = await QuickLinksScraper.scrapeFromQuickLinks('https://any.url', tabId);

      // Verificar (Assert)
      expect(mockChrome.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: tabId },
          func: expect.any(Function),
        })
      );
      expect(items).toEqual(mockResult);
    });

    it('deve retornar array vazio se o script retornar null/undefined', async () => {
      // Preparar (Arrange)
      const tabId = 456;
      mockChrome.scripting.executeScript.mockResolvedValue([
        { result: null }, // Simula retorno vazio do script
      ]);

      // Agir (Act)
      const items = await QuickLinksScraper.scrapeFromQuickLinks('https://any.url', tabId);

      // Verificar (Assert)
      expect(items).toEqual([]);
    });

    it('deve retornar array vazio se executeScript retornar array vazio (nenhum frame)', async () => {
      // Preparar (Arrange)
      const tabId = 789;
      mockChrome.scripting.executeScript.mockResolvedValue([]); // Simula falha catastrófica ou frame vazio

      // Agir (Act)
      const items = await QuickLinksScraper.scrapeFromQuickLinks('https://any.url', tabId);

      // Verificar (Assert)
      expect(items).toEqual([]);
    });
  });
});
