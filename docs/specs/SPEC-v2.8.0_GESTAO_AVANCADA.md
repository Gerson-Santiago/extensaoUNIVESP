# SPEC v2.8.0: Gestão Avançada de Tarefas Acadêmicas

> **Versão**: v2.8.0  
> **Status**: Em Progresso (Issue #010: 95%)  
> **Última Atualização**: 22/12/2025

---

## Visão Geral

Expansão do sistema de gestão de tarefas semanais com funcionalidades avançadas de visualização, exportação e análise de progresso acadêmico.

### Objetivos de Negócio
1. Facilitar navegação entre atividades com scroll automático
2. Permitir exportação de dados para análise externa
3. Oferecer filtros e visualizações personalizadas
4. Fornecer estatísticas de progresso acadêmico
5. Alertar sobre tarefas pendentes

---

## Issues da Epic v2.8.0

### Issue #010: DetailsActivitiesWeekView ✅ (Quase Completo)
**Status**: 95% Completo  
**Prioridade**: Alta  
**Estimativa**: 8h (7.5h gastas)

#### Descrição
Índice navegável de atividades com scroll automático para elementos no AVA.

####  Critérios de Aceitação
- [x] Lista atividades na ordem DOM original
- [x] Ícones visuais por tipo (Videoaula, Quiz, etc.)
- [x] Botão [Ir →] faz scroll até elemento no AVA
- [x] Highlight visual temporário (2s)
- [x] Testes unitários (11/11 passando - 100% cobertura)
- [x] Botão [Ver Atividades] em CourseWeeksView
- [ ] Navegação end-to-end funcionando (falta integrar router)

#### Arquivos Implementados
- ✅ `features/courses/logic/TaskCategorizer.js`
- ✅ `features/courses/tests/TaskCategorizer.test.js`
- ✅ `features/courses/views/DetailsActivitiesWeekView/index.js`
- ✅ `features/courses/tests/DetailsActivitiesWeekView.test.js`
- ✅ `features/courses/components/WeekItem.js` (modificado)
- ✅ `features/courses/views/CourseWeeksView/index.js` (modificado)

---

### Issue #011: Exportar Tarefas (CSV/JSON)
**Status**: Planejado  
**Prioridade**: Média  
**Estimativa**: 4h

---

### Issue #012: Filtros de Atividades
**Status**: Planejado  
**Prioridade**: Média  
**Estimativa**: 6h

---

### Issue #013: Estatísticas de Progresso
**Status**: Planejado  
**Prioridade**: Baixa  
**Estimativa**: 8h

---

### Issue #014: Notificações de Tarefas Pendentes
**Status**: Planejado  
**Prioridade**: Baixa  
**Estimativa**: 5h

---

## Roadmap de Desenvolvimento

### Fase 1: Core Navigation (Atual - Semana 1)
- [x] Issue #010: DetailsActivitiesWeekView (95% - falta router)

### Fase 2: Data Management (Semana 2)
- [ ] Issue #011: Exportação CSV/JSON
- [ ] Issue #012: Filtros

### Fase 3: Analytics (Semana 3)
- [ ] Issue #013: Estatísticas
- [ ] Issue #014: Notificações
