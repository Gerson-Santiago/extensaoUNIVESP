/**
 * @file Modal.js
 * @description Componente Base de Layout para Modais.
 * Gerencia overlay, card, título e botão de fechar.
 */
// DOMSafe removido - Strict DOM creation (ADR-012)

export class Modal {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.element = null;
    this.onCloseCallback = null;
  }

  /**
   * Renderiza o conteúdo no modal de forma segura
   * @param {string|HTMLElement} contentHtml - HTML ou Texto do conteúdo
   */
  render(contentHtml) {
    // Remove existing if any
    const existing = document.getElementById(this.id);
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = this.id;
    overlay.className = 'modal-overlay';
    // Estilos inline mantidos para garantir layout sem CSS externo
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

    const card = document.createElement('div');
    card.className = 'modal-card';
    card.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 350px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;

    // Cabeçalho Seguro (DOM APIs)
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';

    const h3 = document.createElement('h3');
    h3.style.cssText = 'margin: 0; font-size: 16px; color: #333;';
    h3.textContent = this.title;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close-modal';
    closeBtn.style.cssText = 'background: none; border: none; font-size: 20px; cursor: pointer;';
    closeBtn.textContent = '×'; // Changed &times; to utf-8 char for textContent safety

    header.appendChild(h3);
    header.appendChild(closeBtn);

    // Corpo Seguro
    const body = document.createElement('div');
    body.className = 'modal-body';

    // Support HTMLElement or String (Text)
    if (contentHtml instanceof Node) {
      body.appendChild(contentHtml);
    } else {
      body.textContent = String(contentHtml || '');
    }

    card.appendChild(header);
    card.appendChild(body);
    overlay.appendChild(card);

    // Event Listeners
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    closeBtn.addEventListener('click', () => this.close());

    this.element = overlay;
    document.body.appendChild(overlay);
    return overlay;
  }

  close() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    if (this.onCloseCallback) this.onCloseCallback();
  }

  setOnClose(callback) {
    this.onCloseCallback = callback;
  }
}
