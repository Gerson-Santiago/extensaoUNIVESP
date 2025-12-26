---
description: Refatora código mantendo comportamento (Green-Green).
---

> **Regra:** Só refatore se houver testes cobrindo.

# 1. Auditoria
@tests/
- [ ] Existem testes para essa área?
    - **NÃO**: Pare. Crie testes antes.
    - **SIM**: Rode-os para garantir que passam.
- [ ] Use `npm run test:quick` para validação rápida

# 2. Refatoração
@docs/PADROES_DO_PROJETO.md
- [ ] Extraia funções/classes ou melhore tipos (JSDoc Strict).
- [ ] Crie/Atualize **Models** se necessário.
- [ ] Mantenha comportamento inalterado.
- [ ] Use `npm run test:dev` (modo watch) para feedback contínuo durante refatoração

# 3. Validação
// turbo
Execute o workflow de verificação:
```bash
npm run test:quick  # Rápido durante desenvolvimento
npm run verify      # Completo antes de commit
```

# 4. Entrega
- [ ] Atualize diagramas em `docs/TECNOLOGIAS_E_ARQUITETURA.md` se necessário.
- [ ] Proponha commit (ex: `refactor: extrai service`).

---

## 💡 Comandos Jest Úteis

- `npm run test:dev` - Modo watch (ideal para refatoração)
- `npm run test:debug` - Para no primeiro erro  
- `npm run test:quick` - Apenas testes que falharam
- `npm test` - Suite completa