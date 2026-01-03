# SPEC-003: Content Script Security

**Prioridade**: 🟡 Alta  
**Estimate**: 0.5 dia  
**Issues**: ISSUE-039  
**EPIC**: EPIC-001

## Escopo
Audit e Hardening de `SeiLoginContentScript.js`.

**Ações**:
- [x] Auditar uso de `innerHTML` (Confirmado zero).
- [ ] Substituir `console.warn` por `Logger`.
- [ ] Validar permissions no manifest.

## Critérios de Aceite
- `SeiLoginContentScript.js` usando `Logger`.
- Zero `innerHTML`.
- Teste manual de injection passando.
