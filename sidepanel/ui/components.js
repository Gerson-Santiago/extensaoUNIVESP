/**
 * Cria o elemento HTML de um item da lista de matérias.
 * @param {Object} course - Objeto da matéria {id, name, url, weeks}.
 * @param {Object} handlers - { onDelete, onClick, onViewDetails }
 * @returns {HTMLElement} Elemento <li>
 */
export function createCourseElement(course, handlers) {
    const li = document.createElement('li');
    li.className = 'item';

    // Container de Informações (Clicável)
    const infoDiv = document.createElement('div');
    infoDiv.className = 'item-info';
    infoDiv.onclick = () => {
        handlers.onClick(course.url);
        handlers.onViewDetails(course);
    };

    const nameSpan = document.createElement('span');
    nameSpan.className = 'item-name';
    nameSpan.textContent = course.name;

    const urlSpan = document.createElement('div');
    urlSpan.className = 'item-url';
    urlSpan.textContent = course.url;

    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(urlSpan);

    // Botão de Remover
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-delete';
    delBtn.innerHTML = '&times;';
    delBtn.title = 'Remover';
    delBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('Remover esta matéria?')) {
            handlers.onDelete(course.id);
        }
    };

    li.appendChild(infoDiv);
    li.appendChild(delBtn);

    return li;
}

/**
 * Cria o elemento HTML de uma semana.
 * @param {Object} week - Objeto da semana {name, url}.
 * @param {Object} handlers - { onClick }
 * @returns {HTMLElement} Elemento <div>
 */
export function createWeekElement(week, handlers) {
    const wDiv = document.createElement('div');
    wDiv.className = 'week-item';
    wDiv.innerHTML = `
        <span class="week-name">${week.name}</span>
        <span class="week-arrow">›</span>
    `;
    wDiv.onclick = () => {
        handlers.onClick(week.url);
    };
    return wDiv;
}
