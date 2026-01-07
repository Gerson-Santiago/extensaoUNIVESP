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

// Segurança (Trusted Types)
import { initTrustedTypes } from '../shared/security/TrustedTypesPolicy.js';
initTrustedTypes();

// Views
import { HomeView } from '../features/home/ui/HomeView.js';
import { CoursesView } from '../features/courses/views/CoursesView/index.js';
import { SettingsView } from '../features/settings/ui/SettingsView.js';
import { CourseWeeksView } from '../features/courses/views/CourseWeeksView/index.js';
import { DetailsActivitiesWeekView } from '../features/courses/views/DetailsActivitiesWeekView/index.js';
import { FeedbackView } from '../features/feedback/ui/FeedbackView.js';

// Utilitários
import { Tabs } from '../shared/utils/Tabs.js';

// Modais
import { BatchImportModal } from '../features/courses/import/components/BatchImportModal.js'; // Usado por: BatchImportFlow
import { AddManualModal } from '../features/courses/components/AddManualModal/index.js'; // Usado por: CoursesView
import { LoginWaitModal } from '../features/session/components/LoginWaitModal.js'; // Usado por: BatchImportFlow

// Serviços
import { CourseService } from '../features/courses/logic/CourseService.js';
import { BatchImportFlow } from '../features/courses/import/logic/BatchImportFlow.js';
// import { CourseRepository } removed. Using Service.
import { Logger } from '../shared/utils/Logger.js';

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
      /**#LOG_UI*/
      Logger.warn('SidePanel', 'Importação bloqueada pelo usuário (Login Wait Cancelado)');
    },
  });

  // Controlador de fluxo: verificação de login → modais → importação
  batchImportFlow = new BatchImportFlow({
    batchImportModal,
    loginWaitModal,
  });

  // Modal de adição manual (formulário)
  const addManualModal = new AddManualModal(() => {
    // Callback sucesso: recarrega lista se estivermos na view de cursos
    if (coursesView) coursesView.loadCourses();
  });

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
      courseWeeksView.setCourse(course);
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
        /**#LOG_UI*/
        Logger.error('SidePanel', errorMsg);
        alert(errorMsg);
      }
    );
  };

  const homeView = new HomeView({
    onAddCurrentInfo: () => handleAddCurrentPage(),
  });

  const detailsActivitiesWeekView = new DetailsActivitiesWeekView({
    onBack: () => {
      layout.navigateTo('courseDetails');
    },
    onNavigateToWeek: async (weekUrl) => {
      // 1. Tenta encontrar a semana no curso carregado em courseWeeksView
      const currentCourse = courseWeeksView.course;

      if (currentCourse && currentCourse.weeks) {
        const targetWeek = currentCourse.weeks.find((w) => w.url === weekUrl);

        if (targetWeek) {
          // 2. Atualiza a view com a nova semana
          detailsActivitiesWeekView.setWeek(targetWeek);

          // 3. Força a re-renderização da view 'weekActivities'
          // (Mesmo se já estiver nela, isso recarrega o conteúdo correto)
          layout.navigateTo('weekActivities');
        } else {
          /**#LOG_UI*/
          Logger.warn('SidePanel', 'Semana não encontrada no curso atual para URL:', { weekUrl });
          // Opcional: Tentar recarregar o curso?
        }
      }
    },
  });

  const courseWeeksView = new CourseWeeksView({
    onBack: () => {
      layout.topNav.setActive('courses');
      layout.navigateTo('courses');
    },
    onOpenCourse: (url) => Tabs.openOrSwitchTo(url),
    onViewActivities: (week) => {
      detailsActivitiesWeekView.setWeek(week);
      layout.navigateTo('weekActivities');
    },
    // Callback para botão ⚡ Rápido (usa mesma view, diferente apenas no método de scraping)
    onViewQuickLinks: (week) => {
      detailsActivitiesWeekView.setWeek(week);
      layout.navigateTo('weekActivities');
    },
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
    courseDetails: courseWeeksView,
    weekActivities: detailsActivitiesWeekView,
    feedback: feedbackView,
  };

  // Inicializa layout (renderiza estrutura base e gerencia navegação)
  const layout = new MainLayout(views);
  layout.init();

  // --- Global Event Listeners (Decoupling) ---

  // 1. Add Manual Course (Settings -> Modal)
  window.addEventListener('request:add-manual-course', () => {
    addManualModal.open();
  });

  // 2. Scrape Current Tab (Settings -> Logic)
  window.addEventListener('request:scrape-current-tab', () => {
    handleAddCurrentPage();
  });

  // 3. Clear All Courses (Settings -> Repository)
  window.addEventListener('request:clear-all-courses', async () => {
    try {
      await courseService.clearAll();
      // Atualizar views afetadas
      coursesView.loadCourses();
    } catch (err) {
      /**#LOG_UI*/
      Logger.error('SidePanel', 'Erro ao limpar cursos:', err);
    }
  });

  // 4. Context Awareness (MV3 Compliance)
  // Listener do Chrome para detectar troca de abas e resetar estado se necessário
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.onActivated) {
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url && !tab.url.includes('ava.univesp.br') && !tab.url.includes('sei.univesp.br')) {
          // Se saiu do domínio UNIVESP, volta para Home para evitar "vazamento" de contexto
          layout.topNav.setActive('home');
          layout.navigateTo('home');
        }
      } catch {
        // Silencioso se a aba não puder ser acessada ou se o contexto da extensão foi invalidado
      }
    });
  }
});
