import { WeekActivitiesService } from '../services/WeekActivitiesService.js';
import { WeekContentScraper } from '../services/WeekContentScraper.js';
import { QuickLinksScraper } from '../services/QuickLinksScraper.js';

// Mock both scrapers
jest.mock('../services/WeekContentScraper.js');
jest.mock('../services/QuickLinksScraper.js');

describe('WeekActivitiesService', () => {
  const mockWeek = {
    url: 'https://ava.univesp.br/web/123/week/456',
    name: 'Semana 1',
    items: [], // Empty items initially
  };

  const mockItems = [
    { title: 'Videoaula 1', status: 'DONE' },
    { title: 'Quiz', status: 'TODO' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset week object before each test
    mockWeek.items = [];
    delete mockWeek.method;

    // Setup mock implementations
    /** @type {jest.Mock} */ (WeekContentScraper.scrapeWeekContent).mockResolvedValue(mockItems);
    /** @type {jest.Mock} */ (QuickLinksScraper.scrapeFromQuickLinks).mockResolvedValue(mockItems);
  });

  describe('getActivities', () => {
    it('should fetch activities using WeekContentScraper when method is DOM', async () => {
      const result = await WeekActivitiesService.getActivities(mockWeek, 'DOM');

      expect(WeekContentScraper.scrapeWeekContent).toHaveBeenCalledWith(mockWeek.url);
      expect(QuickLinksScraper.scrapeFromQuickLinks).not.toHaveBeenCalled();
      expect(result).toEqual(mockItems);
      expect(mockWeek.items).toEqual(mockItems);
      expect(mockWeek.method).toBe('DOM');
    });

    it('should fetch activities using QuickLinksScraper when method is QuickLinks', async () => {
      const result = await WeekActivitiesService.getActivities(mockWeek, 'QuickLinks');

      expect(QuickLinksScraper.scrapeFromQuickLinks).toHaveBeenCalledWith(mockWeek.url);
      expect(WeekContentScraper.scrapeWeekContent).not.toHaveBeenCalled();
      expect(result).toEqual(mockItems);
      expect(mockWeek.items).toEqual(mockItems);
      expect(mockWeek.method).toBe('QuickLinks');
    });

    it('should use default method DOM if not provided', async () => {
      await WeekActivitiesService.getActivities(mockWeek);

      expect(WeekContentScraper.scrapeWeekContent).toHaveBeenCalled();
      expect(mockWeek.method).toBe('DOM');
    });

    it('should return cached items if method matches and items exist', async () => {
      // First call to populate cache
      await WeekActivitiesService.getActivities(mockWeek, 'DOM');

      // Clear mocks to verify second call logic
      jest.clearAllMocks();

      // Second call
      const result = await WeekActivitiesService.getActivities(mockWeek, 'DOM');

      expect(WeekContentScraper.scrapeWeekContent).not.toHaveBeenCalled();
      expect(result).toBe(mockWeek.items); // Should be same reference
    });

    it('should REFETCH if method changed from DOM to QuickLinks', async () => {
      // First call: DOM
      await WeekActivitiesService.getActivities(mockWeek, 'DOM');

      jest.clearAllMocks();

      // Second call: QuickLinks
      await WeekActivitiesService.getActivities(mockWeek, 'QuickLinks');

      expect(QuickLinksScraper.scrapeFromQuickLinks).toHaveBeenCalled();
      expect(mockWeek.method).toBe('QuickLinks');
    });

    it('should throw error when scraping fails', async () => {
      /** @type {jest.Mock} */ (WeekContentScraper.scrapeWeekContent).mockRejectedValue(
        new Error('Scraping Failed')
      );

      // Using console spy to suppress error output in test logs
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(WeekActivitiesService.getActivities(mockWeek, 'DOM')).rejects.toThrow(
        'Scraping Failed'
      );

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
