/**
 * @file WeekItem.js
 * @description Componente de Item de Semana. Filho de CourseWeeksView.
 */
export function createWeekElement(week, callbacks) {
  const div = document.createElement('div');
  div.className = 'week-item';
  div.addEventListener('click', () => {
    if (callbacks.onClick) callbacks.onClick(week.url);
  });

  const nameSpan = document.createElement('span');
  nameSpan.className = 'week-name';
  nameSpan.textContent = week.name;

  // 🆕 Status Chip (Mini Chip)
  if (week.items && week.items.length > 0) {
    const done = week.items.filter((i) => i.status === 'DONE').length;
    const total = week.items.length;

    const chip = document.createElement('span');
    chip.className = 'status-chip';
    chip.textContent = `${done}/${total}`;
    chip.title = `${done} concluídas de ${total}`;

    // Estilo inline para garantir visibilidade imediata (mover para CSS depois)
    chip.style.cssText = `
      font-size: 11px;
      font-weight: bold;
      background: ${done === total ? '#d4edda' : '#f0f0f0'};
      color: ${done === total ? '#155724' : '#555'};
      padding: 2px 8px;
      border-radius: 12px;
      margin-left: 8px;
      vertical-align: middle;
      border: 1px solid ${done === total ? '#c3e6cb' : '#ddd'};
    `;

    nameSpan.appendChild(chip);
  }

  // Botão de Tarefas
  const tasksBtn = document.createElement('button');
  tasksBtn.className = 'btn-grid-action';
  tasksBtn.textContent = '📋 Tarefas';
  tasksBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (callbacks.onViewTasks) callbacks.onViewTasks(week);
  });

  // Botão de Atividades (usa QuickLinksScraper - Issue #011)
  const activitiesBtn = document.createElement('button');
  activitiesBtn.className = 'btn-grid-action btn-activities';
  activitiesBtn.textContent = '🔍 Atividades';
  activitiesBtn.title = 'Ver atividades da semana';
  activitiesBtn.addEventListener('click', async (e) => {
    e.stopPropagation();

    // Previne múltiplos cliques
    if (activitiesBtn.disabled) {
      return;
    }

    // Loading state
    const originalText = activitiesBtn.textContent;
    activitiesBtn.disabled = true;
    activitiesBtn.textContent = '⏳ Carregando...';
    activitiesBtn.style.opacity = '0.6';

    try {
      if (callbacks.onViewQuickLinks) {
        await callbacks.onViewQuickLinks(week);
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      // Restaura botão
      activitiesBtn.disabled = false;
      activitiesBtn.textContent = originalText;
      activitiesBtn.style.opacity = '1';
    }
  });

  const arrow = document.createElement('span');
  arrow.className = 'week-arrow';
  arrow.innerHTML = '&rsaquo;';

  div.appendChild(nameSpan);
  div.appendChild(tasksBtn);
  div.appendChild(activitiesBtn);
  div.appendChild(arrow);

  return div;
}
