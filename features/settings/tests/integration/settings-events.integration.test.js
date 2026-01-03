/**
 * @jest-environment jsdom
 */

import { SettingsView } from '@features/settings/ui/SettingsView.js';

describe('Integração: Desacoplamento de Eventos de Settings', () => {
  let settingsView;
  let container;

  beforeEach(() => {
    // Arrange (Setup)
    container = document.createElement('div');
    document.body.appendChild(container);
    settingsView = new SettingsView({ onNavigate: jest.fn() });

    // Mock confirm globally
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    document.body.removeChild(container);
    settingsView = null;
    jest.restoreAllMocks();
  });

  describe('Adicionar Curso Manualmente', () => {
    test('Deve emitir evento request:add-manual-course quando botão de Adicionar Manual for clicado', () => {
      // Arrange
      const eventSpy = jest.fn();
      window.addEventListener('request:add-manual-course', eventSpy);

      const settingsEl = settingsView.render();
      container.appendChild(settingsEl);
      settingsView.afterRender(); // Importante: attach listeners

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

  describe('Extrair Dados da Aba Atual (Scrape)', () => {
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

  describe('Limpar Todos os Cursos', () => {
    test('Deve emitir evento request:clear-all-courses quando botão Limpar Tudo for clicado e confirmado', async () => {
      // Arrange
      const eventSpy = jest.fn();
      window.addEventListener('request:clear-all-courses', eventSpy);

      const settingsEl = settingsView.render();
      container.appendChild(settingsEl);
      settingsView.afterRender();

      const clearBtn = settingsEl.querySelector('#btnClearAll');
      expect(clearBtn).toBeTruthy();

      // Act
      // Simula clique e aguarda promessa se houver
      await clearBtn.click();

      // Assert
      // expect(window.confirm).toHaveBeenCalled(); // Confirmation is handled by the listener (Sidepanel)
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'request:clear-all-courses',
        })
      );

      window.removeEventListener('request:clear-all-courses', eventSpy);
    });
  });
});
