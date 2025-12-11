# Documentação dos Scrapers - Extensão UNIVESP

Esta documentação detalha o funcionamento dos scripts de "scraping" (extração de dados) e automação presentes no projeto.

## Visão Geral

O projeto possui identificados três scripts principais que atuam em páginas da web:
1.  **`scripts/ava_scraper_content.js`**: Content Script declarado no manifesto para rodar no AVA.
2.  **`sidepanel/logic/scraper.js`**: Lógica usada pelo painel lateral para extrair dados sob demanda.
3.  **`scripts/content.js`**: Script utilitário para preenchimento de login (não é um scraper de extração massiva).

## Detalhamento Técnico

### 1. Scraper do Painel Lateral (`sidepanel/logic/scraper.js`)
Este é o scraper **atualmente ativo** quando você clica em "Atualizar Semanas" ou adiciona uma matéria pelo painel lateral.

*   **Tipo**: Injeção dinâmica de script (`chrome.scripting.executeScript`).
*   **Acionador**: Botões "Adicionar Página Atual" ou "Atualizar Semanas" no Sidepanel.
*   **Funcionamento**:
    1.  Recebe o ID da aba ativa.
    2.  Injeta a função `DOM_extractWeeks_Injected` em **todos os frames** da página.
    3.  A função percorre todas as tags `<a>` (links) da página.
    4.  Filtra links que contêm a palavra "Semana" no texto ou título.
    5.  Extrai a URL, corrigindo caminhos relativos e tentando resolver links JavaScript (`javascript:`).
    6.  Tenta extrair o nome da matéria buscando um elemento `h1.panel-title`.
    7.  Retorna uma lista de semanas e o título encontrado.
    8.  O script principal consolida os resultados, remove duplicatas e ordena as semanas numericamente.

> **Nota**: O código contém um comentário dizendo "Scraper via Mensageria", mas a implementação atual usa **Injeção de Script**, ignorando o arquivo `ava_scraper_content.js`.

### 2. Content Script do AVA (`scripts/ava_scraper_content.js`)
Este arquivo é carregado automaticamente pelo navegador em páginas `https://ava.univesp.br/*` (definido no `manifest.json`).

*   **Tipo**: Content Script persistente.
*   **Acionador**: Aguarda mensagens do runtime (`chrome.runtime.onMessage`).
*   **Funcionamento**:
    1.  Ouve por uma mensagem com ação `SCRAPE_WEEKS`.
    2.  Executa a função `extractWeeks()` (lógica quase idêntica à do item 1).
    3.  Devolve a lista de semanas encontradas.

> **Observação**: Pela análise do código atual do painel lateral, **este script parece não estar sendo utilizado** efetivamente, pois o painel prefere injetar sua própria função a enviar a mensagem `SCRAPE_WEEKS`. Isso representa uma redundância no código.

### 3. Autopreenchimento (`scripts/content.js`)
Embora não seja um "scraper" de extração de dados, atua na página e vale mencionar.

*   **Alvo**: `https://sei.univesp.br/*`
*   **Função**: Preenche automaticamente o campo de email no login do SEI.
*   **Lógica**:
    1.  Busca o email salvo no `chrome.storage`.
    2.  Verifica se o campo `#form:email` está vazio.
    3.   Preenche e dispara eventos de validação do framework da página.
    4.  Usa `MutationObserver` para garantir que funcione mesmo se a página carregar dinamicamente.

---

## Redundância Identificada

Existe uma duplicação de lógica entre **`sidepanel/logic/scraper.js`** e **`scripts/ava_scraper_content.js`**.

*   **`sidepanel/logic/scraper.js`**: Injeta a função `DOM_extractWeeks_Injected`.
*   **`scripts/ava_scraper_content.js`**: Possui a função `extractWeeks`.

Ambas funções fazem essencialmente a mesma coisa (buscam links com "Semana").
*Recomendação*: Para facilitar a manutenção, o ideal seria padronizar em uma das abordagens (preferencialmente Mensageria, já que o script já é injetado pelo manifesto, economizando recursos de reinjeção).
