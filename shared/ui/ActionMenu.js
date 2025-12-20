/**
 * @typedef {Object} ActionMenuAction
 * @property {string} label
 * @property {string} icon
 * @property {Function} [onClick]
 * @property {'action'|'danger'} [type]
 */

/**
 * @typedef {Object} ActionMenuOptions
 * @property {ActionMenuAction[]} [actions]
 * @property {string} [icon]
 * @property {string} [title]
 */

/**
 * @file ActionMenu.js
 * @description Componente de Menu de Ações (Dropdown).
 */
export class ActionMenu {
  /**
   * @param {ActionMenuOptions} [options]
   */
  constructor({ actions = [], icon = '+', title = 'Ações' } = {}) {
    this.actions = actions;
    this.icon = icon;
    this.title = title;
    this.isOpen = false;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'action-menu-container';

    // Botão Principal
    const button = document.createElement('button');
    button.className = 'action-menu-btn';
    button.innerHTML = `<span class="icon">${this.icon}</span>`;
    button.title = this.title;

    // Menu Dropdown
    const menu = document.createElement('div');
    menu.className = 'action-menu-dropdown hidden';

    this.actions.forEach((action) => {
      const item = document.createElement('div');
      item.className = `action-menu-item ${action.type === 'danger' ? 'danger' : ''}`;
      item.innerHTML = `
        <span class="action-icon">${action.icon}</span>
        <span class="action-label">${action.label}</span>
      `;

      item.onclick = (e) => {
        e.stopPropagation();
        this.closeMenu(menu);
        if (action.onClick) action.onClick();
      };

      menu.appendChild(item);
    });

    // Toggle logic
    button.onclick = (e) => {
      e.stopPropagation();
      this.toggleMenu(menu);
    };

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (e.target instanceof Node && !container.contains(e.target)) {
        this.closeMenu(menu);
      }
    });

    container.appendChild(button);
    container.appendChild(menu);
    return container;
  }

  /**
   * @param {HTMLElement} menu
   */
  toggleMenu(menu) {
    this.isOpen = !this.isOpen;
    menu.classList.toggle('hidden', !this.isOpen);
  }

  /**
   * @param {HTMLElement} menu
   */
  closeMenu(menu) {
    this.isOpen = false;
    menu.classList.add('hidden');
  }
}
