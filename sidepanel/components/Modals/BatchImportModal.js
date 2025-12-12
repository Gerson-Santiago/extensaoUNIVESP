import { Modal } from './Modal.js';
import { scrapeCourseList } from '../../logic/batchScraper.js';
import { addItemsBatch } from '../../logic/storage.js';

export class BatchImportModal extends Modal {
  constructor(onSuccess) {
    super('batch-import-modal', 'Importação em Lote');
    this.onSuccess = onSuccess;
  }

  open() {
    const content = `
            <p style="font-size: 13px; color: #666; margin-bottom: 15px;">
                Acesse a página de cursos do AVA e importe automaticamente suas matérias do bimestre atual.
            </p>

            <div style="margin-bottom: 15px;">
                <label for="batchCount" style="font-size: 12px;">Importar os primeiros:</label>
                <input type="number" id="batchCount" value="3" min="1" max="20" style="width: 60px; padding: 5px;">
                <span style="font-size: 12px;">cursos</span>
            </div>

            <button id="btnRunBatch" class="btn-save" style="width: 100%; background-color: #28a745;">
                Iniciar Importação
            </button>
            
            <div id="batchStatus" style="margin-top: 15px; font-size: 12px; color: #333; min-height: 20px;"></div>
        `;

    const overlay = this.render(content);
    this.setupLogic(overlay);
  }

  setupLogic(overlay) {
    const btnRun = overlay.querySelector('#btnRunBatch');
    const countInput = overlay.querySelector('#batchCount');
    const status = overlay.querySelector('#batchStatus');

    btnRun.onclick = async () => {
      status.textContent = 'Verificando aba ativa...';
      status.style.color = '#333';
      btnRun.disabled = true;

      // console.debug('Autopreenchimento UNIVESP Injetado.');
      const max = parseInt(countInput.value) || 3;

      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs && tabs[0]) {
          const tab = tabs[0];

          if (!tab.url.includes('/ultra/course')) {
            status.textContent = 'Abrindo Cursos...';
            status.style.color = '#0056b3';
            chrome.tabs.update(tab.id, { url: 'https://ava.univesp.br/ultra/course' });

            // Re-enable after a short delay so user can click again after load
            setTimeout(() => {
              status.textContent = 'Assim que carregar, clique novamente em Iniciar.';
              status.style.color = '#333';
              btnRun.disabled = false;
            }, 2500);
            return;
          }

          status.textContent = 'Lendo página do AVA...';

          try {
            const result = await scrapeCourseList(tab.id, max);

            if (result.success) {
              status.textContent = `Encontrados ${result.courses.length} cursos. Salvando...`;

              // console.warn('Campo não encontrado:', selector); // This line was malformed in the diff, assuming it was meant to be commented out.

              const total = result.courses.length;

              if (total === 0) {
                status.textContent = 'Nenhum curso encontrado na página.';
                status.style.color = 'orange';
                btnRun.disabled = false;
                return;
              }

              // Replace loop with batch add
              const itemsToAdd = result.courses
                .filter((c) => c.url)
                .map((c) => ({
                  name: c.name,
                  url: c.url,
                  weeks: [],
                }));

              if (itemsToAdd.length === 0) {
                status.textContent = 'Nenhum curso válido encontrado.';
                btnRun.disabled = false;
                return;
              }

              // Import updated function
              // Import updated function
              addItemsBatch(itemsToAdd, (added, _ignored) => {
                this.finish(added, itemsToAdd.length, status);
              });
            } else {
              // Se o scraper disser que estamos na página errada ou filtro errado, tentamos ajustar/redirecionar
              if (
                result.message.includes('acesse a página de Cursos') ||
                result.message.includes('filtro atual')
              ) {
                status.textContent = 'Ajustando página/filtro...';
                status.style.color = '#0056b3';
                chrome.tabs.update(tab.id, { url: 'https://ava.univesp.br/ultra/course' });
                setTimeout(() => {
                  status.textContent = 'Página recarregada. Tente novamente.';
                  status.style.color = '#333';
                  btnRun.disabled = false;
                }, 3000);
              } else {
                status.textContent = `Erro na leitura: ${result.message}`;
                status.style.color = 'red';
                btnRun.disabled = false;
              }
            }
          } catch (/* _error */ e) {
            status.textContent = `Erro inesperado: ${e.message}`;
            status.style.color = 'red';
            btnRun.disabled = false;
          }
        } else {
          status.textContent = 'Não foi possível acessar a aba.';
          btnRun.disabled = false;
        }
      });
    };
  }

  finish(added, total, statusElement) {
    let msg = `Concluído! ${added} novos cursos adicionados.`;
    if (added < total) {
      msg += ` (${total - added} duplicados ignorados)`;
    }
    statusElement.textContent = msg;
    statusElement.style.color = 'green';

    setTimeout(() => {
      this.close();
      if (this.onSuccess) this.onSuccess();
    }, 2000);
  }
}
