/**
 * @file UserPreferences.test.js
 * @description Testes AAA para funcionalidades de Preferências do Usuário (ISSUE-022)
 * Valida: Densidade Visual e Auto-Pin Tracking
 */

import { SettingsView } from '../ui/SettingsView.js';

describe('User Preferences (ISSUE-022)', () => {
  let settingsView;
  let mockStorage;

  beforeEach(() => {
    // Arrange: Setup DOM
    document.body.innerHTML = '<div id="app"></div>';

    // Mock chrome.storage.local
    mockStorage = {
      user_preferences: {
        density: 'comfortable',
        autoPinLastWeek: false,
        lastWeekNumber: null,
      },
    };

    global.chrome = /** @type {any} */ ({
      storage: {
        local: {
          get: jest.fn((key) => {
            const keys = Array.isArray(key) ? key : [key];
            const result = {};
            keys.forEach((k) => {
              result[k] = mockStorage[k];
            });
            return Promise.resolve(result);
          }),
          set: jest.fn((data) => {
            Object.assign(mockStorage, data);
            return Promise.resolve();
          }),
          getBytesInUse: jest.fn(),
          clear: jest.fn(),
          remove: jest.fn(),
          setAccessLevel: jest.fn(),
          onChanged: {
            addListener: jest.fn(),
            removeListener: jest.fn(),
            hasListener: jest.fn(),
            hasListeners: jest.fn(),
            addRules: jest.fn(),
            getRules: jest.fn(),
            removeRules: jest.fn(),
          },
          getKeys: jest.fn(),
          QUOTA_BYTES: 10485760,
        },
        sync: /** @type {any} */ ({}),
        managed: /** @type {any} */ ({}),
        session: /** @type {any} */ ({}),
        onChanged: /** @type {any} */ ({ addListener: jest.fn() }),
      },
    });

    settingsView = new SettingsView();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Densidade Visual', () => {
    test('deve aplicar classe is-compact quando densidade ativada', () => {
      // Arrange
      const density = 'compact';

      // Act
      settingsView.applyDensity(density);

      // Assert
      expect(document.body.classList.contains('is-compact')).toBe(true);
    });

    test('deve remover classe is-compact quando densidade desativada', () => {
      // Arrange
      document.body.classList.add('is-compact');
      const density = 'comfortable';

      // Act
      settingsView.applyDensity(density);

      // Assert
      expect(document.body.classList.contains('is-compact')).toBe(false);
    });

    test('deve carregar preferência salva e aplicar densidade ao inicializar', async () => {
      // Arrange
      mockStorage.user_preferences = {
        density: 'compact',
        autoPinLastWeek: false,
        lastWeekNumber: null,
      };

      document.body.innerHTML = `
        <input type="checkbox" id="densityCompact" />
        <input type="checkbox" id="autoPinLastWeek" />
      `;

      // Act
      await settingsView.initUserPreferences();

      // Assert
      const checkbox = /** @type {HTMLInputElement} */ (document.getElementById('densityCompact'));
      expect(checkbox.checked).toBe(true);
      expect(document.body.classList.contains('is-compact')).toBe(true);
    });

    test('deve persistir preferência de densidade no storage ao alterar', async () => {
      // Arrange
      document.body.innerHTML = `
        <input type="checkbox" id="densityCompact" />
        <input type="checkbox" id="autoPinLastWeek" />
      `;

      await settingsView.initUserPreferences();

      const checkbox = /** @type {HTMLInputElement} */ (document.getElementById('densityCompact'));

      // Act
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      // Aguardar processamento assíncrono
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        user_preferences: {
          density: 'compact',
          autoPinLastWeek: false,
          lastWeekNumber: null,
        },
      });
    });

    test('deve aplicar densidade imediatamente ao alterar toggle', async () => {
      // Arrange
      document.body.innerHTML = `
        <input type="checkbox" id="densityCompact" />
        <input type="checkbox" id="autoPinLastWeek" />
      `;

      await settingsView.initUserPreferences();

      const checkbox = /** @type {HTMLInputElement} */ (document.getElementById('densityCompact'));
      expect(document.body.classList.contains('is-compact')).toBe(false);

      // Act
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      // Aguardar processamento assíncrono
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(document.body.classList.contains('is-compact')).toBe(true);
    });
  });

  describe('Auto-Pin Toggle', () => {
    test('deve carregar preferência de Auto-Pin salva ao inicializar', async () => {
      // Arrange
      mockStorage.user_preferences = {
        density: 'comfortable',
        autoPinLastWeek: true,
        lastWeekNumber: 5,
      };

      document.body.innerHTML = `
        <input type="checkbox" id="densityCompact" />
        <input type="checkbox" id="autoPinLastWeek" />
      `;

      // Act
      await settingsView.initUserPreferences();

      // Assert
      const checkbox = /** @type {HTMLInputElement} */ (document.getElementById('autoPinLastWeek'));
      expect(checkbox.checked).toBe(true);
    });

    test('deve persistir preferência de Auto-Pin no storage ao alterar', async () => {
      // Arrange
      document.body.innerHTML = `
        <input type="checkbox" id="densityCompact" />
        <input type="checkbox" id="autoPinLastWeek" />
      `;

      await settingsView.initUserPreferences();

      const checkbox = /** @type {HTMLInputElement} */ (document.getElementById('autoPinLastWeek'));

      // Act
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      // Aguardar processamento assíncrono
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        user_preferences: {
          density: 'comfortable',
          autoPinLastWeek: true,
          lastWeekNumber: null,
        },
      });
    });

    test('deve preservar lastWeekNumber ao alterar toggle de Auto-Pin', async () => {
      // Arrange
      mockStorage.user_preferences = {
        density: 'comfortable',
        autoPinLastWeek: false,
        lastWeekNumber: 7,
      };

      document.body.innerHTML = `
        <input type="checkbox" id="densityCompact" />
        <input type="checkbox" id="autoPinLastWeek" />
      `;

      await settingsView.initUserPreferences();

      const checkbox = /** @type {HTMLInputElement} */ (document.getElementById('autoPinLastWeek'));

      // Act
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      // Aguardar processamento assíncrono
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        user_preferences: {
          density: 'comfortable',
          autoPinLastWeek: true,
          lastWeekNumber: 7, // ← Preservado
        },
      });
    });
  });

  describe('Storage Defaults', () => {
    test('deve usar valores padrão quando storage está vazio', async () => {
      // Arrange
      mockStorage.user_preferences = undefined;

      document.body.innerHTML = `
        <input type="checkbox" id="densityCompact" />
        <input type="checkbox" id="autoPinLastWeek" />
      `;

      // Act
      await settingsView.initUserPreferences();

      // Assert
      const densityCheckbox = /** @type {HTMLInputElement} */ (
        document.getElementById('densityCompact')
      );
      const autoPinCheckbox = /** @type {HTMLInputElement} */ (
        document.getElementById('autoPinLastWeek')
      );

      expect(densityCheckbox.checked).toBe(false);
      expect(autoPinCheckbox.checked).toBe(false);
      expect(document.body.classList.contains('is-compact')).toBe(false);
    });
  });
});
