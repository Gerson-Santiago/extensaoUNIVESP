import { SettingsView } from '../../sidepanel/views/SettingsView.js';
import { CoursesView } from '../../sidepanel/views/CoursesView.js';

describe('Integration: Add Course Manual Flow', () => {
  let settingsView;
  let coursesView;
  let container;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');

    // Reset Mocks
    jest.clearAllMocks();
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) =>
      callback({})
    );
    /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((items, callback) =>
      callback()
    );
  });

  test('should add a course manually and display it in the list', async () => {
    // 1. Initialize SettingsView
    settingsView = new SettingsView({ onNavigate: mockNavigate });
    const settingsEl = settingsView.render();
    container.appendChild(settingsEl);
    settingsView.afterRender();

    // 2. Open "Add Manual" Modal
    const btnManual = document.getElementById('btnManualAdd');
    expect(btnManual).toBeTruthy();
    btnManual.click();

    // 3. Fill the Modal Form
    // Modal appends to body usually, let's find it
    const modalOverlay = document.querySelector('.modal-overlay');
    expect(modalOverlay).toBeTruthy();
    expect(/** @type {HTMLElement} */ (modalOverlay).style.display).not.toBe('none');

    const nameInput = document.getElementById('manualName');
    const urlInput = document.getElementById('manualUrl');
    const btnSave = document.getElementById('btnSaveManual');

    expect(nameInput).toBeTruthy();
    expect(urlInput).toBeTruthy();
    expect(btnSave).toBeTruthy();

    // Simulate user input
    /** @type {HTMLInputElement} */ (nameInput).value = 'Matéria Teste Integração';
    /** @type {HTMLInputElement} */ (urlInput).value = 'https://ava.univesp.br/curso/123';

    // 4. Click Save
    // We need to wait for storage to update.
    // Logic: Click -> storage.add -> chrome.storage.sync.set -> callback
    btnSave.click();

    // Helper to wait for async operations (storage callback)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 5. Verify Storage Update
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    const setCall = /** @type {jest.Mock} */ (chrome.storage.sync.set).mock.calls[0][0];
    expect(setCall.savedCourses).toBeDefined();
    expect(setCall.savedCourses.length).toBe(1);
    expect(setCall.savedCourses[0].name).toBe('Matéria Teste Integração');

    // 6. Navigate to CoursesView and Verify Display
    // Mock storage.get to return what was just "saved" (since mock doesn't persist state automatically unless configured,
    // but jes-webextension-mock usually does in-memory if not mocked out.
    // Let's rely on checking if `storage.js` logic worked.
    // Actually, we mocked `get` in beforeEach to return empty. We should update it to return the saved data
    // or rely on the fact that `storage.js` might reload from the "set" data if we didn't mock `get` to strictly return empty forever.

    // Let's update the mock to verify CoursesView behavior
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
      callback({ savedCourses: setCall.savedCourses });
    });

    // Initialize CoursesView
    coursesView = new CoursesView({ onOpenCourse: jest.fn(), onViewDetails: jest.fn() });
    const coursesEl = coursesView.render();
    container.innerHTML = ''; // Clear settings
    container.appendChild(coursesEl);

    // This triggers loadCourses -> storage.loadItems -> chrome.storage.sync.get
    coursesView.afterRender();

    // Wait for render
    await new Promise((resolve) => setTimeout(resolve, 100));

    const listItems = document.querySelectorAll('#itemList li');
    expect(listItems.length).toBe(1);
    expect(listItems[0].textContent).toContain('Matéria Teste Integração');
  });
});
