# ⚙️ Background Worker (Service Worker)

Este diretório contém o **Service Worker** da extensão, responsável pela orquestração de eventos e ciclo de vida.

## 📂 Estrutura

- **`index.js`**: Ponto de entrada (Entrypoint) definido no `manifest.json`.
- **`tests/`**: Testes unitários do worker.

## 🧠 Responsabilidades

O Background Worker deve ser mantido **leve** (Thin Orchestrator). 

✅ **Permitido**:
- Listeners de ciclo de vida (`onInstalled`, `onStartup`).
- Gerenciamento de Context Menu.
- Injeção de scripts (via `chrome.scripting`).
- Comunicação entre abas (Message Passing).

❌ **Proibido**:
- Regras de negócio complexas (Use `features/`).
- Scraping direto de dados.
- Manipulação de DOM.
