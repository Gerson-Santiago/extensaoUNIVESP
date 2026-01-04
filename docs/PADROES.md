# Guia de Estilo e Padrões

[[README](README.md)] | [[Arquitetura](TECNOLOGIAS_E_ARQUITETURA.md)]

### 1. Qualidade Estática
- ESLint (semicolon, single quotes, no-unused).
- Prettier (100 chars width).
- JSDoc (Tipagem obrigatória em models e funções públicas).

- ESM: Use estritamente import/export.

### 3. Segurança MV3 (ADR-012/Issue-030)
- **Trusted Types**: Todas as manipulações de DOM devem usar a policy `dom-safe-policy`. Proibido `innerHTML`.
- **Least Privilege**: Permissões no `manifest.json` devem ser restritas ao mínimo necessário para a funcionalidade (ex: `activeTab` pref. a `tabs`).
- **Content Security Policy**: Política estrita que proíbe `eval()` e scripts remotos.

### 3. Testes (AAA)
- Arrange: Setup e mocks.
- Act: Invocação.
- Assert: Verificação.
Foco em Português Brasileiro para descrições.

### 5. Commits (Conventional)
- Formato: `<tipo>(<escopo>): <descrição>`
- Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.
- Referências: Sempre incluir `Refs: ISSUE-XXX` ou `Closes #XX`.

---
[README](README.md)
