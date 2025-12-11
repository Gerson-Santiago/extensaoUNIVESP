/**
 * Componente: Formulário de Adição Manual
 */
export function initManualForm(onSubmit) {
    const modal = document.getElementById('modal-manual-add');
    const closeBtn = document.getElementById('closeManualBtn');
    const confirmBtn = document.getElementById('btnConfirmManualAdd');

    // Inputs
    const nameInput = document.getElementById('manualNameInput');
    const urlInput = document.getElementById('manualUrlInput');

    // Fechar
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        clearInputs();
    });

    // Confirmar
    confirmBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (name && url) {
            if (onSubmit) {
                // Chama callback enviando os dados
                onSubmit(name, url);
            }
            modal.style.display = 'none';
            clearInputs();
        } else {
            alert('Por favor, preencha o Nome e a URL.');
        }
    });

    function clearInputs() {
        nameInput.value = '';
        urlInput.value = '';
    }

    // Retorna função para abrir o modal externamente
    return {
        open: () => {
            modal.style.display = 'flex';
            nameInput.focus();
        }
    };
}
