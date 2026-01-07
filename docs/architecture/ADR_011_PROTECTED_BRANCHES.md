# ADR-011: Protected Branches & Git Flow
**Status**: Aceito | **Data**: 2026-01-02

## Problema
Commits diretos em `main` ou `dev` podem introduzir bugs em produção sem revisão. VIS_MANIFESTO.md define "Zero Broken Windows" mas o workflow não estava formalizado em ADR. Workflow `/git-flow` existe mas decisão arquitetural não documentada.

## Solução
**Git Flow obrigatório** com proteção de branches principais:

### Estrutura: `main` ← (`dev` ← `feature/*`)

**Branch `main`** (produção):
- PR-only de `dev`
- Requer `npm run verify` passing + tag `v2.x.x`
- Commits diretos **PROIBIDOS**

**Branch `dev`** (staging):
- PR-only de feature branches
- Requer `npm test` passing
- Commits diretos **PROIBIDOS** (exceto hotfixes emergenciais)

**Feature Branches**:
- Nomenclatura: `feat/`, `fix/`, `refactor/`, `docs/` + `slug-descritivo`
- Baseadas em `dev`, merged via PR, deletadas após merge

### Conventional Commits (obrigatório)
```
<tipo>(escopo): descrição

feat(cursos): adiciona filtro de semestre
fix(navegação): corrige scroll em abas lentas
```
Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

### Workflow de Release
1. Criar `release/v2.x.x` de `dev`
2. Atualizar `CHANGELOG.md`, `package.json`, `manifest.json`
3. PR para `main` + tag `v2.x.x`
4 Merge back para `dev`

## Trade-offs
- ✅ **Benefícios**: Histórico limpo e rastreável, rollback fácil (revert merge commit), code review obrigatório, CI/CD valida PRs
- ⚠️ **Riscos**: Overhead para mudanças triviais, requer disciplina (mitigados por permitir fast-forward em docs/ para typos)

## Refs
- [VIS_MANIFESTO.md](VIS_MANIFESTO.md) - "Zero Broken Windows"
- `PADROES.md` - Conventional Commits
- `.agent/workflows/git-flow.md` - Workflow executável
- `.agent/workflows/release-prod.md` - Processo de release

