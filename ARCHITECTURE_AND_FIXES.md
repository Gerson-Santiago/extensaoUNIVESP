# Arquitetura e Correções Técnicas (v2.1)

Este documento detalha as mudanças arquiteturais realizadas para garantir a estabilidade da extensão e explicar por que as correções funcionaram.

## 1. O Problema: Permissões e CORS

Nas versões anteriores, a extensão tentava "injetar" código na página do Blackboard para buscar as semanas (`chrome.scripting.executeScript`).
Isso causava dois problemas:
1.  **Bloqueio de CORS**: O navegador impedia que a extensão fizesse pedidos de rede para `ava.univesp.br` porque a "origem" do pedido era diferente.
2.  **Permissão de Script**: O Chrome bloqueia injeções de script a menos que o usuário aprove explicitamente a permissão "Ler e alterar dados".

## 2. A Solução: Padrão de Mensageria (Messaging Pattern)

Na versão 2.1, alteramos a arquitetura para o **Padrão de Mensageria**.

### Como Funciona:
1.  **Content Script Persistente** (`scripts/ava_scraper_content.js`):
    *   Este script é declarado no `manifest.json` com `all_frames: true`.
    *   Ele é carregado automaticamente pelo navegador assim que você entra no Blackboard.
    *   Ele "mora" na página, então tem acesso nativo ao DOM e à sessão do usuário (cookies), sem precisar de "injeção" forçada.

2.  **Comunicação (Side Panel)**:
    *   Quando você clica em "Atualizar", o painel lateral não tenta mais invadir a página.
    *   Ele apenas envia uma mensagem (`sendMessage`) dizendo: *"Quem estiver aí, me mande as semanas"*.
    *   O Content Script ouve, coleta os links e responde.

### Por que funcionou agora?
A correção definitiva envolveu duas etapas:
1.  **Aprovação de Permissões**: Quando você recarregou a extensão e aprovou as novas permissões (ícone de exclamação no Chrome), liberou o acesso ao site `ava.univesp.br`.
2.  **Arquitetura Robusta**: O novo método de mensagens é mais seguro e menos propenso a falhas intermitentes, pois não depende de injetar código complexo em tempo real.

## 3. Estrutura de Arquivos

*   `sidepanel/logic/scraper.js`: Agora é apenas um "carteiro". Ele envia a mensagem e recebe a resposta.
*   `scripts/ava_scraper_content.js`: O "operário". Fica na página, extrai os links e trata URLs relativas.
*   `manifest.json`: Declara o content script e as permissões mínimas necessárias (`activeTab`).

---
**Desenvolvido por Gerson Santiago**
