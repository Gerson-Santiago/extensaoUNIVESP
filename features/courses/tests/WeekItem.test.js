/**
 * @jest-environment jsdom
 */
import { createWeekElement } from '../components/WeekItem.js';

describe('WeekItem with Tasks Button', () => {
  it('should render tasks button', () => {
    const week = { name: 'Semana 1', items: [], url: 'http://test.com' };
    const callbacks = { onViewTasks: jest.fn() };

    const element = createWeekElement(week, callbacks);
    const btn = element.querySelector('.btn-tasks');

    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Tarefas');
  });

  it('should call onViewTasks when button clicked', () => {
    const week = { name: 'Semana 1', items: [], url: 'http://test.com' };
    const callbacks = { onViewTasks: jest.fn() };

    const element = createWeekElement(week, callbacks);
    const btn = /** @type {HTMLButtonElement} */ (element.querySelector('.btn-tasks'));
    btn.click();

    expect(callbacks.onViewTasks).toHaveBeenCalledTimes(1);
    expect(callbacks.onViewTasks).toHaveBeenCalledWith(week);
  });

  it('should stop propagation on button click (not trigger div onClick)', () => {
    const week = { name: 'Semana 1', url: 'http://test.com', items: [] };
    const callbacks = {
      onClick: jest.fn(),
      onViewTasks: jest.fn(),
    };

    const element = createWeekElement(week, callbacks);
    const btn = /** @type {HTMLButtonElement} */ (element.querySelector('.btn-tasks'));
    btn.click();

    // onClick do div NÃO deve ser chamado
    expect(callbacks.onClick).not.toHaveBeenCalled();
    expect(callbacks.onViewTasks).toHaveBeenCalledWith(week);
  });

  it('should render button between name and arrow', () => {
    const week = { name: 'Semana 1', items: [] };
    const callbacks = { onViewTasks: jest.fn() };

    const element = createWeekElement(week, callbacks);
    const children = Array.from(element.children);

    expect(children[0].className).toBe('week-name');
    expect(children[1].className).toBe('btn-tasks');
    expect(children[2].className).toBe('week-arrow');
  });

  it('should work without onViewTasks callback', () => {
    const week = { name: 'Semana 1', items: [] };
    const callbacks = {};

    const element = createWeekElement(week, callbacks);
    const btn = /** @type {HTMLButtonElement} */ (element.querySelector('.btn-tasks'));

    // Não deve dar erro ao clicar
    expect(() => btn.click()).not.toThrow();
  });
});
