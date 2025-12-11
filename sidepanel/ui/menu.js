/**
 * Componente: Menu de Configurações
 * Gerencia a abertura/fechamento do dropdown e os disparos de ação.
 */
export function initMenu({ onAddManual, onAddCurrent, onAddBatch }) {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsMenu = document.getElementById('settingsMenu');

    // Itens do Menu
    const menuManual = document.getElementById('menuAddManual');
    const menuCurrent = document.getElementById('menuAddCurrent');
    const menuBatch = document.getElementById('menuAddBatch');

    // Toggle Menu
    settingsIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita fechar imediatamente ao clicar
        const isVisible = settingsMenu.style.display === 'block';
        settingsMenu.style.display = isVisible ? 'none' : 'block';
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!settingsMenu.contains(e.target) && e.target !== settingsIcon) {
            settingsMenu.style.display = 'none';
        }
    });

    // Ações
    menuManual.addEventListener('click', () => {
        settingsMenu.style.display = 'none';
        if (onAddManual) onAddManual();
    });

    menuCurrent.addEventListener('click', () => {
        settingsMenu.style.display = 'none';
        if (onAddCurrent) onAddCurrent();
    });

    menuBatch.addEventListener('click', () => {
        settingsMenu.style.display = 'none';
        if (onAddBatch) onAddBatch();
    });
}
