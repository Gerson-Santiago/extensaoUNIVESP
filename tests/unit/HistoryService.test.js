import { HistoryService } from '../../shared/services/HistoryService.js';

describe('HistoryService', () => {
  let historyService;

  // Mock do chrome.storage.local
  const mockStorage = {};

  beforeAll(() => {
    global.chrome = /** @type {any} */ ({
      storage: {
        local: /** @type {any} */ ({
          get: jest.fn((key) => {
            const k = typeof key === 'string' ? key : Object.keys(key)[0];
            return Promise.resolve({ [k]: mockStorage[k] });
          }),
          set: jest.fn((items) => {
            Object.assign(mockStorage, items);
            return Promise.resolve();
          }),
          remove: jest.fn((key) => {
            delete mockStorage[key];
            return Promise.resolve();
          }),
        }),
      },
    });
  });

  beforeEach(() => {
    // Limpar storage mock antes de cada teste
    for (const key in mockStorage) delete mockStorage[key];
    historyService = new HistoryService(3); // Max 3 items para teste
  });

  test('should push items and maintain LRU order (newest first)', async () => {
    const courseId = 'course_123';
    const item1 = { id: '1', label: 'Item 1' };
    const item2 = { id: '2', label: 'Item 2' };

    await historyService.push(courseId, item1);
    await historyService.push(courseId, item2);

    const recent = await historyService.getRecent(courseId);
    expect(recent).toHaveLength(2);
    expect(recent[0].id).toBe('2'); // Item 2 deve ser o primeiro
    expect(recent[1].id).toBe('1');
  });

  test('should move existing item to top if pushed again', async () => {
    const courseId = 'course_123';
    const item1 = { id: '1', label: 'Item 1' };
    const item2 = { id: '2', label: 'Item 2' };

    await historyService.push(courseId, item1);
    await historyService.push(courseId, item2);

    // Push item 1 again
    await historyService.push(courseId, item1);

    const recent = await historyService.getRecent(courseId);
    expect(recent[0].id).toBe('1'); // Item 1 volta para o topo
    expect(recent[1].id).toBe('2');
  });

  test('should enforce maxItems limit', async () => {
    const courseId = 'course_123';
    // Max is 3
    await historyService.push(courseId, { id: '1' });
    await historyService.push(courseId, { id: '2' });
    await historyService.push(courseId, { id: '3' });
    await historyService.push(courseId, { id: '4' });

    const recent = await historyService.getRecent(courseId);
    expect(recent).toHaveLength(3);
    expect(recent[0].id).toBe('4');
    expect(recent[2].id).toBe('2'); // Item 1 deve ter sido removido
  });

  test('should clear history', async () => {
    const courseId = 'course_123';
    await historyService.push(courseId, { id: '1' });

    await historyService.clear(courseId);

    const recent = await historyService.getRecent(courseId);
    expect(recent).toEqual([]);
  });
});
