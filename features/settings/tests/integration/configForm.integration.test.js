import { SettingsView } from '@features/settings/ui/SettingsView.js';
import { RaManager } from '@features/session/logic/SessionManager.js';

describe('Integração: Feedback do Formulário de Configuração', () => {
  let settingsView;
  let container;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Preparar (Arrange) - Reset do DOM e Mocks
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');
    jest.clearAllMocks();

    // Mock Chrome Storage
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) =>
      callback({})
    );
    /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((items, callback) =>
      callback()
    );

    // Mock validação do RaManager
    jest.spyOn(RaManager, 'prepareCredentials').mockReturnValue({
      isValid: true,
      fullEmail: 'test@aluno.univesp.br',
      cleanDomain: 'aluno.univesp.br',
      error: null,
    });
  });

  test('deve exibir mensagem de sucesso no configFeedback ao salvar', async () => {
    // Preparar (Arrange) - Renderizar Configurações
    settingsView = new SettingsView({ onNavigate: mockNavigate });
    container.appendChild(settingsView.render());
    settingsView.afterRender();

    const saveBtn = document.getElementById('saveConfigBtn');
    const feedbackEl = document.getElementById('configFeedback');

    expect(saveBtn).toBeTruthy();
    expect(feedbackEl).toBeTruthy();
    expect(feedbackEl.style.display).toBe('none'); // Inicialmente oculto

    // Agir (Act) - Clicar em Salvar
    saveBtn.click();

    // Aguardar operações assíncronas (storage set)
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verificar (Assert)
    // 1. Storage foi chamado
    expect(chrome.storage.sync.set).toHaveBeenCalled();

    // 2. Feedback visual correto
    expect(feedbackEl.textContent).toContain('Configuração salva com sucesso!');
    expect(feedbackEl.style.display).toBe('block');
    expect(feedbackEl.classList.contains('success')).toBe(true);

    // 3. Feedback antigo não deve ser usado
    const oldFeedback = document.getElementById('settingsFeedback');
    expect(oldFeedback.style.display).not.toBe('block');
  });
});
