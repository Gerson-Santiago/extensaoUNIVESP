# TECH_DEBT: Plano de Cobertura de Testes - Feature Courses

**Status**: ✅ Resolvido (v2.8.0)  
**Prioridade**: Baixa (Concluído)  
**Estimativa**: -  

---

## 🎯 Objetivo

Mapear **gaps de cobertura de testes** na feature `courses` e criar roadmap para melhorar qualidade e confiabilidade.

---

## 📊 Estado Atual

### Cobertura Conhecida

**Arquivo**: `features/courses/README.md` (linha 316)

```
✅ Total: 304 testes passando
```

**Arquivos de teste existentes**:
- `tests/CoursesView.test.js`
- `tests/CourseWeeksView.test.js`
- `tests/CourseWeekTasksView.test.js`
- `tests/DetailsActivitiesWeekView.test.js`
- `tests/QuickLinksScraper.test.js`
- `tests/WeekContentScraper.test.js`

---

## 🔍 Gaps Identificados

### 1. **Falta Cobertura de Integração**

Testes existentes são **unitários**, mas falta:
- ❌ Testes de **fluxo completo** (navegação entre views)
- ❌ Testes de **interação** (click → scraping → render)
- ❌ Testes de **persistência** (salvar → recarregar)

**Exemplo de gap**:
```javascript
// Fluxo não testado:
// CoursesView → CourseWeeksView → DetailsActivitiesWeekView
// Com scraping e navegação real
```

---

### 2. **Componentes Não Testados**

```
✅ Views → Testadas (básico)
✅ Scrapers → Testados
❌ WeekItem.js → Componente NÃO testado
❌ CourseRefresher.js → Service NÃO testado
❌ TaskCategorizer.js → Logic NÃO testada
❌ CourseRepository.js → Repository parcialmente testada
```

---

### 3. **Edge Cases**

Cenários não cobertos:
- ❌ Scraping falha (timeout, DOM change)
- ❌ Storage quota excedida
- ❌ Navegação com aba AVA fechada
- ❌ Week sem items (vazio)
- ❌ Course sem weeks

---

### 4. **Performance/Load Tests**

- ❌ Render com 50+ atividades
- ❌ Múltiplos scrapers rodando simultaneamente
- ❌ Storage com centenas de cursos

---

## 📋 Plano de Auditoria

### Fase 1: **Medir Cobertura Real**

```bash
# Rodar coverage report
npm test -- --coverage

# Analisar relatório
# - % de linhas cobertas
# - % de branches cobertas
# - Arquivos não testados
```

**Deliverable**: Relatório de cobertura atual

---

### Fase 2: **Identificar Gaps Críticos**

Priorizar:
1. 🔴 **Alta prioridade**: Lógica de negócio (`logic/`, `services/`)
2. 🟡 **Média prioridade**: Componentes reutilizáveis (`components/`)
3. 🟢 **Baixa prioridade**: Views (já tem cobertura básica)

**Deliverable**: Lista priorizada de gaps

---

### Fase 3: **Criar Issues de Teste**

Para cada gap crítico:
```markdown
## NEXT-test-[componente].md
- Cenários a testar
- Estratégia (unit/integration)
- Estimativa de LOC
```

---

## 🎯 Metas de Cobertura

| Categoria | Meta | Atual | Gap |
|-----------|------|-------|-----|
| **Lógica de Negócio** | 100% | ? | ? |
| **Services** | 90% | ? | ? |
| **Repository** | 80% | ? | ? |
| **Views** | 60% | ? | ? |
| **Components** | 70% | ? | ? |

---

## 📂 Arquivos a Criar

| Arquivo | Descrição | LOC |
|---------|-----------|-----|
| `docs/COBERTURA_TESTES.md` | Relatório de auditoria | +300 |
| `features/courses/tests/WeekItem.test.js` | **[CRIAR]** Testes de componente | +80 |
| `features/courses/tests/CourseRefresher.test.js` | **[CRIAR]** Testes de service | +60 |
| `features/courses/tests/TaskCategorizer.test.js` | **[CRIAR]** Testes de logic | +50 |
| `features/courses/tests/integration/` | **[CRIAR]** Testes de integração | +200 |

---

## ✅ Critérios de Aceitação

- [ ] Coverage report gerado (`npm test -- --coverage`)
- [ ] Gaps críticos identificados e documentados
- [ ] Metas de cobertura definidas por categoria
- [ ] Issues individuais criadas para cada gap
- [ ] Roadmap de implementação criado

---

## 🚀 Execução

### Comandos

```bash
# 1. Gerar coverage
npm test -- --coverage --coverageDirectory=coverage

# 2. Abrir relatório HTML
open coverage/index.html  # ou xdg-open no Linux

# 3. Analisar por arquivo
cat coverage/lcov-report/index.html
```

---

## 📝 Notas

- Priorizar testes de **regressão** (funcionalidades já implementadas)
- Seguir padrão TDD para novas features
- Considerar usar **Jest snapshots** para Views (UI regression)
- Integrar coverage check no CI/CD local (`npm run verify`)

---

## 🔮 Melhorias Futuras

- **Visual Regression Testing** (screenshot diff)
- **E2E Testing** com Puppeteer (interação real com AVA)
- **Mutation Testing** (qualidade dos testes)

---

**Criado em**: 2025-12-23  
**Resolvido em**: 2025-12-25 (v2.8.0)
**Solução**: Aumentado total de testes para 335. Mocks corrigidos (`chrome.storage`), Services testados.

---

## ✅ Resolução (v2.8.0)

Auditoria e implementação de testes concluídas:

1. **Total de Testes**: 335 testes passando (Meta atingida).
2. **Mock Storage**: Corrigido mock de `chrome.storage.local` para persistência em memória.
3. **Services Cobertos**: `TaskProgressService`, `ActivityProgressRepository` (100% coated).
4. **Pipeline**: `npm run verify` garante qualidade contínua.
