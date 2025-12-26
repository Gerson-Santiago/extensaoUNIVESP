// Courses imports removed - Event-Driven Decoupling
// Events emitted: 'request:add-manual-course', 'request:scrape-current-tab'
import { Toaster } from '../../../shared/ui/feedback/Toaster.js';
import { ConfigForm } from '../components/ConfigForm.js';

export class SettingsView {
  constructor(callbacks = {}) {
    this.onNavigate = callbacks.onNavigate;
    this.onImportBatch = callbacks.onImportBatch; // Callback for Batch Import
    this.feedback = new Toaster('settingsFeedback');
    this.configForm = new ConfigForm(new Toaster('configFeedback'));
    // Removed: CourseService, AddManualModal - delegated via events
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
                    <input type="checkbox" id="chipsEnabled" checked>
                    <span>Exibir chips de navegação</span>
                </label>
                
                <div id="chipsOptions" class="chips-options">
                    <label class="setting-item">
                        <span>Máximo de chips visíveis:</span>
                        <div class="slider-container">
                            <input type="range" id="chipsMaxItems" min="3" max="10" value="5" step="1">
                            <span id="chipsMaxValue" class="slider-value">5</span>
                        </div>
                    </label>
                </div>
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

    // Attach Action Buttons listeners
    const btnManual = document.getElementById('btnManualAdd');
    const btnCurrent = document.getElementById('btnAddCurrent');
    const btnBatch = document.getElementById('btnBatchImport');
    const btnFeedback = document.getElementById('btnFeedback');
    const btnClear = document.getElementById('btnClearAll');

    if (btnManual) {
      btnManual.onclick = () => {
        // Emit event instead of opening modal directly
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
  }

  async handleClearAll() {
    if (
      confirm(
        'Tem certeza que deseja remover TODAS as matérias salvas? Essa ação não pode ser desfeita.'
      )
    ) {
      window.dispatchEvent(new CustomEvent('request:clear-all-courses'));
      // Feedback will be handled by the orchestrator (sidepanel)
      // or we can expect a global reload.
    }
  }

  handleAddCurrent() {
    // Emit event instead of calling CourseService directly
    window.dispatchEvent(
      new CustomEvent('request:scrape-current-tab', {
        detail: { source: 'settings' },
      })
    );
  }

  /**
   * Initialize chips settings UI and listeners
   */
  async initChipsSettings() {
    const checkbox = /** @type {HTMLInputElement|null} */ (document.getElementById('chipsEnabled'));
    const slider = /** @type {HTMLInputElement|null} */ (document.getElementById('chipsMaxItems'));
    const valueDisplay = document.getElementById('chipsMaxValue');
    const options = document.getElementById('chipsOptions');

    if (!checkbox || !slider || !valueDisplay || !options) return;

    // Load saved settings
    const settings = await this.loadChipsSettings();
    checkbox.checked = settings.enabled;
    slider.value = String(settings.maxItems);
    valueDisplay.textContent = String(settings.maxItems);
    options.style.display = settings.enabled ? 'block' : 'none';

    // Checkbox listener
    checkbox.addEventListener('change', async () => {
      options.style.display = checkbox.checked ? 'block' : 'none';
      await this.saveChipsSettings({
        enabled: checkbox.checked,
        maxItems: parseInt(slider.value),
      });
    });

    // Slider listener
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

  /**
   * Load chips settings from storage
   * @returns {Promise<{enabled: boolean, maxItems: number}>}
   */
  async loadChipsSettings() {
    const result = await chrome.storage.local.get('chips_settings');
    return (
      result.chips_settings ||
      /** @type {{enabled: boolean, maxItems: number}} */ ({ enabled: true, maxItems: 5 })
    );
  }

  /**
   * Save chips settings to storage
   */
  async saveChipsSettings(settings) {
    await chrome.storage.local.set({ chips_settings: settings });
    console.warn('[SettingsView] Chips settings saved:', settings);
  }
}
