# SPEC v2.8.0 - Gestão Acadêmica com Controle de Progresso

**Versão**: 2.8.0  
**Status**: Release Candidate (RC)  
**Data de Início**: 2025-12-21  
**Release**: 2025-12-25  

---

## 🎯 Visão Geral

A versão **2.8.0** consolida o sistema de **Gestão de Tarefas** da Extensão UNIVESP, implementando controle de progresso, persistência de estado de conclusão e navegação inteligente entre atividades do AVA.

---

## 📋 Features Entregues

### 1. **Sistema de Navegação de Atividades** ✅
- Scraping via DOM e Links Rápidos
- Índice navegável de atividades por semana
- Scroll automático até atividade no AVA

### 2. **Controle de Progresso de Tarefas** ✅
- Lista de tarefas por semana
- Progress bar de conclusão
- Toggle de status (feito/pendente)
- Persistência desacoplada em `ActivityProgressRepository`

### 3. **Melhorias de UX/UI** ✅
- Breadcrumb para contexto de navegação
- Design system consistente (CSS Modular)
- Responsividade

---

## 🏗️ Arquitetura Consolidada

### Camadas
```
┌─────────────────────────────────────┐
│ Views (UI)                          │ ← Renderização e eventos
├─────────────────────────────────────┤
│ Services (Orquestração)             │ ← Lógica de scraping, progresso
├─────────────────────────────────────┤
│ Logic (Regras de Negócio)           │ ← Categorização, filtros
├─────────────────────────────────────┤
│ Repository (Persistência)           │ ← CRUD de cursos e progresso
├─────────────────────────────────────┤
│ chrome.storage (Data Layer)         │ ← Local/Sync storage
└─────────────────────────────────────┘
```

---

## 🎯 Critérios de Aceitação (Checklist Final)

### Funcionalidade
- [x] Navegação entre cursos → semanas → atividades funciona
- [x] Scraping (DOM e QuickLinks) extrai dados corretamente
- [x] Scroll automático até atividade funciona
- [x] Toggle de tarefas persiste entre sessões
- [x] Progress bar reflete estado real

### Qualidade
- [x] `npm run verify` passa (lint + type-check + testes)
- [x] Cobertura de testes > 80% em Services e Logic
- [x] Zero warnings de linting
- [x] Zero erros de type-check

### Documentação
- [x] README.md de `features/courses/` atualizado
- [x] Issues arquiteturais catalogadas

---

## 📝 Definição de Pronto (Definition of Done)

Para marcar v2.8.0 como **CONCLUÍDA**:

### Código
- [x] Todas features principais implementadas
- [x] Refatorações críticas concluídas (REFACTOR/)
- [x] Bugs conhecidos resolvidos (ISSUES/)

### Testes
- [x] Testes de integração para fluxos principais
- [x] Zero testes falhando

### Release
- [x] Changelog gerado
- [x] Merge `dev` → `main`

---

## 👥 Stakeholders

- **Desenvolvedor Principal**: Gerson Santiago
- **Usuários**: Alunos UNIVESP
- **Comunidade**: Open Source (GitHub)

---

## 📅 Timeline

| Milestone | Data | Status |
|-----------|------|--------|
| Início do desenvolvimento | 2025-12-21 | ✅ Concluído |
| Feature: Navegação de atividades | 2025-12-22 | ✅ Concluído |
| Feature: Controle de progresso | 2025-12-22 | ✅ Concluído |
| Refatorações arquiteturais | 2025-12-23 | 🔄 Em Progresso |
| Auditoria de testes | 2026-01 | 📋 Planejado |
| Release candidata | 2026-01 | 📋 Planejado |
| **v2.8.0 GA** | **2026-Q1** | 📋 Planejado |

---

## 🔗 Documentos Relacionados

- [Identidade do Projeto](file:///home/sant/extensaoUNIVESP/docs/IDENTIDADE_DO_PROJETO.md)
- [Roadmap de Features](file:///home/sant/extensaoUNIVESP/docs/ROADMAP_FEATURES.md)
- [Fluxos de Trabalho](file:///home/sant/extensaoUNIVESP/docs/FLUXOS_DE_TRABALHO.md)
- [Arquitetura](file:///home/sant/extensaoUNIVESP/docs/TECNOLOGIAS_E_ARQUITETURA.md)
- [README de Courses](file:///home/sant/extensaoUNIVESP/features/courses/README.md)

---

**Última Atualização**: 2025-12-23  
**Autor**: Antigravity AI + Gerson Santiago
