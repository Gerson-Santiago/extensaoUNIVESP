import { SettingsView } from '../../features/settings/ui/SettingsView.js';
import { CoursesView } from '../../features/courses/views/CoursesView/index.js';
import { AddManualModal } from '../../features/courses/components/AddManualModal/index.js'; // Added import

describe('Integração: Fluxo Manual de Adição de Curso', () => {
  let settingsView;
  let coursesView;
  let container;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Preparar (Arrange) - Reset do DOM e Mocks
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');

    jest.clearAllMocks();
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) =>
      callback({})
    );
    /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((items, callback) =>
      callback()
    );
  });

  test('deve adicionar um curso manualmente e exibi-lo na lista', async () => {
    // Preparar (Arrange) - Inicializar Views
    settingsView = new SettingsView({ onNavigate: mockNavigate });
    const settingsEl = settingsView.render();
    container.appendChild(settingsEl);
    settingsView.afterRender();

    // Mock do Orquestrador (Sidepanel)
    window.addEventListener('request:add-manual-course', () => {
      const modal = new AddManualModal();
      modal.open();
    });

    // Agir (Act) - Abrir Modal "Adicionar Manualmente"
    const btnManual = document.getElementById('btnManualAdd');
    btnManual.click();

    // Verificar (Assert) - Modal Aberto
    const modalOverlay = document.querySelector('.modal-overlay');
    expect(modalOverlay).toBeTruthy();
    expect(/** @type {HTMLElement} */ (modalOverlay).style.display).not.toBe('none');

    // Preparar (Arrange) - Preencher Formulário
    const nameInput = document.getElementById('manualName');
    const urlInput = document.getElementById('manualUrl');
    const btnSave = document.getElementById('btnSaveManual');

    // Agir (Act) - Preencher e Salvar
    /** @type {HTMLInputElement} */ (nameInput).value = 'Matéria Teste Integração';
    /** @type {HTMLInputElement} */ (urlInput).value = 'https://ava.univesp.br/curso/123';
    btnSave.click();

    // Aguardar callback do storage
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verificar (Assert) - Persistência no Storage
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    const setCall = /** @type {jest.Mock} */ (chrome.storage.sync.set).mock.calls[0][0];
    expect(setCall.savedCourses).toBeDefined();
    expect(setCall.savedCourses.length).toBe(1);
    expect(setCall.savedCourses[0].name).toBe('Matéria Teste Integração');

    // Preparar (Arrange) - Atualizar mock do get para refletir o salvamento
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
      callback({ savedCourses: setCall.savedCourses });
    });

    // Agir (Act) - Navegar para CoursesView (Simulado renderizando a view)
    coursesView = new CoursesView({ onOpenCourse: jest.fn(), onViewDetails: jest.fn() });
    const coursesEl = coursesView.render();
    container.innerHTML = ''; // Limpar settings
    container.appendChild(coursesEl);
    coursesView.afterRender();

    // Aguardar renderização
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verificar (Assert) - Exibição na Lista
    const listItems = document.querySelectorAll('.item-list li');
    expect(listItems.length).toBe(1);
    expect(listItems[0].textContent).toContain('Matéria Teste Integração');
  });
});
