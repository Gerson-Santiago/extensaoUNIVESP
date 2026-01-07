import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

export class SettingsAboutView {
  /**
   * @param {Object} props
   * @param {string} props.version - App version from manifest
   * @param {boolean} props.diagnosticEnabled - Current state of diagnostic mode
   * @param {Function} props.onToggleDiagnostic - Callback for toggle change
   */
  constructor({ version, diagnosticEnabled, onToggleDiagnostic }) {
    this.version = version;
    this.diagnosticEnabled = diagnosticEnabled;
    this.onToggleDiagnostic = onToggleDiagnostic;
    this.element = this._createElement();
  }

  _createElement() {
    const container = document.createElement('div');
    container.className = 'settings-section settings-about';

    const title = document.createElement('h3');
    title.textContent = 'Sobre & Suporte';
    container.appendChild(title);

    const content = document.createElement('div');
    content.className = 'settings-card';
    // Using DOMSafe for trusted HTML construction
    const doc = DOMSafe.parseHTML(`
            <div class="about-header">
                <div class="app-logo">🎓</div>
                <div class="app-info">
                    <span class="app-name">Extensão Central Univesp</span>
                    <span class="app-version">v${DOMSafe.escapeHTML(this.version)}</span>
                </div>
            </div>
            
            <div class="about-links">
                <a href="https://github.com/Gerson-Santiago/extensaoUNIVESP" target="_blank" class="about-link">
                    📦 Repositório GitHub
                </a>
                <a href="https://github.com/Gerson-Santiago/extensaoUNIVESP/issues/new/choose" target="_blank" class="about-link">
                    🐛 Reportar um Problema
                </a>
            </div>

            <div class="settings-divider"></div>

            <div class="setting-item">
                <div class="setting-label">
                    <span>Modo de Diagnóstico</span>
                    <small>Habilita logs detalhados para suporte técnico.</small>
                </div>
                <label class="switch">
                    <input type="checkbox" id="diagnostic-toggle" ${this.diagnosticEnabled ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
            </div>
        `);

    Array.from(doc.body.childNodes).forEach((node) => content.appendChild(node));

    // Attach event listener safely
    const toggle = content.querySelector('#diagnostic-toggle');
    if (toggle) {
      toggle.addEventListener('change', (e) => {
        const target = /** @type {HTMLInputElement} */ (e.target);
        this.onToggleDiagnostic(target.checked);
      });
    }

    container.appendChild(content);
    return container;
  }

  render(parentElement) {
    parentElement.appendChild(this.element);
  }
}
