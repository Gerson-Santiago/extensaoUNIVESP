# 📁 Documentação de Issues - v2.8.0

Esta pasta contém toda a documentação para implementação da feature de Gestão de Tarefas Semanais (v2.8.0).

---

## 📋 Índice de Arquivos

### 🎯 Visão Geral
- **[EPIC-v2.8.0-gestao-tarefas.md](EPIC-v2.8.0-gestao-tarefas.md)** - Epic principal com visão geral, métricas e Definition of Done
- **[ISSUES-SUMMARY.md](ISSUES-SUMMARY.md)** - Resumo de todas as 9 issues e status

### 📝 Issues Detalhadas

#### Fase 1: Foundation
- **[ISSUE-001-week-model-status.md](ISSUE-001-week-model-status.md)** - Estender Week.js com status (1h)
- **[ISSUE-002-week-content-scraper.md](ISSUE-002-week-content-scraper.md)** - Scraping AVA (4h) 🔴 CRÍTICO
- **[ISSUE-003-week-tasks-view.md](ISSUE-003-week-tasks-view.md)** - WeekTasksView básica (3h)

#### Fase 2: UI & Preview
- **[ISSUE-004-week-item-button.md](ISSUE-004-week-item-button.md)** - Botão [Tarefas] (2h)
- **[ISSUE-005-mini-preview.md](ISSUE-005-mini-preview.md)** - Mini preview visual (3h)
- **[ISSUE-006-css-styles.md](ISSUE-006-css-styles.md)** - Estilos CSS (1h)

#### Fase 3: Avançado
- **[ISSUE-007-calc-progresso.md](ISSUE-007-calc-progresso.md)** - Cálculo de progresso (2h)
- **[ISSUE-008-error-handling.md](ISSUE-008-error-handling.md)** - Error handling com Toaster (2h)
- **[ISSUE-009-testes-integracao.md](ISSUE-009-testes-integracao.md)** - Testes de integração (3h)

### 🚀 Guias de Implementação
- **[IMPLEMENTATION-CHECKLIST.md](IMPLEMENTATION-CHECKLIST.md)** - Checklist detalhado para tracking de progresso
- **[QUICK-START-v2.8.0.md](QUICK-START-v2.8.0.md)** - Guia rápido para começar Issue #001

---

## 🎯 Como Usar Esta Documentação

### 1️⃣ Para Planejamento
Leia primeiro:
1. `EPIC-v2.8.0-gestao-tarefas.md` - Entender o objetivo geral
2. `ISSUES-SUMMARY.md` - Ver distribuição de esforço

### 2️⃣ Para Implementação
Siga esta ordem:
1. `QUICK-START-v2.8.0.md` - Como começar
2. `ISSUE-00X-*.md` - Detalhes de cada issue
3. `IMPLEMENTATION-CHECKLIST.md` - Marcar progresso

### 3️⃣ Para Revisão
Validar:
- [ ] Todas as checkboxes em `IMPLEMENTATION-CHECKLIST.md`
- [ ] Definition of Done do Epic atendida
- [ ] 207+ testes passando

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Total de Issues** | 9 |
| **Esforço Estimado** | 21 horas |
| **Fases** | 3 (Foundation → UI → Avançado) |
| **Categoria** | 🏆 CORE |
| **Módulo** | `features/courses/` |

---

## 🏗️ Estrutura da Implementação

```
features/courses/
├── models/
│   └── Week.js              (#001 - adicionar status)
├── services/
│   └── WeekContentScraper.js (#002 - scraping AVA)
├── views/
│   ├── CourseWeeksView/     (#005 - mini preview)
│   └── CourseWeekTasksView/ (#003, #007, #008 - view principal)
├── components/
│   └── WeekItem.js          (#004 - botão Tarefas)
└── tests/                   (#009 - testes integração)

assets/styles/
├── views/
│   └── week-tasks.css       (#006 - estilos)
└── components/
    └── week-item.css        (#006 - estilos)
```

---

## ✅ Padrões de Qualidade

Todas as issues seguem:
- ✅ **TDD**: RED → GREEN → REFACTOR
- ✅ **Testes**: Cobertura ≥90%
- ✅ **Lint**: Zero warnings
- ✅ **Type-check**: Zero erros
- ✅ **Commits**: Semânticos em PT-BR
- ✅ **Branch**: Uma por issue

---

## 🔗 Referências

### Documentação do Projeto
- [SPEC v2.8.0](../docs/specs/SPEC-v2.8.0_GESTAO_ACADEMICA.md)
- [.cursorrules](../.cursorrules)
- [FLUXOS_DE_TRABALHO.md](../docs/FLUXOS_DE_TRABALHO.md)
- [_CATEGORIES.md](../features/_CATEGORIES.md)

### Ferramentas
- [Jest](https://jestjs.io/) - Framework de testes
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Formatação
- [TypeScript (JSDoc)](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) - Type-checking

---

## 📞 Dúvidas?

1. Consulte a issue específica
2. Veja exemplos em código existente (`features/courses/`)
3. Revise a SPEC v2.8.0
4. Siga workflows em `.agent/workflows/`

---

**Status**: 🟡 Em Desenvolvimento (5/9 issues completas)  
**Branch**: `dev`  
**Última atualização**: 2025-12-22  
**Progresso**: 55.5% | Fase 1: ✅ | Fase 2: 🟡 | Fase 3: ⏳
