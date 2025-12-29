/**
 * @file WeekActivitiesService.regression.test.js
 * @description Teste de regressão para bug de sincronização de navegação
 *
 * BUG: Quando usuário clica em "Ver Atividades" de uma semana não aberta,
 * o sistema reutiliza aba de outra semana e faz scraping dos dados errados.
 *
 * SOLUÇÃO: WeekActivitiesService deve garantir que a aba correta está aberta
 * ANTES de fazer scraping.
 */

import { WeekActivitiesService } from '../../../services/WeekActivitiesService.js';
import { WeekContentScraper } from '../../../services/WeekContentScraper.js';
import { Tabs } from '../../../../../shared/utils/Tabs.js';

// Mock dependencies
jest.mock('../../../services/WeekContentScraper.js');
jest.mock('../../../../../shared/utils/Tabs.js');

describe('WeekActivitiesService - Regressão: Bug de Sincronização de Navegação', () => {
  const semana2Url =
    'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp' +
    '?course_id=_111_1&content_id=_222_1';
  const semana3Url =
    'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp' +
    '?course_id=_111_1&content_id=_333_1';

  const semana3 = {
    name: 'Semana 3',
    url: semana3Url,
    items: [],
  };

  const mockItemsSemana3 = [
    { name: 'Videoaula Semana 3', url: 'http://test.com/video3', type: 'video' },
    { name: 'Quiz Semana 3', url: 'http://test.com/quiz3', type: 'quiz' },
  ];

  beforeEach(() => {
    // Arrange (Setup comum)
    jest.clearAllMocks();
    semana3.items = [];
    delete semana3.method;

    // Mock scraper retorna dados da Semana 3
    /** @type {jest.Mock} */ (WeekContentScraper.scrapeWeekContent).mockResolvedValue(
      mockItemsSemana3
    );
  });

  describe('Cenário: Semana 2 aberta, usuário clica em Ver Atividades da Semana 3', () => {
    it('deve abrir/navegar para Semana 3 ANTES de fazer scraping', async () => {
      // Arrange
      // Simula que apenas Semana 2 está aberta
      /** @type {jest.Mock} */ (chrome.tabs.query).mockResolvedValue([
        {
          id: 1,
          url: semana2Url,
          active: true,
          status: 'complete',
        },
      ]);

      // Mock: Tabs.openOrSwitchTo abre/navega para Semana 3
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue({
        id: 2,
        url: semana3Url,
        status: 'complete',
        windowId: 1,
      });

      // Act
      // Usuário clica em "Ver Atividades" da Semana 3
      const result = await WeekActivitiesService.getActivities(semana3, 'DOM');

      // Assert
      // 1. Deve abrir aba correta ANTES do scraping
      expect(Tabs.openOrSwitchTo).toHaveBeenCalledWith(semana3Url);
      expect(Tabs.openOrSwitchTo).toHaveBeenCalled();

      // 2. Scraper deve ser chamado com URL da Semana 3
      expect(WeekContentScraper.scrapeWeekContent).toHaveBeenCalledWith(semana3Url, 2);

      // 3. Resultado deve conter dados da Semana 3
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockItemsSemana3);
      expect(semana3.items).toEqual(mockItemsSemana3);
      expect(semana3.method).toBe('DOM');
    });

    it('deve aguardar carregamento da aba se status for "loading"', async () => {
      // Arrange
      // Tabs.openOrSwitchTo retorna aba em carregamento
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue({
        id: 2,
        url: semana3Url,
        status: 'loading', // <-- Aba ainda carregando
        windowId: 1,
      });

      // Mock chrome.tabs.onUpdated para simular carregamento completo
      const mockAddListener = jest.fn((callback) => {
        // Simula que aba carregou após 100ms
        setTimeout(() => {
          callback(2, { status: 'complete' }, { id: 2 });
        }, 100);
      });
      const mockRemoveListener = jest.fn();

      chrome.tabs.onUpdated.addListener = mockAddListener;
      chrome.tabs.onUpdated.removeListener = mockRemoveListener;

      // Act
      await WeekActivitiesService.getActivities(semana3, 'DOM');

      // Assert
      expect(mockAddListener).toHaveBeenCalled();
      expect(mockRemoveListener).toHaveBeenCalled();
      expect(WeekContentScraper.scrapeWeekContent).toHaveBeenCalled();
    });

    it('deve lançar erro se falhar ao abrir aba', async () => {
      // Arrange
      // Tabs.openOrSwitchTo retorna null (falha)
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(null);

      // Suprimir console.error no teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      const result = await WeekActivitiesService.getActivities(semana3, 'DOM');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.message).toContain('Falha ao abrir aba da semana');

      // Não deve ter chamado scraper
      expect(WeekContentScraper.scrapeWeekContent).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('deve funcionar com método QuickLinks também', async () => {
      // Arrange
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue({
        id: 2,
        url: semana3Url,
        status: 'complete',
        windowId: 1,
      });

      // Mock chrome.scripting.executeScript para QuickLinksScraper
      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
        { result: mockItemsSemana3 },
      ]);

      // Act
      const result = await WeekActivitiesService.getActivities(semana3, 'QuickLinks');

      // Assert
      expect(Tabs.openOrSwitchTo).toHaveBeenCalledWith(semana3Url);
      expect(chrome.scripting.executeScript).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockItemsSemana3);
    });
  });

  describe('Cenário: Cache já existe (não deve reabrir aba)', () => {
    it('deve usar cache se items já existem e método é o mesmo (sem reabrir aba)', async () => {
      // Arrange
      // Semana 3 já tem cache
      semana3.items = mockItemsSemana3;
      semana3.method = 'DOM';

      // Act
      const result = await WeekActivitiesService.getActivities(semana3, 'DOM');

      // Assert
      // NÃO deve abrir aba nem fazer scraping
      expect(Tabs.openOrSwitchTo).not.toHaveBeenCalled();
      expect(WeekContentScraper.scrapeWeekContent).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toBe(semana3.items); // Mesma referência
    });
  });
});
