// @ts-nocheck
import { jest } from '@jest/globals';
import { CourseRefresher } from '../CourseRefresher.js';

// Setup global mocks
const mockStorage = new Map();

// Helper to reset storage
const clearStorage = () => mockStorage.clear();

// Helper to seed storage VALID for ChunkedStorage
const seedStorage = (key, value) => {
  const wrapped = {
    data: JSON.stringify(value),
    chunked: false,
    compressed: false,
  };
  mockStorage.set(key, wrapped);
};

global.chrome = {
  tabs: {
    query: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  windows: {
    update: jest.fn((id, info, cb) => cb && cb()),
  },
  scripting: {
    executeScript: jest.fn(),
  },
  storage: {
    sync: {
      get: jest.fn((keys, callback) => {
        const result = {};
        if (typeof keys === 'string') {
          if (mockStorage.has(keys)) result[keys] = mockStorage.get(keys);
        } else if (Array.isArray(keys)) {
          keys.forEach((k) => {
            if (mockStorage.has(k)) result[k] = mockStorage.get(k);
          });
        }
        if (callback) callback(result);
        return Promise.resolve(result);
      }),
      set: jest.fn((items, callback) => {
        Object.entries(items).forEach(([k, v]) => mockStorage.set(k, v));
        if (callback) callback();
        return Promise.resolve();
      }),
      remove: jest.fn((keys, callback) => {
        const keysArr = Array.isArray(keys) ? keys : [keys];
        keysArr.forEach((k) => mockStorage.delete(k));
        if (callback) callback();
        return Promise.resolve();
      }),
    },
    local: {
      get: jest.fn((keys, callback) => {
        const result = {};
        if (typeof keys === 'string') {
          if (mockStorage.has(keys)) result[keys] = mockStorage.get(keys);
        } else if (Array.isArray(keys)) {
          keys.forEach((k) => {
            if (mockStorage.has(k)) result[k] = mockStorage.get(k);
          });
        } else if (keys === null) {
          mockStorage.forEach((v, k) => (result[k] = v));
        }
        if (callback) callback(result);
        return Promise.resolve(result);
      }),
      set: jest.fn((items, callback) => {
        Object.entries(items).forEach(([k, v]) => mockStorage.set(k, v));
        if (callback) callback();
        return Promise.resolve();
      }),
      remove: jest.fn((keys, callback) => {
        const keysArr = Array.isArray(keys) ? keys : [keys];
        keysArr.forEach((k) => mockStorage.delete(k));
        if (callback) callback();
        return Promise.resolve();
      }),
    },
  },
  runtime: {
    lastError: null,
  },
};

global.alert = jest.fn();

describe('CourseRefresher Integration (Success)', () => {
  let mockBtn;

  beforeEach(() => {
    jest.clearAllMocks();
    clearStorage();
    mockBtn = document.createElement('button');
    mockBtn.textContent = '↻';
    mockBtn.disabled = false;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve identificar novos materiais e atualizar storage com sucesso', async () => {
    const course = {
      id: 12345,
      name: 'Engenharia de Software',
      url: 'https://ava.univesp.br/bbcswebdav/courses/FOO_123/index.html?course_id=_999_1',
    };

    seedStorage('courses_metadata', { courseIds: [course.id] });
    seedStorage(`course_${course.id}`, { ...course, weeks: [] });

    const targetTab = { id: 101, url: course.url };

    chrome.tabs.query
      .mockImplementationOnce((q, cb) => {
        cb([]);
        return Promise.resolve([]);
      })
      .mockImplementationOnce((q, cb) => {
        cb([targetTab]);
        return Promise.resolve([targetTab]);
      });

    chrome.tabs.create.mockImplementation((props, cb) => {
      if (cb) cb(targetTab);
      return Promise.resolve(targetTab);
    });

    const newWeeks = [
      { name: 'Semana 1', url: 'https://ava.univesp.br/semana1' },
      { name: 'Semana 2', url: 'https://ava.univesp.br/semana2' },
    ];

    chrome.scripting.executeScript.mockResolvedValue([
      {
        result: {
          weeks: newWeeks,
          title: 'Engenharia de Software',
        },
      },
    ]);

    const promise = CourseRefresher.refreshCourse(course, mockBtn);

    jest.advanceTimersByTime(2000);

    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.weeks).toHaveLength(2);

    const updatedCourseWrapper = mockStorage.get(`course_${course.id}`);
    const updatedCourse = JSON.parse(updatedCourseWrapper.data);

    expect(updatedCourse.weeks).toHaveLength(2);
    expect(updatedCourse.weeks[0].name).toBe('Semana 1');

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('2 semanas atualizadas'));

    expect(mockBtn.textContent).toBe('↻');
    expect(mockBtn.disabled).toBe(false);
  });
});
