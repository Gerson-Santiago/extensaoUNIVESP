# ADR-009: Security-First Development
**Status**: Aceito | **Data**: 2026-01-02

## Problema
Audit de segurança revelou vulnerabilidades XSS: `innerHTML` não-sanitizado, tipos genéricos (`@type {*}`) escondendo contratos inseguros, falta de validação de dados externos (AVA, chrome.storage).

## Solução
**5 Regras Obrigatórias** para toda mudança de código:

1. **DOM Manipulation**: Zero `innerHTML` com dados dinâmicos não-sanitizados
   ```javascript
   // ❌ Errado: XSS vulnerability
   container.innerHTML = userData;
   
   // ✅ Correto: Seguro por padrão
   container.textContent = userData;
   ```

2. **Input Validation**: Todo dado externo validado antes de uso (AVA scraping, usuário, `chrome.storage`)

3. **Type Safety**: Zero `@type {*}` ou `@type {Object}` em produção (tipos explícitos previnem bugs)

4. **Error Handling**: `SafeResult` pattern obrigatório em I/O boundaries, erros **nunca** silenciados sem logging

5. **Storage Versioning**: Operações de escrita em `chrome.storage` com versionamento para detectar race conditions

### Checklist de PR
- [ ] Nenhum `innerHTML` com dados não-sanitizados?
- [ ] Tipos JSDoc explícitos em funções públicas?
- [ ] Testes cobrem caminhos de erro?
- [ ] Dados externos validados antes de uso?

## Trade-offs
- ✅ **Benefícios**: Redução drástica de surface de ataque XSS, auditoria de segurança via lint rules, confiabilidade aumentada
- ⚠️ **Riscos**: Maior verbosidade (DOM manual), curva de aprendizado para validação rigorosa (mitigados por helpers `DOMSafe`, `SafeRenderer`)

## Refs
- [ADR-000](ADR_000_FUNDAMENTALS.md) - JSDoc Type-Safety como primeira linha de defesa
- [ADR-002](ADR_002_SAFERESULT_PATTERN.md) - SafeResult para error handling seguro
- [ADR-010](ADR_010_MANIFEST_V3_STRATEGY.md) - CSP rigoroso do MV3
- [ADR-012](ADR_012_DEFINITION_OF_DONE.md) - DoD inclui checklist de segurança
- Issues: #028 (Storage versioning), #030 (Security audit), #031 (CSP implementation)
