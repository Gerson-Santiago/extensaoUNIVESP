# Templates de Teste (Oficiais)

[[README](README.md)] | [[Padrões](PADROES.md)] | [[Exemplo Executável](TEST_TEMPLATE_EXAMPLE.js.template)]

### 1. Estrutura AAA
```javascript
describe('Contexto', () => {
  it('comportamento esperado', async () => {
    // Arrange: Setup (mocks, dados)
    // Act: Execução
    // Assert: Validação
  });
});
```

### 2. Regras de Ouro
- Mocks: Use mocks parciais. Se envolver DOM, use jsdom.
- Nomenclatura: Escreva descrições em Português Brasileiro.
- Async: Sempre use async/await para testes de serviços ou repositories.
- Limpeza: Use beforeEach/afterEach para resetar estados e mocks.

### 3. Exemplos Comuns
- Unitário: Lógica pura em features/*/logic/.
- Integração: Orquestradores I/O (I/O borders mocks).
- DOM: Testes de renderers e factories.

[Ver Template Completo](TEST_TEMPLATE_EXAMPLE.js.template)
---
[README](README.md)
