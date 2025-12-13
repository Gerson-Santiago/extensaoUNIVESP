# 🏗️ Tecnologias e Arquitetura do Sistema

> *Local-First, Privacy-Focused & Modern Web Standards.*

Este documento detalha o funcionamento interno da extensão, a stack utilizada e os protocolos de privacidade.

---

## 🧱 1. Stack Tecnológica

### Core
*   **Plataforma**: Google Chrome Extensions (Manifest V3).
*   **Linguagem**: JavaScript Puro (ES Modules), focado em performance e sem transpilação pesada (exceto testes).
*   **Estilização**: CSS Modular (sem frameworks como Tailwind ou Bootstrap para manter o bundle leve).

### Qualidade & Testes
*   **Node.js**: Ambiente de desenvolvimento (Scripts e Testes).
*   **Jest**: Framework de testes (Unitários e Integração).
*   **ESLint**: Análise estática de código (Linter).
*   **Prettier**: Formatador de código.
*   **JSDoc**: Documentação e Tipagem "Soft".

---

## 🏛️ 2. Visão Geral da Arquitetura

A extensão segue o padrão **MVC (Model-View-Controller)** adaptado para o contexto de Browser Extension.

### Diagrama de Fluxo (Data Flow)

```mermaid
flowchart LR
    subgraph "Navegador do Usuário"
        direction TB
        UI[Side Panel / Popup (View)]
        Logic[Business Logic (Controller)]
        Storage[(Chrome Storage (Model))]
        Web[Página AVA/SEI]
    end

    Web -->|Scraping| Logic
    Logic -->|Persist| Storage
    Storage -->|Load| UI
    UI -->|User Action| Logic
```

### Componentes Principais

#### A. Side Panel (`/sidepanel`)
O painel lateral é o coração da experiência do usuário.
*   **Views**: Componentes visuais (`CoursesView.js`, `SettingsView.js`).
*   **Logic**: Controladores (`batchScraper.js`, `tabs.js`).
*   **Components**: Elementos UI reutilizáveis (`Items/`, `Modals/`).

#### B. Content Scripts (`/scripts`)
Scripts injetados na página alvo para ler o DOM.
*   **Scraper**: Lê a estrutura HTML do Blackboard para identificar cursos e semanas.
*   **Isolamento**: Roda em um "mundo isolado" (Isolated World) para não conflitar com o JS da página.

#### C. Background Service (`background.js`)
Gerenciador de eventos do Chrome.
*   Responsável pela instalação, mensagens entre abas e o Side Panel.

---

## 🔒 3. Protocolo de Privacidade e Dados (Data Handling)

Este projeto segue estritamente a filosofia **Local-First**.

### Soberania de Dados
*   **Zero Backend**: Não possuímos servidores. Não coletamos dados.
*   **Armazenamento Local**: Todos os dados (RA, Lista de Matérias) ficam salvos no navegador do usuário (`chrome.storage`), sincronizados apenas com a conta Google dele (se ativado).

### Estratégia de Segurança
1.  **Permissões Mínimas**: O `manifest.json` só solicita acesso aos domínios estritamente necessários (`*.univesp.br`).
2.  **Sem Analytics**: Não usamos Google Analytics, Mixpanel ou qualquer rastreador.
3.  **Auditoria Pública**: O código é aberto para que qualquer um possa verificar que não há envio de dados oculto.

---

---

## 📂 4. Estrutura de Diretórios

```
/
├── assets/          # Ícones e imagens estáticas
├── popup/           # Interface do popup (ícone na barra)
├── sidepanel/       # Lógica e UI do painel lateral
│   ├── components/  # Botões, Cards, Modais reutilizáveis
│   ├── logic/       # Regras de negócio (Scraper, Storage)
│   ├── views/       # Telas inteiras (Home, Config)
│   └── styles/      # CSS modular
├── scripts/         # Content Scripts injetados
├── shared/          # Utils compartilhados (Popup <-> Sidepanel)
└── tests/           # Testes automatizados (Jest)
```

> *Documento atualizado em: Dezembro 2025 (v2.3).*
