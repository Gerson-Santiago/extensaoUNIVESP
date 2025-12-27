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
      previewDiv.innerHTML = `
                <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #444; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    📊 ${week.name}
                </h4>
                <div style="font-size: 18px; letter-spacing: 3px; margin: 8px 0; line-height: 1.2;">${statusIcons}</div>
                <div style="font-size: 12px; color: #777; display: flex; justify-content: space-between; align-items: center;">
                    <span>Progresso: <strong>${progress}%</strong></span>
                    <span style="background: #f0f0f0; padding: 2px 6px; border-radius: 10px;">${doneCount}/${items.length} concluídas</span>
                </div>
            `;
      weekElement.insertAdjacentElement('afterend', previewDiv);
    } else {
      const preview = document.getElementById('activeWeekPreview');
      if (preview) {
        preview.innerHTML = `
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">${week.name}</h4>
                    <div id="previewStatus" style="font-size: 20px; letter-spacing: 2px; margin: 8px 0;">${statusIcons}</div>
                    <div id="previewProgress" style="font-size: 13px; color: #666;">Progresso: ${progress}%</div>
                `;
        preview.style.display = 'block';
      }
    }
  }
}
