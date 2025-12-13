import { Modal } from './Modal.js';
import { scrapeAvailableTerms, processSelectedCourses } from '../../logic/batchScraper.js';
import { addItemsBatch } from '../../logic/storage.js';

export class BatchImportModal extends Modal {
  constructor(onSuccess) {
    super('batch-import-modal', 'Importação em Lote');
    this.onSuccess = onSuccess;
    this.foundTerms = []; // To store fetched terms
  }

  open() {
    const content = `
            <p style="font-size: 13px; color: #666; margin-bottom: 15px;">
                Identificando bimestres e cursos (via ID)...
            </p>

            <div id="batch-step-1" style="display: block;">
                <div id="terms-list" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px; border: 1px solid #eee; padding: 10px;">
                    <div style="text-align: center; color: #999;">Aguarde, lendo...</div>
                </div>
                
                <button id="btnRunBatch" class="btn-save" style="width: 100%; background-color: #28a745;" disabled>
                    Importar Selecionados
                </button>
            </div>
            
            <div id="batchStatus" style="margin-top: 15px; font-size: 12px; color: #333; min-height: 20px;"></div>
        `;

    const overlay = this.render(content);
    this.setupLogic(overlay);
    this.autoLoadTerms(overlay);
  }

  async autoLoadTerms(overlay) {
    const status = overlay.querySelector('#batchStatus');
    const termsList = overlay.querySelector('#terms-list');
    const btnRun = overlay.querySelector('#btnRunBatch');

    status.textContent = 'Verificando aba...';

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || !tabs[0]) {
        status.textContent = 'Erro ao acessar aba.';
        return;
      }
      const tab = tabs[0];

      if (!tab.url.includes('/ultra/course') && !tab.url.includes('bb_router')) {
        status.textContent = 'Redirecionando para Cursos...';
        chrome.tabs.update(tab.id, { url: 'https://ava.univesp.br/ultra/course' });

        // Wait for reload
        setTimeout(() => {
          this.autoLoadTerms(overlay);
        }, 4000);
        return;
      }

      status.textContent = 'Lendo bimestres...';
      const result = await scrapeAvailableTerms(tab.id);

      if (result.success && result.terms) {
        this.foundTerms = result.terms;
        this.renderTerms(termsList);
        status.textContent = 'Selecione os bimestres que deseja importar.';
        btnRun.disabled = false;
      } else {
        termsList.innerHTML = `<div style="color: red; text-align: center;">${result.message || 'Falha ao ler cursos.'}</div>`;
        status.textContent = 'Tente recarregar a página e abrir novamente.';
      }
    });
  }

  renderTerms(container) {
    container.innerHTML = '';

    // Sort terms: Oldest to Newest
    // Format usually: "2025/1 - 1º Bimestre"
    this.foundTerms.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      // Extract year
      const yearAMatch = nameA.match(/(\d{4})/);
      const yearBMatch = nameB.match(/(\d{4})/);
      const yearA = yearAMatch ? parseInt(yearAMatch[1]) : 0;
      const yearB = yearBMatch ? parseInt(yearBMatch[1]) : 0;

      if (yearA !== yearB) return yearA - yearB;

      // Extract period/semester (optional, e.g. 2025/2)
      // Simple string compare for "2025/1" vs "2025/2" works mostly

      // Extract 'Xº Bimestre'
      const bimA = nameA.match(/(\d)º/);
      const bimB = nameB.match(/(\d)º/);
      const valA = bimA ? parseInt(bimA[1]) : 0;
      const valB = bimB ? parseInt(bimB[1]) : 0;

      return valA - valB;
    });

    if (this.foundTerms.length === 0) {
      container.innerHTML = '<div>Nenhum termo encontrado.</div>';
      return;
    }

    this.foundTerms.forEach((term, index) => {
      const div = document.createElement('div');
      div.style.padding = '5px 0';
      div.style.borderBottom = '1px solid #f9f9f9';

      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `term-${index}`;
      checkbox.value = index;
      checkbox.checked = true; // Default selected
      checkbox.style.marginRight = '8px';

      // Label
      const label = document.createElement('label');
      label.htmlFor = `term-${index}`;
      label.style.fontWeight = '500';
      label.textContent = term.name; // e.g. "2025/2 - 4º Bimestre"

      // Count
      const countSpan = document.createElement('span');
      countSpan.style.fontSize = '11px';
      countSpan.style.color = '#777';
      countSpan.style.marginLeft = '5px';
      countSpan.textContent = `(${term.courses.length} disciplinas)`;

      div.appendChild(checkbox);
      div.appendChild(label);
      div.appendChild(countSpan);

      container.appendChild(div);
    });
  }

  setupLogic(overlay) {
    const btnRun = overlay.querySelector('#btnRunBatch');
    const status = overlay.querySelector('#batchStatus');

    btnRun.onclick = async () => {
      const checkboxes = overlay.querySelectorAll('input[type="checkbox"]:checked');
      if (checkboxes.length === 0) {
        status.textContent = 'Selecione pelo menos um bimestre.';
        return;
      }

      btnRun.disabled = true;
      status.textContent = 'Coletando informações dos cursos (Deep Scraping)... Isso pode levar alguns segundos.';

      // Gather all courses from selected terms
      let allCoursesToScrape = [];
      checkboxes.forEach(cb => {
        const termIndex = parseInt(cb.value);
        const term = this.foundTerms[termIndex];
        if (term) {
          allCoursesToScrape = allCoursesToScrape.concat(term.courses);
        }
      });

      // Execute Deep Scrape
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tab = tabs[0];

        const processedList = await processSelectedCourses(tab.id, allCoursesToScrape);

        status.textContent = `Processado! Salvando ${processedList.length} cursos...`;

        if (processedList.length === 0) {
          status.textContent = 'Nenhum curso processado com sucesso.';
          btnRun.disabled = false;
          return;
        }

        const itemsToAdd = processedList.map(c => ({
          name: c.name,
          url: c.url,
          weeks: c.weeks || []
        }));

        addItemsBatch(itemsToAdd, (added, _total) => {
          this.finish(added, itemsToAdd.length, status);
        });
      });
    };
  }

  finish(added, total, statusElement) {
    let msg = `Concluído! ${added} cursos importados.`;
    if (added < total) {
      msg += ` (${total - added} mantidos/ignorados)`;
    }
    statusElement.textContent = msg;
    statusElement.style.color = 'green';

    setTimeout(() => {
      this.close();
      if (this.onSuccess) this.onSuccess();
    }, 2500);
  }
}
