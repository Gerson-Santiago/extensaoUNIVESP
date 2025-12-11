/**
 * Componentes de UI reutilizáveis
 */

export function createCourseElement(course, callbacks) {
    const li = document.createElement('li');
    li.className = 'item';

    // Info Container (clicável para abrir)
    const info = document.createElement('div');
    info.className = 'item-info';
    info.title = "Clique para abrir o AVA";
    info.onclick = () => {
        if (callbacks.onClick) callbacks.onClick(course.url);
    };

    const nameSpan = document.createElement('span');
    nameSpan.className = 'item-name';
    nameSpan.textContent = course.name;

    const urlSpan = document.createElement('span');
    urlSpan.className = 'item-url';
    urlSpan.textContent = course.url;

    info.appendChild(nameSpan);
    info.appendChild(urlSpan);

    // Actions Container
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.alignItems = 'center';

    // Botão Detalhes (Semanas)
    // Se não existir callback de detalhes, não mostra.
    if (callbacks.onViewDetails) {
        const btnDetails = document.createElement('button');
        btnDetails.textContent = '📄'; // Ícone de documento/lista
        btnDetails.title = "Ver Semanas";
        btnDetails.style.background = 'none';
        btnDetails.style.border = 'none';
        btnDetails.style.cursor = 'pointer';
        btnDetails.style.fontSize = '16px';
        btnDetails.style.marginRight = '5px';

        btnDetails.onclick = (e) => {
            e.stopPropagation();
            callbacks.onViewDetails(course);
        };
        actions.appendChild(btnDetails);
    }

    // Botão Excluir
    const btnDel = document.createElement('button');
    btnDel.className = 'btn-delete';
    btnDel.innerHTML = '&times;';
    btnDel.title = "Remover";
    btnDel.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Remover "${course.name}"?`)) {
            if (callbacks.onDelete) callbacks.onDelete(course.id);
        }
    };
    actions.appendChild(btnDel);

    li.appendChild(info);
    li.appendChild(actions);

    return li;
}

export function createWeekElement(week, callbacks) {
    const div = document.createElement('div');
    div.className = 'week-item';
    div.onclick = () => {
        if (callbacks.onClick) callbacks.onClick(week.url);
    };

    const nameSpan = document.createElement('span');
    nameSpan.className = 'week-name';
    nameSpan.textContent = week.name;

    const arrow = document.createElement('span');
    arrow.className = 'week-arrow';
    arrow.innerHTML = '&rsaquo;';

    div.appendChild(nameSpan);
    div.appendChild(arrow);

    return div;
}
