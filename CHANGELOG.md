# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [2.8.9] - 2025-12-26

### ✨ Chips de Navegação Contextual
- **ContextualChips.js**: Componente UI para lista de navegação contextual (TDD).
- **Interação**: Suporte a clique (navegar) e remoção de itens.
- **Acessibilidade**: Layout semântico e suporte a teclado.
- **HistoryService**: Sistema LRU (Least Recently Used) por matéria.
- **Integração**: `DetailsActivitiesWeekView` rastreia navegação automaticamente.
- **CSS Grid**: Layout robusto para header, garantindo visibilidade dos chips.
- **Configurações**: Painel em Settings para ativar/desativar e ajustar limite (3-10 chips).

### ♻️ Refatoração (DetailsActivitiesWeekView)
- **Modularização Completa**: Componente monolítico (368 linhas) dividido em 6 módulos:
  - `SkeletonManager.js`: Gerenciamento de loading state.
  - `ClearHandler.js`: Lógica de limpeza de cache segura.
  - `RefreshHandler.js`: Lógica de atualização de conteúdo.
  - `ActivityItemFactory.js`: Criação de elementos DOM.
  - `ActivityRenderer.js`: Renderização de listas com delegação parcial.
  - `ChipsManager.js`: Gerenciamento isolado dos chips.
- **Index.js**: Reduzido para ~200 linhas (Orquestrador Puro).
- **DRY**: Removido código duplicado de navegação e settings.

### 🎨 UX Improvements
- **Layout**: Header convertido para CSS Grid (2 rows, 3 cols) para melhor disposição dos elementos.
- **Feedback**: Mensagens claras ao limpar cache ou aguardar carregamento.

### 🐛 Bugfixes
- **Tabs.openOrSwitchTo**: Corrige navegação entre semanas (agora abre novas abas em vez de reutilizar).
- **Chips Visibility**: Identificado e corrigido bug onde chips renderizavam mas não apareciam (CSS Display issue).
- **ClearCache**: Corrigido erro `not a function` ao implementar método estático no Service.

### 💾 Persistência & Navegação
- **Navegação de Chips**: Implementado Hook `onNavigateToWeek` para sincronizar View e Browser.
- **Auto-Save**: Dados de scraping agora são persistidos automaticamente após carregamento (`CourseRepository.update`).

### 💅 Interface (UI/UX)
- **Mini Chips**: Adicionado indicador de progresso (ex: `5/10`) na listagem de semanas (`WeekItem`).
- **Feedback**: `WeekItem` agora exibe status visual imediato de tarefas concluídas.

---

## [2.8.8] - 2025-12-26

### 🐛 Bugfixes & Manutenção
- **Correção de Lints**: Ajustes de tipagem em `QuickLinksScraper`, `DomUtils` e `HistoryService`.
- **DomUtils**: Utilitário para manipulação segura do DOM (fechamento de modais).
- **HistoryService**: Correção de tipagem no retorno do storage (`Array.isArray`).
- **QuickLinksScraper**: Tipagem explícita para evitar erros de `Property 'click' does not exist`.

---

## [2.8.7] - 2025-12-26

### 📝 Documentação (Auditoria Final)
- **PADROES_DO_PROJETO.md**: Seção completa de scripts (26 scripts organizados)
- **README.md**: Comandos atualizados com 3 camadas de segurança
- **docs/README.md**: Scripts disponíveis para desenvolvimento
- **PADROES_COMMITS.md**: Seção de commits de segurança com exemplos práticos
- **CHANGELOG**: Limpo e reorganizado (histórico < 2.8.0 arquivado)

### 🛠️ Manutenção
- **Scripts Reorganizados**: Agrupados por categoria (verificação, lint, format, tests, security)
- **CHANGELOG_ARCHIVE.md**: Histórico completo de versões antigas

---

## [2.8.6] - 2025-12-26

### 🔒 Segurança
- **Secretlint**: Detecta automaticamente API keys, tokens e passwords em commits
- **npm audit**: Bloqueia dependências com CVE high/critical
- **ESLint Security**: 7 regras ativas (anti-injection, anti-XSS, anti-eval)
- **Pre-commit Hook**: 3 camadas de proteção automática

### ⚡ Performance
- **Pre-commit Otimizado**: 57% mais rápido (37s → 16s)
- **Testes Inteligentes**: Executa apenas testes relacionados (--findRelatedTests)
- **lint-staged**: Otimizado com --bail para falha rápida
- **Duplicação Removida**: test:dev eliminado (duplicava test:watch)

---

## [2.8.5] - 2025-12-26

### 📝 Scripts Jest Otimizados
- **test:dev**: `jest --watch` - Feedback instantâneo no desenvolvimento
- **test:debug**: `jest --bail` - Para no 1º erro, economiza RAM
- **test:quick**: `jest --onlyFailures` - Apenas testes que falharam (rápido)
- **test:ci**: `jest --coverage --ci` - Otimizado para CI/CD
- **Workflows**: Atualizados com comandos Jest apropriados
- **FLUXOS_DE_TRABALHO.md**: Documentação completa de scripts

---

## [2.8.4] - 2025-12-26

### 🧪 Reorganização de Testes
- **Estrutura Hierárquica**: Testes organizados por tipo (components, views, services, repositories, models, logic)
- **15 Arquivos Movidos**: Organização por responsabilidade
- **Imports Corrigidos**: Todos os caminhos relativos atualizados
- **CourseWeeksView.test.js**: Dividido em 3 arquivos (preview, progress, rendering)
- **QuickLinksScraper.test.js**: Dividido em 2 arquivos (extraction, scraping)
- **365 Testes Passando**: 100% Green mantido

---

## [2.8.3] - 2025-12-26

### 🎨 UX/Features
- **Skeleton Loader**: Implementado componente para feedback visual durante carregamento
  - 171 linhas em `shared/ui/SkeletonLoader.js`
  - Integrado em `DetailsActivitiesWeekView`
  - Melhora percepção de velocidade

### 🐛 Correções
- **Navegação**: Correções gerais de navegação e testes
- **WeekItem**: Ajustes no componente (27 linhas modificadas)
- **CourseWeeksView**: Refatoração (38 linhas modificadas)

---

## [2.8.2] - 2025-12-25

### 🐛 Correção Crítica de Navegação
- **Sincronização de Abas**: Fix crítico ao abrir atividades de semana
  - **Problema**: Sistema reutilizava aba errada e fazia scraping de dados incorretos
  - **Solução**: `WeekActivitiesService` garante aba correta ANTES de scraping
  - Aguarda carregamento completo da aba (status 'loading')
  - Adiciona delay de 500ms para garantir scripts da página prontos
  - **5 testes de regressão** adicionados (173 linhas)
  - **351 testes passando**

### 📁 Arquivos Modificados
- `features/courses/services/WeekActivitiesService.js` (+56 linhas)
- `features/courses/tests/WeekActivitiesService.regression.test.js` (novo, 173 linhas)
- `features/courses/tests/WeekActivitiesService.test.js` (+12 linhas)

---

## [2.8.1] - 2025-12-25

### ✨ Feature: Breadcrumb Navigation (ADR-004)
- **NavigationService**: Novo serviço com método `openActivity`
  - Implementa navegação hierárquica (semana → atividade)
  - 93 linhas em `shared/services/NavigationService.js`
  - 55 linhas de testes
- **Tabs.js Async**: Refatorado para async/await
  - Corrige: loop infinito de reload
  - 120 linhas refatoradas
- **DetailsActivitiesWeekView**: Refatoração (-70 linhas, mais limpo)
- **BatchImportFlow**: Refatoração (40 linhas modificadas)
- **Modal AVA**: Agora fecha automaticamente

### 🐛 Correções
- **fix(tabs)**: Garante reutilização de aba apenas para mesmo curso e atualiza URL

### 📝 Documentação
- **ADR-004**: Documentação da lógica de breadcrumb (48 linhas)
- **ESTUDO_NAVEGACAO_GRAFOS.md**: Estudo de navegação hierárquica (71 linhas)
- **CHECKLIST_NAVEGACAO.md**: Checklist de navegação (21 linhas)

---

## [2.8.0] - 2025-12-24

### 🏗️ Infraestrutura & Tecnologia
- **ES2024 Ready**: Suporte nativo ES2024 (Object.groupBy, etc)
- **Conventional Commits**: Commitlint no pipeline Husky
- **Node.js v24 (Krypton)**: 100% compatibilidade
- **Documentação**: TECNOLOGIAS_E_ARQUITETURA.md atualizada

### 🛠️ Engenharia & Qualidade
- **Tipagem JSDoc Strict**: Sistema híbrido (JS + segurança TS)
- **Models Canônicos**: Padrão models/ + pipeline type-check
- **Zero Errors Policy**: Sem erros de tipagem em produção
- **335 Testes**: Suite completa com validação de tipos

### 🏛️ Arquitetura (Screaming Architecture Fase 2)
- **Features Isoladas**: features/courses/import/ como submódulo
- **Event-Driven**: Settings desacoplado
- **Models Colocalizados**: Course.js, Week.js, Session.js

### 📝 Documentação
- **Badges**: 🏆 CORE, 🔧 INFRA, 📦 UTILITY
- **Hub**: docs/README.md como navegação
- **Glossário**: Termos arquiteturais detalhados

### 🧪 Qualidade
- **Scraper**: Auto-Scroll simplificado
- **Testes**: CourseRepository.test.js modularizado
- **CourseRefresher**: Serviço dedicado (SRP)

### 🎨 UX
- **Botão Recarregar**: Scroll inteligente na importação

---

> 📦 **Histórico Completo**: Versões anteriores a 2.8.0 foram arquivadas.  
> Consulte [CHANGELOG_ARCHIVE.md](./docs/history_changelog/CHANGELOG_ARCHIVE.md)
