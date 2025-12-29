import { WeekActivitiesService } from '../../../services/WeekActivitiesService.js';
import { WeekContentScraper } from '../../../services/WeekContentScraper.js';
import { QuickLinksScraper } from '../../../services/QuickLinksScraper.js';
import { Tabs } from '../../../../../shared/utils/Tabs.js';

// Mock both scrapers and Tabs
jest.mock('../../../services/WeekContentScraper.js');
jest.mock('../../../services/QuickLinksScraper.js');
jest.mock('../../../../../shared/utils/Tabs.js');
jest.mock('../../../repositories/ActivityRepository.js');

import { ActivityRepository } from '../../../repositories/ActivityRepository.js';

describe('WeekActivitiesService', () => {
  const mockWeek = {
    name: 'Semana 1',
    url: 'https://ava.univesp.br/web/123/week/456',
    items: [{ id: '1', title: 'Atividade 1' }],
    method: 'DOM',
    courseId: '123',
    contentId: '456',
  };

  const mockItems = [
    { title: 'Videoaula 1', status: 'DONE' },
    { title: 'Quiz', status: 'TODO' },
  ];

  beforeEach(() => {
    // Preparar (Arrange) - Mocks e reset de dados
    jest.clearAllMocks();
    mockWeek.items = [];
    delete mockWeek.method;

    /** @type {jest.Mock} */ (WeekContentScraper.scrapeWeekContent).mockResolvedValue(mockItems);
    /** @type {jest.Mock} */ (QuickLinksScraper.scrapeFromQuickLinks).mockResolvedValue(mockItems);

    /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue({
      id: 1,
      url: mockWeek.url,
      status: 'complete',
      windowId: 1,
    });

    /** @type {jest.Mock} */ (ActivityRepository.get).mockResolvedValue(null);
    /** @type {jest.Mock} */ (ActivityRepository.save).mockResolvedValue(true);
  });

  describe('getActivities', () => {
    it('deve buscar atividades usando WeekContentScraper quando método for DOM', async () => {
      // Agir (Act)
      const result = await WeekActivitiesService.getActivities(mockWeek, 'DOM');

      // Verificar (Assert)
      expect(WeekContentScraper.scrapeWeekContent).toHaveBeenCalledWith(mockWeek.url, 1);
      expect(QuickLinksScraper.scrapeFromQuickLinks).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockItems);
      expect(mockWeek.items).toEqual(mockItems);
      expect(mockWeek.method).toBe('DOM');
    });

    it('deve buscar atividades usando QuickLinksScraper quando método for QuickLinks', async () => {
      // Agir (Act)
      const result = await WeekActivitiesService.getActivities(mockWeek, 'QuickLinks');

      // Verificar (Assert)
      expect(QuickLinksScraper.scrapeFromQuickLinks).toHaveBeenCalledWith(mockWeek.url, 1);
      expect(WeekContentScraper.scrapeWeekContent).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockItems);
      expect(mockWeek.items).toEqual(mockItems);
      expect(mockWeek.method).toBe('QuickLinks');
    });

    it('deve usar método DOM por padrão se não fornecido', async () => {
      // Agir (Act)
      await WeekActivitiesService.getActivities(mockWeek);

      // Verificar (Assert)
      expect(WeekContentScraper.scrapeWeekContent).toHaveBeenCalled();
      expect(mockWeek.method).toBe('DOM');
    });

    it('deve retornar itens do cache se método corresponder e itens existirem', async () => {
      // Preparar (Arrange) - Popula cache
      await WeekActivitiesService.getActivities(mockWeek, 'DOM');
      jest.clearAllMocks();

      // Agir (Act) - Segunda chamada
      const result = await WeekActivitiesService.getActivities(mockWeek, 'DOM');

      // Verificar (Assert)
      expect(WeekContentScraper.scrapeWeekContent).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWeek.items); // Mesma referência
    });

    it('deve buscar NOVAMENTE se o método mudar de DOM para QuickLinks', async () => {
      // Preparar (Arrange) - Chamada inicial com DOM
      await WeekActivitiesService.getActivities(mockWeek, 'DOM');
      jest.clearAllMocks();

      // Agir (Act) - Chamada com QuickLinks
      await WeekActivitiesService.getActivities(mockWeek, 'QuickLinks');

      // Verificar (Assert)
      expect(QuickLinksScraper.scrapeFromQuickLinks).toHaveBeenCalled();
      expect(mockWeek.method).toBe('QuickLinks');
    });

    it('deve retornar erro estruturado quando o scraping falhar', async () => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (WeekContentScraper.scrapeWeekContent).mockRejectedValue(
        new Error('Falha no Scraping')
      );

      // Suprimir console.error no teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Agir
      const result = await WeekActivitiesService.getActivities(mockWeek, 'DOM');

      // Verificar (Assert)
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Falha no Scraping');

      consoleSpy.mockRestore();
    }, 10000); // Aumentar timeout para suportar delay de 500ms do serviço
  });
});
