import { Modal } from './Modal.js';
import { scrapeCourseList } from '../../logic/batchScraper.js';
import { addItem } from '../../logic/storage.js';

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
                <input type="number" id="batchCount" value="6" min="1" max="20" style="width: 60px; padding: 5px;">
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

            const max = parseInt(countInput.value) || 6;

            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (tabs && tabs[0]) {
                    const tab = tabs[0];

                    if (!tab.url.includes('/ultra/course')) {
                        status.textContent = 'Erro: Você deve estar na página "Cursos" do AVA.';
                        status.style.color = 'red';
                        btnRun.disabled = false;
                        return;
                    }

                    status.textContent = 'Lendo página do AVA...';

                    try {
                        const result = await scrapeCourseList(tab.id, max);

                        if (result.success) {
                            status.textContent = `Encontrados ${result.courses.length} cursos. Salvando...`;

                            let addedCount = 0;
                            let itemsProcessed = 0;
                            const total = result.courses.length;

                            if (total === 0) {
                                status.textContent = 'Nenhum curso encontrado na página.';
                                status.style.color = 'orange';
                                btnRun.disabled = false;
                                return;
                            }

                            // Replace loop with batch add
                            const itemsToAdd = result.courses
                                .filter(c => c.url)
                                .map(c => ({
                                    name: c.name,
                                    url: c.url,
                                    weeks: []
                                }));

                            if (itemsToAdd.length === 0) {
                                status.textContent = 'Nenhum curso válido encontrado.';
                                btnRun.disabled = false;
                                return;
                            }

                            // Import updated function
                            import('../../logic/storage.js').then(({ addItemsBatch }) => {
                                addItemsBatch(itemsToAdd, (added, ignored) => {
                                    this.finish(added, itemsToAdd.length, status, btnRun);
                                });
                            });
                        } else {
                            status.textContent = `Erro na leitura: ${result.message}`;
                            status.style.color = 'red';
                            btnRun.disabled = false;
                        }
                    } catch (e) {
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

    finish(added, total, statusElement, btnElement) {
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
