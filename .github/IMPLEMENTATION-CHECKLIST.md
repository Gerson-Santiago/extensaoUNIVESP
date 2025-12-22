# 📋 Checklist de Implementação v2.8.0

Este arquivo serve como guia de execução para as 9 issues do Epic v2.8.0.

---

## 🎯 Objetivo
Implementar sistema de gestão de tarefas semanais seguindo abordagem MVP-First com TDD rigoroso.

---

## 📊 Progresso Geral

- [ ] Fase 1: Foundation (0/3)
- [ ] Fase 2: UI & Preview (0/3)
- [ ] Fase 3: Avançado (0/3)

**Total**: 0/9 issues concluídas (0%)

---

## 🚀 Fase 1: Foundation

### ✅ Issue #001: Week.js com Status (1h)
**Branch**: `feat/issue-001-week-model`
- [x] Criar branch a partir de dev
- [x] RED: Criar teste Week.test.js
- [x] GREEN: Adicionar typedef com status
- [x] REFACTOR: Validar type-check
- [x] Commit: `feat(courses): adiciona status aos items de Week`
- [x] Merge para dev

**Workflow**: `/nova-feature`

---

### 🔴 Issue #002: WeekContentScraper (4h) - CRÍTICO
**Branch**: `feat/issue-002-week-content-scraper`
- [x] Criar branch a partir de dev
- [x] RED: Criar testes WeekContentScraper.test.js
- [x] GREEN: Implementar classe WeekContentScraper
- [x] GREEN: Método extractItemsFromDOM()
- [x] GREEN: Método detectType()
- [x] REFACTOR: Error handling
- [x] Validar cobertura ≥90% (97.75% ✅)
- [x] Commit: `feat(courses): adiciona WeekContentScraper para scraping AVA`
- [ ] Merge para dev

**Workflow**: `/nova-feature`
**Atenção**: Mock chrome.scripting.executeScript

---

### ✅ Issue #003: CourseWeekTasksView (3h)
**Branch**: `feat/issue-003-week-tasks-view`
- [x] Criar branch a partir de dev
- [x] RED: Criar testes CourseWeekTasksView.test.js
- [x] GREEN: Implementar classe CourseWeekTasksView
- [x] GREEN: Métodos render() e afterRender()
- [x] GREEN: Método renderTasks()
- [x] GREEN: Empty state
- [x] REFACTOR: CSS inline temporário
- [x] Validar cobertura ≥90%
- [x] Commit: `feat(courses): adiciona CourseWeekTasksView básica`
- [x] Merge para dev

**Workflow**: `/nova-feature`

---

## 🎨 Fase 2: UI & Preview

### ✅ Issue #004: Botão [Tarefas] (2h)
**Branch**: `feat/issue-004-week-item-button`
- [x] Criar branch a partir de dev
- [x] RED: Atualizar testes WeekItem.test.js
- [x] GREEN: Adicionar botão em WeekItem.js
- [x] GREEN: Implementar stopPropagation
- [x] GREEN: Callback onViewTasks
- [ ] Adicionar CSS .btn-tasks
- [x] Commit: `feat(courses): adiciona botão Tarefas em WeekItem`
- [x] Merge para dev

**Workflow**: `/nova-feature`

---

### ✅ Issue #005: Mini Preview (3h)
**Branch**: `feat/issue-005-mini-preview`
- [ ] Criar branch a partir de dev
- [ ] RED: Criar testes CourseWeeksView.test.js
- [ ] GREEN: Adicionar div #activeWeekPreview
- [ ] GREEN: Método showPreview()
- [ ] GREEN: Renderização de ícones e %
- [ ] GREEN: Integração com WeekContentScraper
- [ ] Error handling com Toaster
- [ ] Adicionar CSS .week-preview
- [ ] Commit: `feat(courses): adiciona mini preview em CourseWeeksView`
- [ ] Merge para dev

**Workflow**: `/nova-feature`

---

### 🎨 Issue #006: Estilos CSS (1h)
**Branch**: `feat/issue-006-css-styles`
- [ ] Criar branch a partir de dev
- [ ] Criar week-tasks.css
- [ ] Modificar courses.css (adicionar .week-preview)
- [ ] Criar/modificar week-item.css
- [ ] Validar responsividade
- [ ] Validar acessibilidade (WCAG contraste)
- [ ] Commit: `style(courses): adiciona estilos para CourseWeekTasksView`
- [ ] Merge para dev

**Workflow**: Simples (sem testes)

---

## 🔧 Fase 3: Avançado

### ✅ Issue #007: Cálculo de Progresso (2h)
**Branch**: `feat/issue-007-calc-progresso`
- [ ] Criar branch a partir de dev
- [ ] RED: Testes calculateProgress()
- [ ] GREEN: Implementar método
- [ ] GREEN: Integrar no render()
- [ ] GREEN: Atualizar barra visual
- [ ] Validar fórmula (DONE=100%, DOING=50%)
- [ ] Cobertura 100%
- [ ] Commit: `feat(courses): adiciona cálculo de progresso em CourseWeekTasksView`
- [ ] Merge para dev

**Workflow**: `/nova-feature`

---

### 🛡️ Issue #008: Error Handling (2h)
**Branch**: `feat/issue-008-error-handling`
- [ ] Criar branch a partir de dev
- [ ] RED: Testes mockando erros
- [ ] GREEN: Try/catch em scrapeWeekContent()
- [ ] GREEN: Try/catch em showPreview()
- [ ] GREEN: Try/catch em loadWeekTasks()
- [ ] GREEN: Método showEmptyState()
- [ ] GREEN: Integração com Toaster
- [ ] Commit: `feat(courses): adiciona error handling com Toaster`
- [ ] Merge para dev

**Workflow**: `/nova-feature`

---

### 🧪 Issue #009: Testes de Integração (3h)
**Branch**: `feat/issue-009-testes-integracao`
- [ ] Criar branch a partir de dev
- [ ] Criar navigation.test.js (fluxo completo)
- [ ] Criar scraping-storage.test.js
- [ ] Criar mini-preview.test.js
- [ ] Validar cobertura ≥90% em features/courses/
- [ ] Validar todos os mocks de chrome.*
- [ ] Commit: `test(courses): adiciona testes de integração v2.8.0`
- [ ] Merge para dev

**Workflow**: `/nova-feature`

---

## 🏁 Finalização do Epic

- [ ] Todas as 9 issues fechadas
- [ ] `npm test` - All Passing (207+ testes)
- [ ] `npm run lint` - Zero Warnings
- [ ] `npm run type-check` - Zero Errors
- [ ] Cobertura ≥90% em features/courses/
- [ ] Atualizar CHANGELOG.md
- [ ] Merge dev → main via `/release-prod`
- [ ] Tag v2.8.0
- [ ] Piloto com 3+ usuários

---

## 📚 Comandos Úteis

```bash
# Criar branch para issue
git switch dev
git pull origin dev
git switch -c feat/issue-001-week-model

# Validar antes de commit
npm test
npm run lint
npm run type-check

# Commit e merge
git add .
git commit -m "feat(courses): descrição"
git switch dev
git merge feat/issue-001-week-model
git push origin dev
git branch -d feat/issue-001-week-model

# Release (após todas as issues)
/release-prod
```

---

## 🎯 Ordem Recomendada de Execução

1. #001 (Week.js) → Base de dados
2. #002 (Scraper) → Fonte de dados
3. #003 (CourseWeekTasksView) → Visualização básica
4. #004 (Botão) → Acesso à view
5. #006 (CSS) → Estilização
6. #005 (Preview) → Feature extra
7. #007 (Progresso) → Cálculo
8. #008 (Errors) → Robustez
9. #009 (Testes) → Validação final

---

**Meta**: 21h de desenvolvimento, ~3 semanas (1h/dia)
