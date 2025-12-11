export class HomeView {
    constructor(callbacks) {
        this.addCurrentPageCallback = callbacks.onAddCurrentInfo;
    }

    render() {
        const div = document.createElement('div');
        div.className = 'view-home-dashboard';
        div.innerHTML = `
            <div class="dashboard-header">
                <h2>Olá!</h2>
                <p>O que vamos estudar hoje?</p>
            </div>
            
            <div class="dashboard-actions">
                <button id="dashAddCurrentBtn" class="action-card">
                    <span class="icon">➕</span>
                    <span class="label">Adicionar Página Atual</span>
                </button>
                <!-- Futuros atalhos podem vir aqui -->
            </div>
        `;
        return div;
    }

    afterRender() {
        const btn = document.getElementById('dashAddCurrentBtn');
        if (btn && this.addCurrentPageCallback) {
            btn.onclick = this.addCurrentPageCallback;
        }
    }
}
