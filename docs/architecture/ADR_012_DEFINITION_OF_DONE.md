# ADR-012: Definition of Done
**Status**: Aceito | **Data**: 2026-01-02

## Problema
VIS_MANIFESTO.md define "Refatoração exige teste" mas não há critério formal do que constitui "pronto para produção". Issues têm "Critérios de Aceite" sem padronização. Falta de DoD gera: PRs aprovados com testes faltando, cobertura de código diminuindo silenciosamente, ADRs não atualizados.

## Solução
**Definition of Done obrigatório** para TODOS Pull Requests (exceto `docs/` triviais):

### Checklist de PR (5 Pilares)

1. **Quality Gates**: `npm run test` (100% green, zero skipped) + `npm run lint` (`max-warnings=0`) + `npm run type-check` (zero erros)
2. **Test Coverage**: Cobertura mantida ou aumentada, novas funções públicas têm testes, padrão AAA aplicado
3. **Documentation**: ADRs atualizados se decisão arquitetural, JSDoc atualizado para funções públicas, `CHANGELOG.md` atualizado (PRs para `main`)
4. **Traceability**: Conventional Commits respeitado, Issues linkadas (`Closes #030`), breaking changes documentadas
5. **Code Review**: 1+ aprovação (se equipe > 1), comments endereçados

### Exceções
- **Docs triviais** (typos, formatação): Pode pular testes, ainda requer lint + conventional commits
- **Hotfixes emergenciais**: Podem entrar direto em `dev` (NÃO em `main`), requerem Issue retroativa + testes posteriores

## Trade-offs
- ✅ **Benefícios**: Qualidade consistente (reduz bugs produção), cobertura não decai, rastreabilidade total (ADR ↔ Issue ↔ PR ↔ Commit), onboarding mais fácil
- ⚠️ **Riscos**: Overhead em mudanças pequenas, pode bloquear urgências (mitigados por template de PR com checklist, hotfix exception)

## Refs
- [VIS_MANIFESTO.md](VIS_MANIFESTO.md) - "Refatoração exige teste"
- [ADR-000](ADR_000_FUNDAMENTALS.md) - AAA Testing Pattern
- [ADR-011](ADR_011_PROTECTED_BRANCHES.md) - Protected Branches dependem de DoD
- `.github/pull_request_template.md` (template futuro)

