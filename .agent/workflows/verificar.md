---
description: Executa a verificação completa do projeto (Lint + Testes) conforme a política de qualidade.
---

# Passo 1: Verificação de Estilo e Regras
@LINTING_RULES.md
// turbo
Execute os linters para garantir que o código está em conformidade.
1. `npm run lint`

# Passo 2: Testes Automatizados
@tests/
// turbo
Execute a suíte de testes para garantir que não há regressões.
1. `npm test`

# Passo 3: Relatório
Se algum passo acima falhou, não prossiga com commits ou PRs até corrigir.
- Lint errors devem ser zerados.
- Testes devem estar todos passando (Green).
