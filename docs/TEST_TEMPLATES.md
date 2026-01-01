# 📋 Templates de Testes Oficiais

Este documento identifica os **testes exemplares** do projeto que devem ser usados como referência.

## ✅ Templates Aprovados

### 1. **Testes Unitários de Utilidades**
- **Arquivo**: [`shared/utils/tests/DomUtils.test.js`](../shared/utils/tests/DomUtils.test.js)
- **Cobertura**: 100%
- **Destaques**: AAA explícito, mocks corretos de DOM, edge cases

### 2. **Testes com APIs Web e Polyfills**
- **Arquivo**: [`shared/utils/tests/CompressionUtils.test.js`](../shared/utils/tests/CompressionUtils.test.js)
- **Cobertura**: 100%
- **Destaques**: Polyfills (TextEncoder), mocks globais (Response), fallbacks

### 3. **Testes de Lógica de Negócio Pura**
- **Arquivo**: [`features/courses/logic/tests/CourseStructure.test.js`](../features/courses/logic/tests/CourseStructure.test.js)
- **Destaques**: Funções puras, casos abrangentes, zero mocks

### 4. **Testes de Integração (Service Layer)**
- **Arquivo**: [`features/courses/services/tests/CourseRefresher.integration.test.js`](../features/courses/services/tests/CourseRefresher.integration.test.js)
- **Destaques**: Fluxo end-to-end, fixtures reais, error handling

---

## 📖 Convenções Obrigatórias

### Nomenclatura
```javascript
describe('ModuleName', () => {
  describe('functionName', () => {
    it('deve [ação esperada] quando [condição]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Checklist Pré-Commit
- [ ] Estrutura AAA explícita?
- [ ] Nomenclatura em português?
- [ ] Mocks seguem [`ANTI_PADROES.md`](./ANTI_PADROES.md)?
- [ ] Testa sucesso E falha?
- [ ] Cobertura > 90%?

---

## 🎯 Template Executável (Copiar & Colar)

**Arquivo**: [`TEST_TEMPLATE_EXAMPLE.js.template`](./TEST_TEMPLATE_EXAMPLE.js.template)

Este arquivo contém exemplos práticos prontos para copiar:
1. Testes unitários com AAA explícito
2. Testes com mocks DOM
3. Testes com polyfills JSDOM
4. Testes de integração

**Uso**: Copie o conteúdo e renomeie para `.test.js`

---

**Referência ADR**: [`ADR-000-C`](../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)

**Última Atualização**: 2026-01-01
