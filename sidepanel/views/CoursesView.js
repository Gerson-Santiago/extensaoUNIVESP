import { loadItems, deleteItem } from '../logic/storage.js';
import { createCourseElement } from '../components/Items/CourseItem.js';

export class CoursesView {
  constructor(callbacks) {
    this.callbacks = callbacks; // { onOpenCourse, onViewDetails }
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

            <ul id="itemList" class="item-list"></ul>
        `;
    return div;
  }

  afterRender() {
    this.loadCourses();
  }

  loadCourses() {
    const list = document.getElementById('itemList');
    if (!list) return;

    list.innerHTML = '';
    loadItems((courses) => {
      if (courses.length === 0) {
        list.innerHTML =
          '<li style="color: #999; text-align: center; padding: 10px;">Nenhuma matéria salva.</li>';
        return;
      }

      courses.forEach((course) => {
        const li = createCourseElement(course, {
          onDelete: (id) => deleteItem(id, () => this.loadCourses()),
          onClick: (url) => this.callbacks.onOpenCourse(url),
          // Detalhes não navegam mais para 'view-details' escondida,
          // mas poderiam navegar para uma View de Detalhes dedicada se implementada.
          // Por simplicidade, vamos usar um callback que o MainLayout pode tratar
          // ou expandir na própria lista (se fosse accordion).
          // Como a refatoração pede Views, vamos assumir que o MainLayout troca para CourseDetailsView.
          onViewDetails: (c) => this.callbacks.onViewDetails(c),
        });
        list.appendChild(li);
      });
    });
  }
}
