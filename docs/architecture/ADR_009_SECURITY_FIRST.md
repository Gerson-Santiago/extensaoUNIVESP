# ADR 009: Security-First Development
Status: Aceito | Data: 2026-01-02

## Contexto
Audit de segurança revelou que os ADRs atuais não mencionavam explicitamente práticas anti-XSS, validação de entrada ou Content Security Policy (CSP). Código de produção tinha vulnerabilidades potenciais:
- Uso de `innerHTML` com dados não-sanitizados
- Tipos genéricos (`@type {*}`) escondendo contratos inseguros
- Falta de validação de dados externos (AVA, chrome.storage)

## Decisão
Todas as features e refatorações **DEVEM** considerar segurança como requisito não-funcional prioritário.

### Regras Obrigatórias

**1. DOM Manipulation**
```javascript
// ❌ Errado: XSS vulnerability
container.innerHTML = userData;

// ✅ Correto: Seguro por padrão
container.textContent = userData;
// ou
const el = document.createElement('div');
el.textContent = userData;
container.appendChild(el);
```

`innerHTML` permitido **APENAS** se sanitizado explicitamente via biblioteca confiável.

**2. Input Validation**  
Todo dado externo (AVA scraping, usuário, chrome.storage) **DEVE** ser validado:
- Type checking via JSDoc (ADR-000-B)
- Validação de schema para objetos complexos
- Sanitização de strings antes de renderização

**3. Type Safety**  
Zero `@type {*}` ou `@type {Object}` em código de produção. Tipos explícitos previnem bugs de segurança.

**4. Error Handling**  
Usar `SafeResult` pattern (ADR-003). Erros **NÃO** podem ser silenciados sem logging.

**5. Storage Versioning**  
Operações de escrita em `chrome.storage` devem usar versionamento para detectar race conditions.

### Checklist de PR
- [ ] Nenhum `innerHTML` com dados dinâmicos não-sanitizados?
- [ ] Tipos JSDoc explícitos em todas funções públicas?
- [ ] Testes cobrem caminhos de erro (falha de validação)?
- [ ] Dados externos validados antes de uso?

## Consequências
- **Positivo**: Redução drástica de surface de ataque (XSS, race conditions)
- **Positivo**: Auditoria de segurança via lint rules customizadas
- **Negativo**: Maior verbosidade (mais linhas para criar DOM manualmente)
- **Negativo**: Curva de aprendizado para validação rigorosa
- **Mitigação**: Criar helpers reutilizáveis (`DomBuilder`, `SafeRenderer`)

## Relacionado
- ADR-000-B (JSDoc Typing como primeira linha de defesa)
- ADR-003 (SafeResult para error handling seguro)
- Issue-028 (Storage versioning)
- Issue-030 (Security audit)
- Issue-031 (CSP implementation)
