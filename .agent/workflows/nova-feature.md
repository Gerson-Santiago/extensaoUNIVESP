---
description: Planeja e implementa uma nova funcionalidade seguindo o ciclo de vida do projeto (TDD, MVC, Linting).
---

---
description: Planeja e implementa uma nova funcionalidade seguindo o ciclo de vida do projeto (TDD, MVC, Linting).
---

# Passo 1: Auditoria de Arquitetura e Privacidade
@TECNOLOGIAS_E_ARQUITETURA.md @PADROES_DO_PROJETO.md @DATA_HANDLING.md @manifest.json

Analise a solicitação do usuário. Antes de escrever código, responda:
1. **Separação de Responsabilidades:** A funcionalidade pertence a `sidepanel/views` (UI), `sidepanel/logic` (Regra de Negócio) ou `scripts/` (DOM)? (Lembre-se: Views não devem ter lógica pesada).
2. **Privacidade:** A funcionalidade manipula dados sensíveis? Verifique `DATA_HANDLING.md` para garantir que nada seja enviado para fora (Local-First).
3. **Manifesto:** Precisamos de novas permissões no `manifest.json`?

# Passo 2: Planejamento de Testes (TDD)
@tests/ @jest.config.js

Como definido em `FLUXOS_DE_TRABALHO.md`, "Se não está testado, não existe".
1. Liste quais testes unitários ou de integração são necessários.
2. Identifique se será necessário mockar `chrome.storage` ou `chrome.tabs`.
3. Crie ou atualize o arquivo de teste correspondente em `tests/` *antes* de implementar a lógica principal.

# Passo 3: Implementação
@PADROES_DO_PROJETO.md @eslint.config.mjs

Escreva o código seguindo estas regras estritas:
1. **ES Modules:** Use `import/export`.
2. **Tipagem:** Use Type Guards (ex: `element instanceof HTMLInputElement`) para evitar erros de tipagem, conforme `LINTING_RULES.md`.
3. **Estilo:** Use aspas simples e ponto e vírgula, conforme o Prettier.
4. **CSS:** Se houver UI, crie o arquivo em `sidepanel/styles/` (não use estilos inline).

# Passo 4: Validação (Lint e Testes)
// turbo
Execute os comandos de verificação:
1. `npm run lint` (Deve retornar 0 erros).
2. `npm test` (Todos os testes devem passar).

Se houver erros, corrija-os imediatamente. Não apresente código com falhas de lint.

# Passo 5: Documentação
@CHANGELOG.md

1. Adicione uma entrada na seção "Não Publicado" ou crie uma nova versão no `CHANGELOG.md` seguindo o padrão Keep a Changelog.