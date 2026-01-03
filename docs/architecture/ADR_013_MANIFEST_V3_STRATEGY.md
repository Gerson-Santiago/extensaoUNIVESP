# ADR 013: Manifest V3 Migration Strategy
Status: Aceito | Data: 2026-01-02

## Contexto
Chrome Web Store tornou Manifest V3 obrigatório para todas extensões desde Janeiro 2024. Extensões em Manifest V2 não podem mais ser publicadas ou atualizadas. MV3 introduz mudanças significativas:
- Background Pages → Service Workers (processo efêmero)
- Host Permissions mais restritivas (menor surface de ataque)
- Content Security Policy mais rígida
- APIs nativas para Side Panel

Temos 9 issues abertas (032-040) sobre MV3 compliance para Chrome Web Store.

## Decisão
Migração completa para Manifest V3 seguindo arquitetura event-driven e políticas de segurança:

### 1. Service Worker Architecture
**De**: Background page persistente 24/7  
**Para**: Service Worker efêmero basead em eventos

```javascript
// ✅ Event-driven (MV3)
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// ❌ Proibido: Keepalive hacks
// setInterval(() => console.log('ping'), 20000);
```

**Regras**:
- Zero `setInterval`/`setTimeout` com loops infinitos
- Tarefas periódicas usam `chrome.alarms`
- Estado crítico em `chrome.storage` (não memória volátil)

### 2. Permissions Strategy (Minimum Viable)
```json
{
  "permissions": ["storage", "sidePanel", "scripting"],
  "host_permissions": ["https://apps.univesp.br/*"],
  "optional_permissions": [] // Future: activeTab para menos invasividade
}
```

**Trade-off**: `host_permissions` específico vs `activeTab` (mais seguro mas requer user gesture).

### 3. Side Panel API Nativa
**De**: Popup customizado (`default_popup`)  
**Para**: `chrome.sidePanel` API nativa

Benefícios:
- UI nativa do Chrome (melhor UX)
- Comportamento contextual por aba
- Compliance automático com User Gesture policies

### 4. Content Script Injection
Mantém `chrome.scripting.executeScript` mas sem imports (ADR-002 BatchScraper):
- Scripts injetados são monolitos funcionais
- Sem dependências externas (limitação MV3)

### 5. Single Purpose Policy
**Propósito único da extensão**: "Produtividade Acadêmica UNIVESP"

Todas features convergem:
1. Gestão de Cursos → scrapers, organização
2. Navegação Inteligente → sidePanel, chips contextuais
3. Autopreenchimento SEI → login acadêmico (matrícula, protocolos)

**Risco mitigado**: SEI autofill justificado como função acadêmica (não genérica).

## Consequências
- **Positivo**: Compliance com Chrome Web Store (publicação garantida)
- **Positivo**: Melhor segurança (permissões mínimas, CSP rigoroso)
- **Positivo**: Side Panel nativo (melhor UX, menos código)
- **Positivo**: Service Worker economiza bateria vs Background Page
- **Negativo**: Service Worker efêmero complica debugging (logs perdidos)
- **Negativo**: Restrições de import em content scripts (ADR-002)
- **Negativo**: Migração de estado persistente para `chrome.storage`
- **Mitigação**: Logging estruturado via `chrome.storage.local` export

## Relacionado
- ADR-002 (BatchScraper monolito devido a MV3)
- ADR-005 (Logger precisa persistir em storage, não console)
- ADR-010 (Estratégia de sync/local storage)
- ISSUE-032 (Single Purpose)
- ISSUE-033 (Permission Audit)
- ISSUE-034 (Service Worker Lifecycle)
- ISSUE-036 (CWS Metadata)
- ISSUE-037 (Remote Code Audit)
- ISSUE-038 (sidePanel UX)
- ISSUE-039 (Content Script Security)
- ISSUE-040 (Asset Quality)
