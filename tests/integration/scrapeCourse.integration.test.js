import { SettingsView } from '../../features/settings/ui/SettingsView.js';
import { CourseService } from '../../features/courses/logic/CourseService.js'; // Added import

describe('Integração: Fluxo de Coleta de Curso', () => {
  let settingsView;
  let container;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Preparar (Arrange) - Mocks e DOM
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');
    jest.clearAllMocks();

    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({});
    /** @type {jest.Mock} */ (chrome.storage.local.get).mockResolvedValue({});
    /** @type {jest.Mock} */ (chrome.storage.local.set).mockResolvedValue(undefined);
    /** @type {jest.Mock} */ (chrome.storage.local.remove).mockResolvedValue(undefined);

    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((query, callback) => {
      callback([
        {
          id: 123,
          url: 'https://ava.univesp.br/ultra/courses/_123_1/cl/outline',
          title: 'Matéria Real - Univesp',
        },
      ]);
    });

    chrome.scripting = /** @type {any} */ ({
      executeScript: jest.fn(),
    });
  });

  test('deve coletar dados da aba atual e salvar o curso', async () => {
    // Preparar (Arrange) - Mock da Coleta
    const mockScrapedData = {
      weeks: [
        { name: 'Semana 1', url: 'https://ava.univesp.br/s1' },
        { name: 'Semana 2', url: 'https://ava.univesp.br/s2' },
      ],
      title: 'Matéria Real',
    };

    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      { result: mockScrapedData },
    ]);

    // Renderizar Configurações
    settingsView = new SettingsView({ onNavigate: mockNavigate });
    container.appendChild(settingsView.render());
    settingsView.afterRender();

    // Mock do Orquestrador
    const courseService = new CourseService();
    window.addEventListener('request:scrape-current-tab', () => {
      courseService.addFromCurrentTab(
        () => (document.getElementById('settingsFeedback').textContent = 'sucesso'),
        (msg) => console.error(msg)
      );
    });

    // Agir (Act) - Clicar em "Adicionar Atual"
    const btnAddCurrent = document.getElementById('btnAddCurrent');
    btnAddCurrent.click();

    // Aguardar Operações Assíncronas
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verificar (Assert)
    // 1. Script foi injetado
    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId: 123, allFrames: true },
      func: expect.any(Function),
    });

    // 2. Storage foi atualizado
    expect(chrome.storage.local.set).toHaveBeenCalled();
    // Note: CourseStorage agora usa chrome.storage.local via ChunkedStorage

    // 3. Feedback visual exibido
    const feedbackEl = document.getElementById('settingsFeedback');
    expect(feedbackEl.textContent).toContain('sucesso');
  });

  test('deve lidar graciosamente com falha na coleta (fallback)', async () => {
    // Preparar (Arrange) - Falha no Script
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockRejectedValue(
      new Error('Falha na injeção')
    );

    settingsView = new SettingsView({ onNavigate: mockNavigate });
    container.appendChild(settingsView.render());
    settingsView.afterRender();

    const courseService = new CourseService();
    window.addEventListener('request:scrape-current-tab', () => {
      courseService.addFromCurrentTab(
        () => {},
        (_msg) => {}
      );
    });

    // Agir (Act)
    const btnAddCurrent = document.getElementById('btnAddCurrent');
    btnAddCurrent.click();

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verificar (Assert)
    // Deve salvar mesmo assim, usando título da aba e sem semanas (fallback)
    expect(chrome.storage.local.set).toHaveBeenCalled();
    // Note: CourseStorage agora usa chrome.storage.local via ChunkedStorage
  });
});
