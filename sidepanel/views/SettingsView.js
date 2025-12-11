import { AddManualModal } from '../components/Modals/AddManualModal.js';
import { BatchImportModal } from '../components/Modals/BatchImportModal.js';
import { addItem, clearItems } from '../logic/storage.js';
import { scrapeWeeksFromTab } from '../logic/scraper.js';
import { formatEmail, extractRa, resolveDomain, CONSTANTS } from '../utils/settings.js';

export class SettingsView {
    constructor(callbacks = {}) {
        this.onNavigate = callbacks.onNavigate;

        // Inicializa os modais
        this.addManualModal = new AddManualModal(() => this.showFeedback('Matéria adicionada com sucesso!', 'success'));
        this.batchImportModal = new BatchImportModal(() => {
            this.showFeedback('Importação concluída!', 'success');
            // Redireciona para CoursesView após importação
            if (this.onNavigate) {
                setTimeout(() => {
                    this.onNavigate('courses');
                }, 1500); // Pequeno delay para ler o feedback
            }
        });
    }

    render() {
        const div = document.createElement('div');
        div.className = 'view-settings';
        div.innerHTML = `
            <h2>Configurações</h2>
            
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

                <hr class="divider">

                <h3>Gerenciar Matérias</h3>
                <p class="config-desc">Opções para adicionar ou remover cursos.</p>

                <div class="action-list">
                    <button id="btnManualAdd" class="action-card small-action">
                        <span class="icon">✏️</span>
                        <span class="label">Adicionar Manualmente</span>
                    </button>

                    <button id="btnAddCurrent" class="action-card small-action">
                        <span class="icon">➕</span>
                        <span class="label">Adicionar Página Atual</span>
                    </button>

                    <button id="btnBatchImport" class="action-card small-action">
                        <span class="icon">📦</span>
                        <span class="label">Importar em Lote (AVA)</span>
                    </button>
                    
                    <hr class="divider">

                    <button id="btnClearAll" class="action-card small-action" style="border-color: #ffcccc; color: #d9534f;">
                        <span class="icon">🗑️</span>
                        <span class="label">Remover Todas as Matérias</span>
                    </button>
                </div>

                <div id="settingsFeedback" class="status-msg"></div>
            </div>
            
            <div class="footer-info">
                <!-- Version removed -->
            </div>
        `;
        return div;
    }

    afterRender() {
        const btnManual = document.getElementById('btnManualAdd');
        const btnCurrent = document.getElementById('btnAddCurrent');
        const btnBatch = document.getElementById('btnBatchImport');
        const btnClear = document.getElementById('btnClearAll');

        // Config Logic
        this.setupConfigLogic();

        if (btnManual) {
            btnManual.onclick = () => this.addManualModal.open();
        }

        if (btnBatch) {
            btnBatch.onclick = () => this.batchImportModal.open();
        }

        if (btnCurrent) {
            btnCurrent.onclick = () => this.handleAddCurrent();
        }

        if (btnClear) {
            btnClear.onclick = () => {
                if (confirm('Tem certeza que deseja remover TODAS as matérias salvas? Essa ação não pode ser desfeita.')) {
                    clearItems(() => {
                        this.showFeedback('Todas as matérias foram removidas.', 'success');
                    });
                }
            };
        }
    }

    setupConfigLogic() {
        const raInput = document.getElementById('raInput');
        const domainInput = document.getElementById('domainInput');
        const resetDomainBtn = document.getElementById('resetDomainBtn');
        const saveConfigBtn = document.getElementById('saveConfigBtn');

        const popupToggle = document.getElementById('popupToggle');

        // Carregar dados salvos
        chrome.storage.sync.get(['userEmail', 'customDomain', 'clickBehavior'], (result) => {
            const domain = resolveDomain(result.userEmail, result.customDomain);
            if (domainInput) domainInput.value = domain;

            if (result.userEmail && raInput) {
                raInput.value = extractRa(result.userEmail);
            }

            // Load Behavior (Default is sidepanel, so popup is unchecked)
            const savedBehavior = result.clickBehavior || 'sidepanel';
            if (popupToggle) {
                popupToggle.checked = (savedBehavior === 'popup');
            }
        });

        // Listen for Behavior Change
        if (popupToggle) {
            popupToggle.addEventListener('change', (e) => {
                const behavior = e.target.checked ? 'popup' : 'sidepanel';
                chrome.storage.sync.set({ clickBehavior: behavior }, () => {
                    // Saved
                });
            });
        }

        // Salvar Credenciais
        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', () => {
                const ra = raInput.value;
                const domain = domainInput.value;

                if (ra.trim()) {
                    const { fullEmail, cleanDomain } = formatEmail(ra, domain);

                    chrome.storage.sync.set({
                        userEmail: fullEmail,
                        customDomain: cleanDomain
                    }, () => {
                        this.showFeedback('Configuração salva com sucesso!', 'success');
                    });
                } else {
                    alert("Por favor, digite o seu RA.");
                }
            });
        }

        // Reset Domain
        if (resetDomainBtn) {
            resetDomainBtn.addEventListener('click', () => {
                domainInput.value = CONSTANTS.DEFAULT_DOMAIN;
            });
        }
    }

    handleAddCurrent() {
        const feedback = document.getElementById('settingsFeedback');
        feedback.textContent = 'Analisando página...';
        feedback.style.display = 'block';
        feedback.className = 'status-msg';

        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs && tabs[0]) {
                const tab = tabs[0];
                let name = tab.title || "Nova Matéria";

                // Tenta extrair nome limpo se for padrão "Nome - UNIVESP"
                if (name.includes('-')) {
                    name = name.split('-')[0].trim();
                }

                let weeks = [];
                let detectedName = null;

                // Tenta fazer scrape se for página web
                if (tab.url.startsWith('http')) {
                    const result = await scrapeWeeksFromTab(tab.id);
                    weeks = result.weeks || [];
                    detectedName = result.title;
                }

                if (detectedName) {
                    name = detectedName;
                }

                addItem(name, tab.url, weeks, (success, msg) => {
                    if (success) {
                        this.showFeedback('Página atual adicionada com sucesso!', 'success');
                    } else {
                        this.showFeedback(`Erro: ${msg}`, 'error');
                    }
                });
            }
        });
    }

    showFeedback(message, type = 'success') {
        const el = document.getElementById('settingsFeedback');
        if (el) {
            el.textContent = message;
            el.style.display = 'block';
            el.className = `status-msg ${type}`;
            el.style.color = type === 'success' ? 'green' : 'red';

            setTimeout(() => {
                el.style.display = 'none';
            }, 3000);
        }
    }
}
