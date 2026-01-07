import { Logger } from '../../../shared/utils/Logger.js';
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

/**
 * @file WeekItem.js
 * @description Componente de Item de Semana. Filho de CourseWeeksView.
 */
export function createWeekElement(
  week,
  callbacks,
  flags = { showAdvancedButtons: true, showTasksButton: true }
) {
  const h = DOMSafe.createElement;

  // Name with optional status chip
  const nameChildren = [week.name];

  if (week.items && week.items.length > 0) {
    const done = week.items.filter((i) => i.status === 'DONE').length;
    const total = week.items.length;
    const isComplete = done === total;

    const chip = h(
      'span',
      {
        className: 'status-chip',
        title: `${done} concluídas de ${total}`,
        style: {
          fontSize: '11px',
          fontWeight: 'bold',
          background: isComplete ? '#d4edda' : '#f0f0f0',
          color: isComplete ? '#155724' : '#555',
          padding: '2px 8px',
          borderRadius: '12px',
          marginLeft: '8px',
          verticalAlign: 'middle',
          border: `1px solid ${isComplete ? '#c3e6cb' : '#ddd'}`,
        },
      },
      `${done}/${total}`
    );

    nameChildren.push(chip);
  }

  const nameSpan = h('span', { className: 'week-name' }, nameChildren);

  // Buttons array (conditional rendering)
  const buttons = [];

  // Tasks Button (Conditional)
  if (flags.showTasksButton) {
    buttons.push(
      h(
        'button',
        {
          className: 'btn-grid-action',
          onclick: (e) => {
            e.stopPropagation();
            callbacks.onViewTasks?.(week);
          },
        },
        '📋 Tarefas'
      )
    );
  }

  // Quick Activities Button (Conditional)
  if (flags.showAdvancedButtons) {
    buttons.push(
      h(
        'button',
        {
          className: 'btn-grid-action btn-activities-quick',
          title: 'Atividades via QuickLinks',
          onclick: async (e) => {
            e.stopPropagation();
            if (e.target.disabled) return;
            try {
              if (callbacks.onViewQuickLinks) await callbacks.onViewQuickLinks(week);
            } catch (err) {
              /**#LOG_UI*/
              Logger.error('WeekItem', err);
            }
          },
        },
        '⚡ Rápido'
      )
    );
  }

  // Full Activities Button (Always visible)
  const activitiesBtn = h(
    'button',
    {
      className: 'btn-grid-action btn-activities-dom',
      title: 'Carregar atividades da semana',
      onclick: async (e) => {
        e.stopPropagation();

        const btn = e.target;
        if (btn.disabled) return;

        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = '⏳';
        btn.style.opacity = '0.6';

        try {
          if (callbacks.onViewActivities) {
            await callbacks.onViewActivities(week);
          }
        } catch (error) {
          /**#LOG_UI*/
          Logger.error('WeekItem', 'Erro ao carregar atividades (DOM):', error);
        } finally {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.style.opacity = '1';
        }
      },
    },
    flags.showAdvancedButtons ? '🔍 Completo' : 'Ver Atividades'
  );

  buttons.push(activitiesBtn);

  // Arrow
  const arrow = h('span', { className: 'week-arrow' }, '›'); // Safe text instead of innerHTML

  return h(
    'div',
    {
      className: 'week-item',
      onclick: () => callbacks.onClick?.(week.url),
    },
    [nameSpan, ...buttons, arrow]
  );
}
