# ADR-013: Jest isolateModulesAsync Pattern
**Status**: Aceito (v2.9.7) | **Data**: 2026-01-05

## Problema
Módulos ES com variáveis de estado (`let domSafePolicy = null`) persistem entre testes, causando vazamento de estado, falsos positivos/negativos e necessidade de `.skip()`.

Exemplo do problema:
```javascript
// TrustedTypesPolicy.js
let domSafePolicy = null;  // ← Persiste entre testes

// ❌ Teste falha se teste anterior chamou init
it('deve retornar null antes de init', () => {
  expect(getTrustedTypesPolicy()).toBeNull();  // Falha!
});
```

## Solução
Adotar **`jest.isolateModulesAsync()`** como padrão para módulos com estado:

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

## Trade-offs
- ✅ **Benefícios**: Isolamento perfeito (sem `.skip()`), testes independentes da ordem, padrão já existente no projeto (`background.test.js`)
- ⚠️ **Riscos**: Performance (~10-20ms extra/teste), verbosidade (async/await + import dinâmico), limitação (`typeof self` sempre `'object'` em Node.js)

## Refs
- [Jest isolateModulesAsync Docs](https://jestjs.io/docs/jest-object#jestisolateModulesAsync)
- `background/tests/background.test.js` - Implementação de referência
- ISSUE-025 - TrustedTypesPolicy test refactoring

