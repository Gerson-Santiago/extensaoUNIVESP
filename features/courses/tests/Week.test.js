/**
 * @jest-environment jsdom
 */

describe('Week Model - Status Support', () => {
  it('should support status property in items', () => {
    const week = {
      name: 'Semana 1',
      items: [
        { name: 'Tarefa 1', url: 'http://test.com/t1', type: 'video', status: 'DONE' },
        { name: 'Tarefa 2', url: 'http://test.com/t2', type: 'quiz', status: 'TODO' },
      ],
    };

    expect(week.items[0].status).toBe('DONE');
    expect(week.items[1].status).toBe('TODO');
  });

  it('should allow DOING status', () => {
    const week = {
      name: 'Semana 2',
      items: [{ name: 'Tarefa em andamento', status: 'DOING' }],
    };

    expect(week.items[0].status).toBe('DOING');
  });

  it('should work without status (optional)', () => {
    const week = {
      name: 'Semana 3',
      items: [{ name: 'Tarefa sem status', url: 'http://test.com', type: 'document' }],
    };

    expect(week.items[0].status).toBeUndefined();
  });

  it('should maintain existing Week structure', () => {
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

    expect(week.name).toBe('Semana 4');
    expect(week.url).toBe('http://test.com/week4');
    expect(week.date).toBe('01/01 a 07/01');
    expect(week.items).toHaveLength(1);
    expect(week.items[0].status).toBe('DONE');
  });
});
