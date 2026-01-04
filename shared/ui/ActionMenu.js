/**
 * @typedef {import('../models/ActionMenu.js').ActionMenuAction} ActionMenuAction
 */

/**
 * @typedef {import('../models/ActionMenu.js').ActionMenuOptions} ActionMenuOptions
 */

import { DOMSafe } from '../utils/DOMSafe.js';

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
    const h = DOMSafe.createElement;

    // Menu Dropdown with action items
    const menuItems = this.actions.map((action) =>
      h(
        'div',
        {
          className: `action-menu-item ${action.type === 'danger' ? 'danger' : ''}`,
          onclick: (e) => {
            e.stopPropagation();
            this.closeMenu(menu);
            action.onClick?.();
          },
        },
        [
          h('span', { className: 'action-icon' }, action.icon),
          h('span', { className: 'action-label' }, action.label),
        ]
      )
    );

    const menu = h('div', { className: 'action-menu-dropdown hidden' }, menuItems);

    // Main Button
    const button = h(
      'button',
      {
        className: 'action-menu-btn',
        title: this.title,
        onclick: (e) => {
          e.stopPropagation();
          this.toggleMenu(menu);
        },
      },
      h('span', { className: 'icon' }, this.icon)
    );

    // Container with outside click handler
    const container = h('div', { className: 'action-menu-container' }, [button, menu]);

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (e.target instanceof Node && !container.contains(e.target)) {
        this.closeMenu(menu);
      }
    });

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
