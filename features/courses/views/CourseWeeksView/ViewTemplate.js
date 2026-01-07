/**
 * @file ViewTemplate.js
 * @description Template HTML para a view de semanas do curso.
 */
import { DOMSafe } from '../../../../shared/utils/DOMSafe.js';

export const ViewTemplate = {
  /**
   * Creates the course weeks view structure
   * @param {string} courseName - Name of the course
   * @returns {HTMLElement} The complete view structure
   */
  render(courseName) {
    const h = DOMSafe.createElement;

    return h('div', { className: 'view-details' }, [
      // Header
      h('div', { className: 'details-header' }, [
        h('button', { id: 'backBtn', className: 'btn-back' }, '← Voltar'),
        h('h2', { id: 'detailsTitle', className: 'details-title' }, courseName),
      ]),

      // Actions
      h(
        'div',
        {
          id: 'detailsActions',
          style: { marginBottom: '15px', display: 'flex', gap: '5px' },
        },
        [
          h(
            'button',
            {
              id: 'openCourseBtn',
              className: 'btn-open-course',
              style: { flex: '1' },
            },
            'Abrir Matéria'
          ),
          h(
            'button',
            {
              id: 'refreshWeeksBtn',
              className: 'btn-refresh',
              title: 'Atualizar Semanas',
              style: { width: '40px', cursor: 'pointer' },
            },
            '↻'
          ),
        ]
      ),

      // Weeks Header
      h(
        'h3',
        {
          style: { fontSize: '14px', color: '#555', marginBottom: '10px' },
        },
        'Semanas Disponíveis:'
      ),

      // Weeks List
      h('div', { id: 'weeksList', className: 'weeks-container' }),

      // Preview (hidden by default, for test compatibility)
      h('div', {
        id: 'activeWeekPreview',
        style: {
          display: 'none',
          marginTop: '15px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '8px',
        },
      }),
    ]);
  },
};
