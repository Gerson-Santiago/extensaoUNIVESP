/**
 * @file ActivityRenderer.js
 * @description Gerencia renderização da lista de atividades
 * @architecture View Layer - Renderer
 */

import { categorizeTask } from '../../logic/TaskCategorizer.js';
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';

/**
 * Renderiza lista de atividades no container
 */
export class ActivityRenderer {
  /**
   * @param {HTMLElement} container - Container onde renderizar
   * @param {Object} itemFactory - Factory de items de atividade
   */
  constructor(container, itemFactory) {
    this.container = container;
    this.itemFactory = itemFactory;
  }

  /**
   * Renderiza lista completa de atividades
   * @param {Array} items - Atividades da semana
   */
  renderActivities(items) {
    if (!this.container || !items) return;

    try {
      const list = document.createElement('ul');
      list.className = 'activities-list';

      items.forEach((item, index) => {
        const categorized = categorizeTask(item);
        const li = this.itemFactory.createActivityItem(categorized, index + 1);
        list.appendChild(li);
      });

      this.container.innerHTML = '';
      this.container.appendChild(list);
    } catch (error) {
      console.error('[ActivityRenderer] Erro ao renderizar atividades:', error);
      const toaster = new Toaster();
      toaster.show('Erro ao carregar atividades.', 'error');
    }
  }

  /**
   * Limpa container
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
