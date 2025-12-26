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
- [ ] Use `npm run test:debug` para validar que falha

# 3. Implementação
@docs/PADROES_DO_PROJETO.md
- [ ] Defina **Models** JSDoc explícitos em `models/` antes da lógica.
- [ ] Codifique usando ES Modules e Tipagem defensiva.
- [ ] Use `addEventListener` com `PointerEvent` para interações.
- [ ] Use `npm run test:dev` (modo watch) para desenvolvimento iterativo

# 4. Validação
// turbo
Execute validação rápida durante desenvolvimento:
```bash
npm run test:quick  # Apenas testes que falharam
```

Validação completa antes de commit:
```bash
npm run verify  # Testes + lint + type-check
```

# 5. Entrega
@CHANGELOG.md
- [ ] Atualize `docs/TECNOLOGIAS_E_ARQUITETURA.md` se mudou estrutura.
- [ ] **Check de Arquivos**: Rode `git status` e verifique se há arquivos novos (docs, tests) não rastreados.
- [ ] Adicione ao `CHANGELOG.md` (Não Publicado).
- [ ] Proponha commit seguindo a **Regra de Ouro**:
    - `feat: adiciona login` (✅ Português Inválido? Não! É Válido!)
    - `feat: add login` (❌ Inglês Proibido!)

---

## 💡 Comandos Jest Úteis

- `npm run test:dev` - Modo watch (desenvolvimento)
- `npm run test:debug` - Para no primeiro erro
- `npm run test:quick` - Apenas testes que falharam
- `npm test` - Suite completa