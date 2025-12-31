---
description: Planeja e implementa nova feature (TDD).
---

# ✨ Workflow: Nova Funcionalidade (Nova Feature)

Protocolo profissional para criação de novos domínios ou funcionalidades, priorizando TDD e Arquitetura Screaming.

## 1. Protocolo de Início (Git Flow)
Nenhuma funcionalidade deve ser escrita diretamente na `dev`.
- Branch: `feat/issue-XXX-nome-da-feature`
- Protocolo: `/git-flow`

## 2. Planejamento Arquitetural
- [ ] Defina o domínio dentro de `features/`.
- [ ] Identifique as camadas necessárias (Models, Service, UI, Repository).
- [ ] Verifique se o ADR de JSDoc Typing (`ADR-000-B`) será aplicado em modelos novos.

## 3. TDD (Ciclo Red-Green-Refactor)
1. **Red**: Escreva o teste de especificação da feature.
2. **Green**: Implemente o código mínimo para o teste passar.
3. **Refactor**: Melhore a estrutura mantendo o teste verde.

## 4. Quality Gate Final
// turbo
O código só é considerado "pronto" após passar no Quality Gate (Referência: `/verificar`):
```bash
npm run verify
```

## 5. Documentação
- [ ] Se a feature introduz novos padrões, crie ou atualize um ADR.
- [ ] Atualize o `README.md` se necessário.
- [ ] Se houver mudança de comportamento visível, atualize o `CHANGELOG.md` via `/versionamento`.

## 6. Entrega (Conventional Commits)
- [ ] Commit Mensagem: `feat(escopo): adiciona funcionalidade Z`
- [ ] Siga o protocolo de commit em `docs/FLUXOS_DE_TRABALHO.md`.