/**
 * @jest-environment jsdom
 */

import { SettingsView } from '@features/settings/ui/SettingsView.js';

describe('Integração: Eventos de Settings (Adicionar Manual)', () => {
  let settingsView;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    settingsView = new SettingsView({ onNavigate: jest.fn() });
  });

  afterEach(() => {
    document.body.removeChild(container);
    settingsView = null;
    jest.restoreAllMocks();
  });

  test('Deve emitir evento request:add-manual-course quando botão de Adicionar Manual for clicado', () => {
    // Arrange
    const eventSpy = jest.fn();
    window.addEventListener('request:add-manual-course', eventSpy);

    const settingsEl = settingsView.render();
    container.appendChild(settingsEl);
    settingsView.afterRender();

    const addManualBtn = settingsEl.querySelector('#btnManualAdd');
    expect(addManualBtn).toBeTruthy();

    // Act
    addManualBtn.click();

    // Assert
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'request:add-manual-course',
        detail: expect.objectContaining({ source: 'settings' }),
      })
    );

    window.removeEventListener('request:add-manual-course', eventSpy);
  });
});
