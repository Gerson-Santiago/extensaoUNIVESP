---
description: Fluxo para correção de bugs com foco em reprodução via teste e conformidade com Lint.
---

# Passo 1: Análise e Reprodução
@LINTING_RULES.md @FLUXOS_DE_TRABALHO.md

Analise o erro reportado pelo usuário.
1. Crie um caso de teste em `tests/` que reproduza esse bug (o teste deve falhar inicialmente).
2. Verifique se o erro viola alguma regra de `LINTING_RULES.md` (ex: acesso inseguro a DOM, tipagem fraca).

# Passo 2: Correção
Realize a correção no código fonte.
- Mantenha a modularização.
- Se for uma correção no `content.js` ou `background.js`, verifique se o contexto de execução (Isolated World) foi respeitado.

# Passo 3: Verificação Dupla
// turbo
1. Rode o teste criado no Passo 1 (agora deve passar).
2. Rode `npm run lint`. O projeto tem política de "Zero Warnings". Se sua correção gerou um warning (ex: variável não usada), corrija.

# Passo 4: Registro
@CHANGELOG.md
Registre a correção na seção "Fixed" da versão atual no `CHANGELOG.md`.