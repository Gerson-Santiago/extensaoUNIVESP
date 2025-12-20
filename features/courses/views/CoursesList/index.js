/**
 * @file CoursesList.js
 * @description View principal que lista as matérias (Courses).
 * Localizada em: features/courses/views/CoursesList/index.js
 */

import { CourseRepository } from '../../data/CourseRepository.js';
import { createCourseElement } from '../../components/CourseItem.js';
import { groupCoursesByTerm } from '../../logic/CourseGrouper.js';
import { ActionMenu } from '../../../../shared/ui/ActionMenu.js';
import { AutoScrollService } from '../../logic/AutoScrollService.js';

export class CoursesList {
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

  async loadCourses() {
    const container = document.getElementById('coursesListContainer');
    if (!container) return;

    container.innerHTML = '';
    const courses = await CourseRepository.loadItems();
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
          onDelete: async (id) => {
            await CourseRepository.delete(id);
            await this.loadCourses();
          },
          onClick: (url) => this.callbacks.onOpenCourse(url),
          onViewDetails: (c) => this.callbacks.onViewDetails(c),
        });
        ul.appendChild(li);
      });

      groupDiv.appendChild(ul);
      container.appendChild(groupDiv);
    });
  }

  async handleAutoScroll() {
    await AutoScrollService.run();
  }
}
