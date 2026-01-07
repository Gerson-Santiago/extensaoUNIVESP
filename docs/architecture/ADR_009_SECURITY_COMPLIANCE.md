# ADR-009: Security-First & MV3 Compliance
**Status**: Aceito | **Data**: 2026-01-02

## Problema
Necessidade dupla de segurança e compliance para publicação no Chrome Web Store:
- **Segurança**: Vulnerabilidades XSS (`innerHTML` não-sanitizado, tipos genéricos escondendo contratos inseguros, falta de validação de dados externos)
- **Compliance**: Manifest V3 obrigatório desde Janeiro/2024 (Service Worker efêmero, CSP rigoroso, permissões mínimas)

## Solução
Estratégia integrada de segurança e compliance:

### Security-First: 5 Regras Obrigatórias

1. **DOM Manipulation**: Zero `innerHTML` com dados dinâmicos não-sanitizados (usar `textContent` ou `createElement`)
2. **Input Validation**: Todo dado externo validado antes de uso (AVA scraping, usuário, `chrome.storage`)
3. **Type Safety**: Zero `@type {*}` ou `@type {Object}` em produção (tipos explícitos previnem bugs)
4. **Error Handling**: `SafeResult` pattern obrigatório em I/O boundaries, erros nunca silenciados sem logging
5. **Storage Versioning**: Operações de escrita em `chrome.storage` com versionamento para detectar race conditions

**Checklist de PR**:
- [ ] Nenhum `innerHTML` com dados não-sanitizados?
- [ ] Tipos JSDoc explícitos em funções públicas?
- [ ] Testes cobrem caminhos de erro?
- [ ] Dados externos validados antes de uso?

### MV3 Compliance: 5 Estratégias

1. **Service Worker**: Event-driven architecture (zero `setInterval` loops infinitos, tarefas periódicas usam `chrome.alarms`, estado crítico em `chrome.storage`)
2. **Permissions**: Mínimas viáveis (`storage`, `sidePanel`, `scripting` + `host_permissions` específico `https://apps.univesp.br/*`)
3. **Side Panel API**: Nativa do Chrome (não popup customizado) - melhor UX, comportamento contextual por aba
4. **Content Scripts**: Monolito funcional sem imports (ADR-001 BatchScraper - limitação MV3)
5. **Single Purpose**: "Produtividade Acadêmica UNIVESP" (todas features convergem: gestão de cursos, navegação inteligente, autofill SEI)

## Trade-offs
- ✅ **Benefícios**: Redução drástica de surface de ataque XSS e race conditions, compliance com Chrome Web Store (publicação garantida), melhor segurança (CSP rigoroso), Side Panel nativo (melhor UX), Service Worker economiza bateria
- ⚠️ **Riscos**: Maior verbosidade (DOM manual), Service Worker efêmero complica debugging (logs perdidos), restrições de import em content scripts, migração de estado para `chrome.storage` (mitigados por helpers `DOMSafe`, logging estruturado via `chrome.storage.local` export, ADR-001 monolito funcional)

## Refs
- [ADR-000](ADR_000_FUNDAMENTALS.md) - JSDoc Type-Safety como primeira linha de defesa
- [ADR-002](ADR_002_SAFERESULT_PATTERN.md) - SafeResult para error handling seguro
- [ADR-001](ADR_001_BATCHSCRAPER_ARCHITECTURE.md) - BatchScraper monolito (solução para limitação MV3)
- [ADR-004](ADR_004_OBSERVABILITY_LOGGER.md) - Logger precisa persistir em storage (não console)
- [ADR-007](ADR_007_FUTURE_PROOF_CONFIGURATION.md) - Estratégia sync/local storage
- Issues: #028 (Storage versioning), #030 (Security audit), #031 (CSP), #032-#040 (MV3 compliance)
