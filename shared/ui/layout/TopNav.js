import { DOMSafe } from '../../utils/DOMSafe.js';

export class TopNav {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.activeTab = 'home';
  }

  render() {
    const h = DOMSafe.createElement;
    const nav = h('nav', { className: 'top-nav' });

    const tabs = [
      { id: 'home', icon: '🏠', label: 'Início' },
      { id: 'courses', icon: '📚', label: 'Cursos' },
      { id: 'settings', icon: '⚙️', label: 'Configurações' },
    ];

    tabs.forEach((tab) => {
      const btn = h(
        'button',
        {
          className: `nav-item ${this.activeTab === tab.id ? 'active' : ''}`,
          title: `Ir para ${tab.label}`,
          onclick: () => {
            this.setActive(tab.id);
            this.onNavigate(tab.id);
          },
        },
        [
          h('span', { className: 'nav-icon' }, tab.icon),
          h('span', { className: 'nav-label' }, tab.label),
        ]
      );

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
