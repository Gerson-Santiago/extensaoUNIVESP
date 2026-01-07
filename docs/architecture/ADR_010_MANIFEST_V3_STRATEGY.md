# ADR-010: Manifest V3 Strategy
**Status**: Aceito | **Data**: 2026-01-02

## Problema
Chrome Web Store tornou Manifest V3 obrigatório desde Janeiro/2024. MV3 introduz restrições significativas: Service Workers efêmeros (não background pages persistentes), host permissions mais restritivas, CSP rigoroso, proibição de imports em content scripts.

## Solução
**5 Estratégias** para compliance total com MV3:

### 1. Service Worker Event-Driven
- Processo efêmero baseado em eventos (zero `setInterval` loops infinitos)
- Tarefas periódicas: `chrome.alarms` API
- Estado crítico em `chrome.storage` (não memória volátil)

### 2. Permissions Mínimas
```json
{
  "permissions": ["storage", "sidePanel", "scripting"],
  "host_permissions": ["https://apps.univesp.br/*"]
}
```
Trade-off aceito: `host_permissions` específico vs `activeTab` (mais seguro mas requer user gesture)

### 3. Side Panel API Nativa
De `default_popup` para `chrome.sidePanel` API nativa:
- UI nativa do Chrome (melhor UX)
- Comportamento contextual por aba
- Compliance automático com User Gesture policies

### 4. Content Script sem Imports
Monolito funcional auto-contido (ADR-001 BatchScraper) devido à limitação MV3 de proibir `import` statements

### 5. Single Purpose Policy
**Propósito único**: "Produtividade Acadêmica UNIVESP"

Todas features convergem:
1. Gestão de Cursos (scrapers, organização)
2. Navegação Inteligente (sidePanel, chips contextuais)
3. Autopreenchimento SEI (login acadêmico)

## Trade-offs
- ✅ **Benefícios**: Compliance com Chrome Web Store (publicação garantida), melhor segurança (CSP rigoroso, permissões mínimas), Side Panel nativo (melhor UX), Service Worker economiza bateria
- ⚠️ **Riscos**: Service Worker efêmero complica debugging (logs perdidos), restrições de import em content scripts, migração de estado para `chrome.storage` (mitigados por logging em `chrome.storage.local`, ADR-001 monolito, ADR-007 storage strategy)

## Refs
- [ADR-001](ADR_001_BATCHSCRAPER_ARCHITECTURE.md) - BatchScraper monolito (solução para limitação MV3)
- [ADR-004](ADR_004_OBSERVABILITY_LOGGER.md) - Logger precisa persistir em storage
- [ADR-007](ADR_007_FUTURE_PROOF_CONFIGURATION.md) - Estratégia sync/local storage
- [ADR-009](ADR_009_SECURITY_FIRST.md) - CSP rigoroso e segurança
- Issues: #032 (Single Purpose), #033 (Permission Audit), #034 (Service Worker Lifecycle), #036-#040 (CWS Metadata, Remote Code, sidePanel UX, Content Script Security, Asset Quality)
