# ⚙️ Fluxos de Trabalho da Equipe (Team Workflow)

Este documento descreve como a equipe de desenvolvimento opera no dia-a-dia. Se você é um novo desenvolvedor (ou uma IA), **leia isto antes de tocar no código**.

---

## 🏗️ Ciclo de Desenvolvimento (Development Lifecycle)

Nosso fluxo segue um padrão simples de Feature Branch.

### 1. Escolha da Tarefa
*   Identifique uma Issue ou crie uma tarefa no `task.md`.
*   Entenda o "Porquê" antes do "Como". Se a tarefa não tem um valor claro para o usuário, questione.

### 2. Branching
*   Crie uma branch descritiva a partir da `dev` (ou `main` se não houver dev):
    *   `feat/nova-funcionalidade`
    *   `fix/correcao-bug`
    *   `refactor/limpeza-codigo`
    *   `docs/atualizacao-readme`
    *   **Dica:** O agente possui workflows automatizados para essas tarefas (`.agent/workflows/`). Peça "crie uma feature" ou "corrija esse bug" e ele executará os passos.

### 3. Codificação (Coding Rules)
*   **Javascript Moderno**: Use ES6+, `const`/`let`, Arrow Functions.
*   **Modularização**: Siga a arquitetura de pastas (`shared/`, `logic/`, `views/`). Não crie arquivos gigantes.
*   **Padrões**: Consulte `PADROES_DO_PROJETO.md` se tiver dúvida sobre uma convenção.
*   **Linting Contínuo**: O VS Code deve estar configurado para mostrar erros de ESLint em tempo real. **Não ignore os sublinhados vermelhos ou amarelos.**

### 4. Verificação Local (Before Commit)
Antes de comitar, você **DEVE** rodar os seguintes comandos:

1.  **Corrigir Estilo**:
    ```bash
    npm run format
    ```
2.  **Validar Regras (Lint)**:
    ```bash
    npm run lint
    ```
    🚨 **Regra de Ouro**: O comando `npm run lint` deve retornar **0 erros e 0 warnings**. Se houver warnings, corrija-os.
3.  **Rodar Testes**:
    ```bash
    npm test
    ```
    Todos os testes devem passar. Se você adicionou funcionalidade nova, adicione testes novos.

### 5. Commit e Pull Request (PR)
*   Mensagens de commit semânticas:
    *   `feat: adiciona modal de importação`
    *   `fix: resolve erro de digitação no CSS`
    *   `docs: atualiza guia de instalação`
*   Abra o PR descrevendo o que foi feito e como testar.

---

## 🛠️ Ferramentas e Configurações

### Ambiente
*   **Editor**: VS Code (Recomendado) com extensão ESLint e Prettier.
*   **Node**: Versão 20.x ou superior.
*   **Gerenciador de Pacotes**: `npm`.

### Scripts Principais (`package.json`)
| Comando | Descrição |
| :--- | :--- |
| `npm install` | Instala dependências. |
| `npm run lint` | Roda o ESLint (Check). |
| `npm run lint:fix` | Tenta corrigir erros de Lint automaticamente. |
| `npm run format` | Formata o código com Prettier. |
| `npm test` | Executa a suíte de testes Jest. |
| `npm run test:watch` | Roda testes em modo de observação (durante desenvolvimento). |

---

## 🚫 O que NÃO Fazer

1.  **Não comite código quebrado.** (O Lint e Testes são seus guardiões).
2.  **Não ignore o console.** Se o console do navegador mostrar erros vermelhos, investigue.
3.  **Não misture idiomas.** Código/Comentários em Inglês ou Português (decidido no projeto: Doc em PT-BR, Código misto mas tendendo a Inglês para variáveis/funções e PT-BR para comentários explicativos longos é o padrão atual, mas **consistência** é a chave).
    *   *Nota: Atualmente o projeto prioriza documentação em PT-BR.*

---

> *"Qualidade não é um ato, é um hábito."* - Aristóteles (e nossa equipe de QA).
