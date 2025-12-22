# Epic: Gestão de Tarefas Semanais v2.8.0

## 📋 Visão Geral

Adicionar sistema de visualização de tarefas acadêmicas por semana, lendo status diretamente do AVA (Revisto/Marca Revista).

**Categoria**: 🏆 CORE  
**Módulo**: `features/courses/`  
**Prioridade**: Alta  
**MVP**: Sim

---

## 🎯 Objetivo de Negócio

Permitir que estudantes visualizem o progresso de tarefas semanais sem precisar navegar no AVA toda vez.

**Métricas de Sucesso**:
- [x] Mini preview funcional com status visual
- [x] View completa de tarefas responsiva
- [x] 100% cobertura de testes em logic/
- [x] Zero warnings (lint + type-check)

---

## 📦 Issues Relacionadas

Este Epic se divide em **3 fases incrementais**:

### Fase 1: Foundation (MVP Mínimo)
- #1 - Estender model Week.js com status
- #2 - Adicionar WeekContentScraper (scraping AVA)
- #3 - Criar CourseWeekTasksView básica

### Fase 2: UI & Preview
- #4 - Adicionar botão [Tarefas] em WeekItem
- #5 - Implementar mini preview em CourseWeeksView
- #6 - Adicionar estilos CSS (week-tasks.css)

### Fase 3: Funcionalidades Avançadas
- #7 - Adicionar cálculo de progresso
- #8 - Implementar error handling com Toaster
- #9 - Adicionar testes de integração

---

## 🚧 Risco e Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| DOM do AVA mudar | Médio | Alto | Testes mockando estrutura DOM |
| Scraping lento | Médio | Médio | Lazy loading + feedback visual |
| Storage cheio | Baixo | Médio | Error handling + Toaster |

---

## 📚 Documentação de Referência

- [SPEC v2.8.0](docs/specs/SPEC-v2.8.0_GESTAO_ACADEMICA.md)
- [Screaming Architecture](docs/TECNOLOGIAS_E_ARQUITETURA.md)
- [FLUXOS_DE_TRABALHO.md](docs/FLUXOS_DE_TRABALHO.md)
- [_CATEGORIES.md](features/_CATEGORIES.md)

---

## ✅ Definition of Done (Epic)

- [/] Todas as 9 issues fechadas (6/9 completas - 66.7%)
- [x] `npm test` - All Passing (252/252)
- [x] `npm run lint` - Zero Warnings
- [x] `npm run type-check` - Zero Errors
- [ ] Documentação atualizada (CHANGELOG.md)
- [ ] Piloto com 3+ usuários realizado
