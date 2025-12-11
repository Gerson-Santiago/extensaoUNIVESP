/**
 * Componente: Formulário de Importação em Lote
 */
import { scanAvailableTerms } from '../../logic/batchScraper.js';

export function initBatchForm(onImportItem, onComplete) {
    const modal = document.getElementById('modal-settings'); // Reutilizando ID antigo ou ajustado
    // O ID no HTML ainda é 'modal-settings' para o batch. Vamos manter ou refatorar no futuro.
    // Assumindo que o HTML manteve 'modal-settings' para o batch conforme o passo anterior.

    const closeBtn = document.getElementById('closeSettingsBtn');

    // Steps UI
    const btnScanTerms = document.getElementById('btnScanTerms');
    const batchConfigStep = document.getElementById('batchConfigStep');
    const termSelect = document.getElementById('termSelect');
    const courseLimitInput = document.getElementById('courseLimitInput');
    const previewList = document.getElementById('previewList');
    const btnConfirmImport = document.getElementById('btnConfirmImport');
    const scanStatus = document.getElementById('scanStatus');

    let termsCache = [];

    // --- Actions ---

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetState();
    });

    btnScanTerms.addEventListener('click', async () => {
        scanStatus.innerText = 'Escaneando...';

        // Pega aba ativa
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs && tabs[0]) {
                const tab = tabs[0];
                const result = await scanAvailableTerms(tab.id);

                if (result.error) {
                    scanStatus.innerText = result.error;
                } else if (result.terms && result.terms.length > 0) {
                    termsCache = result.terms;
                    populateTermSelect(termsCache);
                    scanStatus.innerText = '';

                    // Switch UI
                    btnScanTerms.style.display = 'none';
                    batchConfigStep.style.display = 'block';

                    updatePreview();
                } else {
                    scanStatus.innerText = 'Nenhum termo encontrado. Verifique se está em "Cursos abertos".';
                }
            }
        });
    });

    btnConfirmImport.addEventListener('click', () => {
        const termIndex = termSelect.value;
        const limit = parseInt(courseLimitInput.value) || 3;

        if (termsCache[termIndex] && termsCache[termIndex].courses) {
            const coursesToImport = termsCache[termIndex].courses.slice(0, limit);

            if (coursesToImport.length === 0) {
                alert('Nenhuma matéria selecionada.');
                return;
            }

            // Inicia processo de importação
            processImportRecursive(coursesToImport, 0, 0);
        }
    });

    // --- Helpers ---

    function populateTermSelect(terms) {
        termSelect.innerHTML = '';
        terms.forEach((term, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = term.termName;
            termSelect.appendChild(opt);
        });
        if (terms.length > 0) termSelect.value = 0;
    }

    // Listeners para atualizar preview
    termSelect.addEventListener('change', updatePreview);
    courseLimitInput.addEventListener('change', updatePreview);
    courseLimitInput.addEventListener('input', updatePreview);

    function updatePreview() {
        const termIndex = termSelect.value;
        const limit = parseInt(courseLimitInput.value) || 3;

        previewList.innerHTML = '';

        if (termsCache[termIndex] && termsCache[termIndex].courses) {
            const allCourses = termsCache[termIndex].courses;
            const coursesToShow = allCourses.slice(0, limit);

            coursesToShow.forEach(c => {
                const li = document.createElement('li');
                li.textContent = c.name;
                previewList.appendChild(li);
            });

            if (allCourses.length > limit) {
                const moreLi = document.createElement('li');
                moreLi.style.color = '#999';
                moreLi.style.fontStyle = 'italic';
                moreLi.textContent = `... e mais ${allCourses.length - limit} matérias.`;
                previewList.appendChild(moreLi);
            }
        }
    }

    function processImportRecursive(list, idx, count) {
        if (idx >= list.length) {
            modal.style.display = 'none';
            resetState();
            if (onComplete) onComplete(count);
            return;
        }

        const c = list[idx];
        // Chama callback externo para adicionar item
        if (onImportItem) {
            onImportItem(c.name, c.url, () => {
                processImportRecursive(list, idx + 1, count + 1);
            });
        } else {
            // Se não tiver callback, pula (erro)
            processImportRecursive(list, idx + 1, count);
        }
    }

    function resetState() {
        scanStatus.innerText = '';
        batchConfigStep.style.display = 'none';
        btnScanTerms.style.display = 'block';
        termsCache = [];
        previewList.innerHTML = '';
        termSelect.innerHTML = '';
    }

    return {
        open: () => {
            modal.style.display = 'flex';
            resetState();
        }
    };
}
