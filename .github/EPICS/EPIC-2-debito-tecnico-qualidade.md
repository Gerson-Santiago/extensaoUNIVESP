# EPIC 2: Débito Técnico e Qualidade

**Status**: 📊 Análise  
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

### 1. [TECH_DEBT-unificar-estrutura-progresso.md](file:///home/sant/extensaoUNIVESP/.github/TECH_DEBT/TECH_DEBT-unificar-estrutura-progresso.md)

**Problema**: Estrutura de progresso fragmentada entre Views

**Solução**:
- Criar modelo `ActivityProgress` unificado
- Repository separado para progresso
- Namespace próprio no storage

**Impacto**: ~325 LOC  
**Estimativa**: 4-6 horas

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

- [ ] `ActivityProgress` modelo criado e documentado
- [ ] Breadcrumb: decisão arquitetural tomada (ADR)
- [ ] Coverage > 80% em `features/courses/`
- [ ] Relatório de auditoria gerado
- [ ] Todos gaps críticos com issues criadas

---

## 📊 Progresso

```
[░░░░░░░░░░] 0%
```

**Concluído**: 0/3 issues  
**Em análise**: 3/3 issues  
**Total estimado**: 9-13 horas

---

## 🔗 Dependências

- Unificação de progresso → Depende de EPIC 1 (Services)
- Breadcrumb → Pode ser feito independentemente
- Cobertura → Bloqueia refatorações seguras

---

**Criado em**: 2025-12-23  
**Relacionado a**: [SPEC-v2.8.0.md](file:///home/sant/extensaoUNIVESP/.github/SPEC-v2.8.0.md)
