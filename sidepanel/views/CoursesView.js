import { loadItems, deleteItem } from '../logic/storage.js';
import { createCourseElement } from '../components/Items/CourseItem.js';
import { groupCoursesByTerm } from '../utils/courseGrouper.js';

export class CoursesView {
  constructor(callbacks) {
    this.callbacks = callbacks;
  }

  render() {
    const div = document.createElement('div');
    div.className = 'view-courses';
    div.innerHTML = `
            <h2>Minhas Matérias</h2>
            
            <div class="course-legend">
                <span class="legend-left">Matéria</span>
                <span style="text-align: center;">Ver semana</span>
                <span style="text-align: center;">Remover</span>
            </div>

            <div id="coursesListContainer" class="courses-list-container"></div>
        `;
    return div;
  }

  afterRender() {
    this.loadCourses();
  }

  loadCourses() {
    const container = document.getElementById('coursesListContainer');
    if (!container) return;

    container.innerHTML = '';
    loadItems((courses) => {
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
            onDelete: (id) => deleteItem(id, () => this.loadCourses()),
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
}
