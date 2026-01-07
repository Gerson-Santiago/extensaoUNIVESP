# Feature: Settings (Configurações)

Este módulo gerencia as preferências do usuário, incluindo sincronização via `chrome.storage` e interface de opções.

> [!IMPORTANT]
> **Source of Truth:** A implementação de referência está em `features/settings/logic` e `features/settings/views`.

## Estrutura
- **logic/**: Gerenciamento de estado (`UserPreferencesManager.js`) e validação.
- **views/**: Interface do usuário (`SettingsView.js`) e controllers (`SettingsController.js`).
