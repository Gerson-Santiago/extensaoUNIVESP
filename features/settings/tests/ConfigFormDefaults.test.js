import { ConfigForm } from '../ui/components/ConfigForm.js';

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
      <input type="text" id="raInput">
      <input type="text" id="domainInput">
    `;
  });

  test('Deve inicializar campos vazios se storage retornar undefined', () => {
    // Arrange
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
    callback({}); // Empty object
  });

    // Act
    configForm.setupLoadData();

    // Assert
    const raInput = document.getElementById('raInput');
    const domainInput = document.getElementById('domainInput');
    // @ts-ignore
    expect(raInput.value).toBe('');
    // @ts-ignore - domain deve ter valor padrão do DomainManager
    expect(domainInput.value).toBeTruthy();
  });
});
