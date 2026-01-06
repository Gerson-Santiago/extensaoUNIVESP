// @ts-nocheck
import { ChunkedStorage } from '../ChunkedStorage.js';
import { CompressionUtils } from '../CompressionUtils.js';
import { Logger } from '../Logger.js';

// Mock do Logger
jest.mock('../Logger.js', () => ({
  Logger: {
    error: jest.fn(),
  },
}));

// Mock do CompressionUtils
jest.mock('../CompressionUtils.js');

describe('ChunkedStorage', () => {
  let mockChromeStorage;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();

    // Mock do chrome.storage.local
    mockChromeStorage = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    };

    global.chrome = {
      storage: {
        local: mockChromeStorage,
      },
    };

    // Mock padrão do CompressionUtils
    // @ts-ignore - Mock de função
    CompressionUtils.needsCompression = jest.fn().mockReturnValue(false);
    // @ts-ignore - Mock de função
    CompressionUtils.compress = jest.fn().mockImplementation((str) => Promise.resolve(str));
    // @ts-ignore - Mock de função
    CompressionUtils.decompress = jest.fn().mockImplementation((str) => Promise.resolve(str));
    // @ts-ignore - Mock de função
    CompressionUtils.getByteSize = jest.fn().mockImplementation((str) => str.length);
  });

  describe('saveChunked', () => {
    it('deve salvar dados pequenos sem chunking nem compressão', async () => {
      // Arrange
      const key = 'test-key';
      const data = { name: 'test', value: 123 };
      const expectedJson = JSON.stringify(data);

      // @ts-ignore - Mock de função
      CompressionUtils.needsCompression.mockReturnValue(false);
      // @ts-ignore - Mock de função
      CompressionUtils.getByteSize.mockReturnValue(100); // Menor que CHUNK_SIZE
      mockChromeStorage.set.mockResolvedValue(undefined);

      // Act
      await ChunkedStorage.saveChunked(key, data);

      // Assert
      expect(mockChromeStorage.set).toHaveBeenCalledWith({
        [key]: {
          data: expectedJson,
          compressed: false,
          chunked: false,
        },
      });
      expect(CompressionUtils.needsCompression).toHaveBeenCalledWith(expectedJson);
    });

    it('deve comprimir dados grandes sem chunking', async () => {
      // Arrange
      const key = 'large-data';
      const data = { content: 'x'.repeat(10000) };
      const jsonStr = JSON.stringify(data);
      const compressedStr = 'compressed-data';

      // @ts-ignore - Mock de função
      CompressionUtils.needsCompression.mockReturnValue(true);
      // @ts-ignore - Mock de função
      CompressionUtils.compress.mockResolvedValue(compressedStr);
      // @ts-ignore - Mock de função
      CompressionUtils.getByteSize.mockReturnValue(500); // Menor que CHUNK_SIZE após compressão
      mockChromeStorage.set.mockResolvedValue(undefined);

      // Act
      await ChunkedStorage.saveChunked(key, data);

      // Assert
      expect(CompressionUtils.compress).toHaveBeenCalledWith(jsonStr);
      expect(mockChromeStorage.set).toHaveBeenCalledWith({
        [key]: {
          data: compressedStr,
          compressed: true,
          chunked: false,
        },
      });
    });

    it('deve dividir dados muito grandes em chunks', async () => {
      // Arrange
      const key = 'chunked-data';
      const data = { huge: 'x'.repeat(20000) };

      // @ts-ignore - Mock de função
      CompressionUtils.needsCompression.mockReturnValue(false);
      // @ts-ignore - Mock de função
      CompressionUtils.getByteSize.mockReturnValue(20000); // Maior que CHUNK_SIZE (7168)
      mockChromeStorage.set.mockResolvedValue(undefined);

      // Act
      await ChunkedStorage.saveChunked(key, data);

      // Assert
      // Deve ter salvado metadados
      const setCallArgs = mockChromeStorage.set.mock.calls;
      expect(setCallArgs.length).toBe(2); // Metadata + chunks

      const metadataCall = setCallArgs[0][0];
      expect(metadataCall[key]).toMatchObject({
        compressed: false,
        chunked: true,
        totalChunks: expect.any(Number),
        totalSize: 20000,
      });

      // Deve ter salvado chunks
      const chunksCall = setCallArgs[1][0];
      const chunkKeys = Object.keys(chunksCall);
      expect(chunkKeys.length).toBeGreaterThan(1);
      expect(chunkKeys[0]).toBe(`${key}_chunk_0`);
    });

    it('deve comprimir E dividir em chunks dados muito grandes', async () => {
      // Arrange
      const key = 'compressed-chunked';
      const data = { massive: 'y'.repeat(30000) };
      const jsonStr = JSON.stringify(data);
      const compressedStr = 'c'.repeat(15000); // Ainda grande após compressão

      // @ts-ignore - Mock de função
      CompressionUtils.needsCompression.mockReturnValue(true);
      // @ts-ignore - Mock de função
      CompressionUtils.compress.mockResolvedValue(compressedStr);
      // @ts-ignore - Mock de função
      CompressionUtils.getByteSize.mockReturnValue(15000); // Maior que CHUNK_SIZE
      mockChromeStorage.set.mockResolvedValue(undefined);

      // Act
      await ChunkedStorage.saveChunked(key, data);

      // Assert
      expect(CompressionUtils.compress).toHaveBeenCalledWith(jsonStr);

      const setCallArgs = mockChromeStorage.set.mock.calls;
      const metadataCall = setCallArgs[0][0];
      expect(metadataCall[key]).toMatchObject({
        compressed: true,
        chunked: true,
        totalChunks: expect.any(Number),
        totalSize: 15000,
      });
    });

    it('deve lançar erro se chrome.storage.set falhar', async () => {
      // Arrange
      const key = 'fail-key';
      const data = { test: 'data' };
      const storageError = new Error('QUOTA_EXCEEDED');

      mockChromeStorage.set.mockRejectedValue(storageError);

      // Act & Assert
      await expect(ChunkedStorage.saveChunked(key, data)).rejects.toThrow(storageError);
      expect(Logger.error).toHaveBeenCalledWith(
        'ChunkedStorage',
        expect.stringContaining('Erro ao salvar'),
        storageError
      );
    });
  });

  describe('loadChunked', () => {
    it('deve carregar dados simples (não chunked, não compressed)', async () => {
      // Arrange
      const key = 'simple-key';
      const originalData = { name: 'test', value: 456 };
      const storedJson = JSON.stringify(originalData);

      mockChromeStorage.get.mockResolvedValue({
        [key]: {
          data: storedJson,
          compressed: false,
          chunked: false,
        },
      });

      // Act
      const result = await ChunkedStorage.loadChunked(key);

      // Assert
      expect(result).toEqual(originalData);
      expect(mockChromeStorage.get).toHaveBeenCalledWith(key);
    });

    it('deve descomprimir dados comprimidos (não chunked)', async () => {
      // Arrange
      const key = 'compressed-key';
      const originalData = { content: 'important' };
      const compressedData = 'compressed-string';
      const decompressedJson = JSON.stringify(originalData);

      mockChromeStorage.get.mockResolvedValue({
        [key]: {
          data: compressedData,
          compressed: true,
          chunked: false,
        },
      });

      // @ts-ignore - Mock de função
      CompressionUtils.decompress.mockResolvedValue(decompressedJson);

      // Act
      const result = await ChunkedStorage.loadChunked(key);

      // Assert
      expect(CompressionUtils.decompress).toHaveBeenCalledWith(compressedData);
      expect(result).toEqual(originalData);
    });

    it('deve recompor dados de múltiplos chunks', async () => {
      // Arrange
      const key = 'chunked-key';
      const originalData = { big: 'data' };
      const jsonStr = JSON.stringify(originalData);
      const chunk1 = jsonStr.slice(0, 10);
      const chunk2 = jsonStr.slice(10);

      mockChromeStorage.get
        .mockResolvedValueOnce({
          [key]: {
            compressed: false,
            chunked: true,
            totalChunks: 2,
            totalSize: jsonStr.length,
          },
        })
        .mockResolvedValueOnce({
          [`${key}_chunk_0`]: chunk1,
          [`${key}_chunk_1`]: chunk2,
        });

      // Act
      const result = await ChunkedStorage.loadChunked(key);

      // Assert
      expect(result).toEqual(originalData);
      expect(mockChromeStorage.get).toHaveBeenCalledTimes(2);
    });

    it('deve recompor e descomprimir chunks comprimidos', async () => {
      // Arrange
      const key = 'compressed-chunked-key';
      const originalData = { huge: 'content' };
      const jsonStr = JSON.stringify(originalData);
      const compressedStr = 'compressed-long-string';
      const chunk1 = compressedStr.slice(0, 10);
      const chunk2 = compressedStr.slice(10);

      mockChromeStorage.get
        .mockResolvedValueOnce({
          [key]: {
            compressed: true,
            chunked: true,
            totalChunks: 2,
            totalSize: compressedStr.length,
          },
        })
        .mockResolvedValueOnce({
          [`${key}_chunk_0`]: chunk1,
          [`${key}_chunk_1`]: chunk2,
        });

      // @ts-ignore - Mock de função
      CompressionUtils.decompress.mockResolvedValue(jsonStr);

      // Act
      const result = await ChunkedStorage.loadChunked(key);

      // Assert
      expect(CompressionUtils.decompress).toHaveBeenCalledWith(compressedStr);
      expect(result).toEqual(originalData);
    });

    it('deve retornar null se chave não existir', async () => {
      // Arrange
      const key = 'non-existent';
      mockChromeStorage.get.mockResolvedValue({});

      // Act
      const result = await ChunkedStorage.loadChunked(key);

      // Assert
      expect(result).toBeNull();
    });

    it('deve retornar null e logar erro se carregar falhar', async () => {
      // Arrange
      const key = 'error-key';
      const loadError = new Error('Storage error');
      mockChromeStorage.get.mockRejectedValue(loadError);

      // Act
      const result = await ChunkedStorage.loadChunked(key);

      // Assert
      expect(result).toBeNull();
      expect(Logger.error).toHaveBeenCalledWith(
        'ChunkedStorage',
        expect.stringContaining('Erro ao carregar'),
        loadError
      );
    });

    it('deve lidar com chunks corrompidos/faltando retornando dados parciais', async () => {
      // Arrange
      const key = 'corrupted-chunks';

      mockChromeStorage.get
        .mockResolvedValueOnce({
          [key]: {
            compressed: false,
            chunked: true,
            totalChunks: 3,
            totalSize: 30,
          },
        })
        .mockResolvedValueOnce({
          [`${key}_chunk_0`]: '{"name":',
          [`${key}_chunk_1`]: '"test",', // chunk_2 está faltando
        });

      // Act & Assert
      // JSON.parse vai falhar com JSON incompleto, deve retornar null e logar erro
      const result = await ChunkedStorage.loadChunked(key);
      expect(result).toBeNull();
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('deleteChunked', () => {
    it('deve deletar item simples (não chunked)', async () => {
      // Arrange
      const key = 'simple-delete';

      mockChromeStorage.get.mockResolvedValue({
        [key]: {
          data: '{"test": true}',
          compressed: false,
          chunked: false,
        },
      });

      mockChromeStorage.remove.mockResolvedValue(undefined);

      // Act
      await ChunkedStorage.deleteChunked(key);

      // Assert
      expect(mockChromeStorage.remove).toHaveBeenCalledWith(key);
      expect(mockChromeStorage.remove).toHaveBeenCalledTimes(1);
    });

    it('deve deletar metadados e todos os chunks', async () => {
      // Arrange
      const key = 'chunked-delete';

      mockChromeStorage.get.mockResolvedValue({
        [key]: {
          compressed: false,
          chunked: true,
          totalChunks: 3,
          totalSize: 1000,
        },
      });

      mockChromeStorage.remove.mockResolvedValue(undefined);

      // Act
      await ChunkedStorage.deleteChunked(key);

      // Assert
      expect(mockChromeStorage.remove).toHaveBeenCalledTimes(2);
      expect(mockChromeStorage.remove).toHaveBeenNthCalledWith(1, key);
      expect(mockChromeStorage.remove).toHaveBeenNthCalledWith(2, [
        `${key}_chunk_0`,
        `${key}_chunk_1`,
        `${key}_chunk_2`,
      ]);
    });

    it('deve retornar silenciosamente se item não existir', async () => {
      // Arrange
      const key = 'non-existent-delete';
      mockChromeStorage.get.mockResolvedValue({});

      // Act
      await ChunkedStorage.deleteChunked(key);

      // Assert
      expect(mockChromeStorage.remove).not.toHaveBeenCalled();
    });

    it('deve logar erro mas não lançar se deletar falhar', async () => {
      // Arrange
      const key = 'error-delete';
      const deleteError = new Error('Delete failed');

      mockChromeStorage.get.mockResolvedValue({
        [key]: { data: 'test', compressed: false, chunked: false },
      });

      mockChromeStorage.remove.mockRejectedValue(deleteError);

      // Act
      await ChunkedStorage.deleteChunked(key);

      // Assert
      expect(Logger.error).toHaveBeenCalledWith(
        'ChunkedStorage',
        expect.stringContaining('Erro ao deletar'),
        deleteError
      );
    });
  });

  describe('CHUNK_SIZE constante', () => {
    it('deve ter CHUNK_SIZE definido como 7168 bytes (7KB)', () => {
      // Assert
      expect(ChunkedStorage.CHUNK_SIZE).toBe(7168);
    });
  });
});
