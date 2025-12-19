import { Modal } from '../../../shared/ui/Modal.js';

export class LoginWaitModal extends Modal {
  /**
   * @param {Object} callbacks
   * @param {() => void} callbacks.onConfirm - Called when user clicks "Já fiz Login"
   * @param {() => void} [callbacks.onCancel] - Called when user cancels (optional override)
   */
  constructor({ onConfirm, onCancel }) {
    super('login-wait-modal', 'Preparando Ambiente');
    this.onConfirm = onConfirm;
    this.onCancelCallback = onCancel;
  }

  open() {
    const content = `
      <div style="text-align: center; padding: 10px;">
        <h3 style="color: #0275d8; margin-top: 0;">Aguardando Login</h3>
        
        <p style="margin: 15px 0; color: #555; line-height: 1.5;">
          Para importar seus cursos, precisamos que você esteja logado no ambiente virtual.
        </p>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: left; font-size: 13px; border: 1px solid #eee;">
          <strong>Passos:</strong>
          <ol style="margin: 5px 0 0 20px; padding: 0;">
            <li>Foi aberta uma guia do <strong>AVA UNIVESP</strong>.</li>
            <li>Faça seu login nela (se necessário).</li>
            <li>Aguarde a página carregar "Cursos".</li>
            <li>Volte aqui e clique em confirmar.</li>
          </ol>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="btnLoginConfirmed" class="btn-confirm" style="padding: 10px; background: #28a745; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">
            Já realizei o Login
          </button>
          <button id="btnLoginCancel" class="btn-cancel" style="padding: 8px; border: 1px solid #ccc; background: white; cursor: pointer; border-radius: 4px; color: #666;">
            Cancelar
          </button>
        </div>
      </div>
    `;

    const overlay = this.render(content);
    this.setupEvents(overlay);
  }

  setupEvents(overlay) {
    const btnConfirm = overlay.querySelector('#btnLoginConfirmed');
    const btnCancel = overlay.querySelector('#btnLoginCancel');

    if (btnConfirm) {
      btnConfirm.onclick = () => {
        // We close this modal and trigger the callback to proceed
        this.close();
        if (this.onConfirm) this.onConfirm();
      };
    }

    if (btnCancel) {
      btnCancel.onclick = () => {
        this.close();
        if (this.onCancelCallback) this.onCancelCallback();
      };
    }
  }
}
