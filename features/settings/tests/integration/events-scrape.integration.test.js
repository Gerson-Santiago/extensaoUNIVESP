/**
 * @jest-environment jsdom
 */

import { SettingsView } from '@features/settings/ui/SettingsView.js';

describe('Integração: Eventos de Settings (Scrape)', () => {
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

  test('Deve emitir evento request:scrape-current-tab quando botão Scrape for clicado', () => {
    // Arrange
    const eventSpy = jest.fn();
    window.addEventListener('request:scrape-current-tab', eventSpy);

    const settingsEl = settingsView.render();
    container.appendChild(settingsEl);
    settingsView.afterRender();

    const scrapeBtn = settingsEl.querySelector('#btnAddCurrent');
    expect(scrapeBtn).toBeTruthy();

    // Act
    scrapeBtn.click();

    // Assert
    expect(eventSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener('request:scrape-current-tab', eventSpy);
  });
});
