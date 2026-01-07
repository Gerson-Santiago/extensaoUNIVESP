# ADR 012: Definition of Done
Status: Aceito | Data: 2026-01-02

## Contexto
VIS_MANIFESTO.md define "Refatoração exige teste" mas não há critério formal do que constitui uma mudança "pronta para produção". Issues individuais têm "Critérios de Aceite" mas sem padronização entre elas.

Falta de DoD gera:
- PRs aprovados com testes faltando
- Cobertura de código diminuindo silenciosamente
- ADRs não atualizados quando decisões arquiteturais mudam

## Decisão
**Definition of Done** obrigatório para TODOS Pull Requests (exceto `docs/` triviais):

### Checklist de PR (Obrigatório)

**1. Quality Gates**
- [ ] `npm run test` passa (100% green, zero skipped tests)
- [ ] `npm run lint` passa (zero warnings, `max-warnings=0`)
- [ ] `npm run type-check` passa (zero erros TypeScript via JSDoc)

**2. Test Coverage**
- [ ] Cobertura mantida ou aumentada (verificar `npm run test:coverage`)
- [ ] Novas funções públicas têm testes (unitários ou integração)
- [ ] Padrão AAA aplicado (ADR-000-C)

**3. Documentation**
- [ ] ADRs atualizados se decisão arquitetural foi tomada
- [ ] JSDoc atualizado para funções públicas modificadas
- [ ] `CHANGELOG.md` atualizado (apenas em PRs para `main`)

**4. Traceability**
- [ ] Conventional Commits respeitado
- [ ] Issues relacionadas linkadas no PR (e.g., "Closes #030")
- [ ] Breaking changes documentadas (se aplicável)

**5. Code Review**
- [ ] Pelo menos 1 aprovação (se equipe > 1 pessoa)
- [ ] Comments do reviewer endereçados

### Exceções Permitidas

**Mudanças triviais em `docs/`**:
- Correção de typos, formatação
- Pode pular testes (se não há código testável)
- Ainda requer lint e conventional commits

**Hotfixes emergenciais**:
- Podem entrar direto em `dev` (mas NÃO em `main`)
- Requerem Issue retroativa e testes de regressão posteriores

## Consequências
- **Positivo**: Qualidade consistente (reduz bugs em produção)
- **Positivo**: Cobertura de testes não decai silenciosamente
- **Positivo**: Rastreabilidade total (ADR ↔ Issue ↔ PR ↔ Commit)
- **Positivo**: Onboarding mais fácil (critério claro do que é "done")
- **Negativo**: Overhead em mudanças pequenas (mas críticas)
- **Negativo**: Pode bloquear urgências (mitigado por hotfix exception)
- **Mitigação**: Template de PR com checklist pré-preenchido

## Relacionado
- VIS_MANIFESTO.md (pilar "Refatoração exige teste")
- ADR-000-C (AAA Testing Pattern)
- ADR-015 (Protected Branches dependem de DoD)
- `.github/pull_request_template.md` (template futuro)
