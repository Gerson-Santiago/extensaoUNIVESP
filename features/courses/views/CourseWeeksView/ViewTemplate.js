/**
 * @file ViewTemplate.js
 * @description Template HTML para a view de semanas do curso.
 */

export const ViewTemplate = {
  render(courseName) {
    return `
      <div class="view-details">
        <div class="details-header">
          <button id="backBtn" class="btn-back">← Voltar</button>
          <h2 id="detailsTitle" class="details-title">${courseName}</h2>
        </div>
        
        <div id="detailsActions" style="margin-bottom: 15px; display: flex; gap: 5px;">
          <button id="openCourseBtn" class="btn-open-course" style="flex: 1;">Abrir Matéria</button>
          <button id="refreshWeeksBtn" class="btn-refresh" title="Atualizar Semanas" style="width: 40px; cursor: pointer;">↻</button>
        </div>

        <h3 style="font-size: 14px; color: #555; margin-bottom: 10px;">Semanas Disponíveis:</h3>
        <div id="weeksList" class="weeks-container">
          <!-- Lista de semanas e previews dinâmicos aqui -->
        </div>
        
        <!-- Preview Fixo (apenas para compatibilidade com testes) -->
        <div id="activeWeekPreview" style="display: none; margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
          <!-- Preview legado -->
        </div>
      </div>
    `;
  },
};
