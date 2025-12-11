import { loadItems, deleteItem } from '../logic/storage.js';
import { createCourseElement } from '../ui/components.js';

export class CoursesView {
    constructor(callbacks) {
        this.callbacks = callbacks; // { onOpenCourse, onViewDetails }
    }

    render() {
        const div = document.createElement('div');
        div.className = 'view-courses';
        div.innerHTML = `
            <h2>Minhas Matérias</h2>
            <ul id="itemList" class="item-list"></ul>
            
            <div class="add-form">
                <div style="text-align: center; margin-bottom: 8px; font-size: 12px; color: #666;">Adicionar manualmente:</div>
                <input type="text" id="nameInput" class="input-field" placeholder="Nome da Matéria">
                <input type="text" id="urlInput" class="input-field" placeholder="https://...">
                <button id="addBtn" class="btn-add">Adicionar</button>
            </div>
        `;
        return div;
    }

    afterRender() {
        this.loadCourses();

        // Setup manual add event
        const addBtn = document.getElementById('addBtn');
        if (addBtn) {
            addBtn.onclick = () => {
                const nameInput = document.getElementById('nameInput');
                const urlInput = document.getElementById('urlInput');
                if (this.callbacks.onManualAdd) {
                    this.callbacks.onManualAdd(nameInput.value, urlInput.value, () => {
                        // Refresh after add
                        nameInput.value = '';
                        urlInput.value = '';
                        this.loadCourses();
                    });
                }
            };
        }
    }

    loadCourses() {
        const list = document.getElementById('itemList');
        if (!list) return;

        list.innerHTML = '';
        loadItems((courses) => {
            if (courses.length === 0) {
                list.innerHTML = '<li style="color: #999; text-align: center; padding: 10px;">Nenhuma matéria salva.</li>';
                return;
            }

            courses.forEach(course => {
                const li = createCourseElement(course, {
                    onDelete: (id) => deleteItem(id, () => this.loadCourses()),
                    onClick: (url) => this.callbacks.onOpenCourse(url),
                    // Detalhes não navegam mais para 'view-details' escondida, 
                    // mas poderiam navegar para uma View de Detalhes dedicada se implementada.
                    // Por simplicidade, vamos usar um callback que o MainLayout pode tratar 
                    // ou expandir na própria lista (se fosse accordion).
                    // Como a refatoração pede Views, vamos assumir que o MainLayout troca para CourseDetailsView.
                    onViewDetails: (c) => this.callbacks.onViewDetails(c)
                });
                list.appendChild(li);
            });
        });
    }
}
