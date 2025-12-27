/**
 * @file ContextualChips.js
 * @description Componente UI para exibição de chips de navegação contextual
 */

/**
 * @typedef {import('../services/HistoryService.js').HistoryItem} HistoryItem
 */

export class ContextualChips {
  /**
   * @param {HTMLElement} container - Elemento onde os chips serão renderizados
   */
  constructor(container) {
    this.container = container;
    this.listeners = {
      navigate: [],
      remove: [],
    };
  }

  /**
   * Registra listeners para eventos
   * @param {'navigate'|'remove'} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * Emite um evento
   * @param {'navigate'|'remove'} event
   * @param {*} data
   */
  _emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  }

  /**
   * Renderiza a lista de chips
   * @param {HistoryItem[]} items
   */
  render(items) {
    // Limpar container
    this.container.innerHTML = '';

    // Criar container de scroll se não existir (ou usar o próprio container se for o wrapper)
    // Pela spec, o container principal pode ser o .chips-container
    this.container.classList.add('chips-container');

    if (!items || items.length === 0) {
      return;
    }

    items.forEach((item) => {
      try {
        const chip = this._createChip(item);
        this.container.appendChild(chip);
      } catch (error) {
        console.error(`[ContextualChips] Erro ao criar chip:`, error);
      }
    });
  }

  /**
   * Cria elemento do chip
   * @param {HistoryItem} item
   * @returns {HTMLElement}
   */
  _createChip(item) {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');

    // Label com truncamento
    const span = document.createElement('span');
    span.textContent = item.label;
    chip.appendChild(span);

    // Botão de remover
    const removeBtn = document.createElement('div');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '×'; // U+00D7 Multiplication Sign (ou use SVG)
    removeBtn.setAttribute('aria-label', `Remover ${item.label}`);

    // Evento de remover
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._emit('remove', item.id);
    });

    chip.appendChild(removeBtn);

    // Evento de navegação (click no chip)
    chip.addEventListener('click', () => {
      this._emit('navigate', item);
    });

    // Acessibilidade (Enter/Space)
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._emit('navigate', item);
      }
    });

    return chip;
  }
}
