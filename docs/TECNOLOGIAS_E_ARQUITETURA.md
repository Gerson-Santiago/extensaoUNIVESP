# 🏗️ Especificação de Arquitetura e Tecnologia

> **Status**: Produção (v2.6.1)
> **Arquitetura**: Screaming Architecture (Domain-Driven)
> **Plataforma**: Google Chrome Extensions (Manifest V3)

Este documento atua como a **Fonte da Verdade Arquitetural** do projeto. Ele define as restrições, padrões e fronteiras que garantem a longevidade e manutenibilidade do software.

---

## 1. Princípios Arquiteturais (The Axioms)

### 1.1 Screaming Architecture (A Arquitetura que Grita)
A estrutura de diretórios do projeto reflete **o que o sistema faz**, não de que o sistema é feito.
*   **Intenção > Ferramenta**: Ao abrir a raiz do projeto, um desenvolvedor deve ver *Casos de Uso* (Cursos, Importação), não *Frameworks* (Controllers, Views).
*   **Regra**: Se uma nova funcionalidade de negócio for adicionada, uma nova pasta em `features/` deve nascer.

### 1.2 Local-First & Zero-Backend
O sistema opera sob o princípio de soberania de dados do usuário.
*   **Persistência**: Todo dado reside estritamente no `chrome.storage` local.
*   **Sincronização**: Ocorre apenas através do mecanismo nativo do Chrome (Google Account), sem servidores intermediários proprietários.
*   **Offline-Capable**: A lógica de negócio independe de conectividade constante, salvo para operações de scraping (AVA/SEI).

### 1.3 Dependências Mínimas (Vanilla First)
A longevidade do projeto é priorizada sobre a conveniência imediata.
*   **Sem Frameworks de UI**: Uso de HTML/CSS/JS nativos e Custom Elements (se necessário) para evitar *framework fatigue* e obsolescência.
*   **Sem Transpilação em Runtime**: O código em produção é ES Modules nativo, suportado diretamente pela V8 engine moderna.

---

## 2. Anatomia do Sistema (Manifest V3)

O sistema é dividido em três camadas concêntricas de responsabilidade.

```mermaid
graph TD
    User((Usuário))
    
    subgraph "Shell (Side Panel)"
        Orchestrator[sidepanel.js]
        HTML[sidepanel.html]
    end

    subgraph "Shared Components"
        SharedUI[shared/ui]
        Layout[Layout & TopNav]
        Modal[Modal & ActionMenu]
        Toaster[Toaster]
    end

    subgraph "Features (Domain Layer)"
        Courses[Feature: Cursos]
        Import[Feature: Importação]
        Settings[Feature: Configurações]
        Session[Feature: Sessão/Auth]
        Home[Feature: Home]
        Feedback[Feature: Feedback]
    end

    subgraph "Core & Infrastructure"
        StorageAdapter[Storage Driver]
        Assets[assets/styles]
        BgWorker[Background Service Worker]
        ContentScripts[Content Injectors]
    end

    User --> HTML
    HTML --> Orchestrator
    Orchestrator --> SharedUI
    SharedUI --> Layout & Modal & Toaster
    Orchestrator --> Courses & Import & Settings & Session
    
    Courses & Import --> StorageAdapter
    Import --> BgWorker
    BgWorker --> ContentScripts
    HTML --> Assets
```

### 2.1 Camada de Features (`/features`)
O coração do software. Cada pasta aqui é um *Bounded Context* autônomo.
*   **Estrutura Canônica de uma Feature**:
    *   `ui/`: Componentes visuais (burros). Renderizam dados e emitem eventos.
    *   `logic/`: Regras de negócio puras (testáveis unitariamente, agnósticas de DOM).
    *   `data/`: Repositórios e DTOs. Responsáveis pela persistência e hidratação de dados.
    *   `services/`: Integração com o mundo externo (Scrapers, Parsers).
    *   `tests/`: Testes unitários e de integração colocalizados.

### 2.2 Camada Shell (`/sidepanel`)
O container minimalista que hospeda as features.
*   **Responsabilidade**: Boot do sistema e orquestração de features.
*   **Conteúdo Atual**: Apenas `sidepanel.html` (entry point) e `sidepanel.js` (orchestrator).
*   **Restrição**: O Shell *não conhece* regras de negócio. Ele apenas instancia a Feature solicitada.
*   **Nota**: Após a refatoração Screaming Architecture (Fases 2-3), components, utils e styles foram migrados para `shared/` e `features/`.

### 2.3 Camada Shared & Infrastructure (`/shared`, `/scripts`, `/assets`)
Mecanismos reutilizáveis e infraestrutura.
*   **`shared/ui`**: Componentes de interface reutilizáveis (Modal, ActionMenu, Layout, Toaster).
*   **`shared/utils`**: Utilitários genéricos (Tabs, BrowserUtils, Settings).
*   **`shared/logic`**: Lógica compartilhada entre features (AutoScroll).
*   **`assets/styles`**: CSS global e componentes visuais centralizados.
*   **Background Service Worker**: Gerencia ciclo de vida, eventos de sistema e comunicação cross-context.
*   **Content Scripts**: Atuam como sensores e atuadores na página do AVA/SEI. Executam em *Isolated World*.

### 2.4 Estrutura Física Atual

Após a conclusão das Fases 2 e 3 da refatoração Screaming Architecture (Dez/2025):

```
extensaoUNIVESP/
├── assets/
│   ├── styles/              # CSS centralizado (global, layout, components, views)
│   └── *.png                # Ícones da extensão
├── features/
│   ├── courses/             # Gestão de Cursos
│   │   ├── components/      # CoursesList, CourseItem, AddManualModal
│   │   ├── data/            # CourseRepository
│   │   ├── logic/           # CourseService, TermParser, CourseGrouper
│   │   ├── services/        # CourseDetector
│   │   └── tests/
│   ├── import/              # Importação em Lote
│   │   ├── components/      # BatchImportModal
│   │   ├── logic/           # BatchImportFlow
│   │   ├── services/        # BatchScraper
│   │   └── tests/
│   ├── session/             # Autenticação e Sessão (Nova - Phase 2)
│   │   ├── components/      # LoginWaitModal
│   │   └── logic/           # SessionManager (ex-RaManager)
│   ├── settings/            # Configurações do Usuário
│   │   ├── components/      # ConfigForm (Nova - Phase 3)
│   │   ├── logic/           # DomainManager
│   │   └── ui/              # SettingsView
│   ├── home/                # Tela Inicial
│   │   └── ui/              # HomeView
│   └── feedback/            # Feedback do Usuário
│       └── ui/              # FeedbackView
├── shared/
│   ├── ui/                  # Componentes reutilizáveis (Nova - Phase 2/3)
│   │   ├── layout/          # MainLayout, TopNav
│   │   ├── feedback/        # Toaster (ex-StatusManager)
│   │   ├── Modal.js
│   │   └── ActionMenu.js
│   ├── utils/               # Utilitários genéricos
│   │   ├── Tabs.js
│   │   ├── BrowserUtils.js
│   │   └── settings.js
│   └── logic/
│       └── AutoScroll.js
├── sidepanel/               # Shell minimalist (Phase 3 cleanup)
│   ├── sidepanel.html       # Entry point HTML
│   └── sidepanel.js         # Orchestrator
├── scripts/
│   ├── background.js        # Service Worker
│   └── content.js           # Content Script
├── popup/                   # Popup alternativo (opcional)
└── tests/                   # Testes globais e de integração
```

**Nota Histórica**: Antes da refatoração (pré-Dez/2025), todo o código vivia em `sidepanel/components`, `sidepanel/utils` e `sidepanel/styles`. A migração para a estrutura atual foi concluída em 3 fases, priorizando features de negócio primeiro, depois componentes compartilhados, e finalmente assets.

---

## 3. Regras de Fronteira (Boundaries)

### 3.1 A Regra de Dependência
O sentido das dependências deve apontar sempre em direção à estabilidade.
1.  **Features dependem de Core/Shared**: ✅ Permitido.
2.  **Core depende de Features**: ❌ PROIBIDO. O Background Worker não deve importar lógica de cálculo de média.
3.  **Feature depende de Feature**: ⚠️ EVITAR.
    *   Se `Import` precisa criar um curso, ele deve usar o `CourseRepository` (interface pública) ou emitir um evento. Nunca importar a View de Cursos.

### 3.2 Isolamento de CSS
Para evitar colisão de estilos em um ambiente sem Shadow DOM obrigatório:
*   **Namespacing BEM**: `.feature-name__component--modifier` (ex: `.courses-list__item--active`).
*   **CSS Variables**: Definição global de tokens em `global.css`, consumo local nas features.

---

## 4. Stack Tecnológica Detalhada

| Contexto | Tecnologia | Decisão / Justificativa |
| :--- | :--- | :--- |
| **Language** | IPv6 / ES2022+ | Uso de recursos modernos (Classes, Async/Await, Modules) nativos. |
| **Module System** | ES Modules (ESM) | Padrão web. Permite imports estáticos e análise de árvore (Tree Shaking se necessário). |
| **Testing** | Jest + JSDOM | Standard da indústria. Alta performance e cobertura. |
| **Mocking** | jest-webextension-mock | Simulação fidedigna do ambiente hostil da Chrome API. |
| **Linting** | ESLint (Flat Config) | Controle de qualidade estático rigoroso (Zero Warnings Policy). |
| **Formatting** | Prettier | Consistência visual automatizada. |
| **Versioning** | SemVer | Controle semântico de mudanças (Major.Minor.Patch). |

---

## 5. Diretrizes de Desenvolvimento

### 5.1 Adicionando Nova Funcionalidade
Processo obrigatório para expansão do sistema:
1.  **Definir Domínio**: A nova funcionalidade pertence a um domínio existente?
    *   *Sim* -> Adicionar a `features/<dominio>`.
    *   *Não* -> Criar nova `features/<novo-dominio>`.
2.  **Criar Estrutura**: Replicar a anatomia canônica (`ui`, `logic`, `data`, `tests`).
3.  **Test-First**: Escrever o teste de integração da regra de negócio principal.
4.  **Implementar**: Codificar a lógica agnóstica de UI.
5.  **Conectar**: Criar a UI e conectar os eventos no `index.js` da feature.
6.  **Expor**: Exportar apenas o necessário (Facade) no `index.js` para o Shell consumir.

### 5.2 Gerenciamento de Estado
*   **Efêmero (UI State)**: Mantido em memória nas classes de Controller/View enquanto o Sidepanel está aberto.
*   **Persistente (User Data)**: Gravado imediatamente no `chrome.storage`.
*   **Reatividade**: Atualizações de UI ocorrem via re-renderização explícita ou observadores de eventos, evitando a complexidade de Virtual DOM para esta escala de aplicação.

---

> *Este documento deve ser revisado a cada Major Release para garantir que a implementação não divergiu da arquitetura.*
