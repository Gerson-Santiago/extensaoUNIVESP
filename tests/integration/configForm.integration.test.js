import { SettingsView } from '../../features/settings/ui/SettingsView.js';
import { RaManager } from '../../features/settings/logic/raManager.js';

describe('Integration: Config Form Feedback', () => {
  let settingsView;
  let container;
  const mockNavigate = jest.fn();

  beforeEach(() => {
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

    // Mock RaManager validation to return true
    jest.spyOn(RaManager, 'prepareCredentials').mockReturnValue({
      isValid: true,
      fullEmail: 'test@aluno.univesp.br',
      cleanDomain: 'aluno.univesp.br',
      error: null,
    });
  });

  test('should show success message in configFeedback when saving', async () => {
    // 1. Render Settings
    settingsView = new SettingsView({ onNavigate: mockNavigate });
    container.appendChild(settingsView.render());
    settingsView.afterRender();

    // 2. Locate elements
    const saveBtn = document.getElementById('saveConfigBtn');
    const feedbackEl = document.getElementById('configFeedback');

    expect(saveBtn).toBeTruthy();
    expect(feedbackEl).toBeTruthy();
    expect(feedbackEl.style.display).toBe('none'); // Initially hidden (or empty)

    // 3. Trigger Save
    saveBtn.click();

    // 4. Wait for async operations (storage set)
    await new Promise((resolve) => setTimeout(resolve, 0));

    // 5. Verify Storage
    expect(chrome.storage.sync.set).toHaveBeenCalled();

    // 6. Verify Feedback Location and Content
    expect(feedbackEl.textContent).toContain('Configuração salva com sucesso!');
    expect(feedbackEl.style.display).toBe('block');
    expect(feedbackEl.classList.contains('success')).toBe(true);

    // 7. Verify old feedback is NOT used for this action
    const oldFeedback = document.getElementById('settingsFeedback');
    expect(oldFeedback.style.display).not.toBe('block');
  });
});
