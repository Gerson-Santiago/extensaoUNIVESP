/**
 * @file BackupService.js
 * @description Serviço para exportação e importação de todos os dados da extensão
 * @architecture Settings Feature - Domain Service
 */

/**
 * @typedef {Object} BackupData
 * @property {string} version - Versão do formato de backup
 * @property {string} date - Data do backup ISO
 * @property {Object} storage - Dados brutos do chrome.storage.local
 */

export class BackupService {
  static VERSION = '1.0.0';

  /**
   * Exporta todos os dados do storage local (Cursos, Atividades, Configs)
   * @returns {Promise<void>} Inicia o download do arquivo JSON
   */
  static async exportData() {
    try {
      // 1. Pegar tudo do storage local (onde tudo vive agora)
      const allData = await chrome.storage.local.get(null);

      // 2. Filtrar chaves de sistema se necessário (opcional, mas bom pra limpar)
      // Por enquanto, salvamos tudo para garantir restauração completa

      const backup = {
        meta: {
          version: this.VERSION,
          date: new Date().toISOString(),
          extensionVersion: chrome.runtime.getManifest().version,
        },
        data: allData,
      };

      // 3. Criar Blob e Download
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `univesp-backup-${timestamp}.json`;

      await chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true,
      });
    } catch (error) {
      console.error('[BackupService] Erro ao exportar:', error);
      throw new Error('Falha ao criar backup dos dados.');
    }
  }

  /**
   * Importa dados de um arquivo JSON
   * @param {string} jsonString - Conteúdo do arquivo
   * @returns {Promise<Object>} Resultado da importação { success: true, count: number }
   */
  static async importData(jsonString) {
    try {
      const backup = JSON.parse(jsonString);

      // Validação básica
      if (!backup.meta || !backup.data) {
        throw new Error('Formato de arquivo inválido.');
      }

      // eslint-disable-next-line no-console
      console.log(
        `[BackupService] Importando backup de ${backup.meta.date} (v${backup.meta.version})`
      );

      // Salvar dados
      // NOTA: Usamos set ao invés de clear+set para evitar apagar coisas se o restore falhar no meio?
      // Melhor: clear+set para evitar lixo antigo misturado, já que é um "Restore"

      await chrome.storage.local.clear();
      await chrome.storage.local.set(backup.data);

      return {
        success: true,
        keyCount: Object.keys(backup.data).length,
        date: backup.meta.date,
      };
    } catch (error) {
      console.error('[BackupService] Erro ao importar:', error);
      throw error;
    }
  }

  /**
   * Gatilho de UI para selecionar arquivo
   * @returns {Promise<File>}
   */
  static async triggerFileUpload() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = (e) => {
        const target = /** @type {HTMLInputElement} */ (e.target);
        const file = target.files ? target.files[0] : null;
        if (file) resolve(file);
        else reject(new Error('Nenhum arquivo selecionado'));
      };

      input.click();
    });
  }
}
