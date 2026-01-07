/**
 * @file features/courses/components/CourseItem.js
 * @description Componente de Item de Curso
 */
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

export function createCourseElement(course, callbacks) {
  const h = DOMSafe.createElement;

  // Info Container (clicável para abrir)
  const info = h(
    'div',
    {
      className: 'item-info',
      title: 'Abrir página da matéria no AVA',
      onclick: () => callbacks.onClick?.(course.url),
    },
    [
      h('span', { className: 'item-name' }, course.name),
      h('span', { className: 'item-url' }, course.url),
    ]
  );

  // Botão Detalhes (Semanas) - Coluna 2
  const detailsButton = callbacks.onViewDetails
    ? h(
        'button',
        {
          className: 'btn-grid-action',
          title: 'Visualizar semanas e conteúdo',
          onclick: (e) => {
            e.stopPropagation();
            callbacks.onViewDetails(course);
          },
        },
        'Ver Semanas'
      )
    : h('div'); // Placeholder vazio para manter grid

  // Botão Excluir - Coluna 3
  const deleteButton = h(
    'button',
    {
      className: 'btn-delete',
      title: 'Remover matéria da lista',
      onclick: (e) => {
        e.stopPropagation();
        if (confirm(`Remover "${course.name}"?`)) {
          callbacks.onDelete?.(course.id);
        }
      },
    },
    '×'
  ); // Using safe text node instead of innerHTML

  return h('li', { className: 'item' }, [info, detailsButton, deleteButton]);
}
