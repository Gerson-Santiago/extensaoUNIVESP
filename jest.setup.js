Object.assign(global, require('jest-chrome'));

// Polyfill/Mock para chrome.scripting (não incluído nativamente no jest-chrome ainda)
global.chrome.scripting = /** @type {any} */ ({
    executeScript: jest.fn(),
});
