/**
 * @jest-environment jsdom
 */
import { ContextualChips } from '../ContextualChips.js';

describe('ContextualChips', () => {
  let container;
  let chipsComponent;
  const mockHistory = [
    { id: '1', label: 'Semana 1', targetId: 't1' },
    { id: '2', label: 'Semana 2', targetId: 't2' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    chipsComponent = new ContextualChips(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('should render chips from data', () => {
    chipsComponent.render(mockHistory);
    const chips = container.querySelectorAll('.chip');
    expect(chips.length).toBe(2);
    expect(chips[0].textContent).toContain('Semana 1');
    expect(chips[1].textContent).toContain('Semana 2');
  });

  test('should emit navigate event on click', () => {
    const onNavigate = jest.fn();
    chipsComponent.on('navigate', onNavigate);

    chipsComponent.render(mockHistory);
    const firstChip = container.querySelector('.chip');
    firstChip.click();

    expect(onNavigate).toHaveBeenCalledWith(mockHistory[0]);
  });

  test('should emit remove event on remove button click', () => {
    const onRemove = jest.fn();
    chipsComponent.on('remove', onRemove);

    chipsComponent.render(mockHistory);
    const removeBtn = container.querySelector('.remove-btn');
    // Stop bubbling check usually requires event mock, but simple click should bubble if not stopped
    // We verify the component handles it
    removeBtn.click();

    expect(onRemove).toHaveBeenCalledWith(mockHistory[0].id);
  });
});
