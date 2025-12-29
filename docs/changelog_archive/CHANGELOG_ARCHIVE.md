# Changelog - Histórico Arquivado

> **Nota**: Este arquivo contém o histórico de versões anteriores a 2.8.0.  
> Para versões atuais, veja [CHANGELOG.md](../../CHANGELOG.md)

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

## [2.8.8] - 2025-12-26
### 🐛 Bugfixes & Manutenção
- **Correção de Lints**: Ajustes de tipagem em `QuickLinksScraper`, `DomUtils` e `HistoryService`.
- **DomUtils**: Utilitário para manipulação segura do DOM (fechamento de modais).
- **HistoryService**: Correção de tipagem no retorno do storage (`Array.isArray`).
- **QuickLinksScraper**: Tipagem explícita para evitar erros de `Property 'click' does not exist`.

## [2.8.7] - 2025-12-26
### 📝 Documentação (Auditoria Final)
- **PADROES_DO_PROJETO.md**: Seção completa de scripts (26 scripts organizados)
- **README.md**: Comandos atualizados com 3 camadas de segurança
- **docs/README.md**: Scripts disponíveis para desenvolvimento
- **PADROES_COMMITS.md**: Seção de commits de segurança com exemplos práticos
- **CHANGELOG**: Limpo e reorganizado (histórico < 2.8.0 arquivado)

### 🛠️ Manutenção
- **Scripts Reorganizados**: Agrupados por categoria (verificação, lint, format, tests, security)
- **CHANGELOG_ARCHIVE.md**: Histórico completo de versões anteriores

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

## [2.8.5] - 2025-12-26
### 📝 Scripts Jest Otimizados
- **test:dev**: `jest --watch` - Feedback instantâneo no desenvolvimento
- **test:debug**: `jest --bail` - Para no 1º erro, economiza RAM
- **test:quick**: `jest --onlyFailures` - Apenas testes que falharam (rápido)
- **test:ci**: `jest --coverage --ci` - Otimizado para CI/CD
- **Workflows**: Atualizados com comandos Jest apropriados
- **FLUXOS_DE_TRABALHO.md**: Documentação completa de scripts

## [2.8.4] - 2025-12-26
### 🧪 Reorganização de Testes
- **Estrutura Hierárquica**: Testes organizados por tipo (components, views, services, repositories, models, logic)
- **15 Arquivos Movidos**: Organização por responsabilidade
- **Imports Corrigidos**: Todos os caminhos relativos atualizados
- **CourseWeeksView.test.js**: Dividido em 3 arquivos (preview, progress, rendering)
- **QuickLinksScraper.test.js**: Dividido em 2 arquivos (extraction, scraping)
- **365 Testes Passando**: 100% Green mantido

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

## [2.6.2] - 2025-12-19
### Feature: Singleton Tab Pattern (Standardization)
- **Consistência Arquitetural**: A View `Home` foi padronizada para seguir o mesmo comportamento de navegação já existente em `CoursesList` e `WeekItem`.
- **Gerenciamento Inteligente**: Links de acesso rápido (Portal SEI, AVA) agora verificam abas abertas antes de criar novas, resolvendo a poluição de contexto.
- **Match Pattern**: Atualização do utilitário `Tabs.js` para suportar detecção de portais (regex/domínio), essencial para suportar URLs dinâmicas do SEI/AVA.

## [2.6.1] - 2025-12-18
### Arquitetura & Limpeza
- **Conclusão da Migração**: View `Settings`, `Home` e `Feedback` movidas para suas respectivas pastas em `features/`.
- **Limpeza**: Remoção definitiva das pastas legadas `sidepanel/views` e `sidepanel/logic`.
- **Qualidade**: Ajuste de todos os testes de integração para refletir a nova estrutura de pastas.

## [2.6.0] - 2025-12-18
### Arquitetura (Screaming Architecture)
- **Features Isoladas**: Implementação completa da Screaming Architecture. O código agora grita o que faz (`features/courses`, `features/import`).
- **Refatoração Core (Cursos)**: Migração total da feature "Cursos" para domínio isolado.
    - `UI`: Componentes React-like (`CoursesList`, `CourseDetailsView`) movidos para `features/courses/components`.
    - `Data`: Repositório totalmente assíncrono (`CourseRepository`) e Driver de Storage (`CourseStorage`) em `features/courses/data`.
    - **Performance**: Eliminação total de callbacks ("Callback Hell") em favor de `async/await`.

### Feature Importação (Refatoração)
- **Separação de Modais**: Divisão do fluxo de importação em dois estágios para maior estabilidade:
    - `LoginWaitModal`: Interface passiva que aguarda o login do usuário.
    - `BatchImportModal`: Focado exclusivamente na seleção e importação, sem lógica de navegação.
- **Orquestrador de Importação**: Novo serviço `BatchImportFlow` que gerencia a decisão de qual modal exibir.

### UX
- **Smart Switch**: Detecção inteligente de abas do AVA já abertas.
- **Zero Redirect Loop**: Correção definitiva dos loops de redirecionamento.
- **Unificação**: Botão "Importar em Lote" das Configurações agora usa o mesmo fluxo seguro da tela de Cursos.

## [2.5.4] - 2025-12-15
### Refatoração
- **Gerenciamento de Abas Centralizado**: Refatoração completa da lógica de manipulação de abas, movendo toda a responsabilidade para a classe `Tabs.js`.
    - Eliminado código duplicado em `BrowserUtils`, `CourseService`, `CourseDetailsView` e `BatchImportModal`.
    - Substituída a lógica frágil de `chrome.tabs.query` espalhada pelo código por métodos robustos e testáveis (`Tabs.getCurrentTab`, `Tabs.openOrSwitchTo`).
- **Limpeza de Código**: Remoção de logs de debug e métodos obsoletos em `BrowserUtils.js`.

### Correções
- **Testes**: Correção de erros de sintaxe em `SettingsView.js` e mocks obsoletos em testes de integração, garantindo que a suíte de testes (16 testes) passe integralmente.

### Documentação
- **Regras de Negócio**: Criação de `docs/regras-de-negocio.md` detalhando o funcionamento funcional dos módulos `Tabs`, `Scraper` e `Storage`, conforme padrões de projetos Open Source.

## [2.5.3] - 2025-12-13
### Infraestrutura
- **Automação de Qualidade**: Implementação do Husky e lint-staged. Agora, lint e formatação são verificados e corrigidos automaticamente a cada commit, garantindo padronização do código fonte.
- **Limpeza**: Remoção de código legado (`onManualAdd`) e atualização de testes de integração para refletir a estrutura atual da UI.

## [2.5.2] - 2025-12-13
### UI/UX
- **Ajuste Fino de Interface**: Reversão do layout de configurações para manter botões de ação (Remover Tudo, Feedback) no corpo da página, melhorando a acessibilidade e visibilidade conforme preferência do usuário.
- **Menu Genérico**: Manutenção do componente `ActionMenu` para uso exclusivo na view de Cursos.

## [2.5.1] - 2025-12-13
### UI
- **ActionMenu Genérico**: Implementação de componente reutilizável de menu.

## [2.5.0] - 2025-12-13
### UI
- **Dropdown de Ações Rápidas**: Adicionado menu flutuante em "Minhas Matérias".

## [2.4.1] - 2025-12-13
### Novas Funcionalidades
- **Adição Manual Aprimorada**: Agora é possível selecionar o Ano, Semestre e Bimestre ao adicionar cursos manualmente, garantindo que eles sejam agrupados corretamente na lista.
- **Opções no Storage**: A função `addItem` agora aceita um objeto de opções para metadados adicionais.

## [2.4.0] - 2025-12-13
### Novas Funcionalidades
- **Agrupamento Inteligente de Cursos**: Visualize suas matérias organizadas por bimestre (ex: 2025/2 - 4º Bimestre) na aba "Minhas Matérias".
- **Visualização Hierárquica**: Nova interface visual com cabeçalhos claros separando os períodos letivos.
- **Ordenação Automática**: Matérias mais recentes aparecem automaticamente no topo.

### Engenharia de Dados
- **Persistência de Metadados**: Reformulação do sistema de armazenamento (`storage.js`) para salvar tags de agrupamento (`termName`) permanentemente.
- **Parsers Centralizados**: Criação de `termParser.js` e `courseGrouper.js` para garantir consistência lógica em toda a extensão.
