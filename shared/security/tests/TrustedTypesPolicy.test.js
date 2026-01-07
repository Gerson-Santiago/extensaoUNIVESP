// @ts-nocheck
describe('TrustedTypesPolicy', () => {
  let originalTrustedTypes;
  let originalWindow;
  let originalSelf;
  let mockPolicy;
  let mockTrustedTypes;
  let consoleLogSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Limpar mocks
    jest.clearAllMocks();
    jest.resetModules();

    // Salvar referências originais
    originalTrustedTypes = global.trustedTypes;
    originalWindow = global.window;
    originalSelf = global.self;

    // Spies para console
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock do chrome.runtime
    // @ts-expect-error - Mock simplificado sem todas as propriedades runtime
    global.chrome = {
      runtime: {
        getURL: jest.fn((path) => `chrome-extension://test-id/${path}`),
      },
    };
  });

  afterEach(() => {
    // Restaurar valores originais
    global.trustedTypes = originalTrustedTypes;
    global.window = originalWindow;
    global.self = originalSelf;

    // Restaurar console
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('initTrustedTypes', () => {
    it('deve criar policy com sucesso quando trustedTypes API está disponível', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        mockPolicy = {
          createHTML: jest.fn(),
          createScriptURL: jest.fn(),
          createScript: jest.fn(),
        };

        mockTrustedTypes = {
          createPolicy: jest.fn((_name, _policy) => {
            // Simular criação de policy
            return mockPolicy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        // Act
        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Assert
        expect(mockTrustedTypes.createPolicy).toHaveBeenCalledWith(
          'dom-safe-policy',
          expect.objectContaining({
            createHTML: expect.any(Function),
            createScriptURL: expect.any(Function),
            createScript: expect.any(Function),
          })
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Trusted Types Policy "dom-safe-policy" active')
        );
      });
    });

    it('deve avisar quando trustedTypes API não está suportada', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        global.trustedTypes = undefined;

        // Act
        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Assert
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('Trusted Types API not supported')
        );
      });
    });

    it('deve avisar quando criação da policy falha', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        const createPolicyError = new Error('Policy already exists');

        mockTrustedTypes = {
          createPolicy: jest.fn().mockImplementation(() => {
            throw createPolicyError;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        // Act
        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Assert
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('Failed to create Trusted Types policy'),
          createPolicyError
        );
      });
    });
  });

  describe('createHTML', () => {
    it('deve bloquear e lançar erro para qualquer HTML', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        let policyFunctions;

        mockTrustedTypes = {
          createPolicy: jest.fn((name, policy) => {
            policyFunctions = policy;
            return policy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Act & Assert
        expect(() => {
          policyFunctions.createHTML('<div>test</div>');
        }).toThrow('Direct HTML injection is forbidden');

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('createHTML called blocked by policy'),
          '<div>test</div>'
        );
      });
    });

    it('deve bloquear string vazia também', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        let policyFunctions;

        mockTrustedTypes = {
          createPolicy: jest.fn((name, policy) => {
            policyFunctions = policy;
            return policy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Act & Assert
        expect(() => {
          policyFunctions.createHTML('');
        }).toThrow('Direct HTML injection is forbidden');
      });
    });
  });

  describe('createScriptURL', () => {
    it('deve permitir URLs da própria extensão (chrome.runtime.getURL)', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        let policyFunctions;
        const extensionUrl = 'chrome-extension://test-id/script.js';

        mockTrustedTypes = {
          createPolicy: jest.fn((name, policy) => {
            policyFunctions = policy;
            return policy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Act
        const result = policyFunctions.createScriptURL(extensionUrl);

        // Assert
        expect(result).toBe(extensionUrl);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });
    });

    it('deve bloquear URLs externas', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        let policyFunctions;
        const externalUrl = 'https://evil.com/malware.js';

        mockTrustedTypes = {
          createPolicy: jest.fn((name, policy) => {
            policyFunctions = policy;
            return policy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Act & Assert
        expect(() => {
          policyFunctions.createScriptURL(externalUrl);
        }).toThrow('Script URL source not allowed');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Script URL blocked'),
          externalUrl
        );
      });
    });

    it('deve bloquear URLs relativas não confiáveis', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        let policyFunctions;
        const relativeUrl = '/external/script.js';

        mockTrustedTypes = {
          createPolicy: jest.fn((name, policy) => {
            policyFunctions = policy;
            return policy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Act & Assert
        expect(() => {
          policyFunctions.createScriptURL(relativeUrl);
        }).toThrow('Script URL source not allowed');
      });
    });

    it('deve bloquear data: URLs', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        let policyFunctions;
        const dataUrl = 'data:text/javascript,alert(1)';

        mockTrustedTypes = {
          createPolicy: jest.fn((name, policy) => {
            policyFunctions = policy;
            return policy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Act & Assert
        expect(() => {
          policyFunctions.createScriptURL(dataUrl);
        }).toThrow('Script URL source not allowed');
      });
    });
  });

  describe('createScript', () => {
    it('deve sempre bloquear inline scripts', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        let policyFunctions;

        mockTrustedTypes = {
          createPolicy: jest.fn((name, policy) => {
            policyFunctions = policy;
            return policy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Act & Assert
        expect(() => {
          policyFunctions.createScript('alert("xss")');
        }).toThrow('Inline scripts are strictly forbidden');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Inline script execution blocked')
        );
      });
    });

    it('deve bloquear string vazia também', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        let policyFunctions;

        mockTrustedTypes = {
          createPolicy: jest.fn((name, policy) => {
            policyFunctions = policy;
            return policy;
          }),
        };

        global.trustedTypes = mockTrustedTypes;

        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Act & Assert
        expect(() => {
          policyFunctions.createScript('');
        }).toThrow('Inline scripts are strictly forbidden');
      });
    });
  });

  describe('getTrustedTypesPolicy', () => {
    it('deve retornar null antes de initTrustedTypes ser chamado', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange - Módulo fresco, domSafePolicy ainda é null
        const { getTrustedTypesPolicy } = await import('../TrustedTypesPolicy.js');

        // Act
        const policy = getTrustedTypesPolicy();

        // Assert
        expect(policy).toBeNull();
      });
    });

    it('deve retornar a policy após initTrustedTypes', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        mockPolicy = {
          createHTML: jest.fn(),
          createScriptURL: jest.fn(),
          createScript: jest.fn(),
        };

        mockTrustedTypes = {
          createPolicy: jest.fn(() => mockPolicy),
        };

        global.trustedTypes = mockTrustedTypes;

        // Act
        const { initTrustedTypes, getTrustedTypesPolicy } =
          await import('../TrustedTypesPolicy.js');
        initTrustedTypes();
        const policy = getTrustedTypesPolicy();

        // Assert
        expect(policy).toBe(mockPolicy);
      });
    });

    it('deve retornar null se trustedTypes API não é suportada', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        global.trustedTypes = undefined;

        // Act
        const { initTrustedTypes, getTrustedTypesPolicy } =
          await import('../TrustedTypesPolicy.js');
        initTrustedTypes();
        const policy = getTrustedTypesPolicy();

        // Assert
        expect(policy).toBeNull();
      });
    });
  });

  describe('Contexto de execução (self vs window)', () => {
    it('deve funcionar em Service Workers (global self)', async () => {
      await jest.isolateModulesAsync(async () => {
        // Arrange
        const mockSelf = {
          trustedTypes: {
            createPolicy: jest.fn(() => ({})),
          },
        };

        // @ts-expect-error - Mock de contexto Service Worker
        global.self = mockSelf;
        global.window = undefined;

        // Act
        const { initTrustedTypes } = await import('../TrustedTypesPolicy.js');
        initTrustedTypes();

        // Assert
        expect(mockSelf.trustedTypes.createPolicy).toHaveBeenCalled();
      });
    });

    // NOTA: Teste de window context não é possível em Node.js
    // porque typeof self !== 'undefined' sempre é verdadeiro no Node.js,
    // mesmo com global.self = undefined. O código funciona corretamente
    // em browsers onde typeof self pode retornar 'undefined'.
  });
});
