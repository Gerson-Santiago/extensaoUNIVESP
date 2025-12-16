# ⚙️ Fluxos de Trabalho da Equipe (Team Workflow)

> [!WARNING]
> **Regras Gerais:**
> 1.  🚫 Proibido `npm install` sem discussão prévia.
> 2.  🛡️ Commit direto na `main` ou `dev` é proibido sem aprovação (Gate Manual).
> 3.  🧪 Sem teste, sem feature.

Este documento descreve como a equipe de desenvolvimento opera. Se você é um novo desenvolvedor (ou uma IA), **leia isto antes de tocar no código**.

---

## 🏗️ Ciclo de Desenvolvimento (Development Lifecycle)

Nosso fluxo segue um padrão simples de Feature Branch.

### 1. Escolha da Tarefa
- [ ] Identifique uma Issue ou crie uma tarefa no `task.md`.
- [ ] Entenda o "Porquê" antes do "Como". Se a tarefa não tem um valor claro para o usuário, questione.

### 2. Branching
- [ ] Crie uma branch descritiva a partir da `dev` (ou `main` se não houver dev):
    - `feat/nova-funcionalidade`
    - `bug/correcao-critica`
    - `refactor/limpeza-codigo`
    - `docs/atualizacao-readme`
    - **Dica:** Use `git switch -c feat/nome` (Moderno) ao invés de `git checkout -b`.
    - **Dica:** Use os workflows automatizados (`.agent/workflows/`).

### 3. Codificação (Coding Rules)
- **Javascript Moderno**: Use ES6+, `const`/`let`, Arrow Functions.
- **Modularização**: Siga a arquitetura de pastas (`shared/`, `logic/`, `views/`).
- **Padrões**: Consulte `PADROES_DO_PROJETO.md`.
- **Linting Contínuo**: VS Code deve estar sem sublinhados vermelhos.

### 4. Verificação Local (Before Commit)

#### 🛡️ segurança de Refatoração
**Nunca refatore código sem cobertura de testes.**
- [ ] Se não tem teste, crie um teste que passe com o código atual.
- [ ] Só depois refatore.

#### 🔄 Princípio da Co-evolução
> "Se a lógica muda, o teste muda."

- [ ] Validou se o teste passou pelo motivo certo?
- [ ] Atualizou o teste para refletir a nova regra?

#### 💻 Comandos Obrigatórios (Automação Ativa)
O projeto possui **Husky** configurado.
- [ ] `git commit`: Dispara automaticamente Lint e Prettier.
    - Se falhar: Corrija os erros reportados e tente novamente.
    - Se passar: O código será formatado automaticamente.
- [ ] `npm test`: **Deve ser rodado manualmente** antes do push (ainda não está no pre-commit por performance).

### 5. Commit e Pull Request (PR)
- Use mensagens semânticas (`feat:`, `fix:`, `docs:`).
- **Idioma**: A descrição do commit deve ser sempre em **Português do Brasil**.
    - ✅ `feat: adiciona botão de login`
    - ❌ `feat: add login button`
- Abra o PR descrevendo o que foi feito. deve ser sempre em **Português do Brasil**.
    - ✅ `feat: adiciona botão de login`
    - ❌ `feat: add login button`
- Abra o PR descrevendo o que foi feito.

## 🏛️ Governança e Regras de Segurança

### 4.1 Gate de Aprovação
O agente (ou dev) tem autonomia para rodar testes "Turbo", mas **NÃO TEM AUTONOMIA** para commitar alterações funcionais sem revisão explícita.
- **Fluxo**: Implementar -> Validar (Turbo) -> Pausar -> Pedir feedback -> Commitar.

### 4.2 Documentação Viva
Software muda. Documentação deve acompanhar.
- [ ] Estrutura mudou? -> Atualizar `TECNOLOGIAS_E_ARQUITETURA.md`.
- [ ] Fluxo mudou? -> Atualizar `FLUXOS_DE_TRABALHO.md`.
- [ ] Changelog atualizado?

### 4.3 Política Estrita de NPM
**Proibido `npm install` silencioso.**
Novas dependências são um risco de segurança e performance.
- Regra: Todo `npm install` deve ser proposto, justificado e aprovado pelo usuário antes de execução.

---

## 🛠️ Ferramentas e Configurações

### Ambiente
- **Editor**: VS Code (Recomendado) + ESLint + Prettier.
- **Node**: Versão 20.x+.

### Scripts Principais (`package.json`)
| Comando | Descrição |
| :--- | :--- |
| `npm install` | Instala dependências (Cuidado!). |
| `npm run lint` | Roda o ESLint (Check). |
| `npm run lint:fix` | Auto-fix Lint. |
| `npm run format` | Prettier. |
| `npm test` | Jest Suite. |

---

## 🚫 O que NÃO Fazer

1.  **Não comite código quebrado.**
2.  **Não ignore o console.**
3.  **Não misture idiomas.** (Doc em PT-BR, Código misto).

---

> *"Qualidade não é um ato, é um hábito."*
