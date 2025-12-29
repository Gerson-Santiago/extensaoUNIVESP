/**
 * @file ChunkedStorage.js
 * @description Gerencia armazenamento de dados grandes divididos em chunks
 */

import { CompressionUtils } from './CompressionUtils.js';
import { Logger } from './Logger.js';

/**
 * @typedef {Object} ChunkedMetadata
 * @property {boolean} chunked - Se os dados estão divididos em chunks
 * @property {boolean} compressed - Se os dados estão comprimidos
 * @property {string} [data] - Dados quando não está em chunks
 * @property {number} [totalChunks] - Total de chunks (quando chunked=true)
 * @property {number} [totalSize] - Tamanho total (quando chunked=true)
 */

export class ChunkedStorage {
  /** Tamanho máximo por chunk (7KB para margem de segurança) */
  static CHUNK_SIZE = 7168; // 7KB

  /**
   * Salva dados grandes dividindo em chunks se necessário
   * @param {string} key - Chave base
   * @param {any} data - Dados para salvar
   * @returns {Promise<void>}
   */
  static async saveChunked(key, data) {
    try {
      // Serializa dados
      const jsonStr = JSON.stringify(data);

      // Verifica se precisa comprimir
      let finalStr = jsonStr;
      let isCompressed = false;

      if (CompressionUtils.needsCompression(jsonStr)) {
        finalStr = await CompressionUtils.compress(jsonStr);
        isCompressed = true;
      }

      const totalSize = CompressionUtils.getByteSize(finalStr);

      // Se cabe em 1 chunk, salva direto
      if (totalSize <= this.CHUNK_SIZE) {
        await chrome.storage.local.set({
          [key]: {
            data: finalStr,
            compressed: isCompressed,
            chunked: false,
          },
        });
        return;
      }

      // Divide em chunks
      const chunks = [];
      for (let i = 0; i < finalStr.length; i += this.CHUNK_SIZE) {
        chunks.push(finalStr.slice(i, i + this.CHUNK_SIZE));
      }

      // Salva metadados
      await chrome.storage.local.set({
        [key]: {
          compressed: isCompressed,
          chunked: true,
          totalChunks: chunks.length,
          totalSize,
        },
      });

      // Salva cada chunk
      const chunkData = {};
      chunks.forEach((chunk, index) => {
        chunkData[`${key}_chunk_${index}`] = chunk;
      });

      await chrome.storage.local.set(chunkData);
    } catch (error) {
      Logger.error('ChunkedStorage', `Erro ao salvar ${key}:`, error); /**#LOG_SYSTEM*/
      throw error;
    }
  }

  /**
   * Carrega dados que podem estar em chunks
   * @param {string} key - Chave base
   * @returns {Promise<any|null>} Dados originais ou null
   */
  static async loadChunked(key) {
    try {
      const result = await chrome.storage.local.get(key);
      const metadata = /** @type {ChunkedMetadata | undefined} */ (result[key]);

      if (!metadata) return null;

      // Caso simples: não está em chunks
      if (!metadata.chunked) {
        let str = metadata.data;

        if (metadata.compressed) {
          str = await CompressionUtils.decompress(str);
        }

        return JSON.parse(str);
      }

      // Recompõe chunks
      const chunkKeys = [];
      for (let i = 0; i < metadata.totalChunks; i++) {
        chunkKeys.push(`${key}_chunk_${i}`);
      }

      const chunksResult = await chrome.storage.local.get(chunkKeys);

      let combinedStr = '';
      for (let i = 0; i < metadata.totalChunks; i++) {
        const chunkKey = `${key}_chunk_${i}`;
        combinedStr += chunksResult[chunkKey] || '';
      }

      if (metadata.compressed) {
        combinedStr = await CompressionUtils.decompress(combinedStr);
      }

      return JSON.parse(combinedStr);
    } catch (error) {
      Logger.error('ChunkedStorage', `Erro ao carregar ${key}:`, error); /**#LOG_SYSTEM*/
      return null;
    }
  }

  /**
   * Remove item e todos seus chunks
   * @param {string} key - Chave base
   * @returns {Promise<void>}
   */
  static async deleteChunked(key) {
    try {
      const result = await chrome.storage.local.get(key);
      const metadata = /** @type {ChunkedMetadata | undefined} */ (result[key]);

      if (!metadata) return;

      // Remove metadados
      await chrome.storage.local.remove(key);

      // Se tinha chunks, remove todos
      if (metadata.chunked) {
        const chunkKeys = [];
        for (let i = 0; i < metadata.totalChunks; i++) {
          chunkKeys.push(`${key}_chunk_${i}`);
        }
        await chrome.storage.local.remove(chunkKeys);
      }
    } catch (error) {
      Logger.error('ChunkedStorage', `Erro ao deletar ${key}:`, error); /**#LOG_SYSTEM*/
    }
  }
}
