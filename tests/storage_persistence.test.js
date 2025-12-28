import { CourseRepository } from '@features/courses/data/CourseRepository.js';

// Mock chrome.storage (sync + local) com persistência em memória
const storageMock = {};
const localStorageMock = {};

global.chrome = /** @type {any} */ ({
  storage: {
    sync: {
      get: jest.fn((_keys) => Promise.resolve(Object.keys(storageMock).length ? storageMock : {})),
      set: jest.fn((items) => {
        Object.assign(storageMock, items);
        return Promise.resolve();
      }),
    },
    local: {
      get: jest.fn((_keys) => {
        const keysArray = Array.isArray(_keys) ? _keys : [_keys];
        const result = {};
        keysArray.forEach((_key) => {
          if (localStorageMock[_key] !== undefined) {
            result[_key] = localStorageMock[_key];
          }
        });
        return Promise.resolve(result);
      }),
      set: jest.fn((items) => {
        Object.assign(localStorageMock, items);
        return Promise.resolve();
      }),
      remove: jest.fn((keys) => {
        const keysArray = Array.isArray(keys) ? keys : [keys];
        keysArray.forEach((key) => delete localStorageMock[key]);
        return Promise.resolve();
      }),
    },
  },
  runtime: {
    lastError: null,
  },
});

describe('Storage Logic - Persistence & v2.4.1 Features', () => {
  beforeEach(() => {
    // Limpa mocks
    for (const key in storageMock) delete storageMock[key];
    for (const key in localStorageMock) delete localStorageMock[key];
    jest.clearAllMocks();
  });

  test('addItemsBatch should persist termName', async () => {
    const items = [
      { name: 'Curso A', url: 'http://a.com', weeks: [], termName: '2025/1' },
      { name: 'Curso B', url: 'http://b.com' }, // Sem termName
    ];

    await CourseRepository.addBatch(items);

    const courses = await CourseRepository.loadItems();
    expect(courses).toHaveLength(2);
    expect(courses.find((c) => c.name === 'Curso A').termName).toBe('2025/1');
  });

  test('addItem should accept options object with termName', async () => {
    // addItem(name, url, weeks = [], optionsOrCallback, extraCallback)
    await CourseRepository.add('Curso Manual', 'http://manual.com', [], {
      termName: 'Manual Term',
    });

    const courses = await CourseRepository.loadItems();
    const course = courses.find((c) => c.name === 'Curso Manual');
    expect(course).toBeTruthy();
    expect(course.termName).toBe('Manual Term');
  });

  test('addItem should work with old signature (backward compatibility)', async () => {
    // addItem(name, url, weeks = [], callback)
    await CourseRepository.add('Curso Old', 'http://old.com', []);

    const courses = await CourseRepository.loadItems();
    const course = courses.find((c) => c.name === 'Curso Old');
    expect(course).toBeTruthy();
    expect(course.termName).toBe(''); // Default empty
  });
});
