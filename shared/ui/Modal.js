/**
 * @file Modal.js
 * @description Componente Base de Layout para Modais.
 * Gerencia overlay, card, título e botão de fechar.
 */
export class Modal {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.element = null;
    this.onCloseCallback = null;
  }

  render(contentHtml) {
    // Remove existing if any
    const existing = document.getElementById(this.id);
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = this.id;
    overlay.className = 'modal-overlay';
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

    card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 16px; color: #333;">${this.title}</h3>
                <button class="btn-close-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body">${contentHtml}</div>
        `;

    overlay.appendChild(card);

    // Event Listeners
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    const closeBtn = card.querySelector('.btn-close-modal');
    if (closeBtn) closeBtn.onclick = () => this.close();

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
