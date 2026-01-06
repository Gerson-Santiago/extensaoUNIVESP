import { BackupService } from '../../../shared/services/BackupService.js';

/**
 * Controller for Settings View.
 * Handles business logic and mediation between View and Services.
 */
export class SettingsController {
  /**
   * @param {Object} services - Dependency injection
   * @param {Object} services.toaster - Toaster service
   * @param {Object} services.logger - Logger service
   */
  constructor({ toaster, logger }) {
    this.toaster = toaster;
    this.logger = logger;
  }

  /**
   * Handles the export data action.
   */
  async handleExport() {
    try {
      await BackupService.exportData();
      this.toaster.show('Backup iniciado com sucesso! Verifique seus downloads.', 'success');
      this.logger.info('User exported data successfully.');
    } catch (error) {
      this.logger.error('Export failed', error);
      this.toaster.show('Falha ao exportar dados.', 'error');
    }
  }

  /**
   * Handles the import data action.
   * @param {File} file
   */
  async handleImport(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const result = await BackupService.importData(text);

      if (result.success) {
        this.toaster.show('Dados restaurados com sucesso! Recarregando...', 'success');
        this.logger.info('User restored data successfully.');

        // Small delay for user to read toaster before reload
        setTimeout(() => {
          chrome.runtime.reload();
        }, 2000);
      } else {
        this.toaster.show(`Erro na importação: ${result.error}`, 'error');
        this.logger.warn('Import validation failed', result.error);
      }
    } catch (error) {
      this.logger.error('Import failed', error);
      this.toaster.show('Falha crítica ao ler arquivo.', 'error');
    }
  }

  /**
   * Reset all data to factory default.
   * Uses custom modal with double confirmation (checkbox + button).
   */
  async handleReset() {
    return new Promise((resolve) => {
      // Dynamic import to avoid circular dependency
      import('../../../shared/ui/Modal.js').then(({ Modal }) => {
        const modal = new Modal('factoryResetModal', '⚠️ Reset de Fábrica');

        // Create modal content
        const content = document.createElement('div');
        content.style.cssText = 'text-align: left;';

        const warningText = document.createElement('p');
        warningText.style.cssText = 'color: #d9534f; font-weight: bold; margin-bottom: 15px;';
        warningText.textContent =
          'Esta ação apagará TODOS os seus cursos, atividades, anotações e configurações.';

        const irreversibleText = document.createElement('p');
        irreversibleText.style.cssText = 'color: #666; margin-bottom: 20px;';
        irreversibleText.textContent = 'Esta ação é IRREVERSÍVEL e não pode ser desfeita.';

        // Checkbox confirmation
        const checkboxContainer = document.createElement('label');
        checkboxContainer.style.cssText =
          'display: flex; align-items: center; gap: 8px; margin-bottom: 20px; cursor: pointer;';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'confirmReset';
        checkbox.style.cssText = 'cursor: pointer;';

        const checkboxLabel = document.createElement('span');
        checkboxLabel.style.cssText = 'color: #333; font-size: 14px;';
        checkboxLabel.textContent = 'Entendo que esta ação é irreversível';

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxLabel);

        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.style.cssText = `
          padding: 8px 16px;
          border: 1px solid #ccc;
          background: #fff;
          color: #333;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        `;

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Confirmar Reset';
        confirmBtn.disabled = true;
        confirmBtn.style.cssText = `
          padding: 8px 16px;
          border: 2px solid #d9534f;
          background: #d9534f;
          color: white;
          border-radius: 4px;
          cursor: not-allowed;
          font-size: 14px;
          font-weight: bold;
          opacity: 0.5;
        `;

        buttonsContainer.appendChild(cancelBtn);
        buttonsContainer.appendChild(confirmBtn);

        // Assemble content
        content.appendChild(warningText);
        content.appendChild(irreversibleText);
        content.appendChild(checkboxContainer);
        content.appendChild(buttonsContainer);

        // Event Listeners
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            confirmBtn.disabled = false;
            confirmBtn.style.cursor = 'pointer';
            confirmBtn.style.opacity = '1';
          } else {
            confirmBtn.disabled = true;
            confirmBtn.style.cursor = 'not-allowed';
            confirmBtn.style.opacity = '0.5';
          }
        });

        cancelBtn.addEventListener('click', () => {
          modal.close();
          resolve(false);
        });

        confirmBtn.addEventListener('click', async () => {
          if (!checkbox.checked) return;

          try {
            await chrome.storage.local.clear();
            this.toaster.show('Extensão resetada. Recarregando...', 'warning');
            this.logger.info('User performed factory reset.');

            modal.close();
            resolve(true);

            setTimeout(() => {
              chrome.runtime.reload();
            }, 1000);
          } catch (error) {
            this.logger.error('Reset failed', error);
            this.toaster.show('Falha ao resetar dados.', 'error');
            modal.close();
            resolve(false);
          }
        });

        modal.setOnClose(() => resolve(false));
        modal.render(content);
      });
    });
  }
}

if (typeof module !== 'undefined') {
  // module.exports = SettingsController;
}
