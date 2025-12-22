# SPEC v2.8.0: Gestão Avançada de Tarefas Acadêmicas

> **Versão**: v2.8.0  
> **Status**: Em Progresso  
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

### Issue #010: DetailsActivitiesWeekView ✅ (Em Progresso)
**Status**: 85% Completo  
**Prioridade**: Alta  
**Estimativa**: 8h

#### Descrição
Índice navegável de atividades com scroll automático para elementos no AVA.

#### Critérios de Aceitação
- [x] Lista atividades na ordem DOM original
- [x] Ícones visuais por tipo (Videoaula, Quiz, etc.)
- [x] Botão [Ir →] faz scroll até elemento no AVA
- [x] Highlight visual temporário (2s)
- [x] Testes unitários (>80% cobertura)
- [ ] Botão [Ver Atividades] em CourseWeeksView
- [ ] Navegação end-to-end funcionando

---

### Issue #011: Exportar Tarefas (CSV/JSON)
**Status**: Planejado  
**Prioridade**: Média  
**Estimativa**: 4h

---

### Issue #012: Filtros de Atividades
**Status**: Plan

ejado  
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
- [x] Issue #010: DetailsActivitiesWeekView (85%)

### Fase 2: Data Management (Semana 2)
- [ ] Issue #011: Exportação CSV/JSON
- [ ] Issue #012: Filtros

### Fase 3: Analytics (Semana 3)
- [ ] Issue #013: Estatísticas
- [ ] Issue #014: Notificações
