import { WeekActivitiesService } from '../services/WeekActivitiesService.js';
import { ActivityRepository } from '../repositories/ActivityRepository.js';

// Mocks
jest.mock('../repositories/ActivityRepository.js');
const mockChrome = {
  scripting: /** @type {any} */ ({ executeScript: jest.fn() }),
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
};
global.chrome = /** @type {any} */ (mockChrome);

describe('WeekActivitiesService - Cache Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    /** @type {jest.Mock} */ (ActivityRepository.get).mockResolvedValue(null);
    /** @type {jest.Mock} */ (ActivityRepository.save).mockResolvedValue(undefined);
  });

  test('Deve priorizar cache de memória se disponível e método for compatível', async () => {
    // Arrange
    const week = {
      courseId: 'c1',
      contentId: 'w1',
      items: [{ id: '1' }],
      method: 'DOM',
    };

    // Act
    const result = await WeekActivitiesService.getActivities(week, 'DOM');

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBe(week.items);
    expect(ActivityRepository.get).not.toHaveBeenCalled();
  });

  test('Deve priorizar cache persistente se disponível e compatível', async () => {
    // Arrange
    const week = { courseId: 'c1', contentId: 'w1', items: [] };
    const cachedData = { items: [{ id: 'stored' }], method: 'DOM' };

    /** @type {jest.Mock} */ (ActivityRepository.get).mockResolvedValue(cachedData);

    // Act
    const result = await WeekActivitiesService.getActivities(week, 'DOM');

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual(cachedData.items);
    expect(week.items).toEqual(cachedData.items);
    // NÃO deve tentar fazer scraping (que lançaria erro por falta de mocks de Tabs etc)
  });

  test('Deve extrair contentId da URL se não estiver no objeto week', async () => {
    // Arrange
    const week = {
      courseId: 'c1',
      url: 'https://ava.br/webapps/blackboard/content/listContent.jsp?course_id=_123_1&content_id=_999_1&mode=reset',
      items: [],
    };

    // Simular cache hit com o ID extraído
    /** @type {jest.Mock} */ (ActivityRepository.get).mockImplementation((cId, wId) => {
      if (wId === '_999_1') return { items: ['hit'], method: 'DOM' };
      return null;
    });

    // Act
    const result = await WeekActivitiesService.getActivities(week, 'DOM');

    // Assert
    expect(week.contentId).toBe('_999_1');
    expect(result.success).toBe(true);
    expect(result.data).toEqual(['hit']);
  });
});
