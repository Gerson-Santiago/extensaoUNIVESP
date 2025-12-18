import { CourseRepository } from '../data/repositories/CourseRepository.js';
import { createCourseElement } from '../../features/courses/components/CourseItem.js';
import { groupCoursesByTerm } from '../../features/courses/logic/CourseGrouper.js';
import { ActionMenu } from '../components/Shared/ActionMenu.js';

export class CoursesView {
  constructor(callbacks) {
    this.callbacks = callbacks;
  }

  render() {
    const div = document.createElement('div');
    div.className = 'view-courses';

    // Header Container
    const headerContainer = document.createElement('div');
    headerContainer.className = 'courses-header';
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.marginBottom = '10px';

    const title = document.createElement('h2');
    title.textContent = 'Minhas Matérias';
    title.style.margin = '0';

    // Dropdown Action
    const dropdown = new ActionMenu({
      title: 'Adicionar Matéria',
      icon: '+',
      actions: [
        {
          label: 'Carregar Todos',
          icon: '🔄',
          onClick: () => this.handleAutoScroll(),
        },
        {
          label: 'Importar em Lote',
          icon: '📥',
          onClick: () => this.callbacks.onAddBatch && this.callbacks.onAddBatch(),
        },
        {
          label: 'Adicionar desta Página',
          icon: '📄',
          onClick: () => this.callbacks.onAddCurrentPage && this.callbacks.onAddCurrentPage(),
        },
        {
          label: 'Adicionar Manualmente',
          icon: '✍️',
          onClick: () => this.callbacks.onAddManual && this.callbacks.onAddManual(),
        },
      ],
    });
    const dropdownEl = dropdown.render();

    headerContainer.appendChild(title);
    headerContainer.appendChild(dropdownEl);

    div.appendChild(headerContainer);

    div.insertAdjacentHTML(
      'beforeend',
      `
            <div class="course-legend">
                <span class="legend-left">Matéria</span>
                <span style="text-align: center;">Ver semana</span>
                <span style="text-align: center;">Remover</span>
            </div>

            <div id="coursesListContainer" class="courses-list-container"></div>
        `
    );
    return div;
  }

  afterRender() {
    this.loadCourses();
  }

  loadCourses() {
    const container = document.getElementById('coursesListContainer');
    if (!container) return;

    container.innerHTML = '';
    CourseRepository.loadItems((courses) => {
      if (courses.length === 0) {
        container.innerHTML =
          '<div style="color: #999; text-align: center; padding: 10px;">Nenhuma matéria salva.</div>';
        return;
      }

      // Group courses by term using centralized logic
      const grouped = groupCoursesByTerm(courses);

      grouped.forEach((group) => {
        // Create Group Container
        const groupDiv = document.createElement('div');
        groupDiv.className = 'term-group';

        // Header (Term Name)
        const header = document.createElement('header');
        header.className = 'term-header';
        header.textContent = group.title;
        groupDiv.appendChild(header);

        // List Container (UL)
        const ul = document.createElement('ul');
        ul.className = 'item-list';

        // Render Courses
        group.courses.forEach((course) => {
          const li = createCourseElement(course, {
            onDelete: (id) => CourseRepository.delete(id, () => this.loadCourses()),
            onClick: (url) => this.callbacks.onOpenCourse(url),
            onViewDetails: (c) => this.callbacks.onViewDetails(c),
          });
          ul.appendChild(li);
        });

        groupDiv.appendChild(ul);
        container.appendChild(groupDiv);
      });
    });
  }

  async handleAutoScroll() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const STEP = 300;
          const INTERVAL = 1500;
          const MAX_RETRIES = 5;

          if (window._autoScrollRun) {
            alert('O carregamento automático já está em andamento.');
            return;
          }

          const getScrollElement = () => {
            const mainContainer = document.getElementById('main-content-inner');
            if (mainContainer && mainContainer.scrollHeight > mainContainer.clientHeight) {
              return mainContainer;
            }

            const allDivs = document.querySelectorAll('div');
            for (const div of allDivs) {
              if (div.scrollHeight > div.clientHeight && div.clientHeight > 100) {
                const style = window.getComputedStyle(div);
                if (['auto', 'scroll'].includes(style.overflowY) || style.overflow === 'auto') {
                  return div;
                }
              }
            }
            return window;
          };

          const scrollTarget = getScrollElement();
          window._autoScrollRun = true;
          let retries = 0;
          let lastHeight =
            scrollTarget === window
              ? document.documentElement.scrollHeight
              : scrollTarget.scrollHeight;
          const originalTitle = document.title;
          document.title = '[Carregando...] ' + originalTitle;

          const scroll = () => {
            if (scrollTarget === window) {
              window.scrollBy({ top: STEP, behavior: 'smooth' });
            } else {
              scrollTarget.scrollBy({ top: STEP, behavior: 'smooth' });
            }

            setTimeout(() => {
              const currentHeight =
                scrollTarget === window
                  ? document.documentElement.scrollHeight
                  : scrollTarget.scrollHeight;

              let isBottom = false;
              if (scrollTarget === window) {
                isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
              } else {
                isBottom =
                  scrollTarget.scrollTop + scrollTarget.clientHeight >=
                  scrollTarget.scrollHeight - 50;
              }

              if (currentHeight > lastHeight) {
                lastHeight = currentHeight;
                retries = 0;
                scroll();
                return;
              }

              retries++;
              if (retries < MAX_RETRIES && !isBottom) {
                scroll();
                return;
              }

              window._autoScrollRun = false;
              document.title = originalTitle;
              const count = document.querySelectorAll('.course-element-card, .element-card').length;
              alert(`Carregamento concluído! ${count} cursos encontrados.`);
            }, INTERVAL);
          };

          scroll();
        },
      });
    } catch (e) {
      console.error('Erro ao injetar auto-scroll:', e);
      alert('Não foi possível iniciar o scroll nesta página.');
    }
  }
}
