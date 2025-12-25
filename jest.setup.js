// Object.assign(global, require('jest-chrome')); // PREVIOUSLY: jest-chrome (removed)

// Mock de chrome.storage.local com persistência em memória
// IMPORTANTE: jest-webextension-mock já inicializa chrome.storage.local,
// mas o comportamento padrão não persiste dados entre chamadas.
// Vamos sobrescrever apenas os métodos necessários para adicionar persistência.
const storageMemory = {};

// @ts-ignore - Sobrescrever mock do jest-webextension-mock para adicionar persistência
global.chrome.storage.local = {
  get: jest.fn((keys) => {
    if (keys === null || keys === undefined) {
      return Promise.resolve({ ...storageMemory });
    }
    if (typeof keys === 'string') {
      return Promise.resolve({ [keys]: storageMemory[keys] });
    }
    if (Array.isArray(keys)) {
      const result = {};
      keys.forEach((key) => {
        if (key in storageMemory) {
          result[key] = storageMemory[key];
        }
      });
      return Promise.resolve(result);
    }
    // Se keys é um objeto (com valores default), retornar com defaults
    if (typeof keys === 'object') {
      const result = {};
      Object.keys(keys).forEach((key) => {
        result[key] = storageMemory[key] !== undefined ? storageMemory[key] : keys[key];
      });
      return Promise.resolve(result);
    }
    return Promise.resolve({});
  }),
  set: jest.fn((items) => {
    Object.assign(storageMemory, items);
    return Promise.resolve();
  }),
  remove: jest.fn((keys) => {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    keysArray.forEach((key) => delete storageMemory[key]);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(storageMemory).forEach((key) => delete storageMemory[key]);
    return Promise.resolve();
  }),
};

// Reset storage e mocks entre testes
beforeEach(() => {
  Object.keys(storageMemory).forEach((key) => delete storageMemory[key]);
  // @ts-ignore - Reset mocks do jest
  if (global.chrome?.storage?.local?.get?.mockClear) {
    /** @type {any} */ (global.chrome.storage.local.get).mockClear();
  }
  // @ts-ignore - Reset mocks do jest
  if (global.chrome?.storage?.local?.set?.mockClear) {
    /** @type {any} */ (global.chrome.storage.local.set).mockClear();
  }
  // @ts-ignore - Reset mocks do jest
  if (global.chrome?.storage?.local?.remove?.mockClear) {
    /** @type {any} */ (global.chrome.storage.local.remove).mockClear();
  }
  // @ts-ignore - Reset mocks do jest
  if (global.chrome?.storage?.local?.clear?.mockClear) {
    /** @type {any} */ (global.chrome.storage.local.clear).mockClear();
  }
});

// Polyfill/Mock para chrome.scripting (não incluído nativamente no jest-chrome ainda)
global.chrome.scripting = /** @type {any} */ ({
  executeScript: jest.fn(),
});

// Polyfill ensure for chrome.windows if missing
if (!global.chrome.windows) {
  global.chrome.windows = /** @type {any} */ ({
    update: jest.fn(),
    create: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    remove: jest.fn(),
    onFocusChanged: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      hasListener: jest.fn(),
    },
  });
}

// Polyfill PointerEvent for JSDOM environment (used by CourseWeekTasksView)
if (!global.PointerEvent) {
  // @ts-ignore
  global.PointerEvent = class extends MouseEvent { };
}

