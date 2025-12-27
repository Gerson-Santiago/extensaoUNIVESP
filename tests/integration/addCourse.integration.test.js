import { SettingsView } from '../../features/settings/ui/SettingsView.js';
import { CoursesView } from '../../features/courses/views/CoursesView/index.js';
import { AddManualModal } from '../../features/courses/components/AddManualModal/index.js';

describe('Integração: Fluxo Manual de Adição de Curso', () => {
  let settingsView;
  let coursesView;
  let container;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Arrange (Setup) - Reset do DOM e Mocks
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

  test('Deve adicionar um curso manualmente e exibi-lo na lista', async () => {
    // Arrange 1: Inicializar SettingsView
    settingsView = new SettingsView({ onNavigate: mockNavigate });
    const settingsEl = settingsView.render();
    container.appendChild(settingsEl);
    settingsView.afterRender();

    // Mock do Orquestrador (Sidepanel) para abrir o modal
    window.addEventListener('request:add-manual-course', () => {
      const modal = new AddManualModal();
      modal.open();
    });

    // Act 1: Abrir Modal "Adicionar Manualmente"
    const btnManual = document.getElementById('btnManualAdd');
    btnManual.click();

    // Assert 1: Verificar se modal abriu
    const modalOverlay = document.querySelector('.modal-overlay');
    expect(modalOverlay).toBeTruthy();
    expect(/** @type {HTMLElement} */ (modalOverlay).style.display).not.toBe('none');

    // Arrange 2: Preencher Formulário
    const nameInput = document.getElementById('manualName');
    const urlInput = document.getElementById('manualUrl');
    const btnSave = document.getElementById('btnSaveManual');

    // Act 2: Preencher e Salvar
    /** @type {HTMLInputElement} */ (nameInput).value = 'Matéria Teste Integração';
    /** @type {HTMLInputElement} */ (urlInput).value = 'https://ava.univesp.br/curso/123';
    btnSave.click();

    // Aguardar callback do storage e fechamento
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert 2: Verificação de Persistência no Storage
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    const setCall = /** @type {jest.Mock} */ (chrome.storage.sync.set).mock.calls[0][0];
    expect(setCall.savedCourses).toBeDefined();
    expect(setCall.savedCourses.length).toBe(1);
    expect(setCall.savedCourses[0].name).toBe('Matéria Teste Integração');

    // Arrange 3: Atualizar mock do get para refletir o salvamento para a próxima view
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
      callback({ savedCourses: setCall.savedCourses });
    });

    // Act 3: Navegar para CoursesView (Simulado renderizando a view)
    coursesView = new CoursesView({ onOpenCourse: jest.fn(), onViewDetails: jest.fn() });
    const coursesEl = coursesView.render();
    container.innerHTML = ''; // Limpar settings
    container.appendChild(coursesEl);
    coursesView.afterRender();

    // Aguardar renderização da lista
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert 3: Verificação de Exibição na Lista
    const listItems = document.querySelectorAll('.item-list li');
    expect(listItems.length).toBe(1);
    expect(listItems[0].textContent).toContain('Matéria Teste Integração');
  });
});
