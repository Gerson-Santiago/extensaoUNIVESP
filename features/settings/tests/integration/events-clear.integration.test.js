/**
 * @jest-environment jsdom
 */

import { SettingsView } from '@features/settings/ui/SettingsView.js';

describe('Integração: Eventos de Settings (Limpar Tudo)', () => {
  let settingsView;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    settingsView = new SettingsView({ onNavigate: jest.fn() });

    // Mock confirm globally although strictly not needed if we expect only the event in this scope
    // But helpful if logic changes back.
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    document.body.removeChild(container);
    settingsView = null;
    jest.restoreAllMocks();
  });

  test('Deve emitir evento request:clear-all-courses quando botão Limpar Tudo for clicado', async () => {
    // Arrange
    const eventSpy = jest.fn();
    window.addEventListener('request:clear-all-courses', eventSpy);

    const settingsEl = settingsView.render();
    container.appendChild(settingsEl);
    settingsView.afterRender();

    const clearBtn = settingsEl.querySelector('#btnClearAll');
    expect(clearBtn).toBeTruthy();

    // Act
    await clearBtn.click();

    // Assert
    // Verify that the View (dumb component) dispatched the event.
    // The orchestration (Sidepanel) handles confirmation and execution.
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'request:clear-all-courses',
      })
    );

    window.removeEventListener('request:clear-all-courses', eventSpy);
  });
});
