import { Toaster } from '../../../shared/ui/feedback/Toaster.js';
import { ConfigForm } from '../components/ConfigForm.js';
import { Logger } from '../../../shared/utils/Logger.js';
import { SettingsController } from '../logic/SettingsController.js';
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

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
  }

  render() {
    const h = DOMSafe.createElement;

    // Helper for dividers
    const divider = () => h('hr', { className: 'divider' });

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
        h('input', { type: 'checkbox', id: 'showAdvancedButtons', checked: true }),
        h('span', {}, 'Botões de Verificação Avançados (Rápido vs Completo)'),
      ]),
      h(
        'p',
        { className: 'setting-hint' },
        'Se desativado, mostra apenas o botão padrão (Completo).'
      ),
      h('label', { className: 'setting-item' }, [
        h('input', { type: 'checkbox', id: 'showTasksButton', checked: true }),
        h('span', {}, 'Funcionalidade de Tarefas (Preview)'),
      ]),
      h(
        'p',
        { className: 'setting-hint' },
        "Habilita o botão 'Tarefas' para ver o resumo sem abrir."
      ),
    ]);

    // User Preferences (NEW - ISSUE-022)
    const userPreferences = h('div', { className: 'user-preferences' }, [
      h('label', { className: 'setting-item' }, [
        h('input', { type: 'checkbox', id: 'densityCompact' }),
        h('span', {}, 'Densidade Visual Compacta'),
      ]),
      h(
        'p',
        { className: 'setting-hint' },
        'Reduz margens e espaçamentos para mostrar mais conteúdo na tela.'
      ),
      h('label', { className: 'setting-item' }, [
        h('input', { type: 'checkbox', id: 'autoPinLastWeek' }),
        h('span', {}, 'Lembrar Última Semana Visitada'),
      ]),
      h(
        'p',
        { className: 'setting-hint' },
        'Reabre automaticamente a última semana que você estava visualizando.'
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
      this.configForm.render(), // Já retorna HTMLElement via DOMSafe
      divider(),

      h('h3', {}, 'Navegação Contextual (Chips)'),
      h('p', { className: 'config-desc' }, 'Configure a barra de navegação rápida entre semanas.'),
      chipsSettings,
      divider(),

      h('h3', {}, 'Interface & Funcionalidades'),
      h('p', { className: 'config-desc' }, 'Personalize o que você vê na lista de semanas.'),
      uiSettings,
      divider(),

      h('h3', {}, 'Preferências do Usuário'),
      h('p', { className: 'config-desc' }, 'Adapte a interface ao seu estilo de uso.'),
      userPreferences,
      divider(),

      h('h3', {}, 'Privacidade e Dados'),
      h(
        'p',
        { className: 'config-desc' },
        'Gerencie seus dados locais. A extensão segue a política Local-First.'
      ),
      privacyActions,
      divider(),

      h('h3', {}, 'Gerenciar Matérias'),
      h('p', { className: 'config-desc' }, 'Opções para adicionar ou remover cursos.'),
      manageActions,
      divider(),

      h('h3', {}, 'Ajuda e Feedback'),
      h('p', { className: 'config-desc' }, 'Encontrou um problema ou tem uma sugestão?'),
      helpActions,

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

    if (!checkbox || !slider || !valueDisplay || !options) return;

    // Load
    const settings = await this.loadChipsSettings();
    checkbox.checked = settings.enabled;
    slider.value = String(settings.maxItems);
    valueDisplay.textContent = String(settings.maxItems);

    // Toggle visibility of slider based on checkbox
    options.style.display = settings.enabled ? 'block' : 'none';

    // Listeners
    checkbox.addEventListener('change', async () => {
      const enabled = checkbox.checked;
      options.style.display = enabled ? 'block' : 'none';
      await this.saveChipsSettings({ enabled, maxItems: parseInt(slider.value) });
    });

    slider.addEventListener('input', () => {
      valueDisplay.textContent = slider.value;
    });

    slider.addEventListener('change', async () => {
      await this.saveChipsSettings({
        enabled: checkbox.checked,
        maxItems: parseInt(slider.value),
      });
    });
  }

  async initUISettings() {
    const advBtn = /** @type {HTMLInputElement|null} */ (
      document.getElementById('showAdvancedButtons')
    );
    const tasksBtn = /** @type {HTMLInputElement|null} */ (
      document.getElementById('showTasksButton')
    );

    if (!advBtn || !tasksBtn) return;

    // Default values
    const defaults = { showAdvancedButtons: true, showTasksButton: true };
    const saved = /** @type {{showAdvancedButtons: boolean, showTasksButton: boolean}} */ (
      (await chrome.storage.local.get('ui_settings')).ui_settings || defaults
    );

    advBtn.checked = saved.showAdvancedButtons;
    tasksBtn.checked = saved.showTasksButton;

    // Listeners
    const save = async () => {
      await chrome.storage.local.set({
        ui_settings: {
          showAdvancedButtons: advBtn.checked,
          showTasksButton: tasksBtn.checked,
        },
      });
    };

    advBtn.addEventListener('change', save);
    tasksBtn.addEventListener('change', save);
  }

  async loadChipsSettings() {
    const result = await chrome.storage.local.get('chips_settings');
    return /** @type {{enabled: boolean, maxItems: number}} */ (
      result.chips_settings || { enabled: true, maxItems: 3 }
    );
  }

  async saveChipsSettings(settings) {
    await chrome.storage.local.set({ chips_settings: settings });
    /**#LOG_UI*/
    Logger.warn('SettingsView', 'Chips settings saved:', settings);
  }

  /**
   * Initializes User Preferences toggles (ISSUE-022).
   * Manages Density and Auto-Pin settings.
   */
  async initUserPreferences() {
    const densityCheckbox = /** @type {HTMLInputElement|null} */ (
      document.getElementById('densityCompact')
    );
    const autoPinCheckbox = /** @type {HTMLInputElement|null} */ (
      document.getElementById('autoPinLastWeek')
    );

    if (!densityCheckbox || !autoPinCheckbox) return;

    // Load saved preferences
    const defaults = {
      density: 'comfortable',
      autoPinLastWeek: false,
      lastWeekNumber: null,
    };
    const saved = /** @type {import('../../../types/UserPreferences.js').UserPreferences} */ (
      (await chrome.storage.local.get('user_preferences')).user_preferences || defaults
    );

    densityCheckbox.checked = saved.density === 'compact';
    autoPinCheckbox.checked = saved.autoPinLastWeek;

    // Apply density class immediately on load
    this.applyDensity(saved.density);

    // Listeners
    const save = async () => {
      const preferences = {
        density: densityCheckbox.checked ? 'compact' : 'comfortable',
        autoPinLastWeek: autoPinCheckbox.checked,
        lastWeekNumber: saved.lastWeekNumber, // Preserve existing value
      };
      await chrome.storage.local.set({ user_preferences: preferences });

      // Apply density change immediately
      this.applyDensity(/** @type {'compact'|'comfortable'} */ (preferences.density));

      Logger.info('SettingsView', 'User preferences saved:', preferences);
    };

    densityCheckbox.addEventListener('change', save);
    autoPinCheckbox.addEventListener('change', save);
  }

  /**
   * Applies or removes compact density class on body.
   * @param {'compact'|'comfortable'} density - The density to apply
   */
  applyDensity(density) {
    const body = document.body;
    if (density === 'compact') {
      body.classList.add('is-compact');
    } else {
      body.classList.remove('is-compact');
    }
  }
}
