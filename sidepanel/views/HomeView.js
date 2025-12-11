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
            </div>

            <div class="footer-info">
                <span>Versão 2.1.1</span>
                <a href="https://github.com/Gerson-Santiago/extensaoUNIVESP" target="_blank" class="github-link">GitHub</a>
            </div>
        `;
        return div;
    }

    afterRender() {
        // Nada específico por enquanto na Home
    }
}
