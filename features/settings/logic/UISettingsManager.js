// @ts-check
/**
 * @file UISettingsManager.js
 * @description Gerencia configurações de interface do usuário
 * @architecture Settings Feature - Settings Manager
 */

/**
 * @typedef {Object} UISettings
 * @property {boolean} showAdvancedButtons - Mostrar botões avançados (Rápido vs Completo)
 * @property {boolean} showTasksButton - Mostrar botão de Tarefas (Preview)
 */

export class UISettingsManager {
  /**
   * @param {typeof chrome.storage.local} storage - Storage API para testes
   */
  constructor(storage = chrome.storage.local) {
    this.storage = storage;
  }

  /**
   * Carrega configurações de UI do storage
   * @returns {Promise<UISettings>}
   */
  async load() {
    const result = await this.storage.get('ui_settings');
    return /** @type {UISettings} */ (result.ui_settings || UISettingsManager.getDefaults());
  }

  /**
   * Salva configurações de UI no storage
   * @param {UISettings} settings
   * @returns {Promise<void>}
   */
  async save(settings) {
    await this.storage.set({ ui_settings: settings });
  }

  /**
   * Retorna configurações padrão
   * @returns {UISettings}
   */
  static getDefaults() {
    return {
      showAdvancedButtons: true,
      showTasksButton: true,
    };
  }

  /**
   * Anexa listeners aos elementos DOM de UI settings
   * @param {HTMLInputElement} advBtn - Checkbox de botões avançados
   * @param {HTMLInputElement} tasksBtn - Checkbox de botão de tarefas
   * @returns {Promise<void>}
   */
  async attachListeners(advBtn, tasksBtn) {
    if (!advBtn || !tasksBtn) return;

    // Load current settings
    const settings = await this.load();
    advBtn.checked = settings.showAdvancedButtons;
    tasksBtn.checked = settings.showTasksButton;

    // Save function
    const save = async () => {
      await this.save({
        showAdvancedButtons: advBtn.checked,
        showTasksButton: tasksBtn.checked,
      });
    };

    // Attach listeners
    advBtn.addEventListener('change', save);
    tasksBtn.addEventListener('change', save);
  }
}
