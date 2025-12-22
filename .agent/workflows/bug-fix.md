---
description: Fluxo para correção de bugs com testes e lint.
---

> **Regra:** Bug sem teste é gambiarra.

# 1. Reprodução
@docs/PADROES_DO_PROJETO.md
- [ ] Crie um teste em `tests/` que reproduza o erro (deve falhar).

# 2. Correção
- [ ] Corrija o código respeitando a modularização e privacidade.

# 3. Validação
// turbo
Execute o workflow de verificação:
- [ ] /verificar

# 4. Entrega
@docs/PADROES_DO_PROJETO.md
- [ ] Testes passando? Lint ok?
- [ ] Proponha commit em PT-BR (ex: `fix: corrige X`).