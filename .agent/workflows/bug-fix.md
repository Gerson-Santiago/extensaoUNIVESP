---
description: Fluxo para correção de bugs com testes e lint.
---

# 🐛 Workflow: Correção de Bug (Bug-Fix)

Protocolo profissional para identificação, isolamento e resolução de bugs.

## 1. Protocolo de Início (Git Flow)
Antes de começar, você **DEVE** criar uma branch de correção:
- Branch: `fix/issue-XXX-descricao-curta`
- Protocolo: `/git-flow`

## 2. Inspecionar e Ancorar
- [ ] Leia o log/issue com atenção.
- [ ] Identifique o arquivo e a linha provável do erro.

## 3. TDD: Reprodução (Red)
- [ ] Crie um teste que **reproduza** o bug (o teste deve falhar).
- [ ] O teste deve seguir o padrão AAA (`ADR-000-C`).

## 4. Correção e Estabilização (Green)
- [ ] Implemente a correção técnica.
- [ ] Garante que o teste de regressão criado no passo anterior agora passa.
- [ ] Verifique se outros testes relacionados permanecem verdes.

## 5. Quality Gate Final
// turbo
Antes de finalizar, execute a verificação completa (Referência: `/verificar`):
```bash
npm run verify
```

## 6. Entrega (Conventional Commits)
- [ ] Commit Mensagem: `fix(escopo): corrige bug X na feature Y`
- [ ] Siga o protocolo de commit em `docs/FLUXOS_DE_TRABALHO.md`.
- [ ] Exclua a branch após o merge bem-sucedido na `dev`.