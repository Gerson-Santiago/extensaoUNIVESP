/**
 * @file HistoryService.js
 * @description Gerencia histórico de navegação recente por curso (LRU)
 */

export class HistoryService {
  /**
   * @param {number} maxItems - Limite de itens por curso
   */
  constructor(maxItems = 10) {
    this.maxItems = maxItems;
    this.storageKeyPrefix = 'recent_access_';
  }

  /**
   * Adiciona um item ao histórico do curso.
   * Se já existir, move para o topo.
   * @param {string} courseId
   * @param {object} item - { id, label, targetId, url }
   */
  async push(courseId, item) {
    const key = this._getKey(courseId);
    const history = await this.getRecent(courseId);

    // Remover duplicata se existir (pelo targetId ou url)
    const filtered = history.filter((h) => h.id !== item.id && h.targetId !== item.targetId);

    // Adicionar no início (Topo da pilha)
    filtered.unshift(item);

    // Limitar tamanho (LRU)
    const trimmed = filtered.slice(0, this.maxItems);

    await chrome.storage.local.set({ [key]: trimmed });
    return trimmed;
  }

  /**
   * Remove um item específico do histórico.
   * @param {string} courseId
   * @param {string} itemId
   */
  async remove(courseId, itemId) {
    const key = this._getKey(courseId);
    const history = await this.getRecent(courseId);

    const filtered = history.filter((h) => h.id !== itemId);

    await chrome.storage.local.set({ [key]: filtered });
    return filtered;
  }

  /**
   * Recupera o hitórico de um curso.
   * @param {string} courseId
   * @returns {Promise<Array>}
   */
  async getRecent(courseId) {
    const key = this._getKey(courseId);
    const result = await chrome.storage.local.get(key);
    return result[key] || [];
  }

  /**
   * Limpa histórico de um curso.
   */
  async clear(courseId) {
    const key = this._getKey(courseId);
    await chrome.storage.local.remove(key);
  }

  _getKey(courseId) {
    // Normalizar courseId removendo underscores se necessário, mas mantendo consistência
    return `${this.storageKeyPrefix}${courseId}`;
  }
}
