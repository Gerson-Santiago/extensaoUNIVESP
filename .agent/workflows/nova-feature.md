---
description: Planeja e implementa nova feature (TDD).
---

> **Regras:** 1. Não instale nada sem pedir. 2. TDD (teste primeiro).

# 1. Planejamento
@docs/TECNOLOGIAS_E_ARQUITETURA.md @docs/DATA_HANDLING.md
- [ ] Defina responsabilidade (View vs Logic).
- [ ] Verifique privacidade (Local-First).
- [ ] Verifique se precisa de novas permissões no `manifest.json`.

# 2. TDD (Red Phase)
- [ ] Crie teste em `tests/` que falhe.

# 3. Implementação
@docs/PADROES_DO_PROJETO.md @docs/LINTING_RULES.md
- [ ] Codifique usando ES Modules e Tipagem defensiva.

# 4. Validação
// turbo
Execute o workflow de verificação:
- [ ] /verificar

# 5. Entrega
@CHANGELOG.md
- [ ] Atualize `docs/TECNOLOGIAS_E_ARQUITETURA.md` se mudou estrutura.
- [ ] **Check de Arquivos**: Rode `git status` e verifique se há arquivos novos (docs, tests) não rastreados.
- [ ] Adicione ao `CHANGELOG.md` (Não Publicado).
- [ ] Proponha commit seguindo a **Regra de Ouro**:
    - `feat: adiciona login` (✅ Português Inválido? Não! É Válido!)
    - `feat: add login` (❌ Inglês Proibido!)