/**
 * @file WeekItem.js
 * @description Componente de Item de Semana. Filho de CourseWeeksView.
 */
export function createWeekElement(week, callbacks) {
  const div = document.createElement('div');
  div.className = 'week-item';
  div.onclick = () => {
    if (callbacks.onClick) callbacks.onClick(week.url);
  };

  const nameSpan = document.createElement('span');
  nameSpan.className = 'week-name';
  nameSpan.textContent = week.name;

  // Botão de Tarefas
  const tasksBtn = document.createElement('button');
  tasksBtn.className = 'btn-grid-action';
  tasksBtn.textContent = '📋 Tarefas';
  tasksBtn.onclick = (e) => {
    e.stopPropagation();
    if (callbacks.onViewTasks) callbacks.onViewTasks(week);
  };

  // Botão de Ver Atividades (novo - Issue #010)
  const activitiesBtn = document.createElement('button');
  activitiesBtn.className = 'btn-grid-action btn-activities';
  activitiesBtn.textContent = '🔍 Atividades';
  activitiesBtn.title = 'Ver detalhes das atividades (DOM)';
  activitiesBtn.onclick = (e) => {
    e.stopPropagation();
    if (callbacks.onViewActivities) callbacks.onViewActivities(week);
  };

  // Botão de Links Rápidos (alternativo - Issue #010)
  const quickLinksBtn = document.createElement('button');
  quickLinksBtn.className = 'btn-grid-action btn-quick-links';
  quickLinksBtn.textContent = '⚡ Rápido';
  quickLinksBtn.title = 'Ver atividades (Links Rápidos)';
  quickLinksBtn.onclick = (e) => {
    e.stopPropagation();
    if (callbacks.onViewQuickLinks) callbacks.onViewQuickLinks(week);
  };

  const arrow = document.createElement('span');
  arrow.className = 'week-arrow';
  arrow.innerHTML = '&rsaquo;';

  div.appendChild(nameSpan);
  div.appendChild(tasksBtn);
  div.appendChild(activitiesBtn);
  div.appendChild(quickLinksBtn); // NOVO
  div.appendChild(arrow);

  return div;
}
