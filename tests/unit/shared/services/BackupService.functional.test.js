// AAA Pattern Test for BackupService (Functional Layer)
import { BackupService } from '../../../../shared/services/BackupService.js';
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;

// Mock global chrome object
global.chrome = {
  storage: {
    // @ts-expect-error - Mock parcial: apenas métodos necessários
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
  },
  downloads: {
    // @ts-expect-error - Mock de assinatura de callback não corresponde overloads
    download: jest.fn((options, callback) => callback && callback(123)),
  },
  runtime: {
    // @ts-expect-error - Mock retorna Manifest parcial
    getManifest: jest.fn(() => ({ version: '2.10.0' })),
  },
};

// Mock crypto needed even for functional part because exportData calls it
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
  writable: true,
});

// @ts-expect-error - Mock parcial: apenas métodos necessários para teste
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mock-url'),
  revokeObjectURL: jest.fn(),
};

// @ts-expect-error - Mock parcial: apenas propriedades necessárias para teste
global.Blob = class {
  constructor(content, options) {
    this.content = content;
    this.options = options;
  }
};

describe('BackupService (Functional)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportData', () => {
    it('should export all data with metadata', async () => {
      // Arrange
      const mockData = { courses: { 1: { id: 1 } }, settings: { density: 'compact' } };
      // @ts-expect-error - Jest mock method
      chrome.storage.local.get.mockResolvedValue(mockData);

      const realDate = Date.now;
      global.Date.now = jest.fn(() => 1735689600000); // Fixed timestamp

      // Act
      await BackupService.exportData();

      // Assert
      expect(chrome.storage.local.get).toHaveBeenCalledWith(null);

      // Verify Blob creation and content
      expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
      // @ts-expect-error - Jest mock internal property
      const blob = global.URL.createObjectURL.mock.calls[0][0];

      expect(blob).toBeInstanceOf(global.Blob);
      expect(blob.options).toEqual({ type: 'application/json' });

      const jsonString = blob.content[0];
      const exported = JSON.parse(jsonString);

      // We expect checksum field to be present (generated), but we don't validate its security properties here.
      // We just ensure the structure is correct.
      expect(exported).toEqual({
        data: mockData,
        meta: {
          version: '2.10.0',
          exportedAt: '2025-01-01T00:00:00.000Z',
          schemaVersion: 1,
          checksum: expect.any(String),
        },
      });

      // Verify Download trigger
      expect(chrome.downloads.download).toHaveBeenCalledTimes(1);

      // Restore Date
      global.Date.now = realDate;
    });
  });

  describe('importData (Functional)', () => {
    it('should successfully import valid data', async () => {
      // Arrange
      // We need a valid checksum for the functional test to pass (since security check is always on)
      // But we mock the generation to return X, and put X in the payload.
      const mockHashBuffer = new Uint8Array([0xaa, 0xbb]).buffer;
      // @ts-expect-error - Jest mock method
      global.crypto.subtle.digest.mockResolvedValue(mockHashBuffer);
      const expectedHash = 'aabb'; // Hex of [0xaa, 0xbb]

      const validJson = JSON.stringify({
        meta: { version: '2.9.0', schemaVersion: 1, checksum: expectedHash },
        data: { courses: { 2: { id: 2 } } },
      });

      // Act
      const result = await BackupService.importData(validJson);

      // Assert
      expect(result.success).toBe(true);
      expect(chrome.storage.local.clear).toHaveBeenCalled();
      expect(chrome.storage.local.set).toHaveBeenCalledWith({ courses: { 2: { id: 2 } } });
    });

    it('should reject invalid json string', async () => {
      const result = await BackupService.importData('invalid-json-{');
      expect(result.success).toBe(false);
      expect(result.error).toContain('JSON incompleto');
      expect(chrome.storage.local.set).not.toHaveBeenCalled();
    });

    it('should reject missing data key', async () => {
      const invalidSchema = JSON.stringify({ meta: {} });
      const result = await BackupService.importData(invalidSchema);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Esquema inválido');
      expect(chrome.storage.local.set).not.toHaveBeenCalled();
    });
  });
});
