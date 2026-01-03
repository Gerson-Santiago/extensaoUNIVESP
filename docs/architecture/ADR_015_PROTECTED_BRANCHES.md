# ADR 015: Protected Branches & Git Flow
Status: Aceito | Data: 2026-01-02

## Contexto
Commits diretos em `main` ou `dev` podem introduzir bugs em produção sem revisão. VIS_MANIFESTO.md define "Zero Broken Windows" (branch sempre verde) mas o workflow não estava formalizado em ADR.

Workflow `/git-flow` existe mas decisão arquitetural não estava documentada.

## Decisão
**Git Flow obrigatório** com proteção de branches principais:

### Estrutura de Branches

```
main (produção)
  ↑
  PR only
  ↑
dev (staging)
  ↑
  PR only
  ↑
feature/* | fix/* | refactor/* | docs/*
```

### Regras de Proteção

**1. Branch `main`**
- ✅ Apenas via Pull Request de `dev`
- ✅ Requer `npm run verify` passing (lint + type-check + tests)
- ✅ Requer tag de versão (`v2.x.x`)
- ❌ Commits diretos: **PROIBIDOS**

**2. Branch `dev`**
- ✅ Apenas via Pull Request de feature branches
- ✅ Requer testes passando (`npm test`)
- ❌ Commits diretos: **PROIBIDOS** (exceto hotfixes emergenciais)

**3. Feature Branches**
- Nomenclatura: `tipo/slug-descritivo`
  - `feat/settings-backup`
  - `fix/zombie-dom`
  - `refactor/repositories`
  - `docs/adr-security`
- Baseadas em `dev`, merged de volta via PR
- Deletadas após merge

### Conventional Commits
Formato obrigatório (já documentado em `PADROES.md`):
```
<tipo>(<escopo>): <descrição>

feat(cursos): adiciona filtro de semestre
fix(navegação): corrige scroll em abas lentas
docs(adr): adiciona ADR-013 sobre Manifest V3
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

### Workflow de Release
1. Criar branch `release/v2.x.x` de `dev`
2. Atualizar `CHANGELOG.md`, `package.json`, `manifest.json`
3. PR para `main` + criar tag `v2.x.x`
4. Merge back para `dev`

## Consequências
- **Positivo**: Histórico limpo e rastreável (cada feature é um PR)
- **Positivo**: Rollback fácil (revert de merge commit)
- **Positivo**: Code review obrigatório (detecta bugs antes de merge)
- **Positivo**: CI/CD pode rodar em PRs (validação automática)
- **Negativo**: Overhead para mudanças triviais (typos em docs)
- **Negativo**: Requer disciplina da equipe
- **Mitigação**: Permitir fast-forward em `docs/` para correções mínimas (typos)

## Relacionado
- VIS_MANIFESTO.md (pilar "Zero Broken Windows")
- `PADROES.md` (Conventional Commits)
- `.agent/workflows/git-flow.md` (workflow executável)
- `.agent/workflows/release-prod.md` (processo de release)
