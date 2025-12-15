/**
 * Componente de Item de Semana
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

  const arrow = document.createElement('span');
  arrow.className = 'week-arrow';
  arrow.innerHTML = '&rsaquo;';

  div.appendChild(nameSpan);
  div.appendChild(arrow);

  return div;
}
