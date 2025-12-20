/**
 * SIDEPANEL - Ponto de Entrada Principal
 *
 * Responsabilidades:
 * - Inicializar componentes (views, modais, serviços)
 * - Conectar callbacks entre componentes
 * - Configurar navegação entre views
 *
 * Arquitetura: Feature-based + Dependency Injection + Fluxo Unidirecional
 */

// ========== IMPORTAÇÕES ==========

// Layout
import { MainLayout } from '../shared/ui/layout/MainLayout.js';

// Views
import { HomeView } from '../features/home/ui/HomeView.js';
import { CoursesView } from '../features/courses/views/CoursesView/index.js';
import { SettingsView } from '../features/settings/ui/SettingsView.js';
import { CourseDetailsView } from '../features/courses/views/CourseDetails/index.js';
import { FeedbackView } from '../features/feedback/ui/FeedbackView.js';

// Utilitários
import { Tabs } from '../shared/utils/Tabs.js';

// Modais
import { BatchImportModal } from '../features/import/components/BatchImportModal.js'; // Usado por: BatchImportFlow
import { AddManualModal } from '../features/courses/components/AddManualModal/index.js'; // Usado por: CoursesView
import { LoginWaitModal } from '../features/session/components/LoginWaitModal.js'; // Usado por: BatchImportFlow

// Serviços
import { CourseService } from '../features/courses/logic/CourseService.js';
import { BatchImportFlow } from '../features/import/logic/BatchImportFlow.js';

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', () => {
  // --- Serviços ---
  const courseService = new CourseService(); // CRUD de cursos

  // --- Modais ---
  // Modal de importação em lote (exibe formulário e progresso)
  const batchImportModal = new BatchImportModal(() => {
    if (coursesView) coursesView.loadCourses();
  });

  // Declarado aqui, instanciado depois (evita dependência circular)
  let batchImportFlow;

  // Modal de espera de login (exibido quando usuário precisa fazer login no AVA)
  const loginWaitModal = new LoginWaitModal({
    onConfirm: () => {
      // Usuário clicou em "Já Fiz Login". Reinicia o fluxo de importação.
      if (batchImportFlow) batchImportFlow.start();
    },
    onCancel: () => {
      console.warn('Importação bloqueada pelo usuário (Login Wait Cancelado)');
    },
  });

  // Controlador de fluxo: verificação de login → modais → importação
  batchImportFlow = new BatchImportFlow({
    batchImportModal,
    loginWaitModal,
  });

  // Modal de adição manual (formulário)
  const addManualModal = new AddManualModal();

  // --- Views ---
  const settingsView = new SettingsView({
    onNavigate: (viewId) => {
      layout.topNav.setActive(viewId);
      layout.navigateTo(viewId);
    },
    onImportBatch: () => {
      if (batchImportFlow) batchImportFlow.start();
    },
  });

  const coursesView = new CoursesView({
    onOpenCourse: (url) => Tabs.openOrSwitchTo(url),
    onViewDetails: (course) => {
      // Navegação customizada: atualiza dados do componente antes de navegar
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

  // Handler: adiciona página atual como curso
  const handleAddCurrentPage = () => {
    courseService.addFromCurrentTab(
      () => {
        // Callback de sucesso
        layout.topNav.setActive('courses');
        layout.navigateTo('courses');
        coursesView.loadCourses();
      },
      (errorMsg) => {
        // Callback de erro
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
      layout.topNav.setActive('settings');
      layout.navigateTo('settings');
    },
  });

  // --- Mapeamento de Views ---
  const views = {
    home: homeView,
    courses: coursesView,
    settings: settingsView,
    courseDetails: courseDetailsView,
    feedback: feedbackView,
  };

  // Inicializa layout (renderiza estrutura base e gerencia navegação)
  const layout = new MainLayout(views);
  layout.init();
});
