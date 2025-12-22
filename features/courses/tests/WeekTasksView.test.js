/**
 * @jest-environment jsdom
 */
import { WeekTasksView } from '../views/WeekTasksView/index.js';

describe('WeekTasksView', () => {
  let view;
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onBack: jest.fn(),
    };
    view = new WeekTasksView(mockCallbacks);
    document.body.innerHTML = '';
  });

  it('should render week name in header', () => {
    view.setWeek({ name: 'Semana 1', items: [] });
    const element = view.render();

    expect(element.textContent).toContain('Semana 1');
    expect(element.textContent).toContain('Tarefas');
  });

  it('should render empty state when no items', () => {
    view.setWeek({ name: 'Semana 1', items: [] });
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();

    expect(document.body.textContent).toContain('Nenhuma tarefa encontrada');
  });

  it('should render tasks with status icons', () => {
    const week = {
      name: 'Semana 1',
      items: [
        { name: 'Tarefa 1', url: '#', type: 'video', status: 'DONE' },
        { name: 'Tarefa 2', url: '#', type: 'quiz', status: 'TODO' },
        { name: 'Tarefa 3', url: '#', type: 'pdf', status: 'DOING' },
      ],
    };

    view.setWeek(week);
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();

    const tasks = document.querySelectorAll('.task-item');
    expect(tasks.length).toBe(3);
    expect(tasks[0].textContent).toContain('🟢');
    expect(tasks[0].textContent).toContain('Tarefa 1');
    expect(tasks[1].textContent).toContain('⚪');
    expect(tasks[1].textContent).toContain('Tarefa 2');
    expect(tasks[2].textContent).toContain('🔵');
    expect(tasks[2].textContent).toContain('Tarefa 3');
  });

  it('should default to TODO icon when status is undefined', () => {
    const week = {
      name: 'Semana 1',
      items: [{ name: 'Tarefa sem status', url: '#', type: 'document' }],
    };

    view.setWeek(week);
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();

    const tasks = document.querySelectorAll('.task-item');
    expect(tasks[0].textContent).toContain('⚪');
  });

  it('should call onBack callback when back button is clicked', () => {
    view.setWeek({ name: 'Semana 1', items: [] });
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();

    const backBtn = document.getElementById('backBtn');
    expect(backBtn).toBeTruthy();

    backBtn.click();
    expect(mockCallbacks.onBack).toHaveBeenCalledTimes(1);
  });

  it('should return empty div when no week is set', () => {
    const element = view.render();
    expect(element.tagName).toBe('DIV');
    expect(element.children.length).toBe(0);
  });

  it('should have correct status icon mapping', () => {
    expect(view.getStatusIcon('DONE')).toBe('🟢');
    expect(view.getStatusIcon('DOING')).toBe('🔵');
    expect(view.getStatusIcon('TODO')).toBe('⚪');
    expect(view.getStatusIcon('INVALID')).toBe('⚪'); // Default fallback
  });

  it('should handle empty items array', () => {
    view.setWeek({ name: 'Semana Vazia', items: [] });
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();

    const container = document.getElementById('tasksList');
    expect(container.textContent).toContain('Nenhuma tarefa');
  });

  it('should render multiple tasks correctly', () => {
    const week = {
      name: 'Semana Completa',
      items: [
        { name: 'Videoaula 1', status: 'DONE' },
        { name: 'Quiz 1', status: 'DONE' },
        { name: 'Fórum', status: 'DOING' },
        { name: 'PDF Complementar', status: 'TODO' },
        { name: 'Exercício Final', status: 'TODO' },
      ],
    };

    view.setWeek(week);
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();

    const tasks = document.querySelectorAll('.task-item');
    expect(tasks.length).toBe(5);
  });
});
