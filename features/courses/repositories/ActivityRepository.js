import { Logger } from '../../../shared/utils/Logger.js';

export class ActivityRepository {
  /**
   * Gera a chave de armazenamento para uma semana específica
   * Gera a chave de armazenamento para uma semana específica
   * @param {string} courseId - ID do curso
   * @param {string} contentId - ID do conteúdo (semana)
   * @returns {string} Chave formatada
   */
  static #getKey(courseId, contentId) {
    return `activities_${courseId}_${contentId}`;
  }

  /**
   * Salva as atividades de uma semana no storage local
   * @param {string} courseId - ID do curso
   * @param {string} contentId - ID do conteúdo
   * @param {Array} items - Lista de atividades raspadas
   * @param {string} method - Método utilizado ('DOM' ou 'QuickLinks')
   * @returns {Promise<void>}
   */
  static async save(courseId, contentId, items, method) {
    const key = this.#getKey(courseId, contentId);
    /**#LOG_REPOSITORY*/
    Logger.debug('ActivityRepository', `Salvando dados na chave: ${key} (${items.length} itens)`);
    const data = {
      items,
      method,
      updatedAt: new Date().toISOString(),
    };

    // Usar storage.local que tem 5MB de quota vs 100KB do sync por item
    // e é muito mais rápido, sem afetar o salvamento global de cursos
    await chrome.storage.local.set({ [key]: data });
  }

  /**
   * Recupera as atividades salvas de uma semana
   * @param {string} courseId - ID do curso
   * @param {string} contentId - ID do conteúdo
   * @returns {Promise<{items: Array, method: string, updatedAt: string}|null>} Dados salvos ou null se não existir
   */
  static async get(courseId, contentId) {
    const key = this.#getKey(courseId, contentId);
    /**#LOG_REPOSITORY*/
    Logger.debug('ActivityRepository', `Acessando cache para chave: ${key}`);
    const result = await chrome.storage.local.get([key]);
    return /** @type {Object<string, any>} */ (result)[key] || null;
  }

  /**
   * Remove atividades salvas (limpar cache)
   * @param {string} courseId - ID do curso
   * @param {string} contentId - ID do conteúdo
   * @returns {Promise<void>}
   */
  static async clear(courseId, contentId) {
    const key = this.#getKey(courseId, contentId);
    await chrome.storage.local.remove(key);
  }
}
