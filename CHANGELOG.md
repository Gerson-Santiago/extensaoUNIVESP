# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

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
