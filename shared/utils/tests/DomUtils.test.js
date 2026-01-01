import { DomUtils } from '../DomUtils.js';

describe('DomUtils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('ensureModalClosed', () => {
    it('deve fechar o modal se o botão de fechar existir', () => {
      // Arrange
      document.body.innerHTML = `
        <div id="modal">
          <a class="lbAction" href="#close">Fechar</a>
        </div>
      `;
      const closeBtn = document.querySelector('a.lbAction');
      const clickMock = jest.fn();
      // @ts-ignore - Mock para teste
      closeBtn.click = clickMock;

      // Act
      const result = DomUtils.ensureModalClosed(document);

      // Assert
      expect(result).toBe(true);
      expect(clickMock).toHaveBeenCalled();
    });

    it('deve retornar false se o botão de fechar não existir', () => {
      // Arrange
      document.body.innerHTML = '<div id="no-modal"></div>';

      // Act
      const result = DomUtils.ensureModalClosed(document);

      // Assert
      expect(result).toBe(false);
    });

    it('deve usar document por padrão se nenhum dom for passado', () => {
      // Arrange
      document.body.innerHTML = '<a class="lbAction" href="#close">Fechar</a>';

      // Act
      const result = DomUtils.ensureModalClosed();

      // Assert
      expect(result).toBe(true);
    });
  });
});
