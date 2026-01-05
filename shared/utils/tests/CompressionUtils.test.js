import { CompressionUtils } from '../CompressionUtils.js';
import { Logger } from '../Logger.js';
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

// Polyfill para TextEncoder/Decoder se faltar no ambiente JSDOM
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = NodeTextEncoder;
  global.TextDecoder = NodeTextDecoder;
}

// Mock do Logger para não poluir console de teste
jest.mock('../Logger.js', () => ({
  Logger: {
    warn: jest.fn(),
  },
}));

describe('CompressionUtils', () => {
  describe('getByteSize', () => {
    it('deve retornar o tamanho correto em bytes para strings simples', () => {
      expect(CompressionUtils.getByteSize('abc')).toBe(3);
    });

    it('deve retornar o tamanho correto para caracteres especiais/emojis', () => {
      // '🚀' tem 4 bytes em UTF-8
      expect(CompressionUtils.getByteSize('🚀')).toBe(4);
    });
  });

  describe('needsCompression', () => {
    it('deve retornar false para strings menores que 6KB', () => {
      expect(CompressionUtils.needsCompression('pequena')).toBe(false);
    });

    it('deve retornar true para strings maiores que 6144 bytes', () => {
      const longStr = 'a'.repeat(6145);
      expect(CompressionUtils.needsCompression(longStr)).toBe(true);
    });
  });

  describe('compress e decompress', () => {
    const originalCompressionStream = global.CompressionStream;
    const originalDecompressionStream = global.DecompressionStream;
    const originalResponse = global.Response;

    afterEach(() => {
      global.CompressionStream = originalCompressionStream;
      global.DecompressionStream = originalDecompressionStream;
      global.Response = originalResponse;
    });

    it('deve comprimir e descomprimir dados quando as APIs estão disponíveis', async () => {
      // Mock básico para CompressionStream
      global.CompressionStream = jest.fn().mockImplementation(() => ({
        writable: {
          getWriter: () => ({
            write: jest.fn(),
            close: jest.fn(),
          }),
        },
        readable: {},
      }));

      global.DecompressionStream = jest.fn().mockImplementation(() => ({
        writable: {
          getWriter: () => ({
            write: jest.fn(),
            close: jest.fn(),
          }),
        },
        readable: {},
      }));

      // Mock Response para simular o comportamento de ReadableStream -> ArrayBuffer
      const mockData = new TextEncoder().encode('resultado');
      // @ts-ignore - Mock simplificado para teste
      global.Response = class {
        constructor(body) {
          this.body = body;
        }
        async arrayBuffer() {
          return mockData.buffer;
        }
      };

      const input = 'resultado';
      const compressed = await CompressionUtils.compress(input);

      // r=114, e=101, s=115, u=117, l=108, t=116, a=97, d=100, o=111
      const expectedBase64 = btoa('resultado');
      expect(compressed).toBe(expectedBase64);

      const decompressed = await CompressionUtils.decompress(compressed);
      expect(decompressed).toBe('resultado');
    });

    it('deve retornar a string original se CompressionStream não estiver disponível (fallback)', async () => {
      global.CompressionStream = undefined;
      const input = 'teste de fallback';
      const result = await CompressionUtils.compress(input);
      expect(result).toBe(input);
      expect(Logger.warn).toHaveBeenCalledWith(
        'CompressionUtils',
        expect.any(String),
        expect.any(Error)
      );
    });

    it('deve retornar a string comprimida original se DecompressionStream falhar (fallback)', async () => {
      global.DecompressionStream = undefined;
      const input = 'dado_comprimido_fake';
      const result = await CompressionUtils.decompress(input);
      expect(result).toBe(input);
      expect(Logger.warn).toHaveBeenCalledWith(
        'CompressionUtils',
        expect.any(String),
        expect.any(Error)
      );
    });
  });
});
