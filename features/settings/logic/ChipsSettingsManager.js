/**
 * @file ChipsSettingsManager.js
 * @description Gerencia configurações de navegação contextual (Chips)
 * @architecture Settings Feature - Settings Manager
 */

import { Logger } from '../../../shared/utils/Logger.js';

/**
 * @typedef {Object} ChipsSettings
 * @property {boolean} enabled - Se os chips estão habilitados
 * @property {number} maxItems - Quantidade máxima de chips (1-8)
 */

// @ts-check
export class ChipsSettingsManager {
  /**
   * @param {typeof chrome.storage.local} storage - Storage API para testes
   */
  constructor(storage = chrome.storage.local) {
    this.storage = storage;
  }

  /**
   * Carrega configurações de chips do storage
   * @returns {Promise<ChipsSettings>}
   */
  async load() {
    const result = await this.storage.get('chips_settings');
    return /** @type {ChipsSettings} */ (
      result.chips_settings || ChipsSettingsManager.getDefaults()
    );
  }

  /**
   * Salva configurações de chips no storage
   * @param {ChipsSettings} settings
   * @returns {Promise<void>}
   */
  async save(settings) {
    await this.storage.set({ chips_settings: settings });
    /**#LOG_UI*/
    Logger.warn('ChipsSettingsManager', 'Chips settings saved:', settings);
  }

  /**
   * Retorna configurações padrão
   * @returns {ChipsSettings}
   */
  static getDefaults() {
    return {
      enabled: true,
      maxItems: 3,
    };
  }

  /**
   * Anexa listeners aos elementos DOM de chips settings
   * @param {HTMLInputElement} checkbox - Checkbox de ativação
   * @param {HTMLInputElement} slider - Slider de quantidade
   * @param {HTMLElement} valueDisplay - Display do valor
   * @param {HTMLElement} options - Container de opções
   * @returns {Promise<void>}
   */
  async attachListeners(checkbox, slider, valueDisplay, options) {
    if (!checkbox || !slider || !valueDisplay || !options) {
      Logger.warn('ChipsSettingsManager', 'Missing DOM elements for listeners');
      return;
    }

    // Load current settings
    const settings = await this.load();
    checkbox.checked = settings.enabled;
    slider.value = String(settings.maxItems);
    valueDisplay.textContent = String(settings.maxItems);

    // Toggle visibility of slider based on checkbox
    options.style.display = settings.enabled ? 'block' : 'none';

    // Checkbox change listener
    checkbox.addEventListener('change', async () => {
      const enabled = checkbox.checked;
      options.style.display = enabled ? 'block' : 'none';
      await this.save({ enabled, maxItems: parseInt(slider.value) });
    });

    // Slider input listener (update display)
    slider.addEventListener('input', () => {
      valueDisplay.textContent = slider.value;
    });

    // Slider change listener (save)
    slider.addEventListener('change', async () => {
      await this.save({
        enabled: checkbox.checked,
        maxItems: parseInt(slider.value),
      });
    });
  }
}
