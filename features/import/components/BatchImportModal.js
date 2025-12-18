import { Modal } from '../../../sidepanel/components/Modals/Modal.js';
import { scrapeAvailableTerms, processSelectedCourses } from '../services/BatchScraper.js';
import { CourseRepository } from '../../courses/data/CourseRepository.js';
import { parseTerm } from '../../courses/logic/TermParser.js';
import { Tabs } from '../../../shared/utils/Tabs.js';

export class BatchImportModal extends Modal {
  constructor(onSuccess) {
    super('batch-import-modal', 'Importação em Lote');
    this.onSuccess = onSuccess;
    this.foundTerms = []; // To store fetched terms
  }

  /**
   * @param {number} [targetTabId] - ID of the AVA tab to scrape. If not provided, tries current.
   */
  open(targetTabId) {
    this.targetTabId = targetTabId;

    const content = `
            <p style="font-size: 13px; color: #666; margin-bottom: 15px;">
                Identificando bimestres e cursos...
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
    this.loadTerms(overlay);
  }

  async loadTerms(overlay) {
    const status = overlay.querySelector('#batchStatus');
    const termsList = overlay.querySelector('#terms-list');
    const btnRun = overlay.querySelector('#btnRunBatch');

    status.textContent = 'Acessando dados da página...';

    // Use passed tabId or get current
    let tabId = this.targetTabId;
    if (!tabId) {
      const currentForFallback = await Tabs.getCurrentTab();
      if (currentForFallback) tabId = currentForFallback.id;
    }

    if (!tabId) {
      status.textContent = 'Erro: Nenhuma aba identificada.';
      status.style.color = 'red';
      return;
    }

    try {
      const result = await scrapeAvailableTerms(tabId);

      if (result.success && result.terms) {
        this.foundTerms = result.terms;
        this.renderTerms(termsList);
        status.textContent = 'Selecione as disciplinas que deseja importar.';
        status.style.color = '#333';
        btnRun.disabled = false;
      } else {
        // Just report error, no smart retry/confirmation here. The Controller handles pre-checks.
        status.textContent = 'Falha ao ler cursos. A página mudou? Tente recarregar a aba.';
        status.style.color = 'orange';
        termsList.innerHTML =
          '<div style="color:red; text-align:center;">Não foi possível ler os cursos.</div>';
      }
    } catch (e) {
      console.error(e);
      status.textContent = 'Erro de comunicação com a página.';
      status.style.color = 'red';
    }
  }

  // NOTE: showConfirmationUI removed as it is now handled by LoginWaitModal upstream.

  renderTerms(container) {
    container.innerHTML = '';

    // Sort terms: Newest to Oldest (Descending)
    // Sort terms: Newest to Oldest (Descending) using centralised parser
    this.foundTerms.sort((a, b) => {
      const parsedA = parseTerm(a.name);
      const parsedB = parseTerm(b.name);
      return parsedB.sortKey - parsedA.sortKey;
    });

    if (this.foundTerms.length === 0) {
      container.innerHTML = '<div>Nenhum termo encontrado.</div>';
      return;
    }

    this.foundTerms.forEach((term, termIndex) => {
      // Create Term Group
      const groupDiv = document.createElement('div');
      groupDiv.className = 'term-group';

      // Header
      const header = document.createElement('header');
      header.className = 'term-header';
      header.textContent = term.name;
      groupDiv.appendChild(header);

      // Courses List
      term.courses.forEach((course, courseIndex) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'course-item';

        // Checkbox using compound ID: termIndex-courseIndex
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `t${termIndex}-c${courseIndex}`;
        checkbox.value = `${termIndex}-${courseIndex}`;
        checkbox.checked = true; // Default selected

        // Label
        const label = document.createElement('label');
        label.htmlFor = `t${termIndex}-c${courseIndex}`;
        label.textContent = course.name;

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(label);
        groupDiv.appendChild(itemDiv);
      });

      container.appendChild(groupDiv);
    });
  }

  setupLogic(overlay) {
    const btnRun = overlay.querySelector('#btnRunBatch');
    const status = overlay.querySelector('#batchStatus');

    btnRun.onclick = async () => {
      const checkboxes = overlay.querySelectorAll('input[type="checkbox"]:checked');
      if (checkboxes.length === 0) {
        status.textContent = 'Selecione pelo menos uma disciplina.';
        return;
      }

      try {
        btnRun.disabled = true;
        status.textContent = 'Coletando informações dos cursos... Isso pode levar alguns segundos.';

        // Gather all selected courses
        const allCoursesToScrape = [];
        checkboxes.forEach((cb) => {
          const parts = cb.value.split('-');
          if (parts.length === 2) {
            const tIdx = parseInt(parts[0], 10);
            const cIdx = parseInt(parts[1], 10);
            const term = this.foundTerms[tIdx];
            if (term && term.courses[cIdx]) {
              const courseRef = { ...term.courses[cIdx], _termName: term.name };
              allCoursesToScrape.push(courseRef);
            }
          }
        });

        // Execute Deep Scrape
        // Use ID we already found
        const tabId = this.targetTabId;
        if (tabId) {
          const processedList = await processSelectedCourses(tabId, allCoursesToScrape);

          status.textContent = `Processado! Salvando ${processedList.length} cursos...`;

          if (processedList.length === 0) {
            status.textContent = 'Nenhum curso processado com sucesso. Tente novamente.';
            return;
          }

          const itemsToAdd = processedList.map((c) => ({
            name: c.name,
            url: c.url,
            weeks: c.weeks || [],
            termName: c.original ? c.original._termName : c._termName || '',
          }));

          CourseRepository.addBatch(itemsToAdd, (added, _total) => {
            this.finish(added, itemsToAdd.length, status);
          });
        }
      } catch (err) {
        console.error(err);
        status.textContent = 'Erro ao processar. Tente recarregar a página.';
        status.style.color = 'red';
      } finally {
        // Only re-enable if not strictly successful (success path handles closing)
        // But for safety, we can re-enable after a timeout or let finish() close it.
        // If finish() is called, model closes. If return early, we simply re-enable.
        if (!status.textContent.includes('Concluído')) {
          btnRun.disabled = false;
        }
      }
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
