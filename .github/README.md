# 📋 .github - Gestão de Projeto

**Versão**: v2.8.8  
**Última atualização**: 2025-12-27

---

## 📂 Estrutura

```
.github/
├── ADR/           ← Architecture Decision Records (decisões técnicas)
├── EPICS/         ← Meta-categorias de organização (sempre ativas)
├── FEATURE/       ← Features implementadas (histórico)
├── ISSUES/        ← Bugs ATIVOS
├── RESOLVED/      ← Bugs RESOLVIDOS (histórico)
├── REFACTOR/      ← Refatorações planejadas
├── TECH_DEBT/     ← Débitos técnicos catalogados
└── ARCHIVED/      ← Documentação obsoleta
```

---

## 🎯 Status Atual

### 🐛 Bugs Ativos
- [`BUG-botao-abrir-materia.md`](ISSUES/BUG-botao-abrir-materia.md) - Em investigação

### ✅ Bugs Resolvidos
- [`BUG-navegacao-abas.md`](RESOLVED/BUG-navegacao-abas.md) - Resolvido (Tabs.js refatorado)
- [`BUG-fechar-listador-de-atividades-do-site.md`](RESOLVED/BUG-fechar-listador-de-atividades-do-site.md) - Implementado (DomUtils.ensureModalClosed)

### ✨ Features Implementadas
- [`FEATURE-checkbox-conclusao.md`](FEATURE/FEATURE-checkbox-conclusao.md) - Sistema de progresso (v2.8.0)
- [`FEATURE-chips-navegacao-contextual.md`](FEATURE/FEATURE-chips-navegacao-contextual.md) - Navegação contextual

### 🔧 Débitos Técnicos
- [`ISSUE-console-cleanup.md`](TECH_DEBT/ISSUE-console-cleanup.md) - Limpeza de console statements
- [`TECH_DEBT-breadcrumb-estado-global.md`](TECH_DEBT/TECH_DEBT-breadcrumb-estado-global.md) - Estado de navegação
- [`TECH_DEBT-cobertura-testes-courses.md`](TECH_DEBT/TECH_DEBT-cobertura-testes-courses.md) - Cobertura de testes
- [`TECH_DEBT-unificar-estrutura-progresso.md`](TECH_DEBT/TECH_DEBT-unificar-estrutura-progresso.md) - Unificar repositórios

### 📐 Refatorações Planejadas
- [`REFACTOR-modernizacao-es2024.md`](REFACTOR/REFACTOR-modernizacao-es2024.md) - Baixa prioridade

### 📦 Refatorações Concluídas (Arquivadas)
- [`REFACTOR-desacoplar-scraping-view.md`](ARCHIVED/REFACTOR-desacoplar-scraping-view.md) - WeekActivitiesService
- [`REFACTOR-persistencia-courseweektasksview.md`](ARCHIVED/REFACTOR-persistencia-courseweektasksview.md) - TaskProgressService


### 🎯 Decisões Arquiteturais (ADRs)
- [`ADR-001: Console Cleanup`](ADR/ADR-001-tech-debt-console-cleanup.md) - Priorização de TECH_DEBT

---

## 📖 EPICs (Meta-Categorias)

> **Nota**: EPICs são categorias organizacionais **sempre ativas** (nunca "concluídas").

1. **EPIC-1**: Arquitetura e Refatoração
2. **EPIC-2**: Débito Técnico e Qualidade
3. **EPIC-3**: Features - Gestão de Tarefas
4. **EPIC-4**: Bugs e Estabilidade
5. **EPIC-5**: Documentação e Conhecimento

Detalhes: [EPICS/README.md](EPICS/README.md)

---

## 🗂️ Convenções

### Nomenclatura
- `ADR-XXX-*.md` - Architecture Decision Records
- `BUG-*.md` - Bugs identificados
- `FEATURE-*.md` - Features implementadas
- `REFACTOR-*.md` - Refatorações planejadas
- `TECH_DEBT-*.md` - Débitos técnicos

### Status
- 🐛 Bug Ativo
- ✅ Resolvido/Implementado
- 🔧 Débito Técnico Catalogado
- 📋 Planejado

---

**Auditoria**: 2025-12-27 (Limpeza radical - docs obsoletas arquivadas)
