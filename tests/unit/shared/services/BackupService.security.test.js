// @ts-nocheck
const { BackupService } = require('../../../../shared/services/BackupService');
const { TextEncoder } = require('util');
global.TextEncoder = TextEncoder;

// Mock global chrome object
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
  },
  downloads: { download: jest.fn() },
  runtime: { getManifest: jest.fn() },
};

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn(),
    },
  },
  writable: true,
});

describe('BackupService (Security)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('importData (Integrity Check)', () => {
    it('should fail if checksum is missing', async () => {
      const invalidPayload = JSON.stringify({
        meta: { version: '2.10.0', schemaVersion: 1 }, // No checksum
        data: { foo: 'bar' },
      });

      const result = await BackupService.importData(invalidPayload);
      expect(result.success).toBe(false);
      // Integrity failure message
      expect(result.error).toMatch(/integridade|checksum/i);
    });

    it('should fail if checksum does not match (Tampered Data)', async () => {
      // Mock crypto to return a hash that DOES NOT match the payload's checksum
      // Calculated: 010203...
      // Payload has: 'original-hash'
      global.crypto.subtle.digest.mockResolvedValueOnce(new Uint8Array([1, 2, 3]).buffer);

      const tamperedPayload = JSON.stringify({
        meta: { version: '2.10.0', schemaVersion: 1, checksum: 'original-hash' },
        data: { foo: 'bar-tampered' },
      });

      const result = await BackupService.importData(tamperedPayload);
      expect(result.success).toBe(false);
      // Data corruption message
      expect(result.error).toMatch(/corrompido|mismatch/i);
    });
  });
});
