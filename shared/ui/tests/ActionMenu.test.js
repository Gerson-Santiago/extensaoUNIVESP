import { ActionMenu } from '../ActionMenu.js';

describe('Componente ActionMenu (Menu de Ações)', () => {
  let actionMenu;
  let container;
  const mockActions = [
    { label: 'Ação 1', icon: 'A', onClick: jest.fn() },
    { label: 'Ação 2', icon: 'B', onClick: jest.fn() },
  ];

  beforeEach(() => {
    // Preparar (Arrange) - Configurar Menu e DOM
    document.body.innerHTML = '';
    actionMenu = new ActionMenu({
      title: 'Menu de Teste',
      icon: '+',
      actions: mockActions,
    });
    container = actionMenu.render();
    document.body.appendChild(container);
  });

  test('Deve renderizar o botão com ícone e título corretos', () => {
    // Agir (Act)
    const btn = container.querySelector('.action-menu-btn');

    // Verificar (Assert)
    expect(btn).toBeTruthy();
    expect(btn.title).toBe('Menu de Teste');
    expect(btn.innerHTML).toContain('+');
  });

  test('Deve renderizar o dropdown oculto inicialmente', () => {
    // Agir (Act)
    const dropdown = container.querySelector('.action-menu-dropdown');

    // Verificar (Assert)
    expect(dropdown.classList.contains('hidden')).toBe(true);
  });

  test('Deve alternar a visibilidade do dropdown ao clicar', () => {
    // Preparar (Arrange)
    const btn = container.querySelector('.action-menu-btn');
    const dropdown = container.querySelector('.action-menu-dropdown');

    // Agir (Act) - Abrir
    btn.click();
    // Verificar (Assert)
    expect(dropdown.classList.contains('hidden')).toBe(false);

    // Agir (Act) - Fechar
    btn.click();
    // Verificar (Assert)
    expect(dropdown.classList.contains('hidden')).toBe(true);
  });

  test('Deve renderizar todas as ações', () => {
    // Agir (Act)
    const items = container.querySelectorAll('.action-menu-item');

    // Verificar (Assert)
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Ação 1');
    expect(items[1].textContent).toContain('Ação 2');
  });

  test('Deve chamar o callback da ação e fechar o menu ao clicar no item', () => {
    // Preparar (Arrange) - Botão, Dropdown e Abrir Menu
    const btn = container.querySelector('.action-menu-btn');
    const dropdown = container.querySelector('.action-menu-dropdown');
    btn.click();
    expect(dropdown.classList.contains('hidden')).toBe(false);

    // Agir (Act) - Clicar no Item 1
    const items = container.querySelectorAll('.action-menu-item');
    items[0].click();

    // Verificar (Assert)
    expect(mockActions[0].onClick).toHaveBeenCalled();
    // Deve fechar (com base na implementação)
    expect(dropdown.classList.contains('hidden')).toBe(true);
  });
});
