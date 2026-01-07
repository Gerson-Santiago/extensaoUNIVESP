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

describe('CourseRefresher Integration (Failure)', () => {
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

  it('deve falhar graciosamente se URL da aba não bater (mudou durante carga)', async () => {
    const course = {
      id: 12345,
      name: 'Engenharia de Software',
      url: 'https://ava.univesp.br/bbcswebdav/courses/FOO_123/index.html?course_id=_999_1',
    };

    chrome.tabs.query.mockImplementationOnce((q, cb) => {
      cb([]);
      return Promise.resolve([]);
    });

    chrome.tabs.create.mockImplementation((p, cb) => {
      cb({ id: 101, url: course.url });
      return Promise.resolve({});
    });

    const wrongTab = { id: 101, url: 'https://google.com' };
    chrome.tabs.query.mockImplementationOnce((q, cb) => {
      cb([wrongTab]);
      return Promise.resolve([wrongTab]);
    });

    const promise = CourseRefresher.refreshCourse(course, mockBtn);
    jest.advanceTimersByTime(2000);
    const result = await promise;

    expect(result.success).toBe(false);
    expect(global.alert).toHaveBeenCalledWith(
      expect.stringContaining('aguarde a página da matéria')
    );
  });

  it('deve lidar com falha no scraping (ex: erro de script)', async () => {
    const course = {
      id: 12345,
      name: 'Engenharia de Software',
      url: 'https://ava.univesp.br/bbcswebdav/courses/FOO_123/index.html?course_id=_999_1',
    };

    const targetTab = { id: 101, url: course.url };
    chrome.tabs.query.mockImplementationOnce((q, cb) => {
      cb([]);
      return Promise.resolve([]);
    });
    chrome.tabs.create.mockImplementation((p, cb) => {
      cb(targetTab);
      return Promise.resolve(targetTab);
    });
    chrome.tabs.query.mockImplementationOnce((q, cb) => {
      cb([targetTab]);
      return Promise.resolve([targetTab]);
    });

    chrome.scripting.executeScript.mockRejectedValue(new Error('Script injection failed'));

    const promise = CourseRefresher.refreshCourse(course, mockBtn);
    jest.advanceTimersByTime(2000);
    const result = await promise;

    expect(result.success).toBe(false);
    expect(global.alert).toHaveBeenCalledWith('Nenhuma semana encontrada nesta página.');
  });

  it('deve lidar com erro interno no CourseRepository (ex: falha de storage)', async () => {
    const course = {
      id: 12345,
      name: 'Engenharia de Software',
      url: 'https://ava.univesp.br/bbcswebdav/courses/FOO_123/index.html?course_id=_999_1',
    };
    seedStorage('courses_metadata', { courseIds: [course.id] });
    seedStorage(`course_${course.id}`, { ...course, weeks: [] });

    const targetTab = { id: 101, url: course.url };
    chrome.tabs.query.mockImplementationOnce((q, cb) => {
      cb([]);
      return Promise.resolve([]);
    });
    chrome.tabs.create.mockImplementation((p, cb) => {
      cb(targetTab);
      return Promise.resolve(targetTab);
    });
    chrome.tabs.query.mockImplementationOnce((q, cb) => {
      cb([targetTab]);
      return Promise.resolve([targetTab]);
    });

    const newWeeks = [{ name: 'Semana 1', url: '...' }];
    chrome.scripting.executeScript.mockResolvedValue([{ result: { weeks: newWeeks } }]);

    // Force saveItems failure
    chrome.storage.local.set.mockImplementation(() => {
      throw new Error('Quota Exceeded');
    });

    const promise = CourseRefresher.refreshCourse(course, mockBtn);
    jest.advanceTimersByTime(2000);

    const result = await promise;

    // This documents current behavior (Repository swallows error)
    expect(result.success).toBe(true);
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('1 semanas atualizadas'));
  });

  it('deve cair no catch se ocorrer um erro não tratado (ex: falha ao obter aba)', async () => {
    const course = {
      id: 12345,
      name: 'Engenharia de Software',
      url: 'https://ava.univesp.br/bbcswebdav/courses/FOO_123/index.html?course_id=_999_1',
    };

    chrome.tabs.query.mockImplementation((q, cb) => {
      cb([]);
      return Promise.resolve([]);
    });

    const promise = CourseRefresher.refreshCourse(course, mockBtn);
    jest.advanceTimersByTime(2000);

    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(global.alert).toHaveBeenCalledWith('Erro ao buscar semanas.');

    expect(mockBtn.textContent).toBe('↻');
    expect(mockBtn.disabled).toBe(false);
  });
});
