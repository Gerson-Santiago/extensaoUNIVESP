export class BottomNav {
    constructor(onNavigate) {
        this.onNavigate = onNavigate;
        this.activeTab = 'home';
    }

    render() {
        const nav = document.createElement('nav');
        nav.className = 'bottom-nav';

        const tabs = [
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'courses', icon: '📚', label: 'Cursos' },
            { id: 'settings', icon: '⚙️', label: 'Config' }
        ];

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `nav-item ${this.activeTab === tab.id ? 'active' : ''}`;
            btn.innerHTML = `
                <span class="nav-icon">${tab.icon}</span>
                <span class="nav-label">${tab.label}</span>
            `;
            btn.onclick = () => {
                this.setActive(tab.id);
                this.onNavigate(tab.id);
            };
            nav.appendChild(btn);
        });

        return nav;
    }

    setActive(tabId) {
        this.activeTab = tabId;
        const buttons = document.querySelectorAll('.nav-item');
        // Re-render ou update classes seria ideal, mas num DOM simples:
        // Apenas atualiza a classe visualmente se o elemento já estiver no DOM
        // Se formos re-renderizar tudo, o MainLayout cuidará disso.
        // Mas para manter performance, podemos manipular classes aqui se tivermos referência.

        // Simples manipulação de DOM se já renderizado:
        document.querySelectorAll('.nav-item').forEach((btn, index) => {
            const tabs = ['home', 'courses', 'settings'];
            if (tabs[index] === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}
