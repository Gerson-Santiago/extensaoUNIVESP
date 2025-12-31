---
description: Refatora código mantendo comportamento (Green-Green).
---

# 🔧 Workflow: Refatoração Técnica

Protocolo profissional para melhorar a estrutura do código sem alterar suas funcionalidades externas (Blackbox).

## 1. Protocolo de Início (Git Flow)
Refatorações devem ser isoladas em branches específicas.
- Branch: `refactor/issue-XXX-objetivo`
- Protocolo: `/git-flow`

## 2. Ponto de Partida (Green)
Antes de alterar qualquer linha, garanta que os testes atuais estão passando.
```bash
npm test <arquivo-alvo>
```

## 3. Refatoração Evolutiva (Green-Green)
- [ ] Altere pequenos blocos de código.
- [ ] Execute os testes repetidamente (use `npm run test:watch`).
- [ ] Se os testes falharem, você alterou o comportamento. Volte e corrija.

## 4. Quality Gate Final
// turbo
Uma refatoração só é válida se não introduzir regressões (Referência: `/verificar`):
```bash
npm run verify
```

## 5. Entrega (Conventional Commits)
- [ ] Commit Mensagem: `refactor(escopo): simplifica lógica X` ou `refactor: move utils para shared`
- [ ] O commit de refactor NÃO deve conter novas funcionalidades.