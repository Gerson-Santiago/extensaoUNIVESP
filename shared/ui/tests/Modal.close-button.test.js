/**
 * @file Modal.close-button.test.js
 * @description Testes de regressão para botão fechar modal
 * Bug: Botão × não funciona corretamente
 */

import { Modal } from '../Modal.js';

describe('Modal - Botão Fechar (Regression)', () => {
  let modal;

  beforeEach(() => {
    document.body.innerHTML = '';
    modal = new Modal('test-modal', 'Teste');
  });

  afterEach(() => {
    if (modal.element) {
      modal.element.remove();
    }
  });

  test('deve fechar modal ao clicar no botão ×', () => {
    // ARRANGE
    modal.render('\u003cp\u003eConteúdo\u003c/p\u003e');
    const closeBtn = /** @type {HTMLButtonElement} */ (document.querySelector('.btn-close-modal'));

    // ACT
    closeBtn.click();

    // ASSERT: Modal deve ser removido do DOM
    expect(document.getElementById('test-modal')).toBeNull();
    expect(modal.element).toBeNull();
  });

  test('deve executar callback onClose ao fechar', () => {
    // ARRANGE
    const onCloseMock = jest.fn();
    modal.setOnClose(onCloseMock);
    modal.render('\u003cp\u003eConteúdo\u003c/p\u003e');
    const closeBtn = /** @type {HTMLButtonElement} */ (document.querySelector('.btn-close-modal'));

    // ACT
    closeBtn.click();

    // ASSERT: Callback deve ser chamado
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('deve fechar modal ao clicar no overlay (fora do card)', () => {
    // ARRANGE
    modal.render('\u003cp\u003eConteúdo\u003c/p\u003e');
    const overlay = document.getElementById('test-modal');

    // ACT: Simula clique direto no overlay
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: overlay, enumerable: true });
    overlay.dispatchEvent(event);

    // ASSERT: Modal deve fechar
    expect(document.getElementById('test-modal')).toBeNull();
  });

  test('NÃO deve fechar modal ao clicar dentro do card', () => {
    // ARRANGE
    modal.render('\u003cp\u003eConteúdo\u003c/p\u003e');
    const card = document.querySelector('.modal-card');

    // ACT: Simula clique no card (não no overlay)
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: card, enumerable: true });
    card.dispatchEvent(event);

    // ASSERT: Modal deve permanecer aberto
    expect(document.getElementById('test-modal')).not.toBeNull();
  });

  test('deve garantir z-index alto para sobrepor modal nativo do Blackboard', () => {
    // ARRANGE
    modal.render('\u003cp\u003eConteúdo\u003c/p\u003e');
    const overlay = document.getElementById('test-modal');

    // ACT: Extrai z-index do CSS inline
    const zIndex = parseInt(overlay.style.zIndex, 10);

    // ASSERT: z-index deve ser \u003e= 1000 (maior que modal do Blackboard)
    expect(zIndex).toBeGreaterThanOrEqual(1000);
  });
});
