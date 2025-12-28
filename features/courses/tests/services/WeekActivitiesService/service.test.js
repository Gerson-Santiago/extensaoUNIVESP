import { WeekActivitiesService } from '../../../services/WeekActivitiesService.js';
import { WeekContentScraper } from '../../../services/WeekContentScraper.js';
import { QuickLinksScraper } from '../../../services/QuickLinksScraper.js';
import { Tabs } from '../../../../../shared/utils/Tabs.js';

// Mock both scrapers and Tabs
jest.mock('../../../services/WeekContentScraper.js');
jest.mock('../../../services/QuickLinksScraper.js');
jest.mock('../../../../../shared/utils/Tabs.js');

describe('WeekActivitiesService', () => {
  const mockWeek = {
    url: 'https://ava.univesp.br/web/123/week/456',
    name: 'Semana 1',
    items: [], // Inicialmente vazio
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
  });

  describe('getActivities', () => {
    it('deve buscar atividades usando WeekContentScraper quando método for DOM', async () => {
      // Agir (Act)
      const result = await WeekActivitiesService.getActivities(mockWeek, 'DOM');

      // Verificar (Assert)
      expect(WeekContentScraper.scrapeWeekContent).toHaveBeenCalledWith(mockWeek.url);
      expect(QuickLinksScraper.scrapeFromQuickLinks).not.toHaveBeenCalled();
      expect(result).toEqual(mockItems);
      expect(mockWeek.items).toEqual(mockItems);
      expect(mockWeek.method).toBe('DOM');
    });

    it('deve buscar atividades usando QuickLinksScraper quando método for QuickLinks', async () => {
      // Agir (Act)
      const result = await WeekActivitiesService.getActivities(mockWeek, 'QuickLinks');

      // Verificar (Assert)
      expect(QuickLinksScraper.scrapeFromQuickLinks).toHaveBeenCalledWith(mockWeek.url);
      expect(WeekContentScraper.scrapeWeekContent).not.toHaveBeenCalled();
      expect(result).toEqual(mockItems);
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
      expect(result).toBe(mockWeek.items); // Mesma referência
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

    it('deve lançar erro quando o scraping falhar', async () => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (WeekContentScraper.scrapeWeekContent).mockRejectedValue(
        new Error('Falha no Scraping')
      );

      // Agir & Verificar (Act & Assert)
      await expect(WeekActivitiesService.getActivities(mockWeek, 'DOM')).rejects.toThrow(
        'Falha no Scraping'
      );
    });
  });
});
