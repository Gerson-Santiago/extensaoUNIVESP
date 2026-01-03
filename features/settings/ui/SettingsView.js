import { Toaster } from '../../../shared/ui/feedback/Toaster.js';
import { ConfigForm } from '../components/ConfigForm.js';
import { Logger } from '../../../shared/utils/Logger.js';
import { SettingsController } from '../logic/SettingsController.js';

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
    const div = document.createElement('div');
    div.className = 'view-settings';

    div.innerHTML = `
            <h2>Configurações</h2>
            
            ${this.configForm.render()}
            
            <hr class="divider">

            <h3>Navegação Contextual (Chips)</h3>
            <p class="config-desc">Configure a barra de navegação rápida entre semanas.</p>
            
            <div class="chips-settings">
                <label class="setting-item">
                    <input type="checkbox" id="chipsEnabled">
                    <span>Exibir chips de navegação</span>
                </label>
                
                <div id="chipsOptions" class="chips-options" style="display: block;">
                    <label class="setting-item">
                        <span>Quantidade de chips:</span>
                        <div class="slider-container">
                            <input type="range" id="chipsMaxItems" min="1" max="8" value="3" step="1">
                            <span id="chipsMaxValue" class="slider-value">3</span>
                        </div>
                    </label>
                </div>
            </div>
            
            <hr class="divider">

            <h3>Interface & Funcionalidades</h3>
            <p class="config-desc">Personalize o que você vê na lista de semanas.</p>
            
            <div class="ui-settings">
                <label class="setting-item">
                    <input type="checkbox" id="showAdvancedButtons" checked>
                    <span>Botões de Verificação Avançados (Rápido vs Completo)</span>
                </label>
                <p class="setting-hint">Se desativado, mostra apenas o botão padrão (Completo).</p>

                <label class="setting-item">
                    <input type="checkbox" id="showTasksButton" checked>
                    <span>Funcionalidade de Tarefas (Preview)</span>
                </label>
                <p class="setting-hint">Habilita o botão 'Tarefas' para ver o resumo sem abrir.</p>
            </div>
            
            <hr class="divider">

            <h3>Privacidade e Dados</h3>
            <p class="config-desc">Gerencie seus dados locais. A extensão segue a política Local-First.</p>
            <div class="action-list">
                <button id="btnExport" class="action-card small-action">
                    <span class="icon">⬇️</span><span class="label">Baixar Meus Dados (Backup)</span>
                </button>
                <button id="btnImport" class="action-card small-action">
                    <span class="icon">⬆️</span><span class="label">Restaurar Backup</span>
                </button>
            </div>

            <hr class="divider">

            <h3>Gerenciar Matérias</h3>
            <p class="config-desc">Opções para adicionar ou remover cursos.</p>

            <div class="action-list">
                <button id="btnManualAdd" class="action-card small-action">
                    <span class="icon">✏️</span><span class="label">Adicionar Manualmente</span>
                </button>
                <button id="btnAddCurrent" class="action-card small-action">
                    <span class="icon">➕</span><span class="label">Adicionar Página Atual</span>
                </button>
                <button id="btnBatchImport" class="action-card small-action">
                    <span class="icon">📦</span><span class="label">Importar em Lote (AVA)</span>
                </button>
                <hr class="divider">
                <button id="btnClearAll" class="action-card small-action" style="border-color: #ffcccc; color: #d9534f;">
                    <span class="icon">🗑️</span><span class="label">Remover Todas as Matérias</span>
                </button>
            </div>

            <hr class="divider">

            <h3>Ajuda e Feedback</h3>
            <p class="config-desc">Encontrou um problema ou tem uma sugestão?</p>
            <div class="action-list">
                <button id="btnFeedback" class="action-card small-action">
                    <span class="icon">📢</span><span class="label">Enviar Feedback</span>
                </button>
            </div>

            <div id="settingsFeedback" class="status-msg"></div>
            <div class="footer-info"></div>
        `;
    return div;
  }

  afterRender() {
    // Attach ConfigForm listeners
    this.configForm.attachListeners();

    // Initialize Chips Settings
    this.initChipsSettings();

    // Initialize UI Settings
    this.initUISettings();

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
}
