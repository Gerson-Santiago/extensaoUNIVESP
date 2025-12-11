import { formatEmail, extractRa, resolveDomain, CONSTANTS } from '../utils/settings.js';

export class HomeView {
    constructor(callbacks) {
        this.addCurrentPageCallback = callbacks.onAddCurrentInfo;
    }

    render() {
        const div = document.createElement('div');
        div.className = 'view-home-dashboard';
        div.innerHTML = `
            <!-- Seção de Acesso Rápido (Links) - Topo -->
            <div class="quick-access-section">
                <h3>Acesso Rápido</h3>
                <div class="quick-links-grid">
                    <a href="https://sei.univesp.br/index.xhtml" target="_blank" class="link-card">
                        Portal SEI
                    </a>
                    <a href="https://ava.univesp.br/ultra/course" target="_blank" class="link-card blackboard-card">
                        <img src="../assets/icon_blackboard.png" alt="Blackboard" class="bb-icon">
                        AVA (Cursos)
                    </a>
                    <a href="https://univesp.br/acesso_aluno.html" target="_blank" class="link-card">
                        Área do Aluno
                    </a>
                    <a href="https://prova.univesp.br/" target="_blank" class="link-card">
                        Sistema de Provas
                    </a>
                </div>
                
                <!-- Botão de Ação Existente -->
                <button id="dashAddCurrentBtn" class="action-card small-action">
                    <span class="icon">➕</span>
                    <span class="label">Adicionar Página Atual</span>
                </button>
            </div>

            <hr class="divider">

            <!-- Seção de Configuração (Login) -->
            <div class="config-section">
                <h3>Configurar Acesso</h3>
                <p class="config-desc">Configuração para preenchimento automático.</p>
                
                <div class="input-group-row">
                    <input type="text" id="raInput" class="input-field" placeholder="RA">
                    <div class="domain-wrapper">
                        <input type="text" id="domainInput" class="input-field" placeholder="@dominio.com">
                        <button id="resetDomainBtn" class="btn-reset" title="Restaurar Padrão">↺</button>
                    </div>
                </div>

                <button id="saveConfigBtn" class="btn-save">Salvar Configuração</button>
                <div id="configStatus" class="status-msg"></div>
            </div>

            <div class="footer-info">
                <span>Versão 2.1.1</span>
                <a href="https://github.com/Gerson-Santiago/extensaoUNIVESP" target="_blank" class="github-link">GitHub</a>
            </div>
        `;
        return div;
    }

    afterRender() {
        // 1. Setup Add Current Button
        const btnAdd = document.getElementById('dashAddCurrentBtn');
        if (btnAdd && this.addCurrentPageCallback) {
            btnAdd.onclick = this.addCurrentPageCallback;
        }

        // 2. Setup Configuration Logic
        const raInput = document.getElementById('raInput');
        const domainInput = document.getElementById('domainInput');
        const resetDomainBtn = document.getElementById('resetDomainBtn');
        const saveConfigBtn = document.getElementById('saveConfigBtn');
        const status = document.getElementById('configStatus');

        // Carregar dados salvos
        chrome.storage.sync.get(['userEmail', 'customDomain'], (result) => {
            const domain = resolveDomain(result.userEmail, result.customDomain);
            if (domainInput) domainInput.value = domain;

            if (result.userEmail && raInput) {
                raInput.value = extractRa(result.userEmail);
            }
        });

        // Salvar
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
                        status.textContent = 'Salvo com sucesso!';
                        status.style.display = 'block';
                        status.className = 'status-msg success';
                        setTimeout(() => {
                            status.style.display = 'none';
                        }, 2000);
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
}
