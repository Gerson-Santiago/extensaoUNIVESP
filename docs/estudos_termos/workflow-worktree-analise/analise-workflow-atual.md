# Análise do Workflow de Trabalho Atual

## 📊 Visão Geral: O Workflow Híbrido

O estado atual do workflow do projeto **Extensão UNIVESP** é caracterizado como um **Workflow Híbrido (Humano + AI)** com forte automação local (Local-First Automation).

Ao contrário de projetos tradicionais que dependem pesadamente de CI/CD remoto (GitHub Actions, Jenkins), este projeto prioriza a **qualidade na fonte** (na máquina do desenvolvedor) impulsionada por agentes de IA e Hooks locais.

---

## 1. O Ciclo de Vida da Tarefa

O fluxo de trabalho é definido formalmente em `docs/FLUXOS_DE_TRABALHO.md` e operacionalizado por arquivos em `.agent/workflows`.

### Fluxo Padrão:
1.  **Definição (Human):** Usuário define a tarefa em `task.md`.
2.  **Planejamento (AI Agent):** O agente lê `.agent/workflows/` (ex: `nova-feature.md`) para saber o "algoritmo" a seguir.
    *   *Exemplo:* Para um bug, o workflow exige: Criar teste de reprodução -> Falhar -> Corrigir -> Passar.
3.  **Execução (AI + Human):**
    *   Criação de Branch (`feat/`, `fix/`).
    *   TDD (Test Driven Development) rigoroso.
4.  **Verificação (Local Automation):**
    *   **Linting:** ESLint roda em tempo real.
    *   **Pre-Commit (Husky):** Impede commit de código sujo (formata e linta arquivos em stage).
5.  **Integração:** Merge manual para `main/dev` após aprovação.

---

## 2. Componentes de Automação

### A. Automação Local (Implementada)
A barreira de qualidade é **local**. O código nem chega ao repositório se não estiver bom.
*   **Ferramenta:** `husky` + `lint-staged`.
*   **Gatilho:** `git commit`.
*   **Ação:** Executa `eslint --fix` e `prettier --write` apenas nos arquivos modificados.
*   **Segurança:** Se o Lint falhar (ex: `console.log` esquecido), o commit é abortado.

### B. Automação de Agente (Implementada)
O projeto contém "instruções de máquina" para a IA em `.agent/workflows/`.
*   `/bug-fix`: Roteiro de correção segura.
*   `/nova-feature`: Roteiro de implementação limpa.
*   `/refactor`: Roteiro de melhoria sem quebra (Green-Green).

### C. Automação Remota (CI/CD)
**Estado Atual: Inexistente/Inativa.**
*   Não foi encontrada a pasta `.github/workflows`.
*   **Impacto:** A validação depende 100% da disciplina do ambiente local e dos hooks do Husky. Não há um "juiz imparcial" no GitHub rodando os testes novamente após o push.

---

## 3. Gestão de Configuração (Git Strategy)

O projeto segue um **Feature Branch Workflow** estrito.

*   **Branches de Vida Longa:** `main` (Produção), `dev` (Integração - Opcional).
*   **Branches de Vida Curta:** `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `docs/*`.
*   **Regra de Ouro:** Commits diretos na `main` são proibidos (mencionado no `docs/FLUXOS_DE_TRABALHO.md`, embora sem trava tecnológica no GitHub verificada).

---

## 4. Conclusão da Análise

O workflow atual é **maduro em disciplina e prevenção**, mas **jovem em integração contínua**.

*   **Ponto Forte:** A combinação de *Cursor Rules* + *Agent Workflows* + *Husky* cria um ambiente onde é difícil escrever código ruim "sem querer". A IA entende as regras do jogo.
*   **Ponto de Atenção:** A ausência de CI (GitHub Actions) significa que "funcionar na minha máquina" ainda é a métrica final, embora mitigada pelo uso de containers/mocks padronizados.
