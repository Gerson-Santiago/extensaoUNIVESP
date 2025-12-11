import { MainLayout } from './components/Layout/MainLayout.js';
import { HomeView } from './views/HomeView.js';
import { CoursesView } from './views/CoursesView.js';
import { SettingsView } from './views/SettingsView.js';
import { CourseDetailsView } from './views/CourseDetailsView.js';
import { addItem } from './logic/storage.js';
import { openOrSwitchToTab } from './logic/tabs.js';
import { scrapeWeeksFromTab } from './logic/scraper.js';

document.addEventListener('DOMContentLoaded', () => {

    // Inicialização das Views e Callbacks

    const settingsView = new SettingsView();

    // Callbacks para CoursesView
    const coursesView = new CoursesView({
        onOpenCourse: (url) => openOrSwitchToTab(url),
        onViewDetails: (course) => {
            // Navegação customizada para Detalhes
            courseDetailsView.setCourse(course);
            layout.navigateTo('courseDetails');
        },
        onManualAdd: (name, url, onSuccess) => {
            if (name && url) {
                addItem(name, url, [], onSuccess);
            } else {
                alert('Preencha nome e URL.');
            }
        }
    });

    const homeView = new HomeView({
        onAddCurrentInfo: () => {
            // Lógica de "Adicionar Página Atual" reaproveitada
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (tabs && tabs[0]) {
                    const tab = tabs[0];
                    let name = tab.title || "Nova Matéria";
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
                    });
                }
            });
        }
    });

    const courseDetailsView = new CourseDetailsView({
        onBack: () => {
            layout.topNav.setActive('courses');
            layout.navigateTo('courses');
        },
        onOpenCourse: (url) => openOrSwitchToTab(url)
    });

    // Mapeamento de Views
    const views = {
        'home': homeView,
        'courses': coursesView,
        'settings': settingsView,
        'courseDetails': courseDetailsView
    };

    // Inicialização do Layout
    const layout = new MainLayout(views);
    layout.init();
});
