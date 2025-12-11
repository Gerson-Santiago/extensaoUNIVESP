# Arquitetura e Correções Técnicas (v2.1.1)

Este documento detalha as mudanças arquiteturais realizadas para garantir a estabilidade da extensão e explicar por que as correções funcionaram.

## 1. O Problema: Permissões e CORS

Nas versões anteriores, a extensão tentava "injetar" código na página do Blackboard para buscar as semanas (`chrome.scripting.executeScript`).
Isso causava dois problemas:
1.  **Bloqueio de CORS**: O navegador impedia que a extensão fizesse pedidos de rede para `ava.univesp.br` porque a "origem" do pedido era diferente.
2.  **Permissão de Script**: O Chrome bloqueia injeções de script a menos que o usuário aprove explicitamente a permissão "Ler e alterar dados".

## 2. A Solução: Injeção Segura (Injection Pattern)

Na versão final 2.1, refinamos a técnica de injeção de scripts para ser segura e robusta.

### Como Funciona:
1.  **Permissão `activeTab`**:
    *   No lugar de pedir permissão para "ler tudo", usamos a permissão `activeTab`.
    *   Isso significa que a extensão só ganha acesso à página quando você CLICA explicitamente no botão. É mais seguro e o Chrome não bloqueia.

2.  **Execução Direta (`scripting`)**:
    *   Quando você clica em "Atualizar", a extensão injeta temporariamente o código de extração (`executeScript`) em todos os frames da página.
    *   O código roda, coleta os links e retorna para o painel.
    *   Não deixamos scripts rodando "para sempre" na página (como no padrão de mensageria), o que economiza memória.

### Por que funcionou agora?
A correção envolveu:
1.  **Correção de Importação**: Havia um erro de código no `sidepanel.js` que impedia o funcionamento dos botões. Isso foi corrigido.
2.  **Uso de `activeTab`**: Garante que o Chrome permita a injeção do script exatamente no momento que você precisa.

## 3. Estrutura de Arquivos

*   `sidepanel/logic/scraper.js`: Contém a lógica de extração e a injeta na página sob demanda.
*   `manifest.json`: Declara a permissão `activeTab` vital para o funcionamento.

## 4. Testes e Segurança

Implementamos uma camada de segurança baseada em testes automatizados (Jest):
1.  **Integridade de Imports**: `tests/imports.test.js` verifica se todos os arquivos críticos da extensão existem e se seus módulos podem ser importados sem erros. Isso previne que refatorações quebrem referências de arquivos.
2.  **Testes Unitários**: `tests/logic.test.js` a lógica de negócios isolada da UI (ex: scraper) para garantir robustez.

## 5. Estrutura Modular (Refatoração v2.2)

Para facilitar a manutenção e leitura, adotamos o padrão de separação de responsabilidades:
*   **UI Components (`sidepanel/ui/components.js`)**: Funções puras que apenas retornam elementos HTML. O `sidepanel.js` não cria mais HTML "na mão", apenas gerencia dados e eventos.
*   **Settings Logic (`popup/logic/settings.js`)**: Funções puras para validar e formatar dados (Emails, RAs). O `popup.js` apenas conecta a tela ao armazenamento.


---
**Desenvolvido por Gerson Santiago**
