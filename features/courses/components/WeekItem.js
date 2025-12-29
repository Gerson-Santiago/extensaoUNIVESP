import { Logger } from '../../../shared/utils/Logger.js';

/**
 * @file WeekItem.js
 * @description Componente de Item de Semana. Filho de CourseWeeksView.
 */
export function createWeekElement(
  week,
  callbacks,
  flags = { showAdvancedButtons: true, showTasksButton: true }
) {
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

  div.appendChild(nameSpan);

  // Botão de Tarefas (Condicional)
  if (flags.showTasksButton) {
    const tasksBtn = document.createElement('button');
    tasksBtn.className = 'btn-grid-action';
    tasksBtn.textContent = '📋 Tarefas';
    tasksBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (callbacks.onViewTasks) callbacks.onViewTasks(week);
    });
    div.appendChild(tasksBtn);
  }

  // Botão de Atividades RÁPIDO (Condicional)
  if (flags.showAdvancedButtons) {
    const activitiesQuickBtn = document.createElement('button');
    activitiesQuickBtn.className = 'btn-grid-action btn-activities-quick';
    activitiesQuickBtn.textContent = '⚡ Rápido';
    activitiesQuickBtn.title = 'Atividades via QuickLinks';
    activitiesQuickBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (activitiesQuickBtn.disabled) return;
      // ... logic ...
      try {
        if (callbacks.onViewQuickLinks) await callbacks.onViewQuickLinks(week);
      } catch (err) {
        /**#LOG_UI*/
        Logger.error('WeekItem', err);
      }
    });
    div.appendChild(activitiesQuickBtn);
  }

  // Botão de Atividades COMPLETO (Sempre visível, mas adapta texto se simplificado?)
  const activitiesDomBtn = document.createElement('button');
  activitiesDomBtn.className = 'btn-grid-action btn-activities-dom';
  activitiesDomBtn.textContent = flags.showAdvancedButtons ? '🔍 Completo' : 'Ver Atividades';
  activitiesDomBtn.title = 'Carregar atividades da semana';
  activitiesDomBtn.addEventListener('click', async (e) => {
    e.stopPropagation();

    if (activitiesDomBtn.disabled) return;

    const originalText = activitiesDomBtn.textContent;
    activitiesDomBtn.disabled = true;
    activitiesDomBtn.textContent = '⏳';
    activitiesDomBtn.style.opacity = '0.6';

    try {
      if (callbacks.onViewActivities) {
        await callbacks.onViewActivities(week);
      }
    } catch (error) {
      /**#LOG_UI*/
      Logger.error('WeekItem', 'Erro ao carregar atividades (DOM):', error);
    } finally {
      activitiesDomBtn.disabled = false;
      activitiesDomBtn.textContent = originalText;
      activitiesDomBtn.style.opacity = '1';
    }
  });
  div.appendChild(activitiesDomBtn);

  const arrow = document.createElement('span');
  arrow.className = 'week-arrow';
  arrow.innerHTML = '&rsaquo;';

  div.appendChild(arrow);

  return div;
}
