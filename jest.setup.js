// Object.assign(global, require('jest-chrome')); // PREVIOUSLY: jest-chrome (removed)

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
