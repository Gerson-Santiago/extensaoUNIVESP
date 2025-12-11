import { Modal } from './Modal.js';
import { addItem } from '../../logic/storage.js';

export class AddManualModal extends Modal {
    constructor(onSuccess) {
        super('add-manual-modal', 'Adicionar Manualmente');
        this.onSuccess = onSuccess;
    }

    open() {
        const content = `
            <div class="input-group">
                <label style="display: block; margin-bottom: 5px; font-size: 12px;">Nome da Matéria</label>
                <input type="text" id="manualName" class="input-field" style="width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box;">
                
                <label style="display: block; margin-bottom: 5px; font-size: 12px;">URL do AVA</label>
                <input type="text" id="manualUrl" class="input-field" style="width: 100%; margin-bottom: 15px; padding: 8px; box-sizing: border-box;">
                
                <button id="btnSaveManual" class="btn-save" style="width: 100%;">Adicionar</button>
                <div id="manualStatus" style="margin-top: 10px; font-size: 12px; text-align: center;"></div>
            </div>
        `;

        const overlay = this.render(content);
        this.setupLogic(overlay);
    }

    setupLogic(overlay) {
        const btnSave = overlay.querySelector('#btnSaveManual');
        const nameInput = overlay.querySelector('#manualName');
        const urlInput = overlay.querySelector('#manualUrl');
        const status = overlay.querySelector('#manualStatus');

        btnSave.onclick = () => {
            const name = nameInput.value.trim();
            const url = urlInput.value.trim();

            if (!name || !url) {
                status.textContent = 'Preencha todos os campos.';
                status.style.color = 'red';
                return;
            }

            btnSave.disabled = true;
            status.textContent = 'Salvando...';
            status.style.color = '#666';

            addItem(name, url, [], (success, message) => {
                if (success) {
                    status.textContent = message;
                    status.style.color = 'green';
                    setTimeout(() => {
                        this.close();
                        if (this.onSuccess) this.onSuccess();
                    }, 1000);
                } else {
                    status.textContent = message;
                    status.style.color = 'red';
                    btnSave.disabled = false;
                }
            });
        };
    }
}
