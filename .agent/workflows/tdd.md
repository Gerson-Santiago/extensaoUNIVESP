---
description: TDD Red-Green-Refactor para todas as situações
---

# TDD Workflows

Três padrões de desenvolvimento guiado por testes.

## Bug-Fix (Red-Green)

### Fluxo
1. Branch → /git-flow (fix/issue-XXX-nome)
2. Red: Teste que FALHA (reproduz bug)
3. Green: Correção (teste PASSA)
4. Gate → /git-flow#quality-gate
5. Commit: fix(escopo): corrige X

## Nova Feature (Red-Green-Refactor)

### Fluxo
1. Branch → /git-flow (feat/nome)
2. Planejar: ADR se necessário, check privacidade
3. Red: Testes FALHAM (definem comportamento)
4. Green: Implementação PASSA
5. Refactor: Melhorar sem quebrar
6. Gate → /git-flow#quality-gate
7. Commit: feat(escopo): adiciona X

## Refactor (Green-Green)

### Fluxo
1. Branch → /git-flow (refactor/modulo)
2. Verde Inicial: TODOS testes OK
3. Refatorar: Melhorar estrutura/legibilidade
4. Verde Final: TODOS testes AINDA OK
5. Gate → /git-flow#quality-gate
6. Commit: refactor(escopo): melhora X

REGRA: Testes quebram = mudou comportamento (não é refactor)

Refs: /git-flow, docs/TEST_TEMPLATES.md, docs/architecture/ADR_000_C
