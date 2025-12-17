# Relatório de Investigação: Auto-Scroll (Blackboard Ultra)

**Data:** 17/12/2025
**Alvo:** `https://ava.univesp.br/ultra/course`
**Objetivo:** Implementar "Carregar Todos" (Auto-Scroll)

---

## 1. Hipótese Inicial (Falha)
**Suposição:** O site usa scroll nativo (`window`) e carrega itens via AJAX conforme descemos.
**Teste:** Injeção de script simples `window.scrollTo`.
**Resultado:** "Não funcionou". O script rodava mas nada acontecia ou parava cedo demais.

## 2. Investigação Técnica (Engenharia Reversa)

### Tentativa A: Acesso Direto ao Angular (Scope)
**Estratégia:** Tentar acessar `angular.element(el).scope()` para ler os dados da memória, evitando scroll visual.
**Resultado:** ❌ Falha.
-   Erro: `Escopo Angular não acessível ou sem 'baseCourses'`.
-   **Conclusão:** O Blackboard Ultra usa frameworks modernos ou isola agressivamente o escopo, impedindo acesso simples ao estado via Console.

### Tentativa B: Análise de Network (XHR/Fetch)
**Estratégia:** Monitorar chamadas de rede ao rolar a página.
**Resultado:** ❌ Inconclusivo/Falha.
-   Não foram observadas chamadas `GET /courses` claras durante o scroll.
-   Muitos erros de segurança (`Unsafe attempt to load URL...`) vindos de scripts internos do Blackboard tentando acessar iframes/CDNs.
-   Conclusão preliminar: Os dados não vêm de um `fetch` simples on-scroll, ou já estão pré-carregados.

### Tentativa C: Análise de DOM e Virtual Scroll
**Estratégia:** Contar elementos no DOM antes e depois do scroll.
**Dados Coletados:**
-   Total de Cards no DOM: **7** (Início) -> **7** (Fim).
-   IDs dos Cards: **Mudaram** parcialmente ao rolar (de `_15307_1` para `_13738_1`).
-   **Diagnóstico:** O site usa **DOM Recycling (Virtual Scroll)**. Ele mantém apenas ~7 elementos na memória e troca o conteúdo deles.

## 3. A Revelação (Fator Humano)
**Fato Novo:** O usuário informou que **possui apenas 7 cursos no total**.
**Impacto:**
-   A função de Auto-Scroll estava tecnicamente correta ou quase correta.
-   Ela "falhava" silenciosamente porque **não havia mais nada para carregar**.
-   O comportamento de "nada acontecer" era o comportamento correto para uma lista completa.

## 4. Próximos Passos (Plano Atual)
1.  **Refinar Script:** Manter a lógica de detecção de container (`#main-content-inner` vs `window`).
2.  **Feedback de UI:** Melhorar as mensagens para diferenciar "Não consegui rolar" de "Já cheguei ao fim da lista".
3.  **Logs:** Manter logs detalhados (`[FBI]`) temporariamente para garantir que a detecção do container está funcionando em contas com mais cursos.
