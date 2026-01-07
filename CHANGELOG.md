# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [2.10.0] - 2026-01-07

### 🎉 Novidades
- **ISSUE-019**: Sistema completo de Backup/Restore com compressão inteligente e validação de integridade.
- **ISSUE-020**: Factory Reset com confirmação dupla para segurança de dados.
- **ISSUE-022**: Sistema de Preferências de UX (Densidade Compacta, Auto-Pin de última semana visitada).
- **ISSUE-050**: Dashboard de Engenharia 2.0 com suporte a Linux/WSL e métricas de Dívida Técnica.

### 🛡️ Segurança (Hotfix ISSUE-045)
- **Trusted Types**: Implementação de `DOMSafe.parseHTML` para conformidade rigorosa com CSP do Chrome.
- **XSS Hardening**: Whitelist dinâmica para atributos de input e eliminação de riscos em injetores.
- **URL Sanitization**: `DOMSafe.sanitizeUrl` bloqueando `javascript:` URLs em scrapers e views.

### 🏗️ Qualidade & Integridade (ISSUE-046 & ISSUE-025)
- **Broken Links**: Validação automatizada de integridade de referências em JS, CSS e HTML.
- **Orphan Code**: Saneamento de código morto e arquivos obsoletos.
- **Test Organization**: Renomeação de testes duplicados para `.unit.test.js`, `.integration.test.js`, `.utils.test.js`.
- **Test Coverage**: Cobertura global atingiu **89.2%**, com blindagem total em `SettingsController`, `ChunkedStorage` e Scrapers.

### 📦 Engenharia de Distribuição (M3)
- **Icons**: Geração automatizada de ícones em 4 tamanhos (16/32/48/128px) usando `sharp`.
- **Screenshots**: 5 screenshots profissionais (1280x800) para Chrome Web Store gallery.
- **Manifest**: Atualização completa com referências corretas para assets específicos.
- **Validation**: Scripts de validação automática (`validate-assets.js`) garantindo conformidade CWS.

### 🔧 Melhorias & Tooling
- **Performance**: Otimização do `dashboard.sh` usando `find -prune` para grandes codebases.
- **ADR 002**: Contexto automático do design do `BatchScraper` integrado ao dashboard.
- **Build Pipeline**: Script `build-dist.js` para empacotamento limpo de distribuição.
- **ESM Migration**: Conversão completa para ESM (100% dos arquivos).

## [2.9.7] - 2026-01-05

### 🧪 Quality & Tests (v2.9.x Maintenance)
- **ISSUE-025**: Expansão de cobertura para `CompressionUtils` (100%), `DomUtils` (100%) e `BatchScraper` (refatorado com funções puras testáveis).
- **ISSUE-026**: Institucionalização do framework de Auditoria de Controle Técnica em `docs/PADROES.md`.

### 🛡️ Maturidade de Engenharia
- **Anti-Padrões**: Documentação de padrões proibidos em `docs/ANTI_PADROES.md` (window.location, mocks globais, spies DOM).
- **Templates de Testes**: Identificação de testes exemplares em `docs/TEST_TEMPLATES.md` para padronização.
- **Workflow**: Adicionado script `npm run check` para validação rápida (lint + type-check) antes de commits.
- **Editor**: Configuração `.vscode/settings.json` para feedback imediato de erros e auto-fix.
- **Restrições de Infraestrutura**: Documentação em `docs/RESTRICOES_INFRAESTRUTURA.md` para controle de execução de testes pesados.

---

## [2.9.6] - 2025-12-31

### 🛡️ Engenharia de Release & Governança (Enterprise)
- **Workflows Operacionais**: Implementação de roteiros interconectados em `.agent/workflows/` (`/git-flow`, `/verificar`, `/versionamento`, `/release-prod`).
- **Proteção de Branches**: Formalização do Git Flow obrigatório em `FLUXOS_DE_TRABALHO.md`, restringindo commits diretos em `dev/main`.
- **Index de Navegação**: Novo index central em `.agent/workflows/README.md` para rápida localização de ADRs e Protocolos por agentes AI.
- **Protocolo de Versão**: Garantia de sincronia absoluta entre `package.json`, `manifest.json` e `CHANGELOG.md`.

### 🧪 Quality Assurance & Test Coverage
- **NavigationService**: Refatoração Future-Proof com tipos JSDoc, configuração injetável e 100% de cobertura lógica (Issue-015).
- **VideoStrategy**: Expansão de detecção (YouTube/Vimeo/HTML5) com suíte unitária de 100% de cobertura de statements (Issue-016).
- **CourseRefresher**: Novas suítes de teste de integração (Issue-013).
- **WeekContentScraper**: Ampliação da cobertura de parsers para 80%+ (Issue-014).
- **UI Handlers**: Cobertura total de funções para `ClearHandler` e `RefreshHandler` (Issue-018).

### 🏗️ Arquitetura
- **ADR-010**: Formalização do padrão *Future-Proof Configuration* para serviços injetáveis.

---

## [2.9.5] - 2025-12-31


### Refatoração (Green-Green)
- **Arquitetura**: Unificação dos repositórios em `features/courses`.
  - `repositories-progress` fundido em `repositories`.
  - `data` fundido em `repositories`.
- **Limpeza**: Remoção de pastas redundantes e arquivos de metadados legados.
- **Sidepanel**: Correção de acesso direto a repositório, agora via `CourseService` (Melhor encapsulamento).
- **Testes**: Reorganização dos testes de repositório para espelhar a nova estrutura.

### Governança & Qualidade
- **ADR Compliance**: Auditoria completa de aderência aos ADRs (000-008) concluída com 100% de conformidade.
- **Auditoria Interna**: Validada estrutura da sub-feature `import` (UI/Logic/Services).
- **Observabilidade**: Refatoração de `console.log` residuais para o sistema de `Logger`.
- **Documentação Técnica**: Atualização do guia de acesso a dados (`repositories/README.md`).

## [2.9.4] - 2025-12-31

### Refactor
- **Architecture**: Separação completa entre `background` (Service Worker) e `scripts` (DevTools).
- **Cleaner**: Remoção de comentários didáticos legados do Service Worker.
- **Shared**: Consolidação da estrutura de kernel compartilhado (`ui`, `logic`, `utils`, `services`, `models`).

## [2.9.3] - 2025-12-31

### 🏗️ Screaming Architecture & Quality
- **Test Colocation**: Testes unitários movidos para dentro das features (`features/*/tests`), respeitando a arquitetura modular. Apenas testes de integração e arquiteturais permanecem na raiz `tests/`.
- **Strict Typing (JSDoc)**: Adoção rigorosa de JSDoc com `@type` casting explícito para eliminar `any/unknown`, garantindo zero erros de TypeScript (`npm run type-check`).
- **Zero Lint Warnings**: Correção de alertas residuais, incluindo verificação de segurança em regex (`security/detect-non-literal-regexp`) e propriedades de DOM (`HTMLElement` vs `Element`).

### 📦 Refatorações
- **Content Scripts**: Scripts de injeção (`SeiLoginContentScript.js`) movidos para `features/session`, centralizando a lógica de sessão.
- **Service Layer**: Ajustes finos em `ScraperService` e `ChipsManager` para conformidade com a nova arquitetura de tipos.
- **Clean Code**: Remoção de redundâncias e arquivos órfãos pós-migração.

---

## [2.9.2] - 2025-12-30

### 🚀 Features & Estabilização (Semanas de Revisão)
- **Centralização de Lógica de Semanas**: Implementação de `CourseStructure.js` como fonte única de verdade (SSOT).
- **Dual Search Strategy**: O scraper agora inspeciona tanto `innerText` quanto `title` dos elementos âncora, garantindo captura mesmo quando o texto visível é truncado ou estilizado.
- **Captura Abrangente**: Regex `/^(Semana\s+(\d{1,2})|Semana\s+de\s+Revisão|Revisão)$/i` suporta variações de nomenclatura identificadas no AVA.
- **Support em Lote**: `BatchScraper` alinhado à lógica central, prevenindo inconsistências entre raspagem individual e em massa.
- **Ordenação Ponderada**: Algoritmo de pesos (`getWeekNumber`) atribui peso 999 para "Revisão", forçando-a sempre para o final da lista, independente da ordem de captura.

### 🧪 Qualidade & Profissionalização
- **100% Cobertura em Lógica Crítica**: Adição de testes de regressão (unitários e integração) cobrindo todos os cenários de captura e ordenação de revisões.
- **Zero Warnings de Lint**: Resolução de 21 warnings pendentes (Security e ESLint).
- **Código Enterprise-Ready**: Remoção de todos os comentários didáticos/internos (`STEP`, `ISSUE`, notas de estudo) para um código mais limpo e profissional.
- **Auditoria de Lint**: Refinamento de supressões `eslint-disable` para escopo de linha específica com justificativa técnica.

### 📝 Documentação
- **Atualização Estratégica**: Sincronização de `README.md` e `ROADMAP.md` globais com a nova versão e terminologia profissional.
- **Cura Documental**: Atualização massiva de referências de versão e regras de negócio nos documentos técnicos.

---

## [2.9.1] - 2025-12-29

### 🚀 Features & Refatoração (Robustez)
- **Padronização de Logs**: Refatoração massiva de `console.*` para `Logger.*` com suporte a tags semânticas (`/**#LOG_UI*/`, `/**#LOG_SYSTEM*/`, etc). Melhora observabilidade e controle de debug.
- **Navegação Robusta (Scroll)**: Nova lógica de navegação para atividades (`NavigationService.js`) usando `MutationObserver`. Corrige falhas em abas lentas ou com IDs dinâmicos.
- **Visual Feedback**: Item encontrado pisca em amarelo/dourado para facilitar localização.
- **Fallback Seguro**: Se o ID não for encontrado via scroll direto, a extensão tenta 4 estratégias de seletores diferentes antes de desistir (timeout 10s).

### 🐛 Bugfixes
- **Fix "Ir" Button**: Reseta estado de scroll e garante carregamento assíncrono do elemento alvo antes da execução.
- **Regex Security**: Correção de Regular Expression insegura em `TaskCategorizer.js` (prevenção de ReDoS).
- **Test Stability**: Ajuste em mocks de testes assíncronos (`WeekContentScraper.test.js`) e expectativas do formatador do Logger.

### 🧪 Testes & QA
- **Blindagem Total**: 455 testes passando (100% green).
- **Conformidade de Lint**: Zero warnings (`max-warnings=0`) e remoção de comentários `eslint-disable` desnecessários.

### 📝 Documentação
- **ADR-007**: [`ADR_007_ROBUST_SCROLL_NAVIGATION.md`](docs/architecture/ADR_007_ROBUST_SCROLL_NAVIGATION.md) formalizando a decisão técnica.
- **Roteiro de Release**: Changelog limpo e histórico movido para arquivo dedicado.

---

## [2.9.0] - 2025-12-29

### 🎉 Destaques da Release
- **SafeResult Pattern**: Error handling robusto em toda a aplicação (substituindo try/catch)
- **DOM Zumbi Fix**: Bug crítico de renderização de atividades corrigido com Container Freshness
- **Blindagem com Testes**: +6 testes de regressão protegendo features críticas
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
  - [`PADROES.md`](docs/PADROES.md): Merge de `PADROES_DO_PROJETO.md` + `PADROES_COMMITS.md`
- **Guias Atualizados**:
  - `ENGINEERING_GUIDE.md`: Seção sobre SafeResult pattern e AAA testing

### 🧪 Testes
- **Cobertura**: 77.81% (437 testes)
- **Total**: 437 testes passando (59 suites)
- **Novos**:
  - `service.test.js`: Timeout fix (+1 teste corrigido)
  - `rendering-regression.test.js`: 5 testes de blindagem

### 🛠️ Infraestrutura
- **SafeResult Utility**: [`shared/utils/ErrorHandler.js`](shared/utils/ErrorHandler.js) - 46 linhas de código para error handling robusto
- **localStorage Strategy**: `ActivityRepository` usa `chrome.storage.local`
- **Naming Consistency**: Renomeado `repository/` → `repositories-progress/` para consistência arquitetural

### 🧹 Limpeza
- **Docs Legados Removidos**: Deletados `PADROES_DO_PROJETO.md` e `PADROES_COMMITS.md`

---

> 📦 **Histórico Completo**: Versões anteriores a 2.9.1 foram arquivadas.  
> Consulte [CHANGELOG_ARCHIVE.md](docs/changelog_archive/CHANGELOG_ARCHIVE.md)
