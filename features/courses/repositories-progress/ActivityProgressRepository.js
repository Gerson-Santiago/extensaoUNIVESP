/**
 * @file ActivityProgressRepository.js
 * @description CRUD operations for activity progress
 * @architecture Data Layer (repository/)
 */

import { Logger } from '../../../shared/utils/Logger.js';
import { ActivityProgress } from '../models/ActivityProgress.js';

/**
 * @typedef {import('../models/ActivityProgress.js').ActivityProgressData} ActivityProgressData
 */

/**
 * Repository para gerenciar progresso de atividades
 * Armazena em namespace separado: chrome.storage.local.activityProgress
 */
export class ActivityProgressRepository {
  static STORAGE_KEY = 'activityProgress';

  /**
   * Busca progresso de uma atividade específica
   * @param {string} activityId
   * @returns {Promise<ActivityProgressData | null>}
   */
  static async get(activityId) {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEY);
      const allProgress = result[this.STORAGE_KEY] || {};
      return allProgress[activityId] || null;
    } catch (error) {
      /**#LOG_REPOSITORY*/
      Logger.error('ActivityProgressRepository', 'Error getting progress:', error);
      return null;
    }
  }

  /**
   * Busca progresso de múltiplas atividades
   * @param {string[]} activityIds
   * @returns {Promise<Record<string, ActivityProgressData>>}
   */
  static async getMany(activityIds) {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEY);
      const allProgress = result[this.STORAGE_KEY] || {};

      /** @type {Record<string, ActivityProgressData>} */
      const filtered = {};
      activityIds.forEach((id) => {
        if (allProgress[id]) {
          filtered[id] = allProgress[id];
        }
      });

      return filtered;
    } catch (error) {
      /**#LOG_REPOSITORY*/
      Logger.error('ActivityProgressRepository', 'Error getting many:', error);
      return /** @type {Record<string, ActivityProgressData>} */ ({});
    }
  }

  /**
   * Salva progresso de uma atividade
   * @param {ActivityProgressData} progress
   * @returns {Promise<void>}
   */
  static async save(progress) {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEY);
      const allProgress = result[this.STORAGE_KEY] || {};

      allProgress[progress.activityId] = progress;

      await chrome.storage.local.set({ [this.STORAGE_KEY]: allProgress });
    } catch (error) {
      /**#LOG_REPOSITORY*/
      Logger.error('ActivityProgressRepository', 'Error saving:', error);
      throw error;
    }
  }

  /**
   * Alterna status de uma atividade (toggle)
   * @param {string} activityId
   * @returns {Promise<ActivityProgressData>}
   */
  static async toggle(activityId) {
    const current = await this.get(activityId);
    const isCurrentlyDone = ActivityProgress.isCompleted(current);

    const updated = ActivityProgress.fromUserToggle(activityId, !isCurrentlyDone);
    await this.save(updated);

    return updated;
  }

  /**
   * Remove progresso de uma atividade
   * @param {string} activityId
   * @returns {Promise<void>}
   */
  static async delete(activityId) {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEY);
      const allProgress = result[this.STORAGE_KEY] || {};

      delete allProgress[activityId];

      await chrome.storage.local.set({ [this.STORAGE_KEY]: allProgress });
    } catch (error) {
      /**#LOG_REPOSITORY*/
      Logger.error('ActivityProgressRepository', 'Error deleting:', error);
      throw error;
    }
  }

  /**
   * Limpa todo progresso (útil para testes)
   * @returns {Promise<void>}
   */
  static async clear() {
    await chrome.storage.local.set({ [this.STORAGE_KEY]: {} });
  }
}
