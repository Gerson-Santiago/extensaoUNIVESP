# Popup (Legacy/Fallback UI)

**Responsabilidade**: Interface de acesso rápido e configuração inicial.

> [!NOTE]
> Conforme a arquitetura (ADR-002), a UI principal da extensão é o **Side Panel**. O Popup serve como fallback e ponto de entrada rápido.

## Funcionalidades
1. **Configuração de Credenciais**: Input de RA e Domínio (persistido via `chrome.storage.sync`).
2. **Atalhos Rápidos**: Links para SEI, AVA, Provas.
3. **Trigger do Side Panel**: Botão para abrir a interface principal.

## Dependências
- `shared/utils/settings.js`: Lógica de formatação de RA/Email.
- `shared/utils/BrowserUtils.js`: Abertura do Side Panel.
- `shared/utils/Tabs.js`: Gerenciamento de abas.

## Estrutura
- `popup.html`: Estrutura (sem frameworks).
- `popup.css`: Estilização isolada.
- `popup.js`: Controller (Vanilla JS + ES Modules).
