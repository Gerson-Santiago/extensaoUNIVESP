import { SettingsView } from '../../sidepanel/views/SettingsView.js';

describe('Integration: Scrape Course Flow', () => {
  let settingsView;
  let container;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');
    jest.clearAllMocks();

    // Mock Storage
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) =>
      callback({})
    );
    /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((items, callback) =>
      callback()
    );

    // Mock Tabs
    /** @type {jest.Mock} */ (chrome.tabs.query).mockImplementation((query, callback) => {
      callback([
        {
          id: 123,
          url: 'https://ava.univesp.br/ultra/courses/_123_1/cl/outline',
          title: 'Matéria Real - Univesp',
        },
      ]);
    });

    // Mock Scripting (Scraper Logic)
    chrome.scripting = /** @type {any} */ ({
      executeScript: jest.fn(),
    });
  });

  test('should scrape current tab and save course', async () => {
    // 1. Setup Mock Scraper Result

    // 1. Setup Mock Scraper Result
    const mockScrapedData = {
      weeks: [
        { name: 'Semana 1', url: 'https://ava.univesp.br/s1' },
        { name: 'Semana 2', url: 'https://ava.univesp.br/s2' },
      ],
      title: 'Matéria Real',
    };

    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      { result: mockScrapedData },
    ]);

    // 2. Render Settings
    settingsView = new SettingsView({ onNavigate: mockNavigate });
    container.appendChild(settingsView.render());
    settingsView.afterRender();

    const btnAddCurrent = document.getElementById('btnAddCurrent');
    expect(btnAddCurrent).toBeTruthy();

    // 3. Trigger Scrape
    btnAddCurrent.click();

    // 4. Wait for Async Operations
    // Click -> tabs.query -> scrapeWeeksFromTab -> executeScript -> addItem -> storage.set
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 5. Verify Script Execution
    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId: 123, allFrames: true },
      func: expect.any(Function),
    });

    // 6. Verify Storage Save
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    const setCall = /** @type {jest.Mock} */ (chrome.storage.sync.set).mock.calls[0][0];

    expect(setCall.savedCourses).toBeDefined();
    expect(setCall.savedCourses.length).toBe(1);
    expect(setCall.savedCourses[0].name).toBe('Matéria Real');
    expect(setCall.savedCourses[0].weeks).toHaveLength(2);
    expect(setCall.savedCourses[0].weeks[0].name).toBe('Semana 1');

    // 7. Verify Feedback
    const feedbackEl = document.getElementById('settingsFeedback');
    expect(feedbackEl.textContent).toContain('sucesso');
  });

  test('should handle scrape failure gracefully', async () => {
    // Mock Scraper Failure
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockRejectedValue(
      new Error('Injection failed')
    );

    settingsView = new SettingsView({ onNavigate: mockNavigate });
    container.appendChild(settingsView.render());
    settingsView.afterRender();

    const btnAddCurrent = document.getElementById('btnAddCurrent');
    btnAddCurrent.click();

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should try to save anyway using tab title/url (fallback in handleAddCurrent?)
    // Looking at handleAddCurrent:
    // if (tab.url.startsWith('http')) { scrape... }
    // addItem(name ...) is called AFTER await scrapeWeeksFromTab
    // If scraper throws, scrapeWeeksFromTab returns { weeks: [], title: null } (it catches error)

    // So it SHOULD still save, but with 0 weeks.
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    const setCall = /** @type {jest.Mock} */ (chrome.storage.sync.set).mock.calls[0][0];
    expect(setCall.savedCourses[0].name).toBe('Matéria Real'); // Initial tab title fallback
    expect(setCall.savedCourses[0].weeks).toEqual([]);
  });
});
