import { Modal } from '../../../shared/ui/Modal.js';
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

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
    const h = DOMSafe.createElement;

    // Build content safely using DOMSafe (ADR-012 Security-First)
    const content = h('div', { style: { textAlign: 'center', padding: '10px' } }, [
      h('h3', { style: { color: '#0275d8', marginTop: '0' } }, 'Aguardando Login'),

      h(
        'p',
        { style: { margin: '15px 0', color: '#555', lineHeight: '1.5' } },
        'Para importar seus cursos, precisamos que você esteja logado no ambiente virtual.'
      ),

      h(
        'div',
        {
          style: {
            background: '#f9f9f9',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'left',
            fontSize: '13px',
            border: '1px solid #eee',
          },
        },
        [
          h('strong', {}, 'Passos:'),
          h('ol', { style: { margin: '5px 0 0 20px', padding: '0' } }, [
            h('li', {}, ['Foi aberta uma guia do ', h('strong', {}, 'AVA UNIVESP'), '.']),
            h('li', {}, 'Faça seu login nela (se necessário).'),
            h('li', {}, 'Aguarde a página carregar "Cursos".'),
            h('li', {}, 'Volte aqui e clique em confirmar.'),
          ]),
        ]
      ),

      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, [
        h(
          'button',
          {
            id: 'btnLoginConfirmed',
            className: 'btn-confirm',
            style: {
              padding: '10px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              fontWeight: 'bold',
            },
          },
          'Já realizei o Login'
        ),

        h(
          'button',
          {
            id: 'btnLoginCancel',
            className: 'btn-cancel',
            style: {
              padding: '8px',
              border: '1px solid #ccc',
              background: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
              color: '#666',
            },
          },
          'Cancelar'
        ),
      ]),
    ]);

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
