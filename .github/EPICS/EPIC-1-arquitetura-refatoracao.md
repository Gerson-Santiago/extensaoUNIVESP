# EPIC 1: Arquitetura e Refatoração

**Status**: ✅ Concluído  
**Prioridade**: Alta  
**Owner**: Equipe de Engenharia  

---

## 🎯 Objetivo

Resolver **violações de princípios arquiteturais** (SRP, separação de camadas) na feature `courses`, melhorando manutenibilidade e testabilidade do código.

---

## 📋 Escopo

### Problema

As Views atuais possuem **múltiplas responsabilidades**, misturando:
- Renderização de UI
- Orquestração de serviços (scraping)
- Persistência de dados

**Consequências**:
- ❌ Dificulta testes (mocking complexo)
- ❌ Viola Single Responsibility Principle (SRP)
- ❌ Acoplamento excessivo entre camadas

---

## 🗂️ Issues Incluídas

### 1. [REFACTOR-desacoplar-scraping-view.md](file:///home/sant/extensaoUNIVESP/.github/REFACTOR/REFACTOR-desacoplar-scraping-view.md) (✅ Concluído)

**Problema**: `CourseWeeksView` gerencia scraping de conteúdo

**Solução**:
- Criar `WeekActivitiesService` para orquestrar scraping
- View apenas renderiza e delega para Service

**Impacto**: ~125 LOC  
**Estimativa**: 4-6 horas

---

### 2. [REFACTOR-persistencia-courseweektasksview.md](file:///home/sant/extensaoUNIVESP/.github/REFACTOR/REFACTOR-persistencia-courseweektasksview.md) (✅ Concluído)

**Problema**: `CourseWeekTasksView` salva direto em `CourseRepository`

**Solução**:
- Criar `TaskProgressService` para gerenciar persistência
- View delega toggle/save para Service

**Impacto**: ~162 LOC  
**Estimativa**: 2-3 horas

---

## 🎁 Benefícios

| Antes | Depois |
|-------|--------|
| Views conhecem Repository | Views conhecem apenas Services |
| Lógica de negócio na UI | Lógica em Services (testável) |
| Acoplamento alto | Baixo acoplamento |
| Difícil testar | Fácil testar com mocks |

---

## ✅ Critérios de Aceitação

- [x] Todas Views delegam lógica para Services
- [x] Services testados isoladamente (WeekActivitiesService, TaskProgressService)
- [x] Views testadas com mocks de Services (CourseWeeksView.test.js, CourseWeekTasksView.test.js)
- [x] Comportamento externo preservado (Green-Green Refactor)
- [x] `npm run verify` passa

---

## 📊 Progresso

```
[████████████████████] 100%
```

**Concluído**: 2/2 issues ✅  
**Total realizado**: ~8 horas  
**Data de conclusão**: 2025-12-23

---

## 🔗 Dependências

- Requer testes verdes antes de refatorar
- Bloqueia implementação de features futuras (checkbox em DetailsActivities)

---

**Criado em**: 2025-12-23  
**Concluído em**: 2025-12-23  
**Relacionado a**: [SPEC-v2.8.0.md](file:///home/sant/extensaoUNIVESP/.github/SPEC-v2.8.0.md)
