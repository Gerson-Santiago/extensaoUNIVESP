/**
 * @file ViewTemplate.js
 * @description Centraliza o HTML da View de Detalhes
 */
export const ViewTemplate = {
  /**
   * Retorna o HTML estrutural da view
   * @param {string} courseName
   * @param {string} weekName
   * @returns {string}
   */
  render(courseName, weekName) {
    return `
      <div class="details-header">
        <button id="backBtn" class="btn-back">← Voltar</button>
        <div class="details-header-info">
          <div class="details-breadcrumb"><strong>${courseName || 'Matéria'}</strong></div>
          <h2 class="details-title">${weekName}</h2>
        </div>
        <div class="details-header-actions">
          <button id="clearBtn" class="btn-clear" title="Limpar cache e voltar">🗑️</button>
          <button id="refreshBtn" class="btn-refresh" title="Atualizar lista">↻</button>
        </div>
        <!-- Contextual Navigation Chips (inside header, bottom) -->
        <div id="chipsContainer" class="chips-container"></div>
      </div>
      <div id="activitiesContainer" class="activities-container"></div>
    `;
  },
};
