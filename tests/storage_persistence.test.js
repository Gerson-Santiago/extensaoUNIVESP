import { addItemsBatch, addItem, loadItems } from '../sidepanel/logic/storage.js';

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
};

describe('Storage Logic - Persistence & v2.4.1 Features', () => {
  beforeEach(() => {
    // Limpa mock
    for (const key in storageMock) delete storageMock[key];
    jest.clearAllMocks();
  });

  test('addItemsBatch should persist termName', (done) => {
    const items = [
      { name: 'Curso A', url: 'http://a.com', weeks: [], termName: '2025/1' },
      { name: 'Curso B', url: 'http://b.com' }, // Sem termName
    ];

    addItemsBatch(items, (added) => {
      expect(added).toBe(2);

      loadItems((courses) => {
        expect(courses).toHaveLength(2);
        expect(courses.find((c) => c.name === 'Curso A').termName).toBe('2025/1');
        done();
      });
    });
  });

  test('addItem should accept options object with termName', (done) => {
    // addItem(name, url, weeks = [], optionsOrCallback, extraCallback)
    addItem('Curso Manual', 'http://manual.com', [], { termName: 'Manual Term' }, (success) => {
      expect(success).toBe(true);

      loadItems((courses) => {
        const course = courses.find((c) => c.name === 'Curso Manual');
        expect(course).toBeTruthy();
        expect(course.termName).toBe('Manual Term');
        done();
      });
    });
  });

  test('addItem should work with old signature (backward compatibility)', (done) => {
    // addItem(name, url, weeks = [], callback)
    addItem('Curso Old', 'http://old.com', [], (success) => {
      expect(success).toBe(true);

      loadItems((courses) => {
        const course = courses.find((c) => c.name === 'Curso Old');
        expect(course).toBeTruthy();
        expect(course.termName).toBe(''); // Default empty
        done();
      });
    });
  });
});
