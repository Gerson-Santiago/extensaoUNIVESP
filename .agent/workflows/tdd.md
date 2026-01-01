description: TDD Red-Green-Refactor

TDD WORKFLOWS

Três padrões de desenvolvimento guiado por testes.

BUG-FIX (Red-Green)
1. Branch → /git-flow (fix/issue-XXX-nome)
2. Red: Teste FALHA (reproduz bug)
3. Green: Correção PASSA
4. Gate → /git-flow#quality-gate
5. Commit: fix(escopo): corrige X

NOVA FEATURE (Red-Green-Refactor)
1. Branch → /git-flow (feat/nome)
2. Planejar: ADR se necessário, check privacidade
3. Red: Testes FALHAM
4. Green: Implementação PASSA
5. Refactor: Melhorar sem quebrar
6. Gate → /git-flow#quality-gate
7. Commit: feat(escopo): adiciona X

REFACTOR (Green-Green)
1. Branch → /git-flow (refactor/modulo)
2. Verde Inicial: TODOS testes OK
3. Refatorar
4. Verde Final: TODOS testes OK
5. Gate → /git-flow#quality-gate
6. Commit: refactor(escopo): melhora X

REGRA: Testes quebram = mudou comportamento (não é refactor)

Refs: /git-flow, docs/TEST_TEMPLATES.md, docs/architecture/ADR_000_C
