/**
 * @file HeaderManager.js
 * @description Gerencia os eventos e lógica do cabeçalho da view
 */
export class HeaderManager {
  /**
   * @param {Object} callbacks - { onBack, onRefresh, onClear }
   */
  constructor(callbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Configura os listeners dos botões do cabeçalho
   */
  setupListeners() {
    this._setupButton('backBtn', this.callbacks.onBack);
    this._setupButton('refreshBtn', this.callbacks.onRefresh);
    this._setupButton('clearBtn', this.callbacks.onClear);
  }

  /**
   * Helper privado para configurar botão com segurança
   * @param {string} id
   * @param {Function} handler
   */
  _setupButton(id, handler) {
    const btn = document.getElementById(id);
    if (btn && handler) {
      btn.addEventListener('click', /** @type {EventListener} */ (handler));
    }
  }
}
