import { MainLayout } from '@shared/ui/layout/MainLayout.js';
import { HomeView } from '@features/home/ui/HomeView.js';
// Mocks para Views são aceitáveis, mas classes reais em testes de integração são melhores
import { CoursesView } from '@features/courses/views/CoursesView/index.js';
import { SettingsView } from '@features/settings/ui/SettingsView.js';

describe('Integração: Fluxo de Navegação', () => {
  let container;
  let layout;

  beforeEach(() => {
    // Arrange (Setup)
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app');
    jest.clearAllMocks();

    // Mocks para dependências encontradas nas Views
    // Storage
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) =>
      callback({ savedCourses: [] })
    );
    // FeedbackManager (SettingsView) cria DOM, o que ok no jsdom
  });

  test('Deve navegar entre abas usando o TopNav', () => {
    // Arrange: Configura as Views e o Layout principal
    const homeView = new HomeView({ onAddCurrentInfo: jest.fn() });
    const coursesView = new CoursesView({ onOpenCourse: jest.fn(), onViewDetails: jest.fn() });
    const settingsView = new SettingsView({ onNavigate: jest.fn() });

    const views = {
      home: homeView,
      courses: coursesView,
      settings: settingsView,
    };

    layout = new MainLayout(views);
    layout.init();

    // Act & Assert 1: Verificar Estado Inicial (Home)
    const mainContent = document.getElementById('main-content');
    expect(mainContent.querySelector('.view-home-dashboard')).toBeTruthy();
    expect(container.querySelector('.view-courses')).toBeFalsy();

    // Verificar Estado Ativo na Nav
    const homeBtn = document.querySelectorAll('.nav-item')[0];
    expect(homeBtn.classList.contains('active')).toBe(true);

    // Act 2: Navegar para Cursos
    const coursesBtn = document.querySelectorAll('.nav-item')[1];
    /** @type {HTMLElement} */ (coursesBtn).click();

    // Assert 2
    expect(mainContent.querySelector('.view-courses')).toBeTruthy();
    expect(mainContent.querySelector('.view-home-dashboard')).toBeFalsy();
    expect(coursesBtn.classList.contains('active')).toBe(true);
    expect(homeBtn.classList.contains('active')).toBe(false);

    // Act 3: Navegar para Configurações (Settings)
    const settingsBtn = document.querySelectorAll('.nav-item')[2];
    /** @type {HTMLElement} */ (settingsBtn).click();

    // Assert 3
    expect(mainContent.querySelector('.view-settings')).toBeTruthy();
    expect(settingsBtn.classList.contains('active')).toBe(true);
  });

  test('Deve lidar com navegação programática', () => {
    // Arrange
    const homeView = new HomeView({});
    const coursesView = new CoursesView({});

    const views = {
      home: homeView,
      courses: coursesView,
    };

    layout = new MainLayout(views);
    layout.init();

    // Act 1: Verificar estado inicial
    expect(
      document.getElementById('main-content').querySelector('.view-home-dashboard')
    ).toBeTruthy();

    // Act 2: Navegar programaticamente
    layout.navigateTo('courses');

    // Assert
    expect(document.getElementById('main-content').querySelector('.view-courses')).toBeTruthy();
  });
});
