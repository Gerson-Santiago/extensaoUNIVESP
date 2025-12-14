---
description: Planeja e implementa uma nova funcionalidade seguindo o ciclo de vida do projeto (TDD, MVC, Linting).
---

---
description: Planeja e implementa uma nova funcionalidade seguindo o ciclo de vida do projeto (TDD, MVC, Linting).
---

> [!WARNING]
> **Regras de Ouro:**
> 1. Proibido `npm install` sem autorização prévia.
> 2. Proibido commitar sem Gate de Manual.
> 3. TDD Rigoroso: Comece pelo teste (Red).

# 🕵️ Passo 1: Auditoria de Arquitetura e Privacidade
@TECNOLOGIAS_E_ARQUITETURA.md @PADROES_DO_PROJETO.md @DATA_HANDLING.md @manifest.json

Analise a solicitação do usuário. Antes de escrever código, responda:
- [ ] **Separação de Responsabilidades:** A funcionalidade pertence a `sidepanel/views` (UI), `sidepanel/logic` (Regra de Negócio) ou `scripts/` (DOM)? (Lembre-se: Views não devem ter lógica pesada).
- [ ] **Privacidade:** A funcionalidade manipula dados sensíveis? Verifique `DATA_HANDLING.md` para garantir que nada seja enviado para fora (Local-First).
- [ ] **Manifesto:** Precisamos de novas permissões no `manifest.json`?

# 🧪 Passo 2: Planejamento de Testes (TDD Rigoroso)
@tests/ @jest.config.js

Como definido em `FLUXOS_DE_TRABALHO.md`, "Se não está testado, não existe".
- [ ] Liste quais testes unitários ou de integração são necessários.
- [ ] Identifique se será necessário mockar `chrome.storage` ou `chrome.tabs`.
- [ ] **Red Phase**: Crie o arquivo de teste em `tests/` e execute-o. **Ele DEVE falhar** (pois a feature não existe). Se passar, seu teste está errado.
// turbo
Run `npm test` -> Deve falhar.

# 💻 Passo 3: Implementação
@PADROES_DO_PROJETO.md @eslint.config.mjs

Escreva o código seguindo estas regras estritas:
- [ ] **ES Modules:** Use `import/export`.
- [ ] **Tipagem:** Use Type Guards (ex: `element instanceof HTMLInputElement`) para evitar erros de tipagem, conforme `LINTING_RULES.md`.
- [ ] **Estilo:** Use aspas simples e ponto e vírgula, conforme o Prettier.
- [ ] **CSS:** Se houver UI, crie o arquivo em `sidepanel/styles/` (não use estilos inline).

# 🧹 Passo 4: Validação (Lint e Testes)
// turbo
Execute os comandos de verificação:
- [ ] `npm run lint` (Deve retornar 0 erros).
- [ ] `npm test` (Todos os testes devem passar).

Se houver erros, corrija-os imediatamente. Não apresente código com falhas de lint.

# 🔄 Passo 5: Checagem de Alinhamento (Co-evolução)
Antes de finalizar, responda:
- [ ] "Eu alterei a lógica do produto?" -> Sim.
- [ ] "Eu editei o arquivo de teste correspondente para refletir isso?"
    - Se **SIM**: Ótimo.
    - Se **NÃO**: **ALERTA**. Você criou uma feature sem garantir que o teste a cobre especificamente ou o teste passou por falso positivo. Revise.

# 📝 Passo 6: Documentação e Arquitetura
@CHANGELOG.md @TECNOLOGIAS_E_ARQUITETURA.md

- [ ] Se a nova feature alterou a estrutura do projeto ou introduziu novos conceitos, atualize `TECNOLOGIAS_E_ARQUITETURA.md`.
- [ ] Adicione uma entrada na seção "Não Publicado" no `CHANGELOG.md`.

# 🛡️ Passo 7: Gate de Entrega (Manual)
**PARE AGORA.**
Não abra PR nem faça commit na main/dev sem revisão.
- [ ] Liste para o usuário o comando exato para testar a feature.
- [ ] **Sugestão de Commit**: Proponha uma mensagem de commit em **Português (PT-BR)** seguindo o padrão (`feat: descrição`).
- [ ] Pergunte: "Posso finalizar e commitar?"
- [ ] Se aprovado: Faça o commit (O Husky corrigirá formatação automaticamente).
- [ ] **Nota sobre Dependências**: Se você precisou instalar algo via `npm`, justifique explicitamente agora. Instalações silenciosas são proibidas.