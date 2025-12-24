# EPIC 2: Débito Técnico e Qualidade

**Status**: 🏗️ Em Progresso  
**Prioridade**: Média  
**Owner**: Equipe de Engenharia  

---

## 🎯 Objetivo

Resolver **débitos técnicos** acumulados relacionados a:
- Estrutura de dados fragmentada
- Estado duplicado (breadcrumb)
- Cobertura de testes insuficiente

---

## 📋 Escopo

### Problema

O projeto possui **inconsistências estruturais** que dificultam evolução:
- Dados de progresso fragmentados (`completed`, `status`, `done`)
- Breadcrumb duplicado em múltiplos objetos
- Gaps de cobertura de testes não mapeados

---

## 🗂️ Issues Incluídas

### 1. ✅ [TECH_DEBT-unificar-estrutura-progresso.md](file:///home/sant/extensaoUNIVESP/.github/TECH_DEBT/TECH_DEBT-unificar-estrutura-progresso.md)

**Status**: ✅ **CONCLUÍDO** (2025-12-24)

**Solução Implementada**:
- ✅ Modelo `ActivityProgress` criado
- ✅ `ActivityProgressRepository` com namespace separado
- ✅ `TaskProgressService` refatorado
- ✅ `CourseWeekTasksView` migrada
- ✅ `Week.js` limpo (`completed` removido)

**Resultado**: 
- 332/334 testes passando (99.4%)
- +586 LOC, -147 LOC
- Branch merged: `feat/unified-progress-model`

**Impacto Real**: ~440 LOC  
**Tempo Real**: ~6 horas

---

### 2. [TECH_DEBT-breadcrumb-estado-global.md](file:///home/sant/extensaoUNIVESP/.github/TECH_DEBT/TECH_DEBT-breadcrumb-estado-global.md)

**Problema**: Breadcrumb duplicado (`week.courseName`)

**Análise de opções**:
1. Estado local com limpeza (curto prazo)
2. Router Context centralizado (médio prazo) ⭐
3. Computed property via getter

**Impacto**: Variável (POC necessário)  
**Estimativa**: 2-3 horas

---

### 3. [TECH_DEBT-cobertura-testes-courses.md](file:///home/sant/extensaoUNIVESP/.github/TECH_DEBT/TECH_DEBT-cobertura-testes-courses.md)

**Problema**: Gaps de cobertura não mapeados

**Plano**:
- Gerar coverage report
- Identificar gaps críticos
- Criar issues por gap

**Componentes não testados**:
- `WeekItem.js`
- `CourseRefresher.js`
- `TaskCategorizer.js`

**Impacto**: ~390 LOC (testes)  
**Estimativa**: 3-4 horas (análise)

---

## 🎁 Benefícios

- ✅ **Modelo único de dados**: Facilita manutenção
- ✅ **Sem duplicação**: Estado consistente
- ✅ **Alta cobertura**: Confiança para refatorar
- ✅ **Preparado para futuro**: Sync com AVA, exportação

---

## ✅ Critérios de Aceitação

- [x] `ActivityProgress` modelo criado e documentado ✅
- [x] Repository implementado com namespace separado ✅
- [x] Tests com > 99% passing ✅
- [ ] Breadcrumb: decisão arquitetural tomada (ADR)
- [ ] Coverage > 80% em `features/courses/`
- [ ] Relatório de auditoria gerado
- [ ] Todos gaps críticos com issues criadas

---

## 📊 Progresso

```
[████████░░] 80% - Issue 1 concluída!
```

**Concluído**: 1/3 issues ✅  
**Em análise**: 2/3 issues  
**Total estimado**: 5-7 horas restantes

---

## 🔗 Dependências

- Unificação de progresso → Depende de EPIC 1 (Services)
- Breadcrumb → Pode ser feito independentemente
- Cobertura → Bloqueia refatorações seguras

---

**Criado em**: 2025-12-23  
**Relacionado a**: [SPEC-v2.8.0.md](file:///home/sant/extensaoUNIVESP/.github/SPEC-v2.8.0.md)
