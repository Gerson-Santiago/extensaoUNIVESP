---
description: Fluxo para correção de bugs com testes e lint.
---

> **Regra:** Bug sem teste é gambiarra.

# 1. Reprodução
@docs/PADROES_DO_PROJETO.md
- [ ] Crie um teste em `tests/` que reproduza o erro (deve falhar).
- [ ] Use `npm run test:debug` para rodar teste rapidamente (para no 1º erro)

# 2. Correção
- [ ] Corrija o código respeitando a modularização e privacidade.
- [ ] Use `npm run test:dev` (modo watch) para feedback contínuo

# 3. Validação
// turbo
Execute validação completa:
```bash
npm run security  # Secrets + Audit + Security Lint
npm run verify    # Tests + Lint + Type-check
```

# 4. Entrega
@docs/PADROES_DO_PROJETO.md
- [ ] Testes passando? Lint ok? Segurança ok?
- [ ] Proponha commit em PT-BR (ex: `fix: corrige X`).

---

## 💡 Comandos Úteis

**Testes:**
- `npm run test:debug` - Para no primeiro erro
- `npm run test:dev` - Modo watch interativo

**Segurança:**
- `npm run security:secrets` - Detecta API keys, tokens
- `npm run security:audit` - Vulnerabilidades em dependências
- `npm run security` - Gate completo