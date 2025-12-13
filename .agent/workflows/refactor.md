---
description: Refatora código existente para melhorar a legibilidade, modularização e adequação aos padrões do projeto.
---

---
description: Refatora código existente para melhorar a legibilidade, modularização e adequação aos padrões do projeto.
---

# Passo 1: Análise de Conformidade
@PADROES_DO_PROJETO.md @LINTING_RULES.md

Leia o arquivo alvo e identifique:
1. Funções muito longas que podem ser extraídas para `shared/utils` ou `sidepanel/logic`.
2. Lógica de negócios misturada dentro de arquivos de View (`.js` de UI).
3. Violações de "Type Safety" (ex: uso de `any` implícito ou falta de checagem de `null`).

# Passo 2: Reestruturação Segura
1. Proponha a nova estrutura de arquivos (se necessário criar novos módulos).
2. Faça as alterações de código mantendo a funcionalidade original.
3. Certifique-se de usar JSDoc para documentar novas funções.

# Passo 3: Garantia de Qualidade
@tests/
// turbo
1. Execute `npm test` para garantir que a refatoração não quebrou nada (Regressão).
2. Execute `npm run lint` para garantir que o novo código está limpo.