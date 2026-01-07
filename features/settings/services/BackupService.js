// @ts-check
/**
 * @file BackupService.js
 * @description Serviço para exportação e importação de todos os dados da extensão
 * @architecture Settings Feature - Domain Service
 */

/**
 * @typedef {Object} BackupData
 * @property {Object} meta
 * @property {string} meta.version - Versão do formato de backup
 * @property {string} meta.date - Data do backup ISO
 * @property {Object} data - Dados brutos do chrome.storage.local
 */

import { Logger } from '../../../shared/utils/Logger.js';

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
      /**#LOG_SYSTEM*/
      Logger.error('BackupService', 'Erro ao exportar:', error);
      throw new Error('Falha ao criar backup dos dados.');
    }
  }

  /**
   * Importa dados de um arquivo JSON
   * @param {string} jsonString - Conteúdo do arquivo
   * @returns {Promise<Object>} Resultado da importação { success: true, count: number }
   * @throws {Error} Se o schema for inválido
   */
  static async importData(jsonString) {
    try {
      /** @type {any} */
      const backup = JSON.parse(jsonString);

      // Validação de Schema (Security-First)
      this.validateSchema(backup);

      Logger.info(
        'BackupService',
        `Importando backup de ${backup.meta.date} (v${backup.meta.version})`
      );

      // Limpar e restaurar
      await chrome.storage.local.clear();
      await chrome.storage.local.set(backup.data);

      return {
        success: true,
        keyCount: Object.keys(backup.data).length,
        date: backup.meta.date,
      };
    } catch (error) {
      /**#LOG_SYSTEM*/
      Logger.error('BackupService', 'Erro ao importar:', error);
      // Retornar erro legível para o controller
      if (error instanceof SyntaxError) {
        throw new Error('Arquivo não é um JSON válido.');
      }
      throw error;
    }
  }

  /**
   * Valida o schema do backup para prevenir injeção de dados corrompidos
   * @param {any} backup - Objeto parseado do JSON
   * @throws {Error} Com mensagem descritiva da falha de validação
   */
  static validateSchema(backup) {
    if (!backup || typeof backup !== 'object') {
      throw new Error('Backup deve ser um objeto JSON.');
    }

    if (!backup.meta || typeof backup.meta !== 'object') {
      throw new Error('Backup hierarquia inválida: falta "meta".');
    }

    if (!backup.data || typeof backup.data !== 'object') {
      throw new Error('Backup hierarquia inválida: falta "data".');
    }

    // Validar campos críticos de meta
    if (typeof backup.meta.version !== 'string') {
      throw new Error('Metadados corrompidos: versão inválida.');
    }

    // Opcional: Validar se 'data' não está vazio se isso for um requisito
    // if (Object.keys(backup.data).length === 0) { ... }
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
