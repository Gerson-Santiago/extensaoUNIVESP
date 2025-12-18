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
*   **Jest (v30+)**: Framework de testes (Unitários e Integração), com provider V8 para cobertura.
*   **jest-webextension-mock**: Simulação robusta da API `chrome.*`.
*   **ESLint**: Análise estática de código (Linter).
*   **Prettier**: Formatador de código.
*   **Husky + Lint-Staged**: Automação de hooks de pré-commit (Garantia de Qualidade).
*   **JSDoc**: Documentação e Tipagem "Soft".

---

## 🏛️ 2. Visão Geral da Arquitetura

A extensão segue o padrão **MVC (Model-View-Controller)** adaptado para o contexto de Browser Extension.

### Diagrama de Fluxo (Data Flow)

```mermaid
flowchart LR
    subgraph "Navegador do Usuário"
        direction TB
        UI["Side Panel (UI)"]
        Feature["Features (Cursos/Import)"]
        Global["Core Logic (Auth/RA)"]
        Storage[(Chrome Storage)]
        Web[Página AVA/SEI]
    end

    Web -->|Scraping| Feature
    Feature -->|Business Logic| Storage
    Storage -->|Load| Feature
    Feature -->|Render| UI
    UI -->|User Action| Global
```

### Componentes Principais

#### A. Features (`/features`)
Onde vivem as regras de negócio específicas, seguindo a **Screaming Architecture**. Se o código é sobre "Cursos", ele mora aqui.
*   **Courses**: Gerencia listagem, detalhes, scraping e persistência de matérias.
*   **Import**: Gerencia o fluxo de importação em lote do histórico escolar.

#### B. Side Panel (`/sidepanel`)
O painel lateral atua agora como um "Shell" (Container) e orquestrador global.
*   **Views**: Telas genéricas (`HomeView`, `SettingsView`).
*   **Logic**: Gerenciadores de Sessão (`raManager.js`, `domainManager.js`).
*   **Components**: Layout base (`TopNav`, `MainLayout`).

#### C. Content Scripts (`/scripts`)
Scripts injetados na página alvo para ler o DOM.
*   **Scraper**: Lê a estrutura HTML do Blackboard para identificar cursos.
*   **Deep Access**: Utiliza `fetch` em background para acessar páginas internas do curso.
*   **Isolamento**: Roda em um "mundo isolado" (Isolated World) para não conflitar com o JS da página.

#### D. Background Service (`scripts/background.js`)
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

Para mais detalhes jurídicos e técnicos sobre dados, veja:
*   **[📜 Protocolo de Privacidade e Dados (DATA_HANDLING.md)](./DATA_HANDLING.md)**: Regras completas.
*   **[🏗️ Manual de Engenharia](../estudos/engenharia/manual-engenharia.md)**: Detalhes de implementação.

---

## 📂 4. Estrutura de Diretórios

/
├──  assets/          # Ícones e imagens estáticas
├──  features/        # SCREAMING ARCHITECTURE (Features isoladas)
│    ├── courses/     # Feature "Cursos" (Lista, Detalhes, Scraper, Storage)
│    │   ├── components/
│    │   ├── data/
│    │   ├── logic/
│    │   └── services/
│    └── import/      # Feature "Importação em Lote"
│        ├── components/
│        ├── logic/
│        └── services/
├──  popup/           # Interface do popup (ícone na barra)
├──  sidepanel/       # Lógica Global e UI do painel lateral
│    ├── components/  # Layout, Modals Globais e Shared UI
│    ├── logic/       # Gerenciadores Globais (raManager, domainManager)
│    ├── utils/       # Utilitários globais de UI
│    └── views/       # Telas genéricas (HomeView, SettingsView, FeedbackView)
├──  scripts/         # Scripts de Background e Content
├──  shared/          # Utils compartilhados (Tabs, Settings, Browser)
└──  tests/           # Testes automatizados (Jest)

> *Documento atualizado em: Dezembro 2025 (v2.6.0).*

---

### Documentação
<!-- Documentação do projeto -->
**[README.md](../README.md)**            Documentação do projeto.             
<!-- Histórico de versões e atualizações -->
**[CHANGELOG.md](../CHANGELOG.md)**      Histórico de versões e atualizações. 

