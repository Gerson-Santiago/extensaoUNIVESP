import { CourseRepository } from '@features/courses/data/CourseRepository.js';

// Mock chrome.storage.sync
const storageMock = {};
global.chrome = {
  storage: {
    sync: {
      get: jest.fn((keys, callback) => {
        callback(storageMock);
      }),
      set: jest.fn((items, callback) => {
        Object.assign(storageMock, items);
        if (callback) callback();
      }),
    },
  },
  runtime: {
    lastError: null,
  },
};

describe('Storage Logic - Persistence & v2.4.1 Features', () => {
  beforeEach(() => {
    // Limpa mock
    for (const key in storageMock) delete storageMock[key];
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
