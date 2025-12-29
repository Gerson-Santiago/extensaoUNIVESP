/* eslint-disable no-console */
/**
 * @file shared/utils/Logger.js
 * @description Sistema de logging estruturado para debug em desenvolvimento
 * @architecture Utility Layer
 *
 * Uso:
 *   Logger.debug('NavigationService', 'Iniciando scroll', { activityId: '_123_1' });
 *
 * Ativação (no console):
 *   localStorage.setItem('UNIVESP_DEBUG', 'true');
 */

/**
 * Níveis de log suportados
 * @enum {string}
 */
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

/**
 * Logger centralizado com suporte a namespaces
 */
export class Logger {
  /**
   * Verifica se debug está habilitado
   * @returns {boolean}
   */
  static isEnabled() {
    try {
      return localStorage.getItem('UNIVESP_DEBUG') === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Log de debug (apenas se debug habilitado)
   * @param {string} namespace - Namespace do log (ex: 'NavigationService')
   * @param {string} message - Mensagem descritiva
   * @param {*} [data] - Dados adicionais (opcional)
   */
  static debug(namespace, message, data = null) {
    if (!Logger.isEnabled()) return;

    const timestamp = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
    const prefix = `[${timestamp}] [${namespace}]`;

    if (data !== null && data !== undefined) {
      /**#LOG_SYSTEM*/
      console.log(prefix, message, data);
    } else {
      /**#LOG_SYSTEM*/
      console.log(prefix, message);
    }
  }

  /**
   * Log de informação (sempre exibido)
   * @param {string} namespace - Namespace do log
   * @param {string} message - Mensagem descritiva
   * @param {*} [data] - Dados adicionais (opcional)
   */
  static info(namespace, message, data = null) {
    const prefix = `[${namespace}]`;
    if (data !== null && data !== undefined) {
      /**#LOG_SYSTEM*/
      console.info(prefix, message, data);
    } else {
      /**#LOG_SYSTEM*/
      console.info(prefix, message);
    }
  }

  /**
   * Log de warning
   * @param {string} namespace - Namespace do log
   * @param {string} message - Mensagem descritiva
   * @param {*} [data] - Dados adicionais (opcional)
   */
  static warn(namespace, message, data = null) {
    const prefix = `[${namespace}]`;
    if (data !== null && data !== undefined) {
      /**#LOG_SYSTEM*/
      console.warn(prefix, message, data);
    } else {
      /**#LOG_SYSTEM*/
      console.warn(prefix, message);
    }
  }

  /**
   * Log de erro
   * @param {string} namespace - Namespace do log
   * @param {string} message - Mensagem descritiva
   * @param {Error|*} [error] - Erro ou dados adicionais (opcional)
   */
  static error(namespace, message, error = null) {
    const prefix = `[${namespace}]`;
    if (error !== null && error !== undefined) {
      /**#LOG_SYSTEM*/
      console.error(prefix, message, error);
    } else {
      /**#LOG_SYSTEM*/
      console.error(prefix, message);
    }
  }

  /**
   * Agrupa logs relacionados (apenas se debug habilitado)
   * @param {string} namespace - Namespace do log
   * @param {string} title - Título do grupo
   * @param {Function} callback - Função que executa os logs agrupados
   */
  static group(namespace, title, callback) {
    if (!Logger.isEnabled()) {
      callback();
      return;
    }

    /**#LOG_SYSTEM*/
    console.group(`[${namespace}] ${title}`);
    try {
      callback();
    } finally {
      /**#LOG_SYSTEM*/
      console.groupEnd();
    }
  }

  /**
   * Mede performance de uma operação
   * @param {string} namespace - Namespace do log
   * @param {string} operationName - Nome da operação
   * @param {Function} operation - Função assíncrona ou síncrona a medir
   * @returns {Promise<any>} Resultado da operação
   */
  static async measure(namespace, operationName, operation) {
    if (!Logger.isEnabled()) {
      return await operation();
    }

    const markStart = `${namespace}-${operationName}-start`;
    const markEnd = `${namespace}-${operationName}-end`;
    const measureName = `${namespace}-${operationName}`;

    performance.mark(markStart);
    try {
      const result = await operation();
      performance.mark(markEnd);
      const measure = performance.measure(measureName, markStart, markEnd);

      Logger.debug(namespace, `⏱️ ${operationName} concluído`, {
        duration: `${measure.duration.toFixed(2)}ms`,
      });

      return result;
    } catch (error) {
      performance.mark(markEnd);
      Logger.error(namespace, `❌ ${operationName} falhou`, error);
      throw error;
    }
  }
}
