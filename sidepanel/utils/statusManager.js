/**
 * Gerencia a exibição de mensagens de status (toasts) na interface.
 */
export class StatusManager {
  /**
   * @param {string} elementId - ID do elemento onde o status será exibido.
   */
  constructor(elementId = 'settingsFeedback') {
    this.elementId = elementId;
    this.timeoutId = null;
  }

  /**
   * Exibe uma mensagem de status.
   * @param {string} message - Mensagem a ser exibida.
   * @param {'success'|'error'|'info'} type - Tipo da mensagem.
   * @param {number} duration - Duração em ms (padrão 3000ms).
   */
  show(message, type = 'success', duration = 3000) {
    const el = document.getElementById(this.elementId);
    if (!el) return;

    // Limpa timeout anterior se houver
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    el.textContent = message;
    el.style.display = 'block';
    el.className = `status-msg ${type}`;

    // Define cores baseadas no tipo (compatibilidade com CSS existente)
    if (type === 'success') el.style.color = 'green';
    else if (type === 'error') el.style.color = 'red';
    else el.style.color = '#333';

    this.timeoutId = setTimeout(() => {
      el.style.display = 'none';
      this.timeoutId = null;
    }, duration);
  }
}
