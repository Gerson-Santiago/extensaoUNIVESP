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
Execute validação rápida:
```bash
npm run test:quick  # Apenas testes que falharam
```

Validação completa antes de commit:
```bash
npm run verify  # Testes + lint + type-check
```

# 4. Entrega
@docs/PADROES_DO_PROJETO.md
- [ ] Testes passando? Lint ok?
- [ ] Proponha commit em PT-BR (ex: `fix: corrige X`).

---

## 💡 Comandos Jest Úteis

- `npm run test:debug` - Para no primeiro erro (debug rápido)
- `npm run test:dev` - Modo watch interativo
- `npm run test:quick` - Apenas testes que falharam
- `npm test` - Suite completa