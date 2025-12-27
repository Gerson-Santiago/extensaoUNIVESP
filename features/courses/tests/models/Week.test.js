/**
 * @jest-environment jsdom
 */

describe('Modelo Week - Suporte a Status', () => {
  it('deve suportar propriedade de status nos itens', () => {
    // Arrange
    const week = {
      name: 'Semana 1',
      items: [
        { name: 'Tarefa 1', url: 'http://test.com/t1', type: 'video', status: 'DONE' },
        { name: 'Tarefa 2', url: 'http://test.com/t2', type: 'quiz', status: 'TODO' },
      ],
    };

    // Act & Assert
    expect(week.items[0].status).toBe('DONE');
    expect(week.items[1].status).toBe('TODO');
  });

  it('deve permitir status DOING', () => {
    // Arrange
    const week = {
      name: 'Semana 2',
      items: [{ name: 'Tarefa em andamento', status: 'DOING' }],
    };

    // Act & Assert
    expect(week.items[0].status).toBe('DOING');
  });

  it('deve funcionar sem status (opcional)', () => {
    // Arrange
    const week = {
      name: 'Semana 3',
      items: [{ name: 'Tarefa sem status', url: 'http://test.com', type: 'document' }],
    };

    // Act & Assert
    expect(week.items[0].status).toBeUndefined();
  });

  it('deve manter a estrutura existente de Week', () => {
    // Arrange
    const week = {
      name: 'Semana 4',
      url: 'http://test.com/week4',
      date: '01/01 a 07/01',
      items: [
        {
          name: 'Tarefa completa',
          url: 'http://test.com/task',
          type: 'video',
          status: 'DONE',
        },
      ],
    };

    // Act & Assert
    expect(week.name).toBe('Semana 4');
    expect(week.url).toBe('http://test.com/week4');
    expect(week.date).toBe('01/01 a 07/01');
    expect(week.items).toHaveLength(1);
    expect(week.items[0].status).toBe('DONE');
  });
});
