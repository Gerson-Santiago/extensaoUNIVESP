import { MainLayout } from '../../shared/ui/layout/MainLayout.js';
import { HomeView } from '../../features/home/ui/HomeView.js';
// We can use mocks for other views to simplify dependencies if we just want to test navigation
// But let's import real classes since it's an integration test
import { CoursesView } from '../../features/courses/views/CoursesView/index.js';
import { SettingsView } from '../../features/settings/ui/SettingsView.js';

describe('Integração: Fluxo de Navegação', () => {
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

  test('deve navegar entre abas usando o TopNav', () => {
    // Preparar (Arrange): Configura as Views e o Layout principal
    const homeView = new HomeView({ onAddCurrentInfo: jest.fn() });
    const coursesView = new CoursesView({ onOpenCourse: jest.fn(), onViewDetails: jest.fn() });
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

  test('deve lidar com navegação programática', () => {
    // Preparar (Arrange)
    const homeView = new HomeView({});
    const coursesView = new CoursesView({});

    const views = {
      home: homeView,
      courses: coursesView,
    };

    layout = new MainLayout(views);
    layout.init();

    // Agir (Act) - Verificar estado inicial e navegar programaticamente
    expect(
      document.getElementById('main-content').querySelector('.view-home-dashboard')
    ).toBeTruthy();

    layout.navigateTo('courses');

    // Verificar (Assert)
    expect(document.getElementById('main-content').querySelector('.view-courses')).toBeTruthy();
  });
});
