/**
 * @file shared/utils/tests/Logger.test.js
 * @description Testes para o sistema de Logger
 */

import { Logger } from '../Logger.js';

describe('Logger', () => {
  let consoleLogSpy;
  let consoleInfoSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;
  let localStorageMock;

  beforeEach(() => {
    // Arrange: Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Arrange: Mock localStorage
    localStorageMock = {
      getItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isEnabled', () => {
    it('deve retornar true quando UNIVESP_DEBUG está ativo', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('true');

      // Act
      const result = Logger.isEnabled();

      // Assert
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('UNIVESP_DEBUG');
    });

    it('deve retornar false quando UNIVESP_DEBUG não está ativo', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('false');

      // Act
      const result = Logger.isEnabled();

      // Assert
      expect(result).toBe(false);
    });

    it('deve retornar false se localStorage lançar erro', () => {
      // Arrange
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage não disponível');
      });

      // Act
      const result = Logger.isEnabled();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('debug', () => {
    it('deve logar quando debug está habilitado', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('true');

      // Act
      Logger.debug('TestNamespace', 'Test message', { foo: 'bar' });

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TestNamespace]'),
        'Test message',
        { foo: 'bar' }
      );
    });

    it('NÃO deve logar quando debug está desabilitado', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('false');

      // Act
      Logger.debug('TestNamespace', 'Test message');

      // Assert
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('deve logar sem data quando não fornecido', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('true');

      // Act
      Logger.debug('TestNamespace', 'Test message');

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TestNamespace]'),
        'Test message'
      );
    });
  });

  describe('info', () => {
    it('deve sempre logar independente do debug', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('false');

      // Act
      Logger.info('TestNamespace', 'Info message', { data: 123 });

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith('[TestNamespace]', 'Info message', { data: 123 });
    });
  });

  describe('warn', () => {
    it('deve logar warning', () => {
      // Act
      Logger.warn('TestNamespace', 'Warning message', { issue: 'test' });

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith('[TestNamespace]', 'Warning message', {
        issue: 'test',
      });
    });
  });

  describe('error', () => {
    it('deve logar erro com objeto Error', () => {
      // Arrange
      const error = new Error('Test error');

      // Act
      Logger.error('TestNamespace', 'Error occurred', error);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('[TestNamespace]', 'Error occurred', error);
    });
  });

  // TODO: Adicionar testes de measure após verificar ambiente de teste
  // describe('measure', () => {
  //   ...
  // });
});
