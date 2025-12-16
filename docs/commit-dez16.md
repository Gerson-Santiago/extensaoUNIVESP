# 📊 Estudo de Evolução do Projeto (Dezembro 16)

> Este documento apresenta uma análise da trajetória do projeto `ExtensaoUNIVESP` até o commit `9b5b455` (16 de Dezembro de 2025).

---

## 1. 📈 Métricas Atuais (Codebase)

Um raio-X do tamanho atual do projeto, excluindo dependências (`node_modules`) e configurações de ambiente.

| Categoria | Tipo de Arquivo | Total de Linhas (Aprox.) |
| :--- | :--- | :--- |
| **Código Fonte** | JS, CSS, HTML, JSON | **13.812** |
| **Documentação** | Markdown (.md) | **1.417** |
| **Total Geral** | - | **~15.229** |

---

## 2. ⏳ Linha do Tempo e Evolução

A análise do histórico (`git log`) revela uma maturação acelerada em curto período, migrando de um script funcional para uma arquitetura robusta de engenharia de software.

### Fases Identificadas

#### 🐣 Fase 1: Fundação e MVP (Early Dec 11)
*   **Marco:** Commit `e7c74f2` ("Initial commit with Domain Config...").
*   **Foco:** Funcionalidade pura. Scripts básicos de scraping e injeção no DOM.
*   **Característica:** commits rápidos, foco em fazer funcionar. Ex: `feat: Initial commit...`.

#### 🏗️ Fase 2: Estruturação Modular (v2.0 - v2.1)
*   **Marco:** Commits `69bf115` (Beta v2.0) e `62869f2` (Refactor v2.1).
*   **Mudança Chave:** Introdução de **Arquitetura de Mensageria**, separação de `logic/` e `views/`, e limpeza de logs.
*   **Qualidade:** Início da preocupação com "Zero Warnings" e logs controlados.

#### 🚀 Fase 3: Escala e Robustez (v2.2+)
*   **Marco:** Commits `031402a` (Modular v2.2) e `584a861` (Batch Scraper).
*   **Inovação:** Implementação de **Testes Unitários** (Jest) e **Batch Processing** (Importação em lote).
*   **UX:** Refinamento visual significativo (cards compactos, remoção de contornos, melhoria de layout).

#### 🛡️ Fase 4: Profissionalização e Governança (Atual - Dez 16)
*   **Marco:** Commits recentes (`docs/atualizacao-arquitetura`, `ui/labels-tooltips`).
*   **Cultura:** Adoção estrita de **Workflows** (`.cursorrules`, `FLUXOS_DE_TRABALHO.md`).
    *   Regra: "Sem teste, sem feature".
    *   Regra: "Commit em PT-BR".
    *   Regra: "Documentation First" (Diagramas atualizados).

---

## 3. 🧠 Análise do Workflow (O Caminho da Qualidade)

A transição para um workflow mais rígido trouxe benefícios tangíveis observados no log:

1.  **Rastreabilidade**: Mensagens de commit como `feat(ui): traduz labels...` facilitam entender *o quê* e *onde* mudou.
2.  **Segurança**: O uso de branches (`feat/`, `docs/`) e merges controlados na `dev` antes da `main` eliminou quebras na branch de produção.
3.  **Confiança**: A obrigatoriedade de testes (evidenciada na criação de `ActionMenu.test.js` antes do merge) garante que funcionalidades visuais não quebrem silenciosamente.

### Conclusão
O projeto evoluiu de um "hack" de extensão para um produto de software com ciclo de vida (ALM) maduro, pronto para manutenção a longo prazo e colaboração em equipe.
