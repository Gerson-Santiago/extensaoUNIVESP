import { MainLayout } from './components/Layout/MainLayout.js';
import { HomeView } from './views/HomeView.js';
import { CoursesView } from './views/CoursesView.js';
import { SettingsView } from './views/SettingsView.js';
import { CourseDetailsView } from './views/CourseDetailsView.js';
import { FeedbackView } from './views/FeedbackView.js';
import { addItem } from './logic/storage.js';
import { openOrSwitchToTab } from './logic/tabs.js';
import { scrapeWeeksFromTab } from './logic/scraper.js';
import { BatchImportModal } from './components/Modals/BatchImportModal.js';
import { AddManualModal } from './components/Modals/AddManualModal.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização das Views e Callbacks

  // Modais Compartilhados
  const batchImportModal = new BatchImportModal(() => {
    // Ao terminar importação, recarregar cursos se estiver na view de cursos
    if (coursesView) coursesView.loadCourses();
  });

  const addManualModal = new AddManualModal();

  const settingsView = new SettingsView({
    onNavigate: (viewId) => {
      layout.topNav.setActive(viewId);
      layout.navigateTo(viewId);
    },
  });

  // Callbacks para CoursesView
  const coursesView = new CoursesView({
    onOpenCourse: (url) => openOrSwitchToTab(url),
    onViewDetails: (course) => {
      // Navegação customizada para Detalhes
      courseDetailsView.setCourse(course);
      layout.navigateTo('courseDetails');
    },

    onAddBatch: () => {
      batchImportModal.open();
    },
    onAddManual: () => {
      addManualModal.open();
    },
    onAddCurrentPage: () => {
      addCurrentPageFlow();
    },
  });

  const addCurrentPageFlow = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs && tabs[0]) {
        const tab = tabs[0];
        let name = tab.title || 'Nova Matéria';
        if (name.includes('-')) {
          name = name.split('-')[0].trim();
        }

        let weeks = [];
        let detectedName = null;

        if (tab.url.startsWith('http')) {
          const result = await scrapeWeeksFromTab(tab.id);
          weeks = result.weeks || [];
          detectedName = result.title;
        }

        if (detectedName) {
          name = detectedName;
        }

        addItem(name, tab.url, weeks, () => {
          // Após adicionar, redireciona para lista de cursos
          layout.topNav.setActive('courses');
          layout.navigateTo('courses');
          coursesView.loadCourses(); // Forçar reload
        });
      }
    });
  };

  const homeView = new HomeView({
    onAddCurrentInfo: () => addCurrentPageFlow(),
  });

  const courseDetailsView = new CourseDetailsView({
    onBack: () => {
      layout.topNav.setActive('courses');
      layout.navigateTo('courses');
    },
    onOpenCourse: (url) => openOrSwitchToTab(url),
  });

  const feedbackView = new FeedbackView({
    onBack: () => {
      layout.topNav.setActive('settings'); // Voltar para settings faz sentido
      layout.navigateTo('settings');
    },
  });

  // Mapeamento de Views
  const views = {
    home: homeView,
    courses: coursesView,
    settings: settingsView,
    courseDetails: courseDetailsView,
    feedback: feedbackView,
  };

  // Inicialização do Layout
  const layout = new MainLayout(views);
  layout.init();
});
