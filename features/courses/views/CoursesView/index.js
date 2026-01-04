/**
 * @file CoursesView.js
 * @description View principal de listagem de cursos (TopNav: "Cursos")
 * Localizada em: features/courses/views/CoursesView/index.js
 * Responsabilidade: Renderizar a lista de matérias do aluno, agrupadas por período letivo.
 *
 * @architecture Screaming Architecture - View Layer
 * @dependencies CourseRepository, CourseGrouper, ActionMenu, BottomNav
 * @author Gerson Santiago
 * @date 2025-12-20
 */

import { CourseRepository } from '../../repositories/CourseRepository.js';
import { createCourseElement } from '../../components/CourseItem.js';
import { groupCoursesByTerm } from '../../logic/CourseGrouper.js';
import { ActionMenu } from '../../../../shared/ui/ActionMenu.js';
import { AutoScrollService } from '../../logic/AutoScrollService.js';
import { DOMSafe } from '../../../../shared/utils/DOMSafe.js';

export class CoursesView {
  constructor(callbacks) {
    this.callbacks = callbacks;
  }

  render() {
    const h = DOMSafe.createElement;

    const title = h('h2', { style: { margin: '0' } }, 'Minhas Matérias');

    // Dropdown Action (ActionMenu manages its own DOM, assuming it's safe or will be refactored)
    const dropdown = new ActionMenu({
      title: 'Adicionar Matéria',
      icon: '+',
      actions: [
        {
          label: 'Carregar Todos' /** ... */,
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

    const headerContainer = h(
      'div',
      {
        className: 'courses-header',
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        },
      },
      [
        title,
        dropdown.render(), // ActionMenu returns HTMLElement
      ]
    );

    const legendDiv = h('div', { className: 'course-legend' }, [
      h('span', { className: 'legend-left' }, 'Matéria'),
      h('span', { style: { textAlign: 'center' } }, 'Ver semana'),
      h('span', { style: { textAlign: 'center' } }, 'Remover'),
    ]);

    const listContainer = h('div', {
      id: 'coursesListContainer',
      className: 'courses-list-container',
    });

    // Main Container
    return h('div', { className: 'view-courses' }, [headerContainer, legendDiv, listContainer]);
  }

  afterRender() {
    this.loadCourses();
  }

  async loadCourses() {
    const container = document.getElementById('coursesListContainer');
    if (!container) return;

    container.replaceChildren(); // Safe clear
    const h = DOMSafe.createElement;

    // Load Data
    const courses = await CourseRepository.loadItems();

    // Empty State
    if (courses.length === 0) {
      const emptyDiv = h(
        'div',
        {
          style: { color: '#999', textAlign: 'center', padding: '10px' },
        },
        'Nenhuma matéria salva.'
      );
      container.appendChild(emptyDiv);
      return;
    }

    // Group courses by term using centralized logic
    const grouped = groupCoursesByTerm(courses);

    grouped.forEach((group) => {
      const ul = h('ul', { className: 'item-list' });

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

      const groupDiv = h('div', { className: 'term-group' }, [
        h('header', { className: 'term-header' }, group.title),
        ul,
      ]);

      container.appendChild(groupDiv);
    });
  }

  async handleAutoScroll() {
    await AutoScrollService.run();
  }
}
