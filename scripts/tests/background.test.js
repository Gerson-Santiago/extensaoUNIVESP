// Mock chrome global
const mockChrome = {
  runtime: {
    onInstalled: /** @type {any} */ ({ addListener: jest.fn() }),
    onStartup: /** @type {any} */ ({ addListener: jest.fn() }),
  },
  storage: {
    sync: /** @type {any} */ ({
      get: jest.fn(),
    }),
    onChanged: /** @type {any} */ ({ addListener: jest.fn() }),
  },
  sidePanel: /** @type {any} */ ({
    setPanelBehavior: jest.fn().mockResolvedValue(undefined),
  }),
  action: /** @type {any} */ ({
    setPopup: jest.fn(),
  }),
};
global.chrome = /** @type {any} */ (mockChrome);

// Import code under test
// Note: Since background.js is not a module, we might need to load it differently
// or simple require it to trigger the listeners if it was a module.
// However, given the file structure shown previously, let's trust the logic inside it.
// Ideally, we would refactor background.js to export the updatePanelBehavior function,
// but for now, we will copy the logic to test it or assume we can simulate the events if we convert it to module or similar.
// Since we CANNOT easily import a non-module file in Jest without side effects,
// and the user file `scripts / background.js` has plain function definitions at top level but listeners at bottom,
// We will test the LOGIC by restructuring how we load it or by mocking the implementation we expect.

// BETTER APPROACH for this context:
// Since we want to test the *file* `scripts / background.js`, we can read it and eval it, or use `require`.
// But `background.js` is not a module export.
// Let's create a test that mocks the global scope and requires the file.

describe('Background Script - Panel Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  // Helper to load the script (simulating execution)
  const loadScript = () => {
    jest.isolateModules(() => {
      // @ts-ignore
      require('../background.js');
    });
  };

  test('Deve configurar sidepanel como padrão na instalação se storage estiver vazio', () => {
    // Arrange
    const mockGet = jest.fn((keys, cb) => cb({})); // Empty storage
    /** @type {jest.Mock} */ (global.chrome.storage.sync.get) = mockGet;

    // We need to capture the listener to trigger it manually because require just registers it
    /** @type {Function} */
    let installCallback;
    /** @type {any} */ (global.chrome.runtime.onInstalled.addListener).mockImplementation((cb) => {
      installCallback = cb;
    });

    // Act
    loadScript();
    if (installCallback) installCallback();

    // Assert
    expect(global.chrome.sidePanel.setPanelBehavior).toHaveBeenCalledWith({
      openPanelOnActionClick: true, // Default sidepanel means this is true
    });
    expect(global.chrome.action.setPopup).toHaveBeenCalledWith({ popup: '' }); // Disable popup
  });

  test('Deve habilitar popup se clickBehavior for "popup" na instalação', () => {
    // Arrange
    const mockGet = jest.fn((keys, cb) => cb({ clickBehavior: 'popup' }));
    /** @type {jest.Mock} */ (global.chrome.storage.sync.get) = mockGet;

    /** @type {Function} */
    let installCallback;
    /** @type {any} */ (global.chrome.runtime.onInstalled.addListener).mockImplementation((cb) => {
      installCallback = cb;
    });

    // Act
    loadScript();
    if (installCallback) installCallback();

    // Assert
    expect(global.chrome.sidePanel.setPanelBehavior).toHaveBeenCalledWith({
      openPanelOnActionClick: false, // Popup means sidepanel click is false
    });
    expect(global.chrome.action.setPopup).toHaveBeenCalledWith({ popup: 'popup/popup.html' });
  });

  test('Deve atualizar comportamento quando storage mudar (onChanged)', () => {
    // Arrange
    /** @type {Function} */
    let changeCallback;
    /** @type {any} */ (global.chrome.storage.onChanged.addListener).mockImplementation((cb) => {
      changeCallback = cb;
    });

    // Act
    loadScript(); // Register listeners

    // Simulate change to 'popup'
    if (changeCallback) {
      changeCallback({ clickBehavior: { newValue: 'popup' } }, 'sync');
    }

    // Assert
    expect(global.chrome.sidePanel.setPanelBehavior).toHaveBeenCalledWith({
      openPanelOnActionClick: false,
    });
    expect(global.chrome.action.setPopup).toHaveBeenCalledWith({ popup: 'popup/popup.html' });
  });
});
