/**
 * @file PreviewManager.js
 * @description Gerencia a lógica de preview de tarefas e progresso.
 */

export class PreviewManager {
  /**
   * Remove preview dinâmico atual e esconde preview legado
   */
  static hidePreview() {
    const existingPreview = document.querySelector('.week-preview-dynamic');
    if (existingPreview) {
      existingPreview.remove();
    }

    const legacyPreview = document.getElementById('activeWeekPreview');
    if (legacyPreview) {
      legacyPreview.style.display = 'none';
    }
  }

  /**
   * Renderiza ícones de status para array de items
   * @param {Array} items - Array de items
   * @returns {string} - String com emojis concatenados
   */
  static renderStatusIcons(items) {
    if (!items || items.length === 0) return '';
    return items.map((item) => (item.status === 'DONE' ? '✅' : '🔵')).join('');
  }

  /**
   * Calcula progresso percentual baseado nos status
   * @param {Array} items - Array de items da semana
   * @returns {number} - Percentual de 0-100
   */
  static calculateProgress(items) {
    if (!items || items.length === 0) return 0;
    const total = items.length;
    const done = items.filter((i) => i.status === 'DONE').length;
    return Math.round((done / total) * 100);
  }

  /**
   * Renderiza o preview dinâmico ou legado
   * @param {Object} week - Objeto da semana
   * @param {HTMLElement} [weekElement] - Elemento DOM da semana
   */
  static renderPreview(week, weekElement) {
    const items = week.items || [];
    const statusIcons = this.renderStatusIcons(items);
    const progress = this.calculateProgress(items);
    const doneCount = items.filter((i) => i.status === 'DONE').length;

    // Helper para criar conteúdo estruturado
    const createContent = () => {
      const fragment = document.createDocumentFragment();

      const h4 = document.createElement('h4');
      h4.textContent = `${weekElement ? '📊 ' : ''}${week.name}`;

      if (weekElement) {
        Object.assign(h4.style, {
          margin: '0 0 8px 0',
          fontSize: '13px',
          color: '#444',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        });
      } else {
        Object.assign(h4.style, {
          margin: '0 0 8px 0',
          fontSize: '14px',
          color: '#333',
        });
      }

      const iconsDiv = document.createElement('div');
      iconsDiv.textContent = statusIcons;
      if (weekElement) {
        Object.assign(iconsDiv.style, {
          fontSize: '18px',
          letterSpacing: '3px',
          margin: '8px 0',
          lineHeight: '1.2',
        });
      } else {
        iconsDiv.id = 'previewStatus';
        Object.assign(iconsDiv.style, {
          fontSize: '20px',
          letterSpacing: '2px',
          margin: '8px 0',
        });
      }

      const infoDiv = document.createElement('div');
      if (weekElement) {
        Object.assign(infoDiv.style, {
          fontSize: '12px',
          color: '#777',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        });

        const progressSpan = document.createElement('span');
        const strong = document.createElement('strong');
        strong.textContent = `${progress}%`;
        progressSpan.append('Progresso: ', strong);

        const countSpan = document.createElement('span');
        countSpan.textContent = `${doneCount}/${items.length} concluídas`;
        Object.assign(countSpan.style, {
          background: '#f0f0f0',
          padding: '2px 6px',
          borderRadius: '10px',
        });

        infoDiv.append(progressSpan, countSpan);
      } else {
        infoDiv.id = 'previewProgress';
        infoDiv.textContent = `Progresso: ${progress}%`;
        Object.assign(infoDiv.style, {
          fontSize: '13px',
          color: '#666',
        });
      }

      fragment.append(h4, iconsDiv, infoDiv);
      return fragment;
    };

    if (weekElement) {
      const previewDiv = document.createElement('div');
      previewDiv.className = 'week-preview-dynamic';
      previewDiv.style.cssText = `
                background: #fdfdfd;
                border: 1px solid #eee;
                border-top: none;
                padding: 12px;
                margin-top: -1px;
                border-radius: 0 0 8px 8px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
                animation: slideDown 0.2s ease-out;
            `;

      previewDiv.appendChild(createContent());
      weekElement.insertAdjacentElement('afterend', previewDiv);
    } else {
      const preview = document.getElementById('activeWeekPreview');
      if (preview) {
        preview.replaceChildren();
        preview.appendChild(createContent());
        preview.style.display = 'block';
      }
    }
  }
}
