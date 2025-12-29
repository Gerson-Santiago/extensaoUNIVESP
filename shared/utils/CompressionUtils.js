/**
 * @file CompressionUtils.js
 * @description Utilitários de compressão para reduzir tamanho de dados no Chrome Storage
 * Usa compressão nativa do JavaScript (não precisa de biblioteca externa)
 */

import { Logger } from './Logger.js';

export class CompressionUtils {
  /**
   * Comprime string usando LZ-based algorithm nativo
   * @param {string} str - String para comprimir
   * @returns {Promise<string>} String comprimida (base64)
   */
  static async compress(str) {
    try {
      // Converte para Uint8Array
      const encoder = new TextEncoder();
      const data = encoder.encode(str);

      // Usa CompressionStream (disponível no Chrome 80+)
      const stream = new CompressionStream('gzip');
      const writer = stream.writable.getWriter();
      writer.write(data);
      writer.close();

      // Lê resultado comprimido
      return new Response(stream.readable)
        .arrayBuffer()
        .then((buf) => btoa(String.fromCharCode(...new Uint8Array(buf))));
    } catch (error) {
      // Fallback: retorna string original se compressão falhar
      /**#LOG_SYSTEM*/
      Logger.warn('CompressionUtils', 'Compressão falhou, usando original:', error);
      return Promise.resolve(str);
    }
  }

  /**
   * Descomprime string
   * @param {string} compressed - String comprimida (base64)
   * @returns {Promise<string>} String original
   */
  static async decompress(compressed) {
    try {
      // Converte de base64 para Uint8Array
      const binary = atob(compressed);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Usa DecompressionStream
      const stream = new DecompressionStream('gzip');
      const writer = stream.writable.getWriter();
      writer.write(bytes);
      writer.close();

      // Lê resultado descomprimido
      const buffer = await new Response(stream.readable).arrayBuffer();
      const decoder = new TextDecoder();
      return decoder.decode(buffer);
    } catch (error) {
      // Fallback: assume que é string não comprimida
      /**#LOG_SYSTEM*/
      Logger.warn('CompressionUtils', 'Descompressão falhou, usando como original:', error);
      return compressed;
    }
  }

  /**
   * Calcula tamanho estimado de string em bytes
   * @param {string} str
   * @returns {number} Tamanho em bytes
   */
  static getByteSize(str) {
    return new Blob([str]).size;
  }

  /**
   * Verifica se compressão é necessária (> 6KB)
   * @param {string} str
   * @returns {boolean}
   */
  static needsCompression(str) {
    return this.getByteSize(str) > 6144; // 6KB
  }
}
