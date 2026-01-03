import { Logger } from '../../../shared/utils/Logger.js';
import { StorageGuard } from '../../../shared/utils/StorageGuard.js';

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

    // ATOMIC SAVE: Usa Optimistic Locking e Retry
    await StorageGuard.atomicSave(key, (currentState) => {
      // currentState é o array 'items' (desembrulhado pelo Guard)
      // Se null, inicializa vazio
      const currentItems = currentState ? currentState.items : [];

      // LÓGICA DE MERGE INTELIGENTE
      // Preserva o status 'completed' se já estiver true localmente
      const mergedItems = items.map((newItem) => {
        const existingItem = currentItems.find((i) => i.id === newItem.id);
        if (!existingItem) return newItem;

        return {
          ...newItem,
          // Preserva completed: true se já marcado, caso contrário usa o novo
          completed: existingItem.completed || newItem.completed,
          // Preserva notas manuais se a nova não existir
          // (Assumindo que podemos ter outros campos no futuro)
        };
      });

      return {
        items: mergedItems,
        method,
        updatedAt: new Date().toISOString(),
      };
    });
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
    return await StorageGuard.get(key);
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
