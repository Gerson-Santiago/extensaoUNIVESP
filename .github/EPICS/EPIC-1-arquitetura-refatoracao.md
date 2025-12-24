# EPIC 1: Arquitetura e Refatoração

**Status**: 🔧 Em Progresso  
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

### 1. [REFACTOR-desacoplar-scraping-view.md](file:///home/sant/extensaoUNIVESP/.github/REFACTOR/REFACTOR-desacoplar-scraping-view.md)

**Problema**: `CourseWeeksView` gerencia scraping de conteúdo

**Solução**:
- Criar `WeekActivitiesService` para orquestrar scraping
- View apenas renderiza e delega para Service

**Impacto**: ~125 LOC  
**Estimativa**: 4-6 horas

---

### 2. [REFACTOR-persistencia-courseweektasksview.md](file:///home/sant/extensaoUNIVESP/.github/REFACTOR/REFACTOR-persistencia-courseweektasksview.md)

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

- [ ] Todas Views delegam lógica para Services
- [ ] Services testados isoladamente (100% cobertura)
- [ ] Views testadas com mocks de Services
- [ ] Comportamento externo preservado (Green-Green Refactor)
- [ ] `npm run verify` passa

---

## 📊 Progresso

```
[██░░░░░░░░] 20%
```

**Concluído**: 0/2 issues  
**Em progresso**: 0/2 issues  
**Total estimado**: 6-9 horas

---

## 🔗 Dependências

- Requer testes verdes antes de refatorar
- Bloqueia implementação de features futuras (checkbox em DetailsActivities)

---

**Criado em**: 2025-12-23  
**Relacionado a**: [SPEC-v2.8.0.md](file:///home/sant/extensaoUNIVESP/.github/SPEC-v2.8.0.md)
