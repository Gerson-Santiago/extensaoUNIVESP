/**
 * @file AddManualModal.js
 * @description Modal para adicionar matéria manualmente.
 * Localizada em: features/courses/components/AddManualModal/index.js
 */
import { Modal } from '../../../../shared/ui/Modal.js';
import { CourseRepository } from '../../repositories/CourseRepository.js';

export class AddManualModal extends Modal {
  constructor(onSuccess) {
    super('add-manual-modal', 'Adicionar Manualmente');
    this.onSuccess = onSuccess;
  }

  open() {
    const container = document.createElement('div');
    container.className = 'input-group';

    // Helper para labels
    const createLabel = (text) => {
      const lbl = document.createElement('label');
      lbl.textContent = text;
      Object.assign(lbl.style, { display: 'block', marginBottom: '5px', fontSize: '12px' });
      return lbl;
    };

    // Helper para inputs
    const createInput = (id, type = 'text', mb = '10px') => {
      const inp = document.createElement('input');
      inp.type = type;
      inp.id = id;
      inp.className = 'input-field';
      Object.assign(inp.style, {
        width: '100%',
        marginBottom: mb,
        padding: '8px',
        boxSizing: 'border-box',
      });
      return inp;
    };

    // Nome
    container.appendChild(createLabel('Nome da Matéria'));
    container.appendChild(createInput('manualName', 'text', '10px'));

    // URL
    container.appendChild(createLabel('URL do AVA'));
    container.appendChild(createInput('manualUrl', 'text', '15px'));

    // Bimestre
    container.appendChild(createLabel('Bimestre'));

    const flexDiv = document.createElement('div');
    Object.assign(flexDiv.style, { display: 'flex', gap: '10px', marginBottom: '15px' });

    const yearInput = createInput('manualYear', 'number', '0');
    yearInput.style.flex = '2';
    yearInput.value = String(new Date().getFullYear());

    const semSelect = document.createElement('select');
    semSelect.id = 'manualSemester';
    semSelect.className = 'input-field';
    semSelect.style.flex = '1';

    const optS1 = document.createElement('option');
    optS1.value = '1';
    optS1.textContent = 'S1';
    const optS2 = document.createElement('option');
    optS2.value = '2';
    optS2.textContent = 'S2';
    optS2.selected = true;
    semSelect.append(optS1, optS2);

    const termSelect = document.createElement('select');
    termSelect.id = 'manualTerm';
    termSelect.className = 'input-field';
    termSelect.style.flex = '1';

    const optB1 = document.createElement('option');
    optB1.value = '1';
    optB1.textContent = '1º Bim';
    const optB2 = document.createElement('option');
    optB2.value = '2';
    optB2.textContent = '2º Bim';
    optB2.selected = true;
    termSelect.append(optB1, optB2);

    flexDiv.append(yearInput, semSelect, termSelect);
    container.appendChild(flexDiv);

    // Botão Salvar
    const btnSave = document.createElement('button');
    btnSave.id = 'btnSaveManual';
    btnSave.className = 'btn-save';
    btnSave.style.width = '100%';
    btnSave.textContent = 'Adicionar';
    container.appendChild(btnSave);

    // Status
    const statusDiv = document.createElement('div');
    statusDiv.id = 'manualStatus';
    Object.assign(statusDiv.style, { marginTop: '10px', fontSize: '12px', textAlign: 'center' });
    container.appendChild(statusDiv);

    const overlay = this.render(container);
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
