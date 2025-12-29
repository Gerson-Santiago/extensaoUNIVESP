# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [2.9.0] - 2025-12-29

### 🎉 Destaques da Release
- **SafeResult Pattern**: Error handling robusto em toda a aplicação (substituindo try/catch)
- **DOM Zumbi Fix**: Bug crítico de renderização de atividades corrigido com Container Freshness
- **Blindagem com Testes**: +6 testes de regressão protegendo features

críticas
- **Documentação Consolidada**: Merge de PADROES_DO_PROJETO + PADROES_COMMITS → `PADROES.md`

### ✨ Features
- **Protocolo de Engenharia**: [`ENGINEERING_GUIDE.md`](docs/ENGINEERING_GUIDE.md) formalizado com SafeResult pattern, AAA testing
- **Testes de Regressão**: [`rendering-regression.test.js`](features/courses/tests/views/DetailsActivitiesWeekView/rendering-regression.test.js) com 5 cenários blindando bug de DOM Zumbi

### 🐛 Bug Fixes
- **CRÍTICO - Listagem de Atividades**: Resolução do bug de "DOM Zumbi" onde atividades não apareciam apesar de dados serem carregados
  - **Sintoma**: Logs mostravam sucesso (`Renderizando 19 atividades`), mas UI ficava travada no Skeleton
  - **Causa**: `ActivityRenderer` renderizava em container órfão após re-render da view
  - **Solução**: Always Fresh Container - `DetailsActivitiesWeekView` sempre cria renderer com container corrente
  - **Proteção**: 5 testes de regressão falham se bug for reintroduzido
- **Timeout em Teste**: Aumentado timeout de `service.test.js` "deve retornar erro estruturado" para 10s (acomoda delay de 500ms do serviço)

### 🔧 Refatorações
- **`WeekActivitiesService.js`**: Adoção do SafeResult pattern (`trySafe()`) para error handling
- **`WeeksManager.js`**: Consumo seguro de SafeResult com early returns explícitos
- **`DetailsActivitiesWeekView.js`**: 
  - Container Freshness: `this.element.querySelector()` em vez de `document.getElementById()`
  - Renderer sempre recriado com container fresco (elimina stale references)

### 📚 Documentação
- **ADRs Arquiteturais**:
  - [`ADR_005_SAFERESULT_PATTERN.md`](docs/architecture/ADR_005_SAFERESULT_PATTERN.md): Decisão de adotar SafeResult vs. try/catch
  - [`ADR_006_CONTAINER_FRESHNESS.md`](docs/architecture/ADR_006_CONTAINER_FRESHNESS.md): Estratégia de renderização para prevenir DOM Zombies
- **Consolidações**:
  - [`PADROES.md`](docs/PADROES.md): Merge de `PADROES_DO_PROJETO.md` + `PADROES_COMMITS.md` (elimina redundância de 311 linhas → 180 linhas)
  - ~~`GLOSSARIO.md`~~: Integrado a `TECNOLOGIAS_E_ARQUITETURA.md` (planejado, não executado)
  - ~~`IDENTIDADE_DO_PROJETO.md`~~: Integrado ao `README.md` (planejado, não executado)
- **Guias Atualizados**:
  - `ENGINEERING_GUIDE.md`: Seção sobre SafeResult pattern e AAA testing
  - `FLUXOS_DE_TRABALHO.md`: Fluxo de "Blindagem com Testes de Regressão" (planejado)

### 🧪 Testes
- **Cobertura**: 77.81% (437 testes)
- **Total**: 437 testes passando (59 suites)
- **Novos**:
  - `service.test.js`: Timeout fix (+1 teste corrigido)
  - `rendering-regression.test.js`: 5 testes de blindagem
    1. Múltiplas renderizações (Skeleton → Dados)
    2. Container sempre é o elemento VISÍVEL
    3. View com dados desde o início
    4. Navegação entre semanas
    5. Estado de erro
- **Padrão AAA**: Enforce pattern Arrange-Act-Assert em todos os novos testes

### 🛠️ Infraestrutura
- **SafeResult Utility**: [`shared/utils/ErrorHandler.js`](shared/utils/ErrorHandler.js) - 46 linhas de código para error handling robusto
- **localStorage Strategy**: `ActivityRepository` usa `chrome.storage.local` (5MB quota) para cache de atividades com chave `activities_{courseId}_{contentId}`
- **Naming Consistency**: Renomeado `repository/` → `repositories-progress/` para consistência arquitetural

### 🧹 Limpeza
- **Docs Legados Removidos**: Deletados `PADROES_DO_PROJETO.md` e `PADROES_COMMITS.md` (consolidados em `PADROES.md`)

### 🔄 Breaking Changes
Nenhum.

### ❓ Known Issues
- **Botão "Ir" (Scroll)**: Pode falhar em semanas com muitos recursos ou IDs complexos (será corrigido em v2.10.0)

### 📊 Métricas
- **Linhas de Código**: 23.617 (233 arquivos)
- **Cobertura de Testes**: 77.81%
- **Testes**: 437 passando (0 falhando)
- **Lint**: 0 warnings
- **TypeScript**: 0 errors

---

## [2.8.14] - 2025-12-28

### 🧪 Modernização de Testes & Qualidade
- **Migração Promises (Async/Await)**:
  - Substituição de todos os mocks antigos (`callbacks`) por Promises modernas.
  - Alinhamento total com ES2024 e Manifest V3.
- **Mock de Storage com Persistência**:
  - Implementação de mock inteligente para `chunkedStorage` e `storage.local`.
  - Dados persistem em memória durante testes de integração (simulando comportamento real).
- **Lint Cleanup**:
  - Remoção de consoles debug (log -> warn).
  - Limpeza de variáveis não utilizadas e try/catch vazios.
- **Novos Scripts**:
  - `test:summary`: Visão rápida de sucesso/falha.
  - `test:failed`: Reexecução focada apenas em falhas.

### 🧹 Manutenção
- **TypeScript**: Correção de tipagem em `ChunkedStorage` e `CompressionUtils`.
- **Zero Errors**: Atingido status de 0 erros de lint e 0 falhas de teste (411 passing).

## [2.8.9] - 2025-12-27

### 📚 Auditoria de Alinhamento Documental
- **Limpeza Radical do `.github/`**:
  - SPEC-v2.8.0.md deletado (obsoleto)
  - 6 EPICs deletados (snapshots v2.8.0 desatualizados)
  - 2 NEXT arquivados (já implementados)
  - 2 REFACTORs arquivados (concluídos)
  - 1 TECH_DEBT arquivado (unificar-estrutura-progresso)
  - README.md reescrito do zero (conciso, sem links quebrados)
  - Seção "Por Onde Começar" adicionada (onboarding)
  
- **Architecture Decision Records (ADRs)**:
  - ADR-001: Console Cleanup (Matriz ISO 25010, 92 pontos)
  - ADR-002: Deletar EPICs (Matriz ISO 25010, 92 vs 73 vs 48)
  - ADR-003: BatchScraper No Modularization (Injected code constraint)
  
- **ROADMAP Reescrito**:
  - Visão estratégica trimestral (Q4 2025 - 2027+)
  - Horizonte atual: Estabilização e consolidação arquitetural
  - Médio prazo: Gamificação + Grade Manager
  - Processo de priorização ADR-driven documentado

- **Estrutura Final `.github/`**: 7 pastas, 17 arquivos, 0 links quebrados ✅

### ✨ Chips de Navegação Contextual (26/dez)
- **ContextualChips.js**: Componente UI para lista de navegação contextual (TDD).
- **Interação**: Suporte a clique (navegar) e remoção de itens.
- **Acessibilidade**: Layout semântico e suporte a teclado.
- **HistoryService**: Sistema LRU (Least Recently Used) por matéria.
- **Integração**: `DetailsActivitiesWeekView` rastreia navegação automaticamente.
- **CSS Grid**: Layout robusto para header, garantindo visibilidade dos chips.
- **Configurações**: Painel em Settings para ativar/desativar e ajustar limite (3-10 chips).

### ♻️ Refatoração (DetailsActivitiesWeekView - 26/dez)
- **Modularização Completa**: Componente monolítico (368 linhas) dividido em 6 módulos:
  - `SkeletonManager.js`: Gerenciamento de loading state.
  - `ClearHandler.js`: Lógica de limpeza de cache segura.
  - `RefreshHandler.js`: Lógica de atualização de conteúdo.
  - `ActivityItemFactory.js`: Criação de elementos DOM.
  - `ActivityRenderer.js`: Renderização de listas com delegação parcial.
  - `ChipsManager.js`: Gerenciamento isolado dos chips.
- **Index.js**: Reduzido para ~200 linhas (Orquestrador Puro).
- **DRY**: Removido código duplicado de navegação e settings.

### 🎨 UX Improvements (26/dez)
- **Layout**: Header convertido para CSS Grid (2 rows, 3 cols) para melhor disposição dos elementos.
- **Feedback**: Mensagens claras ao limpar cache ou aguardar carregamento.

### 🐛 Bugfixes (26/dez)
- **Tabs.openOrSwitchTo**: Corrige navegação entre semanas (agora abre novas abas em vez de reutilizar).
- **Chips Visibility**: Identificado e corrigido bug onde chips renderizavam mas não apareciam (CSS Display issue).
- **ClearCache**: Corrigido erro `not a function` ao implementar método estático no Service.

### 💾 Persistência & Navegação (26/dez)
- **Navegação de Chips**: Implementado Hook `onNavigateToWeek` para sincronizar View e Browser.
- **Auto-Save**: Dados de scraping agora são persistidos automaticamente após carregamento (`CourseRepository.update`).

### 💅 Interface (UI/UX - 26/dez)
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
> Consulte [CHANGELOG_ARCHIVE.md](./docs/changelog_archive/CHANGELOG_ARCHIVE.md)
