import { DOMSafe } from '../../../../shared/utils/DOMSafe.js';
/**
 * @file ActivityItemFactory.js
 * @description Factory para criação de items de atividade
 * @architecture View Layer - Factory
 */

/**
 * Factory para criar elementos HTML de atividades
 */
export class ActivityItemFactory {
  /**
   * @param {Function} onItemClick - Callback ao clicar em "Ir"
   */
  constructor(onItemClick) {
    this.onItemClick = onItemClick;
  }

  /**
   * Cria item de atividade com scroll automático
   * @param {Object} task - Tarefa categorizada
   * @param {number} position - Posição na lista (1-indexed)
   * @returns {HTMLElement}
   */
  createActivityItem(task, position) {
    const li = document.createElement('li');
    li.className = 'activity-item';

    const icon = ActivityItemFactory.getTypeIcon(task.type);

    li.innerHTML = `
      <span class="activity-position">#${DOMSafe.escapeHTML(String(position))}</span>
      <span class="activity-icon">${icon}</span>
      <span class="activity-name">${DOMSafe.escapeHTML(task.original.name)}</span>
      <button class="btn-scroll" data-id="${task.id}">Ir →</button>
    `;

    // Evento de scroll
    const scrollBtn = li.querySelector('.btn-scroll');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        if (this.onItemClick) {
          this.onItemClick(task.id, task.original.url);
        }
      });
    }

    return li;
  }

  /**
   * Retorna ícone para o tipo de atividade
   * @param {string} type - Tipo da atividade
   * @returns {string} Emoji do ícone
   */
  static getTypeIcon(type) {
    const icons = {
      // Tipos do TaskCategorizer (UPPERCASE)
      VIDEOAULA: '🎥',
      QUIZ: '📝',
      TEXTO_BASE: '📖',
      VIDEO_BASE: '🎬',
      APROFUNDANDO: '🔍',

      // Novos Tipos
      ATIVIDADE_AVALIATIVA: '📋',
      FORUM_TEMATICO: '💬',
      FORUM_DUVIDAS: '❓',
      QUIZ_OBJETO_EDUCACIONAL: '🎮',
      MATERIAL_BASE: '📚',
      VIDEO_BASE_COMPLEMENTAR: '🎬',

      // Fallback/Legacy
      videoaula: '🎥',
      quiz: '📝',
      forum: '💬',
      tarefa: '📄',
      leitura: '📚',
      link: '🔗',

      OUTROS: '📌',
    };

    // Tenta encontrar direto ou lowercase
    return icons[type] || icons[type ? type.toLowerCase() : ''] || icons['OUTROS'];
  }
}
