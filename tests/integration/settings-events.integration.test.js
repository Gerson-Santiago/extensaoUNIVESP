/**
 * @jest-environment jsdom
 */

import { SettingsView } from '../../features/settings/ui/SettingsView.js';

describe('Integration: Settings Event Decoupling', () => {
  let settingsView;
  let container;

  beforeEach(() => {
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

  describe('Adding Manual Course Event', () => {
    test('should emit request:add-manual-course event when Add Manual button is clicked', () => {
      const eventSpy = jest.fn();
      window.addEventListener('request:add-manual-course', eventSpy);

      const settingsEl = settingsView.render();
      container.appendChild(settingsEl);
      settingsView.afterRender(); // Importante: attach listeners

      const addManualBtn = settingsEl.querySelector('#btnManualAdd');

      expect(addManualBtn).toBeTruthy();
      addManualBtn.click();

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

  describe('Scraping Current Tab Event', () => {
    test('should emit request:scrape-current-tab event when Scrape button is clicked', () => {
      const eventSpy = jest.fn();
      window.addEventListener('request:scrape-current-tab', eventSpy);

      const settingsEl = settingsView.render();
      container.appendChild(settingsEl);
      settingsView.afterRender();

      const scrapeBtn = settingsEl.querySelector('#btnAddCurrent');

      expect(scrapeBtn).toBeTruthy();
      scrapeBtn.click();

      expect(eventSpy).toHaveBeenCalledTimes(1);

      window.removeEventListener('request:scrape-current-tab', eventSpy);
    });
  });

  describe('Clear All Courses Event', () => {
    test('should emit request:clear-all-courses event when Clear All button is clicked and confirmed', async () => {
      const eventSpy = jest.fn();
      window.addEventListener('request:clear-all-courses', eventSpy);

      const settingsEl = settingsView.render();
      container.appendChild(settingsEl);
      settingsView.afterRender();

      const clearBtn = settingsEl.querySelector('#btnClearAll');
      expect(clearBtn).toBeTruthy();

      // Simula clique e aguarda promessa se houver
      await clearBtn.click();

      expect(window.confirm).toHaveBeenCalled();
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
