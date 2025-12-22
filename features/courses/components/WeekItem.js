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
  activitiesBtn.title = 'Ver detalhes das atividades';
  activitiesBtn.onclick = (e) => {
    e.stopPropagation();
    if (callbacks.onViewActivities) callbacks.onViewActivities(week);
  };

  const arrow = document.createElement('span');
  arrow.className = 'week-arrow';
  arrow.innerHTML = '&rsaquo;';

  div.appendChild(nameSpan);
  div.appendChild(tasksBtn);
  div.appendChild(activitiesBtn);
  div.appendChild(arrow);

  return div;
}
