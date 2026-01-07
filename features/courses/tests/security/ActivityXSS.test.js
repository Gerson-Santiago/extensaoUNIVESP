import { ActivityItemFactory } from '../../views/DetailsActivitiesWeekView/ActivityItemFactory.js';

describe('Security: ActivityItemFactory XSS Vulnerability Check', () => {
  test('🔴 DEVE FALHAR: Payload XSS não deve ser renderizado no DOM', () => {
    // Arrange
    const maliciousPayload = '<img src=x onerror=alert("XSS")>';
    const task = {
      id: '123',
      original: { name: maliciousPayload },
    };

    // Act
    const mockOnItemClick = jest.fn();
    const factory = new ActivityItemFactory(mockOnItemClick); // Instancia a factory com mock
    const element = factory.createActivityItem(task, 1); // Chama o método correto

    // Assert
    // Se vulnerável, innerHTML vai conter a tag <img ...>
    // Se protegido, vai conter &lt;img ...&gt; ou textContent seguro

    // NOTA: Como estamos na fase RED (provar falha), esperamos que isso aqui REVELE a tag <img
    // O teste "passa" se ele encontrar a vulnerabilidade?
    // Não, o teste deve ser escrito esperando O COMPORTAMENTO SEGURO.
    // E ele vai FALHAR porque o código atual é inseguro.

    expect(element.innerHTML).not.toContain('<img src=x');
    expect(element.textContent).toContain(maliciousPayload); // Deve aparecer como texto, não tag
  });
});
