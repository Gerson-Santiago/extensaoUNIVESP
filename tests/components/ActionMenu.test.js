import { ActionMenu } from '../../sidepanel/components/Shared/ActionMenu.js';

describe('ActionMenu Component', () => {
  let actionMenu;
  let container;
  const mockActions = [
    { label: 'Action 1', icon: 'A', onClick: jest.fn() },
    { label: 'Action 2', icon: 'B', onClick: jest.fn() },
  ];

  beforeEach(() => {
    document.body.innerHTML = '';
    actionMenu = new ActionMenu({
      title: 'Test Menu',
      icon: '+',
      actions: mockActions,
    });
    container = actionMenu.render();
    document.body.appendChild(container);
  });

  test('Should render button with correct icon and title', () => {
    const btn = container.querySelector('.action-menu-btn');
    expect(btn).toBeTruthy();
    expect(btn.title).toBe('Test Menu');
    expect(btn.innerHTML).toContain('+');
  });

  test('Should render hidden dropdown initially', () => {
    const dropdown = container.querySelector('.action-menu-dropdown');
    expect(dropdown.classList.contains('hidden')).toBe(true);
  });

  test('Should toggle dropdown on click', () => {
    const btn = container.querySelector('.action-menu-btn');
    const dropdown = container.querySelector('.action-menu-dropdown');

    // Open
    btn.click();
    expect(dropdown.classList.contains('hidden')).toBe(false);

    // Close
    btn.click();
    expect(dropdown.classList.contains('hidden')).toBe(true);
  });

  test('Should render all actions', () => {
    const items = container.querySelectorAll('.action-menu-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Action 1');
    expect(items[1].textContent).toContain('Action 2');
  });

  test('Should call action callback and close menu on item click', () => {
    const btn = container.querySelector('.action-menu-btn');
    const dropdown = container.querySelector('.action-menu-dropdown');

    // Open menu first
    btn.click();
    expect(dropdown.classList.contains('hidden')).toBe(false);

    // Click Item 1
    const items = container.querySelectorAll('.action-menu-item');
    items[0].click();

    expect(mockActions[0].onClick).toHaveBeenCalled();
    // Should stay closed (implementation says this.closeMenu)
    expect(dropdown.classList.contains('hidden')).toBe(true);
  });
});
