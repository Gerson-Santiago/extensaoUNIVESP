---
description: 
---

description: Git Flow + Quality Gate

GIT FLOW OBRIGATÓRIO - Proteção de Branches

REGRA ABSOLUTA:
NUNCA trabalhar diretamente nas branches:
- main (produção)
- dev (integração)

WORKFLOW CORRETO:

1. Antes de Qualquer Trabalho
git branch --show-current
Se em dev ou main → PARAR e criar feature branch

2. Criar Feature Branch
git switch dev
git pull origin dev
git switch -c feat/issue-XXX-descricao

Exemplos:
git switch -c feat/issue-015-navigation-mock
git switch -c fix/bug-scroll-loading
git switch -c refactor/cleanup-imports

3. Trabalhar na Feature Branch
git branch --show-current
git add .
git commit -m "feat: implementa feature X"

4. Integrar na Dev
git switch dev
git pull origin dev
git switch feat/issue-XXX-descricao
git rebase dev
git push origin feat/issue-XXX-descricao

5. Merge para Dev
OPÇÃO A (PR): Criar PR no GitHub → Code review → Merge
OPÇÃO B (local):
git switch dev
git merge feat/issue-XXX-descricao --no-ff
git push origin dev
git branch -d feat/issue-XXX-descricao
git push origin --delete feat/issue-XXX-descricao

ANTI-PADRÕES:

ERRADO - Trabalhar direto na dev:
git switch dev
git commit -m "feat: alguma coisa"

CORRETO - Criar branch:
git switch dev
git switch -c feat/minha-feature
git commit -m "feat: alguma coisa"

CHECKLIST ANTES DE COMMIT:
[ ] Executou git branch --show-current?
[ ] Branch atual NÃO é dev nem main?
[ ] Branch segue padrão feat/, fix/, refactor/?

PROTEÇÃO:
Se commit acidental em dev/main:
1. NÃO FAZER PUSH
2. git reset HEAD~1
3. git switch -c feat/issue-XXX-descricao
4. git commit -m "mensagem original"

EXEMPLO COMPLETO:
git switch dev
git pull origin dev
git switch -c feat/issue-015-navigation-mock
git add .
git commit -m "refactor(services): implementa tipos JSDoc"
git push origin feat/issue-015-navigation-mock
git switch dev
git pull origin dev
git merge feat/issue-015-navigation-mock --no-ff
git push origin dev
git branch -d feat/issue-015-navigation-mock
git push origin --delete feat/issue-015-navigation-mock

PENALIDADE:
Commits diretos em dev/main:
- Dificultam rollback
- Quebram rastreabilidade
- Violam Git Flow
- Podem causar perda de trabalho

SEMPRE usar feature branches.

QUALITY GATE:

Validação antes de commit/push.

Durante Desenvolvimento:
npm run check

Antes de Commit:
npm run test:quick

Antes de Push dev/main (SOLICITAR usuário nunca EXECUTAR npm):
npm run verify



NUNCA EXECUTAR NPM 

+IA NUNCA executa sem permissão (limite RAM):
+- npm run verify
+- npm run test / npm test
+- npm run test:coverage
+- npm run test:debug
+- npm run type-check

Segurança (opcional):
npm run security:secrets

Refs: docs/ANTI_PADROES.md, docs/RESTRICOES_INFRAESTRUTURA.md