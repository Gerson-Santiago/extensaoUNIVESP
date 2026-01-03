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
   */
  async handleReset() {
    if (
      !confirm(
        'ATENÇÃO: Isso apagará TODOS os seus cursos, anotações e configurações.\n\nEsta ação é irreversível. Deseja continuar?'
      )
    ) {
      return;
    }

    try {
      await chrome.storage.local.clear();
      this.toaster.show('Extensão resetada. Recarregando...', 'warning');
      this.logger.info('User performed factory reset.');

      setTimeout(() => {
        chrome.runtime.reload();
      }, 1000);
    } catch (error) {
      this.logger.error('Reset failed', error);
      this.toaster.show('Falha ao resetar dados.', 'error');
    }
  }
}

if (typeof module !== 'undefined') {
  // module.exports = SettingsController;
}
