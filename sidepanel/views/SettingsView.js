import { scrapeCourseList } from '../logic/batchScraper.js';
import { addItem } from '../logic/storage.js';

export class SettingsView {
    render() {
        const div = document.createElement('div');
        div.className = 'view-settings';
        div.innerHTML = `
            <h2>Configurações</h2>
            
            <div class="settings-content">
                <h3>Importação em Lote</h3>
                <p style="font-size: 12px; color: #666; margin-bottom: 10px;">
                    Acesse a página de cursos do AVA e importe automaticamente suas matérias do bimestre atual.
                </p>

                <div class="form-group">
                    <label for="batchCount">Importar os primeiros:</label>
                    <input type="number" id="batchCount" value="6" min="1" max="20" style="width: 50px; padding: 5px;">
                    <span style="font-size: 12px;">cursos</span>
                </div>

                <button id="btnImportBatch" class="btn-add" style="width: 100%; margin-top: 10px;">
                    Importar Cursos do Bimestre
                </button>
                
                <div id="batchStatus" style="margin-top: 10px; font-size: 12px; color: #333;"></div>
            </div>
        `;
        return div;
    }

    afterRender() {
        const btnImportBatch = document.getElementById('btnImportBatch');
        const batchCountInput = document.getElementById('batchCount');
        const batchStatus = document.getElementById('batchStatus');

        if (btnImportBatch) {
            btnImportBatch.onclick = async () => {
                batchStatus.textContent = 'Iniciando...';
                btnImportBatch.disabled = true;

                const max = parseInt(batchCountInput.value) || 6;

                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    if (tabs && tabs[0]) {
                        const tab = tabs[0];

                        if (!tab.url.includes('/ultra/course')) {
                            batchStatus.textContent = 'Erro: Você não está na página de Cursos do AVA.';
                            btnImportBatch.disabled = false;
                            return;
                        }

                        batchStatus.textContent = 'Analisando página...';

                        const result = await scrapeCourseList(tab.id, max);

                        if (result.success) {
                            batchStatus.textContent = `Sucesso! Adicionando ${result.courses.length} cursos...`;

                            let count = 0;
                            for (const course of result.courses) {
                                if (course.url) {
                                    addItem(course.name, course.url, [], () => { });
                                    count++;
                                }
                            }

                            setTimeout(() => {
                                batchStatus.textContent = `Concluído: ${count} cursos importados.`;
                                btnImportBatch.disabled = false;
                            }, 1000);

                        } else {
                            batchStatus.textContent = `Erro: ${result.message}`;
                            btnImportBatch.disabled = false;
                        }
                    }
                });
            };
        }
    }
}
