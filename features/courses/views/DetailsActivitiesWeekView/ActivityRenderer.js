/**
 * @file ActivityRenderer.js
 * @description Gerencia renderização da lista de atividades
 * @architecture View Layer - Renderer
 */

import { categorizeTask } from '../../logic/TaskCategorizer.js';
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';
import { Logger } from '../../../../shared/utils/Logger.js';

/**
 * Renderiza lista de atividades no container
 */
export class ActivityRenderer {
  /**
   * @param {HTMLElement} container - Container onde renderizar
   * @param {Object} itemFactory - Factory de items de atividade
   * @param {Object} [context] - Contexto opcional { courseName, weekName }
   */
  constructor(container, itemFactory, context = null) {
    this.container = container;
    this.itemFactory = itemFactory;
    this.context = context; // { courseName, weekName }
  }

  /**
   * Renderiza lista completa de atividades
   * @param {Array} items - Atividades da semana
   */
  renderActivities(items) {
    if (!this.container || !items) {
      Logger.warn('ActivityRenderer', 'Container ou items nulos', {
        container: !!this.container,
        items: !!items,
      }); /**#LOG_UI*/
      return;
    }

    Logger.debug('ActivityRenderer', 'Renderizando atividades', {
      count: items.length,
      items,
    }); /**#LOG_UI*/

    try {
      const list = document.createElement('ul');
      list.className = 'activities-list';

      items.forEach((item, index) => {
        const categorized = categorizeTask(item, this.context);
        const li = this.itemFactory.createActivityItem(categorized, index + 1);
        list.appendChild(li);
      });

      this.container.replaceChildren();
      this.container.appendChild(list);
    } catch (error) {
      Logger.error('ActivityRenderer', 'Erro ao renderizar atividades:', error); /**#LOG_UI*/
      const toaster = new Toaster();
      toaster.show('Erro ao carregar atividades.', 'error');
    }
  }

  /**
   * Limpa container
   */
  clear() {
    if (this.container) {
      this.container.replaceChildren();
    }
  }
}
