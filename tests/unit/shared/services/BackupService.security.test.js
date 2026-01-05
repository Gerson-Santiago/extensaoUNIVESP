// AAA Pattern Test for BackupService (Security Layer)
import { BackupService } from '../../../../shared/services/BackupService.js';
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;

// Mock global chrome object
global.chrome = {
  storage: {
    // @ts-expect-error - Partial mock with only needed methods
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
  },
  // @ts-expect-error - Partial mock with only needed methods
  downloads: { download: jest.fn() },
  // @ts-expect-error - Partial mock with only needed methods
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
      const mockDigest = jest.fn().mockResolvedValueOnce(new Uint8Array([1, 2, 3]).buffer);
      global.crypto.subtle.digest = mockDigest;

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
