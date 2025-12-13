import { RaManager } from '../../logic/raManager.js';
import { DomainManager } from '../../logic/domainManager.js';

export class ConfigForm {
    /**
     * @param {Object} statusManager - Instância do StatusManager
     */
    constructor(statusManager) {
        this.feedback = statusManager;
    }

    render() {
        return `
      <div class="settings-content">
        <h3>Configurar Acesso</h3>
        <p class="config-desc">Configuração para preenchimento automático (Login).</p>
        
        <div class="input-group-row">
            <input type="text" id="raInput" class="input-field" placeholder="RA">
            <div class="domain-wrapper">
                <input type="text" id="domainInput" class="input-field" placeholder="@dominio.com">
                <button id="resetDomainBtn" class="btn-reset" title="Restaurar Padrão">↺</button>
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <button id="saveConfigBtn" class="btn-save">Salvar Credenciais</button>
        </div>

        <hr class="divider">

        <h3>Comportamento ao Clicar</h3>
        <p class="config-desc">Escolha o que acontece ao clicar no ícone da extensão.</p>
        <div style="margin-bottom: 20px;">
            <label style="display: flex; align-items: center; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="popupToggle" style="margin-right: 8px;">
                <span>Ativar Popup (Desativado por padrão)</span>
            </label>
        </div>
      </div>
    `;
    }

    attachListeners() {
        this.setupLoadData();
        this.setupSaveActions();
        this.setupBehaviorActions();
        this.setupResetDomain();
    }

    setupLoadData() {
        const raInput = /** @type {HTMLInputElement} */ (document.getElementById('raInput'));
        const domainInput = /** @type {HTMLInputElement} */ (document.getElementById('domainInput'));
        const popupToggle = /** @type {HTMLInputElement} */ (document.getElementById('popupToggle'));

        chrome.storage.sync.get(['userEmail', 'customDomain', 'clickBehavior'], (result) => {
            const userEmail = /** @type {string} */ (result.userEmail || '');
            const customDomain = /** @type {string} */ (result.customDomain || '');

            const domain = DomainManager.getCurrentDomain(userEmail, customDomain);
            if (domainInput) domainInput.value = domain;

            if (userEmail && raInput) {
                raInput.value = RaManager.getRaFromEmail(userEmail);
            }

            // Load Behavior
            const savedBehavior = result.clickBehavior || 'sidepanel';
            if (popupToggle) {
                popupToggle.checked = savedBehavior === 'popup';
            }
        });
    }

    setupSaveActions() {
        const saveConfigBtn = document.getElementById('saveConfigBtn');
        const raInput = /** @type {HTMLInputElement} */ (document.getElementById('raInput'));
        const domainInput = /** @type {HTMLInputElement} */ (document.getElementById('domainInput'));

        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', () => {
                const ra = raInput.value;
                const domain = domainInput.value;

                const { isValid, fullEmail, cleanDomain, error } = RaManager.prepareCredentials(ra, domain);

                if (!isValid) {
                    alert(error);
                    return;
                }

                chrome.storage.sync.set(
                    {
                        userEmail: fullEmail,
                        customDomain: cleanDomain,
                    },
                    () => {
                        this.feedback.show('Configuração salva com sucesso!', 'success');
                    }
                );
            });
        }
    }

    setupBehaviorActions() {
        const popupToggle = /** @type {HTMLInputElement} */ (document.getElementById('popupToggle'));
        if (popupToggle) {
            popupToggle.addEventListener('change', (e) => {
                const target = /** @type {HTMLInputElement} */ (e.target);
                const behavior = target.checked ? 'popup' : 'sidepanel';
                chrome.storage.sync.set({ clickBehavior: behavior });
            });
        }
    }

    setupResetDomain() {
        const resetDomainBtn = document.getElementById('resetDomainBtn');
        const domainInput = /** @type {HTMLInputElement} */ (document.getElementById('domainInput'));
        if (resetDomainBtn) {
            resetDomainBtn.addEventListener('click', () => {
                domainInput.value = DomainManager.getDefaultDomain();
            });
        }
    }
}
