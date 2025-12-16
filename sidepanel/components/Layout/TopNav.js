export class TopNav {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.activeTab = 'home';
  }

  render() {
    const nav = document.createElement('nav');
    nav.className = 'top-nav';

    const tabs = [
      { id: 'home', icon: '🏠', label: 'Home' },
      { id: 'courses', icon: '📚', label: 'Cursos' },
      { id: 'settings', icon: '⚙️', label: 'Config' },
    ];

    tabs.forEach((tab) => {
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
