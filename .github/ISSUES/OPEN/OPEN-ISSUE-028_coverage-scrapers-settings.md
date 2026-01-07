# ISSUE-028: Cobertura de Testes - Scrapers & Settings

**Tipo**: Test Coverage Enhancement  
**Prioridade**: Média  
**Status**: Aberta  
**Versão Alvo**: v2.9.8  
**Criada**: 2026-01-05  
**Relacionada**: ISSUE-025 (2/5 componentes concluídos)

---

## Contexto

Esta issue complementa a **ISSUE-025**, que alcançou 100% de cobertura em 2 componentes críticos (ChunkedStorage e TrustedTypesPolicy), mas deixou 3 componentes com cobertura insuficiente.

**Componentes já concluídos (ISSUE-025)**:
- ✅ ChunkedStorage: 53.75% → **100%**
- ✅ TrustedTypesPolicy: 40% → **100%**

---

## Objetivo

Aumentar cobertura de testes dos **3 componentes restantes** para >80%, eliminando "pontos cegos" em scrapers e configurações.

### Metas de Cobertura

| Componente | Atual | Meta | Delta |
|------------|-------|------|-------|
| **QuickLinksScraper** | 48.05% | >80% | +31.95% |
| **SettingsController** | 41.11% | >85% | +43.89% |
| **BatchScraper** | 67.41% | >85% | +17.59% |

---

## Escopo Técnico

### 1. QuickLinksScraper (PRIORIDADE 1)
**Arquivo**: `features/courses/services/QuickLinksScraper.js`  
**Cobertura Atual**: 48.05% statements, 80% branches

**Gaps Identificados**:
- Função `extractFromModal`: Linhas 52-53 não cobertas
- Processamento de diferentes formatos de links: Linhas 71-148 não cobertas
- Cenários de erro e validação

**Ações**:
- [  ] Criar/expandir `tests/QuickLinksScraper.test.js`
- [ ] Testar `extractFromModal` com diferentes estruturas DOM
- [ ] Testar parsing de URLs (links relativos, absolutos, inválidos)
- [ ] Testar edge cases (modal sem links, links duplicados)
- [ ] Mock de DOM/elementos (`document.querySelector`)

---

### 2. SettingsController (PRIORIDADE 2)
**Arquivo**: `features/settings/logic/SettingsController.js`  
**Cobertura Atual**: 41.11% statements, 100% branches

**Gaps Identificados**:
- `loadSettings`: Linhas 22-30 não cobertas
- `saveSettings`: Linhas 37-59 não cobertas
- `resetSettings`: Linhas 65-85 não cobertas

**Ações**:
- [ ] Expandir `tests/SettingsController.test.js` (se existe) ou criar
- [ ] Testar `loadSettings` (success, storage vazio, erro)
- [ ] Testar `saveSettings` (validação, merge com defaults, quota exceeded)
- [ ] Testar `resetSettings` (limpar storage, restaurar defaults)
- [ ] Mock de `chrome.storage.sync`

---

### 3. BatchScraper (PRIORIDADE 3)
**Arquivo**: `features/courses/import/services/BatchScraper/index.js`  
**Cobertura Atual**: 67.41% statements, 67.5% branches

**Gaps Identificados**:
- Cenários de erro: Linhas 320-419, 428, 443 não cobertas
- Variações de `parseCourseTerm`
- Batch scraping completo com múltiplos cursos

**Ações**:
- [ ] Expandir `tests/BatchScraper.test.js` existente
- [ ] Cobrir `parseCourseTerm` (todos os semestres/bimestres)
- [ ] Testar batch scraping (success, partial failure, total failure)
- [ ] Testar retry logic e error handling
- [ ] Mock de `QuickLinksScraper`, `ScraperService`

---

## Requisitos Técnicos

### Padrões Obrigatórios
- ✅ TDD Red-Green-Refactor
- ✅ Padrão AAA (Arrange-Act-Assert) em PT-BR
- ✅ JSDoc completo em todos os testes
- ✅ Fixtures HTML reais quando aplicável
- ✅ Padrão `jest.isolateModulesAsync()` se módulo tiver estado (conforme ADR-017)

### Quality Gates
- [ ] `npm run lint` - ZERO warnings
- [ ] `npm run type-check` - ZERO erros
- [ ] `npm run test:quick` - todos passando
- [ ] **Solicitar usuário**: `npm run test:coverage` - validar metas
- [ ] **Solicitar usuário**: `npm run verify` - 100% passing

---

## Critérios de Aceitação

### Obrigatório
1. ✅ QuickLinksScraper: >80% statements e >90% branches
2. ✅ SettingsController: >85% statements e 100% branches
3. ✅ BatchScraper: >85% statements e >80% branches
4. ✅ Todos os testes seguem padrão AAA em PT-BR
5. ✅ JSDoc completo em todos os testes
6. ✅ quality gates VERDES (`lint`, `type-check`, `verify`)

### Desejável
- Cobertura global do projeto: >87%
- Redução de code smells em cenários de erro
- Documentação de edge cases encontrados

---

## Estimativa de Esforço

- **QuickLinksScraper**: ~2h (criar testes do zero, fixtures DOM)
- **SettingsController**: ~1.5h (expandir testes, mock storage)
- **BatchScraper**: ~1h (expandir testes existentes, error scenarios)
- **QA & Ajustes**: ~30min

**Total**: ~5h de desenvolvimento

---

## Relacionado

- **ISSUE-025**: Componentes 1-2 (ChunkedStorage, TrustedTypesPolicy) - ✅ Concluído
- **ADR-017**: Padrão `jest.isolateModulesAsync()` para ES modules com estado
- **ADR-000-C**: Padrão AAA Testing (obrigatório)
- **Cobertura Baseline**: `docs/history_coverage/coverage-2.9.7-baseline.md`

---

## Notas de Implementação

### Fixtures Recomendados
```javascript
// QuickLinksScraper - fixture DOM
const mockModalHTML = `
  <div class="modal">
    <a href="https://ava.univesp.br/course/123">Curso 1</a>
    <a href="/relative/course/456">Curso 2</a>
  </div>
`;
```

### Mock Pattern - chrome.storage.sync
```javascript
beforeEach(() => {
  global.chrome = {
    storage: {
      sync: {
        get: jest.fn(),
        set: jest.fn(),
        clear: jest.fn(),
      },
    },
  };
});
```

---

**Criada por**: Antigravity AI  
**Branch sugerida**: `feat/issue-028-coverage-scrapers-settings`
