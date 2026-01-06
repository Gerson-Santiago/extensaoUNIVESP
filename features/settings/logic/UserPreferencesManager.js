/**
 * @file UserPreferencesManager.js
 * @description Gerencia preferências do usuário (Auto-Pin)
 * @architecture Settings Feature - Settings Manager (ISSUE-022)
 */

import { Logger } from '../../../shared/utils/Logger.js';

// @ts-check
/**
 * @typedef {Object} UserPreferences
 * @property {'compact'|'comfortable'} density - Densidade visual
 * @property {boolean} autoPinLastWeek - Lembrar última semana visitada
 * @property {number|null} lastWeekNumber - Número da última semana visitada
 */

export class UserPreferencesManager {
    /**
     * @param {typeof chrome.storage.local} storage - Storage API para testes
     */
    constructor(storage = chrome.storage.local) {
        this.storage = storage;
    }

    /**
     * Carrega preferências do usuário do storage
     * @returns {Promise<UserPreferences>}
     */
    async load() {
        const result = await this.storage.get('user_preferences');
        return /** @type {UserPreferences} */ (
            result.user_preferences || UserPreferencesManager.getDefaults()
        );
    }

    /**
     * Salva preferências do usuário no storage
     * @param {UserPreferences} preferences
     * @returns {Promise<void>}
     */
    async save(preferences) {
        await this.storage.set({ user_preferences: preferences });
        Logger.info('UserPreferencesManager', 'User preferences saved:', preferences);
    }

    /**
   * Retorna preferências padrão
   * @returns {UserPreferences}
   */
    static getDefaults() {
        return {
            density: 'comfortable',  // Mantido para compatibilidade com storage existente
            autoPinLastWeek: false,
            lastWeekNumber: null,
        };
    }

    /**
     * Anexa listeners aos elementos DOM de preferências do usuário
     * @param {HTMLInputElement} autoPinCheckbox - Checkbox de auto-pin
     * @returns {Promise<void>}
     */
    async attachListeners(autoPinCheckbox) {
        if (!autoPinCheckbox) {
            Logger.warn('UserPreferencesManager', 'Missing DOM element for autoPinCheckbox');
            return;
        }

        // Load current preferences
        const preferences = await this.load();
        autoPinCheckbox.checked = preferences.autoPinLastWeek;

        // Checkbox change listener
        autoPinCheckbox.addEventListener('change', async () => {
            await this.save({
                ...preferences,
                autoPinLastWeek: autoPinCheckbox.checked
            });
        });
    }
}
