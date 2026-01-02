# ADR 012: Security-First Development (Addendum)

**Status:** Proposto  
**Data:** 02/01/2026  
**Contexto:** Audit de segurança revelou que os ADRs atuais não mencionam explicitamente práticas anti-XSS, validação de entrada ou CSP.

---

## Decisão
Todas as features e refatorações DEVEM considerar segurança como requisito não-funcional prioritário.

### Regras Obrigatórias
1. **DOM Manipulation:** Usar `textContent` ou `createElement`. `innerHTML` permitido APENAS se sanitizado explicitamente.
2. **Input Validation:** Todo dado externo (AVA, usuário, storage) DEVE ser validado antes de uso.
3. **Type Safety:** Zero `@type {*}` ou `@type {Object}` em código de produção.
4. **Error Handling:** Usar `SafeResult` pattern. Erros NÃO podem ser silenciados.
5. **Storage:** Operações de escrita devem usar versionamento (Issue-028).

### Checklist de PR
- [ ] Nenhum `innerHTML` com dados dinâmicos?
- [ ] Tipos JSDoc explícitos?
- [ ] Testes cobrem caminhos de erro?

---

## Consequências
- **Positivo:** Redução drástica de surface de ataque (XSS, race conditions).
- **Negativo:** Maior verbosidade no código (mais linhas para criar DOM manualmente).
- **Mitigação:** Criar helpers reutilizáveis (`DomBuilder`, `SafeRenderer`).

---

**Relacionado:** Issue-030, Issue-031, Issue-028
