# ADR 017: Jest isolateModulesAsync Pattern
Status: Aceito (v2.9.7) | Data: 2026-01-05

## Contexto
Módulos ES com variáveis de estado (`let domSafePolicy = null`) persistem entre testes, causando vazamento de estado, falsos positivos/negativos e necessidade de `.skip()`.

## Problema
```javascript
// TrustedTypesPolicy.js
let domSafePolicy = null;  // ← Persiste entre testes

export function initTrustedTypes() {
  domSafePolicy = trustedTypes.createPolicy(...);
}

// ❌ TESTE FALHA
it('deve retornar null antes de init', () => {
  const policy = getTrustedTypesPolicy();
  expect(policy).toBeNull();  // Falha se teste anterior chamou init
});
```

## Decisão
Adotar **`jest.isolateModulesAsync()`** como padrão para módulos com estado, conforme implementação em `background/tests/background.test.js`.

### Padrão Aprovado
```javascript
describe('Módulo com Estado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();  // Limpa cache
  });

  it('deve testar isoladamente', async () => {
    await jest.isolateModulesAsync(async () => {
      // Arrange
      global.apiMock = mockImplementation();
      
      // Act - Import DENTRO do isolate
      const { functionToTest } = await import('../Module.js');
      const result = functionToTest();
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Quando Usar
- Módulo tem variáveis de escopo (`let`, `const` fora de funções)
- Testes precisam verificar estado inicial limpo
- Módulo mantém singletons ou cache

### Quando NÃO Usar
- Módulo stateless (apenas funções puras)
- Testes de integração que QUEREM estado compartilhado

## Consequências
- **Positivo**: Isolamento perfeito, sem `.skip()`
- **Positivo**: Testes independentes da ordem de execução
- **Positivo**: Padrão já existente no projeto (`background.test.js`)
- **Negativo**: Performance (~10-20ms extra por teste)
- **Negativo**: Verbosidade (async/await + import dinâmico)
- **Limitação**: `typeof self` sempre `'object'` em Node.js (window context não testável)

## Exemplos

### TrustedTypesPolicy.test.js
```javascript
it('deve retornar null antes de init', async () => {
  await jest.isolateModulesAsync(async () => {
    const { getTrustedTypesPolicy } = await import('../TrustedTypesPolicy.js');
    expect(getTrustedTypesPolicy()).toBeNull();  // ✅ PASSA sempre
  });
});
```

### background.test.js (Referência)
```javascript
const loadScript = async () => {
  await jest.isolateModulesAsync(async () => {
    await import('../index.js');
  });
};
```

## Relacionado
- [Jest - isolateModulesAsync Docs](https://jestjs.io/docs/jest-object#jestisolateModulesAsync)
- Implementação: `background/tests/background.test.js`
- ISSUE-025: TrustedTypesPolicy test refactoring
- Thread #272-306: Por que `.skip()` não é aceitável
