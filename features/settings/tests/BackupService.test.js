import { BackupService } from '../services/BackupService.js';

// Mock chrome global
/* @type {any} */
const mockChrome = {
  storage: {
    local: {
      clear: jest.fn(),
      set: jest.fn(),
    },
  },
};
global.chrome = /** @type {any} */ (mockChrome);

// Mock Logger para não poluir output
jest.mock('../../../shared/utils/Logger.js', () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('BackupService - Schema Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve importar com sucesso um backup válido', async () => {
    const validJson = JSON.stringify({
      meta: {
        version: '1.0.0',
        date: '2026-01-01T00:00:00.000Z',
      },
      data: {
        someKey: 'someValue',
      },
    });

    const result = await BackupService.importData(validJson);
    expect(result.success).toBe(true);
    expect(chrome.storage.local.clear).toHaveBeenCalled();
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ someKey: 'someValue' });
  });

  test('Deve rejeitar JSON inválido (SyntaxError)', async () => {
    const invalidJson = '{ bad json ';
    await expect(BackupService.importData(invalidJson)).rejects.toThrow(
      'Arquivo não é um JSON válido'
    );
  });

  test('Deve rejeitar backup faltando "meta"', async () => {
    const noMeta = JSON.stringify({
      data: {},
    });
    await expect(BackupService.importData(noMeta)).rejects.toThrow('hierarquia inválida');
  });

  test('Deve rejeitar backup faltando "data"', async () => {
    const noData = JSON.stringify({
      meta: { version: '1.0' },
    });
    await expect(BackupService.importData(noData)).rejects.toThrow('hierarquia inválida');
  });

  test('Deve rejeitar versão inválida (não string)', async () => {
    const badVersion = JSON.stringify({
      meta: { version: 123 }, // number
      data: {},
    });
    await expect(BackupService.importData(badVersion)).rejects.toThrow('versão inválida');
  });
});
