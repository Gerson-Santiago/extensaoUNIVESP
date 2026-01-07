// @ts-check
import { Toaster } from '../../../shared/ui/feedback/Toaster.js';
import { ConfigForm } from './components/ConfigForm.js';
import { Logger } from '../../../shared/utils/Logger.js';
import { SettingsController } from '../logic/SettingsController.js';
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';
import { ChipsSettingsManager } from '../logic/ChipsSettingsManager.js';
import { UISettingsManager } from '../logic/UISettingsManager.js';
import { UserPreferencesManager } from '../logic/UserPreferencesManager.js';
import { SettingsAboutView } from '../views/SettingsAboutView.js'; // Issue-023

export class SettingsView {
  constructor(callbacks = {}) {
    this.onNavigate = callbacks.onNavigate;
    this.onImportBatch = callbacks.onImportBatch;
    this.feedback = new Toaster('settingsFeedback');
    this.configForm = new ConfigForm(new Toaster('configFeedback'));

    // Initialize Controller with dependencies
    this.controller = new SettingsController({
      toaster: this.feedback,
      logger: Logger,
    });

    // Initialize Settings Managers
    this.chipsManager = new ChipsSettingsManager();
    this.uiManager = new UISettingsManager();
    this.preferencesManager = new UserPreferencesManager();
  }

  render() {
    const h = DOMSafe.createElement;

    // Helper for dividers
    const divider = () => h('hr', { className: 'divider' });

    // Helper for section wrapper (visual padronizado)
    const section = (title, description, content) =>
      h('div', { className: 'settings-content' }, [
        h('h3', {}, title),
        h('p', { className: 'config-desc' }, description),
        content,
      ]);

    // Chips Section
    const chipsSettings = h('div', { className: 'chips-settings' }, [
      h('label', { className: 'setting-item' }, [
        h('input', { type: 'checkbox', id: 'chipsEnabled' }),
        h('span', {}, 'Exibir chips de navegação'),
      ]),
      h('div', { id: 'chipsOptions', className: 'chips-options', style: { display: 'block' } }, [
        h('label', { className: 'setting-item' }, [
          h('span', {}, 'Quantidade de chips:'),
          h('div', { className: 'slider-container' }, [
            h('input', {
              type: 'range',
              id: 'chipsMaxItems',
              min: '1',
              max: '8',
              value: '3',
              step: '1',
            }),
            h('span', { id: 'chipsMaxValue', className: 'slider-value' }, '3'),
          ]),
        ]),
      ]),
    ]);

    // UI Settings
    const uiSettings = h('div', { className: 'ui-settings' }, [
      h('label', { className: 'setting-item' }, [
        h('input', { type: 'checkbox', id: 'showAdvancedButtons', checked: false }),
        h('span', {}, 'Ativar Botão Rápido'),
      ]),
      h(
        'p',
        { className: 'setting-hint' },
        'Mostra botão de verificação rápida além do botão padrão (Completo).'
      ),
      h('label', { className: 'setting-item' }, [
        h('input', { type: 'checkbox', id: 'showTasksButton', checked: true }),
        h('span', {}, 'Ativar Botão de Tarefas (Preview)'),
      ]),
      h(
        'p',
        { className: 'setting-hint' },
        "Habilita o botão 'Tarefas' para ver o resumo sem abrir."
      ),
    ]);

    // User Preferences Section - AGORA COM POPUP TOGGLE
    const userPrefsContent = h('div', {}, [
      // Auto-Pin
      h('label', { className: 'setting-item' }, [
        h('input', { type: 'checkbox', id: 'autoPinLastWeek' }),
        h('span', {}, 'Lembrar Última Semana Visitada'),
      ]),
      h(
        'p',
        { className: 'setting-hint' },
        'Reabre automaticamente a última semana que você estava visualizando.'
      ),
      divider(),
      // Popup Toggle (movido de ConfigForm)
      h('label', { className: 'setting-item' }, [
        h('input', { type: 'checkbox', id: 'popupToggle' }),
        h('span', {}, 'Ativar Popup (Desativado por padrão)'),
      ]),
      h(
        'p',
        { className: 'setting-hint' },
        'Escolha o que acontece ao clicar no ícone da extensão: Popup ou Sidepanel.'
      ),
    ]);

    // Helper for buttons
    const btn = (id, icon, label, extraStyle = '') =>
      h('button', { id, className: 'action-card small-action', style: extraStyle }, [
        h('span', { className: 'icon' }, icon),
        h('span', { className: 'label' }, label),
      ]);

    // Privacy Section
    const privacyActions = h('div', { className: 'action-list' }, [
      btn('btnExport', '⬇️', 'Baixar Meus Dados (Backup)'),
      btn('btnImport', '⬆️', 'Restaurar Backup'),
    ]);

    // Manage Section
    const manageActions = h('div', { className: 'action-list' }, [
      btn('btnManualAdd', '✏️', 'Adicionar Manualmente'),
      btn('btnAddCurrent', '➕', 'Adicionar Página Atual'),
      btn('btnBatchImport', '📦', 'Importar em Lote (AVA)'),
      divider(),
      btn(
        'btnClearAll',
        '🗑️',
        'Remover Todas as Matérias',
        'border-color: #ffcccc; color: #d9534f;'
      ),
    ]);

    // Help Section
    const helpActions = h(
      'div',
      { className: 'action-list' },
      btn('btnFeedback', '📢', 'Enviar Feedback')
    );

    return h('div', { className: 'view-settings' }, [
      h('h2', {}, 'Configurações'),
      this.configForm.render(), // ConfigForm já tem settings-content
      divider(),

      section(
        'Navegação Contextual (Chips)',
        'Configure a barra de navegação rápida entre semanas.',
        chipsSettings
      ),
      divider(),

      section(
        'Interface & Funcionalidades',
        'Personalize o que você vê na lista de semanas.',
        uiSettings
      ),
      divider(),

      section(
        'Preferências do Usuário',
        'Adapte a interface ao seu estilo de uso.',
        userPrefsContent
      ),
      divider(),

      section(
        'Privacidade e Dados',
        'Gerencie seus dados locais. A extensão segue a política Local-First.',
        privacyActions
      ),
      divider(),

      section('Gerenciar Matérias', 'Opções para adicionar ou remover cursos.', manageActions),
      divider(),

      section('Ajuda e Feedback', 'Encontrou um problema ou tem uma sugestão?', helpActions),
      divider(),

      // About & Diagnostics Section (ISSUE-023)
      (() => {
        const aboutView = new SettingsAboutView({
          version: this.controller.getAppVersion(),
          diagnosticEnabled: this.controller.getDiagnosticState(),
          onToggleDiagnostic: (enabled) => this.controller.handleToggleDiagnostic(enabled),
        });
        return aboutView.element; // Directly returning element as section helper expects content
      })(),

      divider(),

      // Danger Zone Section (ISSUE-020) - com visual padronizado
      h('div', { className: 'settings-content' }, [
        h('h3', { style: { color: '#d9534f' } }, '⚠️ Zona de Perigo'),
        h(
          'p',
          { className: 'config-desc' },
          'Ações irreversíveis que apagam todos os seus dados permanentemente.'
        ),
        h('div', { className: 'action-list' }, [
          btn(
            'btnFactoryReset',
            '⚠️',
            'Reset de Fábrica',
            'background: #fff; border: 2px solid #d9534f; color: #d9534f; font-weight: bold;'
          ),
        ]),
        h(
          'p',
          { className: 'setting-hint', style: { color: '#d9534f', fontSize: '0.85em' } },
          '⚠️ Esta ação apaga TODOS os cursos, atividades, anotações e configurações. É impossível desfazer.'
        ),
      ]),

      h('div', { id: 'settingsFeedback', className: 'status-msg' }),
      h('div', { className: 'footer-info' }),
    ]);
  }

  afterRender() {
    // Attach ConfigForm listeners
    this.configForm.attachListeners();

    // Initialize Chips Settings
    this.initChipsSettings();

    // Initialize UI Settings
    this.initUISettings();

    // Initialize User Preferences (ISSUE-022)
    this.initUserPreferences();

    // Attach Action Buttons listeners
    const btnManual = document.getElementById('btnManualAdd');
    const btnCurrent = document.getElementById('btnAddCurrent');
    const btnBatch = document.getElementById('btnBatchImport');
    const btnFeedback = document.getElementById('btnFeedback');
    const btnClear = document.getElementById('btnClearAll');

    if (btnManual) {
      btnManual.onclick = () => {
        window.dispatchEvent(
          new CustomEvent('request:add-manual-course', {
            detail: { source: 'settings' },
          })
        );
      };
    }
    if (btnBatch)
      btnBatch.onclick = () => {
        if (this.onImportBatch) this.onImportBatch();
      };
    if (btnFeedback)
      btnFeedback.onclick = () => {
        if (this.onNavigate) this.onNavigate('feedback');
      };
    if (btnCurrent) btnCurrent.onclick = () => this.handleAddCurrent();

    if (btnClear) {
      btnClear.onclick = () => this.handleClearAll();
    }

    // Backup Listeners
    const btnExport = document.getElementById('btnExport');
    const btnImport = document.getElementById('btnImport');

    if (btnExport) btnExport.onclick = () => this.controller.handleExport();
    if (btnImport) btnImport.onclick = () => this.triggerImport();

    // Factory Reset Listener (ISSUE-020)
    const btnFactoryReset = document.getElementById('btnFactoryReset');
    if (btnFactoryReset) btnFactoryReset.onclick = () => this.controller.handleReset();
  }

  async handleClearAll() {
    window.dispatchEvent(
      new CustomEvent('request:clear-all-courses', {
        detail: { source: 'settings' },
      })
    );
  }

  /**
   * Triggers the file selection dialog for Import.
   */
  triggerImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    input.onchange = (e) => {
      const file = /** @type {HTMLInputElement} */ (e.target).files?.[0];
      if (file) {
        this.controller.handleImport(file);
      }
    };

    document.body.appendChild(input);
    input.click();

    // Clean up
    setTimeout(() => document.body.removeChild(input), 1000);
  }

  handleAddCurrent() {
    window.dispatchEvent(
      new CustomEvent('request:scrape-current-tab', {
        detail: { source: 'settings' },
      })
    );
  }

  async initChipsSettings() {
    const checkbox = /** @type {HTMLInputElement|null} */ (document.getElementById('chipsEnabled'));
    const slider = /** @type {HTMLInputElement|null} */ (document.getElementById('chipsMaxItems'));
    const valueDisplay = document.getElementById('chipsMaxValue');
    const options = document.getElementById('chipsOptions');

    await this.chipsManager.attachListeners(checkbox, slider, valueDisplay, options);
  }

  async initUISettings() {
    const advBtn = /** @type {HTMLInputElement|null} */ (
      document.getElementById('showAdvancedButtons')
    );
    const tasksBtn = /** @type {HTMLInputElement|null} */ (
      document.getElementById('showTasksButton')
    );

    await this.uiManager.attachListeners(advBtn, tasksBtn);
  }

  async initUserPreferences() {
    const autoPinCheckbox = /** @type {HTMLInputElement|null} */ (
      document.getElementById('autoPinLastWeek')
    );
    const popupToggle = /** @type {HTMLInputElement|null} */ (
      document.getElementById('popupToggle')
    );

    if (!autoPinCheckbox) return;

    // Load preferences
    const prefs = await this.preferencesManager.load();
    autoPinCheckbox.checked = prefs.autoPinLastWeek;

    // Save on change - Auto-Pin
    autoPinCheckbox.addEventListener('change', async () => {
      await this.preferencesManager.save({
        ...prefs,
        autoPinLastWeek: autoPinCheckbox.checked,
      });
    });

    // Load and save Popup Toggle (clickBehavior)
    if (popupToggle) {
      chrome.storage.sync.get(['clickBehavior'], (result) => {
        const savedBehavior = result.clickBehavior || 'sidepanel';
        popupToggle.checked = savedBehavior === 'popup';
      });

      popupToggle.addEventListener('change', () => {
        const behavior = popupToggle.checked ? 'popup' : 'sidepanel';
        chrome.storage.sync.set({ clickBehavior: behavior });
      });
    }
  }
}
