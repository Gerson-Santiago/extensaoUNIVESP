/**
 * @jest-environment jsdom
 */
import { createWeekElement } from '../../components/WeekItem.js';

describe('WeekItem com botão de Tarefas', () => {
  it('deve renderizar botão de tarefas', () => {
    // Arrange
    const week = { name: 'Semana 1', items: [], url: 'http://test.com' };
    const callbacks = { onViewTasks: jest.fn() };

    // Act
    const element = createWeekElement(week, callbacks);
    const btn = element.querySelector('.btn-grid-action');

    // Assert
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Tarefas');
  });

  it('deve chamar onViewTasks quando botão clicado', () => {
    // Arrange
    const week = { name: 'Semana 1', items: [], url: 'http://test.com' };
    const callbacks = { onViewTasks: jest.fn() };
    const element = createWeekElement(week, callbacks);
    const btn = /** @type {HTMLButtonElement} */ (element.querySelector('.btn-grid-action'));

    // Act
    btn.click();

    // Assert
    expect(callbacks.onViewTasks).toHaveBeenCalledTimes(1);
    expect(callbacks.onViewTasks).toHaveBeenCalledWith(week);
  });

  it('deve parar propagação no clique do botão (não acionar div onClick)', () => {
    // Arrange
    const week = { name: 'Semana 1', url: 'http://test.com', items: [] };
    const callbacks = {
      onClick: jest.fn(),
      onViewTasks: jest.fn(),
    };
    const element = createWeekElement(week, callbacks);
    const btn = /** @type {HTMLButtonElement} */ (element.querySelector('.btn-grid-action'));

    // Act
    btn.click();

    // Assert
    // onClick do div NÃO deve ser chamado
    expect(callbacks.onClick).not.toHaveBeenCalled();
    expect(callbacks.onViewTasks).toHaveBeenCalledWith(week);
  });

  it('deve renderizar botão entre nome e seta', () => {
    // Arrange
    const week = { name: 'Semana 1', items: [] };
    const callbacks = { onViewTasks: jest.fn() };

    // Act
    const element = createWeekElement(week, callbacks);
    const children = Array.from(element.children);

    // Assert
    expect(children[0].className).toBe('week-name');
    expect(children[1].className).toBe('btn-grid-action'); // Tarefas
    expect(children[2].className).toBe('btn-grid-action btn-activities'); // @Atividades (QuickLinks)
    expect(children[3].className).toBe('week-arrow');
  });

  it('deve funcionar sem callback onViewTasks', () => {
    // Arrange
    const week = { name: 'Semana 1', items: [] };
    const callbacks = {};
    const element = createWeekElement(week, callbacks);
    const btn = /** @type {HTMLButtonElement} */ (element.querySelector('.btn-grid-action'));

    // Act & Assert
    // Não deve dar erro ao clicar
    expect(() => btn.click()).not.toThrow();
  });
});
