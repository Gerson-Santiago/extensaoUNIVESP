# ADR 009: Hybrid Integration Testing for CourseRefresher

**Status:** 🌿 Proposed
**Data:** 2025-12-31
**Autor:** IA do Projeto
**Decisores:** Time de Desenvolvimento
**Consultado:** Relatórios de Cobertura, Screaming Architecture

---

## CONTEXTO

O componente `CourseRefresher.js` foi identificado como uma área crítica de risco (25.71% de cobertura, 0% funções instrumentadas). Ele é um **Orquestrador de Alta Complexidade** que coordena:
1.  Serviços de Rede (Scraping/Fetch).
2.  Serviços de Persistência (ChunkedStorage).
3.  Serviços de Notificação (Chrome API).
4.  Parsing de DOM.

### 🛑 O Problema
A abordagem tradicional de testes unitários (Unit Testing) se mostrou ineficaz para este componente por exigir mocks excessivos (`Mock Hell`). Testar um orquestrador mockando tudo o que ele toca resulta em "testes de implementação" (frágeis a refatoração) e não "testes de comportamento".

Além disso, falhas no `CourseRefresher` são silenciosas e catastróficas (o aluno para de receber atualizações), o que exige um grau de confiança maior que apenas "passar por todas as linhas".

---

## 💡 DECISÃO

Adotaremos uma **Estratégia de Testes Híbrida (Hybrid Integration Testing)** focada no comportamento do orquestrador, minimizando mocks internos.

### 1. Inversão da Pirâmide (Local)
Para este componente específico, priorizaremos **Testes de Integração** sobre Testes Unitários isolados.

### 2. Mocks Apenas em I/O Borders
Não mockaremos classes internas do domínio (como `CourseService` ou `TaskCategorizer`) se elas puderem rodar rápido. Mocks serão restritos a:
*   **API do Chrome:** `chrome.storage`, `chrome.notifications`, `chrome.scripting`.
*   **Rede/DOM:** `fetch` e `document` (via JSDOM).

### 3. Fixture-Driven
Os testes serão guiados por **Fixtures de Estado Completo**.
*   *Input:* Estado inicial do Storage + HTML simulado da página de cursos.
*   *Action:* `refresher.refresh()`.
*   *Output:* Novo estado do Storage + Chamadas de notificação.

---

## ⚖️ CONSEQUÊNCIAS

### ✅ Positivas
*   **Confiabilidade Real:** Garante que os componentes "conversam" entre si.
*   **Resiliência:** Refatorações internas (ex: mudar de `ActivityFocusService` para outro helper) não quebram o teste se o resultado final for o mesmo.
*   **Documentação Viva:** Os testes documentam fluxos de negócio reais (ex: "Detectar nova atividade de video").

### ⚠️ Negativas
*   **Setup Mais Complexo:** Testes de integração exigem um setup de ambiente mais rico (simular DOM e Storage).
*   **Execução Mais Lenta:** Rodam mais devagar que unitários puros (embora ainda rápidos em Node local).

---

## 🛠️ DIRETRIZES DE IMPLEMENTAÇÃO

1.  **Localização:** `features/courses/services/__tests__/CourseRefresher.integration.test.js`.
2.  **Padrão:** AAA (Arrange, Act, Assert).
3.  **Cobertura Alvo:** > 70% de Statements globais no arquivo.

---
**Links:**
*   [ISSUE-013: Integração CourseRefresher](../../.github/ISSUES/ISSUE-013-OPEN_course-refresher-tests.md)
*   [Relatório de Auditoria v2.9.6](../../.github/ISSUES/ISSUES-[013-016]-OPEN-v2.9.6.md)
