// @ts-nocheck
/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { WeekContentScraper } from '../WeekContentScraper.js';

// Mock Chrome API
global.chrome = /** @type {any} */ ({
  tabs: {
    get: jest.fn(),
    query: jest.fn(),
    update: jest.fn(),
    onUpdated: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
  scripting: {
    executeScript: jest.fn(),
  },
  runtime: {
    lastError: null,
  },
});

// Mock Logger to avoid clutter
jest.mock('../../../../shared/utils/Logger.js', () => ({
  Logger: {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('WeekContentScraper', () => {
  let htmlFixture;

  beforeAll(() => {
    const fixturePath = path.resolve(__dirname, 'fixtures/week_content.html');
    htmlFixture = fs.readFileSync(fixturePath, 'utf8');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Parser Logic (extractItemsFromDOM)', () => {
    it('deve extrair itens corretamente de uma fixture HTML completa', () => {
      // Arrange
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlFixture, 'text/html');

      // Act
      const items = WeekContentScraper.extractItemsFromDOM(doc);

      // Assert
      expect(items).toHaveLength(3);

      // Checks kept from previous...
      const video = items.find((i) => i.contentId === 'video_123');
      expect(video.name).toBe('Aula 1: Introdução');

      const quiz = items.find((i) => i.contentId === 'quiz_456');
      expect(quiz.name).toBe('Avaliação Semana 1');
    });

    it('deve retornar lista vazia se não encontrar itens compatíveis', () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString('<ul><li>Nada aqui</li></ul>', 'text/html');
      const items = WeekContentScraper.extractItemsFromDOM(doc);
      expect(items).toEqual([]);
    });

    it('deve lidar com erros de parsing graciosamente', () => {
      const result = WeekContentScraper.extractItemsFromDOM(null);
      expect(result).toEqual([]);
    });
  });

  describe('Orchestration (scrapeWeekContent)', () => {
    const mockWeekUrl =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_123_1&content_id=_456_1';

    it('deve falhar se Chrome API não estiver disponível', async () => {
      const originalChrome = global.chrome;
      delete global.chrome;
      await expect(WeekContentScraper.scrapeWeekContent(mockWeekUrl)).rejects.toThrow(
        'Chrome APIs not available'
      );
      global.chrome = originalChrome;
    });

    it('deve usar ID de aba explícito se fornecido', async () => {
      chrome.tabs.get.mockResolvedValue({ id: 999, url: mockWeekUrl });
      chrome.scripting.executeScript.mockResolvedValue([{ result: htmlFixture }]);

      const items = await WeekContentScraper.scrapeWeekContent(mockWeekUrl, 999);

      expect(chrome.tabs.get).toHaveBeenCalledWith(999);
      expect(items).toHaveLength(3);
    });

    it('deve descobrir aba automaticamente se ID não fornecido', async () => {
      // Mock tabs.query to return a match
      const matchTab = { id: 888, url: mockWeekUrl };
      chrome.tabs.query.mockResolvedValue([matchTab]);
      chrome.scripting.executeScript.mockResolvedValue([{ result: htmlFixture }]);

      const items = await WeekContentScraper.scrapeWeekContent(mockWeekUrl);

      expect(chrome.tabs.query).toHaveBeenCalledWith({ url: '*://ava.univesp.br/*' });
      expect(items).toHaveLength(3);
    });

    it('deve navegar para aba do curso se match exato da semana não for encontrado', async () => {
      // Mock tabs.query to return course match but not week match
      const courseTab = { id: 777, url: 'https://ava.univesp.br/course_id=_123_1/other' };
      chrome.tabs.query.mockResolvedValue([courseTab]);

      // Mock update
      chrome.tabs.update.mockResolvedValue({});

      // Mock waitForTabLoad logic (listener calls back immediately)
      // WeekContentScraper.waitForTabLoad is async.
      // We need to verify update is called.
      // We also need to mock validateTabUrl internal check basically by mocking tabs.get again used by validate

      // 1. query returns courseTab
      // 2. update called
      // 3. waitForTabLoad -> mocked or stubbed? Uses onUpdated. we need to simulate listeners.

      // Let's rely on standard mocks.
      let listenerCallback;
      chrome.tabs.onUpdated.addListener.mockImplementation((fn) => (listenerCallback = fn));

      // Start promise but don't await yet
      const scrapePromise = WeekContentScraper.scrapeWeekContent(mockWeekUrl);

      // Trigger listener to simulate load complete
      // Need to wait slightly for addListener to be called?
      await new Promise((r) => setTimeout(r, 10));
      if (listenerCallback) {
        listenerCallback(777, { status: 'complete' });
      }

      // Mock validateTabUrl -> tabs.get(777)
      chrome.tabs.get.mockResolvedValue({ id: 777, url: mockWeekUrl }); // Now it matches!

      chrome.scripting.executeScript.mockResolvedValue([{ result: htmlFixture }]);

      const items = await scrapePromise;

      expect(chrome.tabs.update).toHaveBeenCalledWith(777, { url: mockWeekUrl, active: true });
      expect(items).toHaveLength(3);
    });

    it('deve lançar erro se nenhuma aba AVA for encontrada', async () => {
      chrome.tabs.query.mockResolvedValue([]); // No AVA tabs
      await expect(WeekContentScraper.scrapeWeekContent(mockWeekUrl)).rejects.toThrow(
        'Nenhuma aba do AVA encontrada'
      );
    });

    it('deve tentar retry se script retornar null (carga lenta)', async () => {
      chrome.tabs.get.mockResolvedValue({ id: 999, url: mockWeekUrl });

      // First call null, Second call fixture
      chrome.scripting.executeScript
        .mockResolvedValueOnce([{ result: null }])
        .mockResolvedValueOnce([{ result: htmlFixture }]);

      const items = await WeekContentScraper.scrapeWeekContent(mockWeekUrl, 999);
      expect(chrome.scripting.executeScript).toHaveBeenCalledTimes(2);
      expect(items).toHaveLength(3);
    });
  });
});
