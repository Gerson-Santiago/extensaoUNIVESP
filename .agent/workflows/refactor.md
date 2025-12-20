---
description: Refatora código mantendo comportamento (Green-Green).
---

> **Regra:** Só refatore se houver testes cobrindo.

# 1. Auditoria
@tests/
- [ ] Existem testes para essa área?
    - **NÃO**: Pare. Crie testes antes.
    - **SIM**: Rode-os para garantir que passam.

# 2. Refatoração
@docs/PADROES_DO_PROJETO.md
- [ ] Extraia funções/classes ou melhore tipos (JSDoc Strict).
- [ ] Crie/Atualize **Models** se necessário.
- [ ] Mantenha comportamento inalterado.

# 3. Validação
// turbo
Execute o workflow de verificação:
- [ ] /verificar

# 4. Entrega
- [ ] Atualize diagramas em `docs/TECNOLOGIAS_E_ARQUITETURA.md` se necessário.
- [ ] Proponha commit (ex: `refactor: extrai service`).