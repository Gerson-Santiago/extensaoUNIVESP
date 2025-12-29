/**
 * @file ErrorHandler.js
 * @description Utilitário para padronização de tratamento de erros e tipagem defensiva.
 * Implementa o padrão "SafeResult" para evitar try/catch aninhados.
 */

import { Logger } from './Logger.js';

/**
 * Estrutura padronizada de resposta segura.
 * @template T
 * @typedef {Object} SafeResult
 * @property {T | null} data - O dado de sucesso (se houver).
 * @property {Error | null} error - O erro capturado (se houver).
 * @property {boolean} success - Flag rápida para controle de fluxo.
 */

/**
 * Executa uma Promise de forma segura, retornando um objeto de resultado estruturado
 * em vez de lançar uma exceção (throw).
 *
 * @template T
 * @param {Promise<T>} promise - A promessa a ser executada.
 * @returns {Promise<SafeResult<T>>} Resultado seguro com tipo garantido.
 *
 * @example
 * const { data, error, success } = await trySafe(api.fetchUser(1));
 * if (!success) {
 *   console.error(error);
 *   return;
 * }
 * console.log(data.name);
 */
export async function trySafe(promise) {
  try {
    const data = await promise;
    return { data, error: null, success: true };
  } catch (originalError) {
    // Garante que o erro seja uma instância de Error
    const error = originalError instanceof Error ? originalError : new Error(String(originalError));

    // Log de debug para rastreabilidade
    /**#LOG_SYSTEM*/
    Logger.debug('ErrorHandler', '[SafeResult Captured]', error);

    return { data: null, error, success: false };
  }
}
