import { MainLayout } from '../../sidepanel/components/Layout/MainLayout.js';
import { HomeView } from '../../features/home/ui/HomeView.js';
// We can use mocks for other views to simplify dependencies if we just want to test navigation
// But let's import real classes since it's an integration test
import { CoursesList } from '../../features/courses/components/CoursesList.js';
import { SettingsView } from '../../features/settings/ui/SettingsView.js';

describe('Integration: Navigation Flow', () => {
  let container;
  let layout;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');
    jest.clearAllMocks();

    // Mocks for dependencies found in Views
    // Storage
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) =>
      callback({ savedCourses: [] })
    );
    // FeedbackManager in SettingsView creates DOM elements, which is fine in jsdom
  });

  test('should navigate between tabs using TopNav', () => {
    // 1. Setup Views & Layout
    const homeView = new HomeView({ onAddCurrentInfo: jest.fn() });
    const coursesView = new CoursesList({ onOpenCourse: jest.fn(), onViewDetails: jest.fn() });
    const settingsView = new SettingsView({ onNavigate: jest.fn() });

    // Mock render methods to easily identify them if we wanted,
    // but let's trust real render() outputs distinctive classes

    const views = {
      home: homeView,
      courses: coursesView,
      settings: settingsView,
    };

    layout = new MainLayout(views);
    layout.init();

    // 2. Verify Initial State (Home)
    const mainContent = document.getElementById('main-content');
    expect(mainContent.querySelector('.view-home-dashboard')).toBeTruthy();
    expect(container.querySelector('.view-courses')).toBeFalsy();

    // Verify Nav Active State
    const homeBtn = document.querySelectorAll('.nav-item')[0];
    expect(homeBtn.classList.contains('active')).toBe(true);

    // 3. Navigate to Courses
    const coursesBtn = document.querySelectorAll('.nav-item')[1];
    /** @type {HTMLElement} */ (coursesBtn).click();

    expect(mainContent.querySelector('.view-courses')).toBeTruthy();
    expect(mainContent.querySelector('.view-home-dashboard')).toBeFalsy();
    expect(coursesBtn.classList.contains('active')).toBe(true);
    expect(homeBtn.classList.contains('active')).toBe(false);

    // 4. Navigate to Settings
    const settingsBtn = document.querySelectorAll('.nav-item')[2];
    /** @type {HTMLElement} */ (settingsBtn).click();

    expect(mainContent.querySelector('.view-settings')).toBeTruthy();
    expect(settingsBtn.classList.contains('active')).toBe(true);
  });

  test('should handle programmatic navigation', () => {
    const homeView = new HomeView({});
    const coursesView = new CoursesList({});

    const views = {
      home: homeView,
      courses: coursesView,
    };

    layout = new MainLayout(views);
    layout.init();

    // Initial
    expect(
      document.getElementById('main-content').querySelector('.view-home-dashboard')
    ).toBeTruthy();

    // Programmatic
    layout.navigateTo('courses');

    expect(document.getElementById('main-content').querySelector('.view-courses')).toBeTruthy();

    // TopNav updates via setActive inside layout if wired?

    // Wait, MainLayout.navigateTo sets currentViewId and calls view.render
    // But TopNav state is separate class instance property 'topNav'.
    // Does MainLayout.navigateTo update topNav active state?
    // Checking MainLayout.js logic...
    // No, construction: this.topNav = new TopNav((viewId) => this.navigateTo(viewId));
    // TopNav.onclick -> calling this.setActive(tabId) THEN this.onNavigate(tabId)
    // So clicking updates UI.
    // But calling layout.navigateTo directly DOES NOT update TopNav active state unless logic is added.
    // Let's verify this behavior (or lack thereof) which mimics current simple implementation.

    // Actually, SettingsView's onNavigate callback in sidepanel.js does:
    // layout.topNav.setActive(viewId);
    // layout.navigateTo(viewId);

    // So the Integration test should probably replicate that wiring or just test `layout.navigateTo` effects on content.
    // We will just test content switch here.
  });
});
