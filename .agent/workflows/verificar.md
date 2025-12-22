---
description: Executa a verificação completa do projeto (Lint + Testes) conforme a política de qualidade.
---

# Passo Único: Verificação Completa
@docs/PADROES_DO_PROJETO.md
// turbo
Execute a pipeline de qualidade (Testes + Lint + Types):
1. `npm run verify`

# Relatório
Se falhar, não prossiga.
- Lint errors devem ser zerados.
- Testes devem estar todos passando (Green).