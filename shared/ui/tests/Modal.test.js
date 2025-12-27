import { Modal } from '../Modal.js';

describe('Componente Modal', () => {
  let modal;
  const modalId = 'test-modal';
  const modalTitle = 'Modal de Teste';
  const modalContent = '<p>Conteúdo de Teste</p>';

  beforeEach(() => {
    // Preparar (Arrange) - Limpar DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (modal) {
      modal.close();
    }
    jest.clearAllMocks();
  });

  test('deve renderizar o modal corretamente', () => {
    // Agir (Act)
    modal = new Modal(modalId, modalTitle);
    modal.render(modalContent);

    // Verificar (Assert)
    const overlay = document.getElementById(modalId);
    expect(overlay).not.toBeNull();
    expect(overlay.querySelector('.modal-card')).not.toBeNull();
    expect(overlay.querySelector('h3').textContent).toBe(modalTitle);
    expect(overlay.querySelector('.modal-body').innerHTML).toBe(modalContent);
  });

  test('deve remover modal existente com mesmo id antes de renderizar', () => {
    // Preparar (Arrange) - Primeiro modal
    const firstModal = new Modal(modalId, 'Primeiro');
    firstModal.render('Primeiro Conteúdo');

    // Agir (Act) - Segundo modal com mesmo ID
    modal = new Modal(modalId, 'Segundo');
    modal.render('Segundo Conteúdo');

    // Verificar (Assert)
    const elements = document.querySelectorAll(`#${modalId}`);
    expect(elements.length).toBe(1);
    expect(elements[0].querySelector('h3').textContent).toBe('Segundo');
  });

  test('deve fechar o modal quando close() for chamado', () => {
    // Preparar (Arrange)
    modal = new Modal(modalId, modalTitle);
    modal.render(modalContent);

    // Agir (Act)
    modal.close();

    // Verificar (Assert)
    const overlay = document.getElementById(modalId);
    expect(overlay).toBeNull();
  });

  test('deve fechar o modal ao clicar no botão de fechar', () => {
    // Preparar (Arrange)
    modal = new Modal(modalId, modalTitle);
    modal.render(modalContent);
    const closeBtn = /** @type {HTMLElement} */ (document.querySelector('.btn-close-modal'));

    // Agir (Act)
    closeBtn.click();

    // Verificar (Assert)
    const overlay = document.getElementById(modalId);
    expect(overlay).toBeNull();
  });

  test('deve fechar o modal ao clicar no overlay', () => {
    // Preparar (Arrange)
    modal = new Modal(modalId, modalTitle);
    modal.render(modalContent);
    const overlay = /** @type {HTMLElement} */ (document.getElementById(modalId));

    // Agir (Act)
    overlay.click();

    // Verificar (Assert)
    const checkOverlay = document.getElementById(modalId);
    expect(checkOverlay).toBeNull();
  });

  test('NÃO deve fechar o modal ao clicar dentro do card', () => {
    // Preparar (Arrange)
    modal = new Modal(modalId, modalTitle);
    modal.render(modalContent);
    const card = /** @type {HTMLElement} */ (document.querySelector('.modal-card'));

    // Agir (Act) - Clique dentro do card
    card.click();

    // Verificar (Assert)
    const overlay = document.getElementById(modalId);
    expect(overlay).not.toBeNull(); // Ainda deve existir
  });

  test('deve executar onCloseCallback quando fechado', () => {
    // Preparar (Arrange)
    const callback = jest.fn();
    modal = new Modal(modalId, modalTitle);
    modal.setOnClose(callback);
    modal.render(modalContent);

    // Agir (Act)
    modal.close();

    // Verificar (Assert)
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
