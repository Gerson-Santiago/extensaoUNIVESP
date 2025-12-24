# SPEC v2.8.0 - Gestão Acadêmica com Controle de Progresso

**Versão**: 2.8.0  
**Status**: Em Desenvolvimento  
**Data de Início**: 2025-12-21  
**Previsão de Release**: 2026-Q1  

---

## 🎯 Visão Geral

A versão **2.8.0** consolida o sistema de **Gestão de Tarefas** da Extensão UNIVESP, implementando controle de progresso, persistência de estado de conclusão e navegação inteligente entre atividades do AVA.

### Objetivo Estratégico

Transformar a extensão em uma **ferramenta completa de acompanhamento acadêmico**, permitindo ao aluno:
- ✅ Visualizar todas as atividades de forma estruturada
- ✅ Marcar progresso de conclusão
- ✅ Navegar rapidamente entre conteúdos
- ✅ Ter visibilidade clara do que falta fazer

---

## 📋 Escopo da Release

### Features Principais

#### 1. **Sistema de Navegação de Atividades** ✅
**Status**: Implementado

- Scraping via DOM e Links Rápidos
- Índice navegável de atividades por semana
- Scroll automático até atividade no AVA
- Cache inteligente de conteúdo

**Arquivos**:
- `features/courses/services/QuickLinksScraper.js`
- `features/courses/services/WeekContentScraper.js`
- `features/courses/views/DetailsActivitiesWeekView/`

---

#### 2. **Controle de Progresso de Tarefas** ✅
**Status**: Implementado (básico)

- Lista de tarefas por semana
- Progress bar de conclusão
- Toggle de status (feito/pendente)
- Persistência no `chrome.storage`

**Arquivos**:
- `features/courses/views/CourseWeekTasksView/`
- `features/courses/repository/CourseRepository.js`

**Limitações conhecidas**:
- Estrutura de dados fragmentada (`completed` vs `status`)
- Acoplamento View ↔ Repository

---

#### 3. **Melhorias de UX/UI** 🔄
**Status**: Em Progresso

- Breadcrumb para contexto de navegação
- Design system consistente
- Responsividade
- Indicadores visuais de método de scraping

**Issues relacionadas**:
- `NEXT-CSS-details-activities.md`

---

### Refatorações Arquiteturais 🔧

Esta release também endereça **débito técnico** acumulado:

#### EPIC 1: Separação de Responsabilidades
- Desacoplar scraping de Views
- Extrair persistência para Services
- Implementar Repository Pattern adequadamente

**Issues**:
- `REFACTOR-desacoplar-scraping-view.md`
- `REFACTOR-persistencia-courseweektasksview.md`

---

#### EPIC 2: Unificação de Estrutura de Dados
- Modelo único de progresso (`ActivityProgress`)
- Namespace separado para progresso no storage
- Preparação para sync com AVA

**Issues**:
- `TECH_DEBT-unificar-estrutura-progresso.md`
- `TECH_DEBT-breadcrumb-estado-global.md`

---

#### EPIC 3: Qualidade e Cobertura
- Auditoria de testes
- Documentação técnica (Chrome APIs)
- Melhoria de cobertura de testes

**Issues**:
- `TECH_DEBT-cobertura-testes-courses.md`
- `NEXT-doc-chrome-tabs-api.md`

---

## 🏗️ Arquitetura

### Princípios da v2.8.0

1. **Screaming Architecture**: Estrutura reflete domínio de negócio
2. **Local-First**: Dados nunca saem da máquina do usuário
3. **TDD**: Testes guiam desenvolvimento
4. **Separation of Concerns**: Views não gerenciam dados

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

## 📊 Estrutura de Dados

### Course
```javascript
{
  id: "LET100",
  name: "Inglês - LET100",
  url: "https://ava.univesp.br/course/view.php?id=123",
  weeks: Week[]
}
```

### Week
```javascript
{
  name: "Semana 1",
  url: "https://ava.univesp.br/course/view.php?id=123&content=1",
  items: Activity[],
  method: 'QuickLinks' | 'DOM',
  courseName: string  // ← Para breadcrumb (a ser refatorado)
}
```

### Activity (Atual)
```javascript
{
  name: "Videoaula 1 - Introdução",
  id: "anonymous_element_9",
  url: "https://ava.univesp.br/...",
  type: "document",
  completed: boolean  // ← A ser migrado para ActivityProgress
}
```

### ActivityProgress (Proposto - v2.8.1+)
```javascript
{
  activityId: "LET100_semana1_anonymous_element_9",
  status: 'TODO' | 'DOING' | 'DONE',
  markedByUser: boolean,
  completedInAVA: boolean,
  lastUpdated: timestamp
}
```

---

## 🎯 Critérios de Aceitação da Release

### Funcionalidade
- [ ] Navegação entre cursos → semanas → atividades funciona
- [ ] Scraping (DOM e QuickLinks) extrai dados corretamente
- [ ] Scroll automático até atividade funciona
- [ ] Toggle de tarefas persiste entre sessões
- [ ] Progress bar reflete estado real

### Qualidade
- [ ] `npm run verify` passa (lint + type-check + testes)
- [ ] Cobertura de testes > 80% em Services e Logic
- [ ] Zero warnings de linting
- [ ] Zero erros de type-check

### Documentação
- [ ] README.md de `features/courses/` atualizado
- [ ] Chrome Tabs API documentada
- [ ] Issues arquiteturais catalogadas

---

## 🚧 Trabalho em Progresso

### Implementado ✅
1. Navegação entre views (CoursesView → CourseWeeksView → DetailsActivitiesWeekView)
2. Scraping dual (DOM + QuickLinks)
3. Scroll automático com highlight
4. Sistema básico de progresso
5. Persistência em `chrome.storage`

### Em Desenvolvimento 🔄
1. Refatoração de Views (SRP)
2. Unificação de estrutura de dados
3. CSS consistente com Design System
4. Cobertura de testes de integração

### Planejado 📋
1. Sincronização com AVA (scraping de status real)
2. Checkbox de conclusão em DetailsActivitiesWeekView
3. Export/import de progresso
4. Analytics de produtividade

---

## 📂 Estrutura de Arquivos (Relevante)

```
features/courses/
├── views/
│   ├── CoursesView/              ← Lista de matérias
│   ├── CourseWeeksView/          ← Semanas de uma matéria
│   ├── CourseWeekTasksView/      ← Tarefas filtradas
│   └── DetailsActivitiesWeekView/ ← Índice de atividades
├── services/
│   ├── QuickLinksScraper.js      ← Scraping via modal
│   ├── WeekContentScraper.js     ← Scraping via DOM
│   └── CourseRefresher.js        ← Atualização de cursos
├── logic/
│   └── TaskCategorizer.js        ← Classificação de atividades
├── repository/
│   └── CourseRepository.js       ← CRUD de cursos
└── tests/                        ← 304 testes
```

---

## 🐛 Issues Conhecidas

Ver `.github/ISSUES/`:
- `BUG-navegacao-abas.md` - Reuso incorreto de abas entre matérias
- `BUG-botao-abrir-materia.md` - Botão falha com aba de semana aberta

---

## 🔮 Roadmap Pós-v2.8.0

### v2.8.1 (Consolidação)
- Resolver todos REFACTOR/ e TECH_DEBT/
- Atingir 90%+ de cobertura de testes
- Documentação completa da API Chrome

### v2.9.0 (Gestão de Notas)
- Scraping de boletim
- Projeção de médias
- Alertas de risco de reprovação

### v3.0.0 (Gamificação)
- Sistema de XP
- Conquistas
- Progresso global

---

## 📝 Definição de Pronto (Definition of Done)

Para marcar v2.8.0 como **CONCLUÍDA**, todos os critérios abaixo devem ser satisfeitos:

### Código
- [x] Todas features principais implementadas
- [ ] Refatorações críticas concluídas (REFACTOR/)
- [ ] Bugs conhecidos resolvidos (ISSUES/)

### Testes
- [ ] Cobertura > 80% em `features/courses/`
- [ ] Testes de integração para fluxos principais
- [ ] Zero testes falhando

### Qualidade
- [ ] `npm run verify` passa sem warnings
- [ ] Documentação técnica completa
- [ ] Issues arquiteturais catalogadas

### Release
- [ ] Changelog gerado
- [ ] Tag de versão criada (`v2.8.0`)
- [ ] Merge `dev` → `main`

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
