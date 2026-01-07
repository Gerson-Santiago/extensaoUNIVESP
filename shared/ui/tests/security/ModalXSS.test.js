import { Modal } from '../../Modal.js';

describe('Security: Modal XSS Vulnerability Check', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('🔴 DEVE FALHAR: Título do Modal não pode interpretar HTML', () => {
    // Arrange
    const maliciousTitle = '<script>alert("XSS")</script>';
    const modal = new Modal('test-modal', maliciousTitle);

    // Act
    modal.render('Conteúdo seguro');

    // Assert
    const titleElement = document.querySelector('h3');

    // Se vulnerável, innerHTML vai ter <script>
    expect(titleElement.innerHTML).not.toContain('<script');
    expect(titleElement.textContent).toBe(maliciousTitle);
  });

  test('🔴 DEVE FALHAR: Conteúdo do Modal deve ser sanitizado se inserido via HTML', () => {
    // Arrange
    const modal = new Modal('test-modal', 'Título Seguro');
    const maliciousContent = '<img src=x onerror=alert(1)>';

    // Act
    // Assumindo que render aceita HTML (vulnerabilidade conhecida)
    modal.render(maliciousContent);

    // Assert
    const body = document.querySelector('.modal-body');
    expect(body.innerHTML).not.toContain('<img src=x');
  });
});
