import { Modal } from './Modal.js';
import { CourseRepository } from '../../../features/courses/data/CourseRepository.js';

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
                
                <label style="display: block; margin-bottom: 5px; font-size: 12px;">Bimestre</label>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="number" id="manualYear" class="input-field" style="flex: 2" value="${new Date().getFullYear()}">
                    <select id="manualSemester" class="input-field" style="flex: 1">
                        <option value="1">S1</option>
                        <option value="2" selected>S2</option>
                    </select>
                    <select id="manualTerm" class="input-field" style="flex: 1">
                        <option value="1">1º Bim</option>
                        <option value="2" selected>2º Bim</option>
                    </select>
                </div>
                
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
    const yearInput = overlay.querySelector('#manualYear');
    const semesterSelect = overlay.querySelector('#manualSemester');
    const termSelect = overlay.querySelector('#manualTerm');
    const status = overlay.querySelector('#manualStatus');

    btnSave.onclick = () => {
      const name = nameInput.value.trim();
      const url = urlInput.value.trim();
      const year = yearInput.value;
      const semester = semesterSelect.value;
      const termRaw = termSelect.value;

      if (!name || !url) {
        status.textContent = 'Preencha nome e URL.';
        status.style.color = 'red';
        return;
      }

      // Calculate logic term (S1->B1/B2, S2->B3/B4)
      // Actually standard is YYYY/S - X Bimestre
      // But termParser expects inputs like "2025/2 - 4º Bimestre"
      // If semester is 2, term 1 is 3rd Bimester total, term 2 is 4th.

      let realTermIndex = parseInt(termRaw);
      if (semester === '2') {
        realTermIndex += 2;
      }

      // Construct term string compatible with termParser
      const termName = `${year}/${semester} - ${realTermIndex}º Bimestre`;

      btnSave.disabled = true;
      status.textContent = 'Salvando...';
      status.style.color = '#666';

      CourseRepository.add(name, url, [], { termName: termName }, (success, message) => {
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
