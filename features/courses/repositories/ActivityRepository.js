/**
 * @file ActivityRepository.js
 * @description Repositório para persistência de atividades das semanas
 * @architecture Screaming Architecture - Repository Layer
 */

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
    const data = {
      items,
      method,
      updatedAt: new Date().toISOString(),
    };

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
    const result = await chrome.storage.local.get([key]);
    return /** @type {any} */ (result[key]) || null;
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
