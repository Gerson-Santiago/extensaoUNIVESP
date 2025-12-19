import { MainLayout } from '../shared/ui/layout/MainLayout.js';
import { HomeView } from '../features/home/ui/HomeView.js';
import { CoursesList } from '../features/courses/components/CoursesList.js';
import { SettingsView } from '../features/settings/ui/SettingsView.js';
import { CourseDetailsView } from '../features/courses/components/CourseDetailsView.js';
import { FeedbackView } from '../features/feedback/ui/FeedbackView.js';
import { Tabs } from '../shared/utils/Tabs.js';
import { BatchImportModal } from '../features/import/components/BatchImportModal.js';
import { AddManualModal } from '../features/courses/components/AddManualModal.js';
import { LoginWaitModal } from '../features/session/components/LoginWaitModal.js';
import { CourseService } from '../features/courses/logic/CourseService.js';
import { BatchImportFlow } from '../features/import/logic/BatchImportFlow.js';

document.addEventListener('DOMContentLoaded', () => {
  const courseService = new CourseService();

  // Initialization of Views and Callbacks

  // 1. Core Modals
  const batchImportModal = new BatchImportModal(() => {
    if (coursesView) coursesView.loadCourses();
  });

  // Flow Controller
  let batchImportFlow; // Defined below after modals

  const loginWaitModal = new LoginWaitModal({
    onConfirm: () => {
      // User clicked "Already Logged In". Retry flow.
      if (batchImportFlow) batchImportFlow.start();
    },
    onCancel: () => {
      console.warn('Import blocked by user (Login Wait Cancelled)');
    },
  });

  // Instantiate Service
  batchImportFlow = new BatchImportFlow({
    batchImportModal,
    loginWaitModal,
  });

  const addManualModal = new AddManualModal();

  const settingsView = new SettingsView({
    onNavigate: (viewId) => {
      layout.topNav.setActive(viewId);
      layout.navigateTo(viewId);
    },
    onImportBatch: () => {
      if (batchImportFlow) batchImportFlow.start();
    },
  });

  // Callbacks para CoursesList
  const coursesView = new CoursesList({
    onOpenCourse: (url) => Tabs.openOrSwitchTo(url),
    onViewDetails: (course) => {
      // Navegação customizada para Detalhes
      courseDetailsView.setCourse(course);
      layout.navigateTo('courseDetails');
    },

    onAddBatch: () => {
      batchImportFlow.start();
    },
    onAddManual: () => {
      addManualModal.open();
    },
    onAddCurrentPage: () => {
      handleAddCurrentPage();
    },
  });

  const handleAddCurrentPage = () => {
    courseService.addFromCurrentTab(
      () => {
        // Success callback
        layout.topNav.setActive('courses');
        layout.navigateTo('courses');
        coursesView.loadCourses();
      },
      (errorMsg) => {
        console.error(errorMsg);
        alert(errorMsg);
      }
    );
  };

  const homeView = new HomeView({
    onAddCurrentInfo: () => handleAddCurrentPage(),
  });

  const courseDetailsView = new CourseDetailsView({
    onBack: () => {
      layout.topNav.setActive('courses');
      layout.navigateTo('courses');
    },
    onOpenCourse: (url) => Tabs.openOrSwitchTo(url),
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
