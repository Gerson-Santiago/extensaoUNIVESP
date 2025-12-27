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
    console.warn('[ActivityRenderer] ========== INÍCIO ==========');
    console.warn('[ActivityRenderer] Items recebidos:', items?.length || 0);
    console.warn('[ActivityRenderer] Container existe?', !!this.container);
    console.warn('[ActivityRenderer] ItemFactory existe?', !!this.itemFactory);

    if (!this.container || !items) {
      console.error('[ActivityRenderer] ABORTADO - container ou items null');
      return;
    }

    try {
      const list = document.createElement('ul');
      list.className = 'activities-list';

      items.forEach((item, index) => {
        console.warn(`[ActivityRenderer] Processando item ${index + 1}:`, item.name);
        const categorized = categorizeTask(item);
        const li = this.itemFactory.createActivityItem(categorized, index + 1);
        list.appendChild(li);
      });

      this.container.innerHTML = '';
      this.container.appendChild(list);
      console.warn('[ActivityRenderer] ✅ Renderizado com sucesso!', items.length, 'items');
    } catch (error) {
      console.error('[ActivityRenderer] ❌ ERRO ao renderizar:', error);
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
