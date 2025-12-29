import { ConfigForm } from '../components/ConfigForm.js';

// Mock chrome global
const mockChrome = {
  storage: {
    sync: /** @type {any} */ ({
      get: jest.fn(),
      set: jest.fn(),
    }),
  },
  sidePanel: /** @type {any} */ ({
    setPanelBehavior: jest.fn(),
  }),
  action: /** @type {any} */ ({
    setPopup: jest.fn(),
    openPopup: jest.fn(),
  }),
};
global.chrome = /** @type {any} */ (mockChrome);

describe('ConfigForm - Default Behavior', () => {
  let configForm;
  let mockStatusManager;

  beforeEach(() => {
    // Arrange (Common)
    mockStatusManager = { show: jest.fn() };
    configForm = new ConfigForm(mockStatusManager);
    jest.clearAllMocks();

    // Setup minimal DOM
    document.body.innerHTML = `
      <input type="checkbox" id="popupToggle">
    `;
  });

  test('Deve inicializar desativado (unchecked) se storage retornar undefined para clickBehavior', () => {
    // Arrange
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
      callback({}); // Empty object = undefined/null properties
    });

    // Act
    configForm.setupLoadData();

    // Assert
    const popupToggle = document.getElementById('popupToggle');
    // @ts-ignore
    expect(popupToggle.checked).toBe(false); // Default should be 'sidepanel' which means unchecked
  });

  test('Deve inicializar ativado (checked) se storage retornar "popup"', () => {
    // Arrange
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
      callback({ clickBehavior: 'popup' });
    });

    // Act
    configForm.setupLoadData();

    // Assert
    const popupToggle = document.getElementById('popupToggle');
    // @ts-ignore
    expect(popupToggle.checked).toBe(true);
  });

  test('Deve inicializar desativado (unchecked) se storage retornar "sidepanel"', () => {
    // Arrange
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
      callback({ clickBehavior: 'sidepanel' });
    });

    // Act
    configForm.setupLoadData();

    // Assert
    const popupToggle = document.getElementById('popupToggle');
    // @ts-ignore
    expect(popupToggle.checked).toBe(false);
  });
});
