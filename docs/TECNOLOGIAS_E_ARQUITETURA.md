# Especificação de Arquitetura

> **Status**: Produção (v2.8.14)
> **Padrão**: Hybrid (Screaming Arch + Modular Monolith)
> **Runtime**: Google Chrome V3

Este documento define a arquitetura de software, restrições técnicas e decisões de design do projeto.

---

## 1. Princípios Arquiteturais

### 1.1 Arquitetura Híbrida (Screaming + Vertical Slices)
A organização do código deve evidenciar o domínio de negócio, utilizando o conceito de **Vertical Slices** dentro de um **Modular Monolith**.
- **Regra**: O diretório `features/` é a fonte da verdade. Cada subdiretório representa uma "Fatia Vertical" completa (UI, Lógica, Dados) de um Bounded Context.
- **Isolamento**: Features não devem acoplar-se diretamente. Comunicação via Eventos ou Shared Kernel é preferível.

### 1.2 Local-First (Data Sovereignty)
O sistema opera sem backend proprietário.
- **Persistência**: Exclusivamente via `chrome.storage` (Sync/Local).
- **Semântica**: O usuário é soberano sobre seus dados. Não há telemetria externa ou database central.

### 1.3 Minimalist Runtime
- **Zero Frameworks**: Interface construída com Web Components padrões ou Vanilla JS para maximizar performance e longevidade.
- **Buildless Dev**: O código fonte é ES Modules nativo, capaz de rodar diretamente no navegador (exceto para JSX/TS se introduzidos, mas atualmente Vanilla).

---

## 2. Anatomia do Sistema (Manifest V3)

### 2.1 Componentes do Chrome Extension
| Componente | Contexto | Responsabilidade |
| :--- | :--- | :--- |
| **Background SW** | Service Worker | Orquestração de eventos, Persistência, Mensageria. |
| **Side Panel** | Main UI Thread | Interface principal. Hospeda as `Views` das features. |
| **Content Script** | Isolated World | Interação com DOM do AVA/SEI (Scraping, Autofill). |
| **Popup** | UI Thread | Acesso rápido (Legacy/Fallback). |

### 2.2 Estrutura de Diretórios (Canonical)
A estrutura física reflete a lógica de negócio:

```text
extensaoUNIVESP/
├── assets/              # Recursos Estáticos
├── features/            # Domínios de Negócio (Bounded Contexts)
│   ├── courses/         # Gestão Acadêmica
│   ├── session/         # Auth & Credenciais
│   └── settings/        # Configuração Global
├── shared/              # Shared Kernel (Reutilizáveis)
│   ├── logic/           # Business Logic agnóstica
│   ├── ui/              # Dumb Components (Modal, Button)
│   └── utils/           # Low-level helpers (Browser API)
├── scripts/             # Background & Content Scripts
└── sidepanel/           # Entry Point da UI (Shell)
```

---

## 3. Camadas de Software

### 3.1 Domain Layer (`features/*/logic`)
Contém a lógica pura de negócio.
- **Característica**: Agnóstica de Framework e UI.
- **Teste**: 100% Coberta por Testes Unitários.

### 3.2 Service Layer (`features/*/services`)
Responsável pela orquestração e integração com o mundo externo (DOM, APIs).
- **Pattern**: Facade / Service Object.
- **Responsabilidade**: Isolar a View da complexidade de obtenção de dados.

### 3.3 Repository Layer (`features/*/repository`)
Responsável pela persistência e recuperação de dados. Implementa o padrão Repository para abstrair a fonte de dados (ex: `chrome.storage` ou API).
- **Pattern**: Repository Pattern.
- **Responsabilidade**: CRUD puro, sem regras de negócio complexas.
- **Exemplo**: `ActivityProgressRepository.js`.

### 3.4 Model Layer (`features/*/models`)
Definições de tipos e entidades de domínio.
- **Formato**: Módulos ES contendo JSDoc `@typedef`.
- **Regra**: Fonte única da verdade para estruturas de dados (Canonical Models).
- **Exemplo**: `Week.js`, `ActivityProgress.js`.

### 3.5 Interface Layer (`features/*/ui`)
Responsável pela renderização e interação.
- **Componentes**: Views (Páginas) e Components (Widgets).
- **Estado**: Gerenciamento local ou via Stores simples.

### 3.6 Infrastructure Layer (`scripts/`)
Conecta o sistema à API do navegador.
- **Responsabilidade**: Mensageria entre abas, detecção de lifecycle eventos.

---

## 4. Decisões Técnicas (ADR Summary)

### ADR-001: Vanilla JS vs Frameworks
**Decisão:** Uso de Vanilla JS + ES Modules.
**Motivo:** Reduzir complexidade de build, eliminar "peso morto" de bundles, garantir compatibilidade perene com V8.

### ADR-002: Side Panel como UI Principal
**Decisão:** Migração de Popup para Side Panel.
**Motivo:** Permitir uso concomitante da extensão enquanto navega no AVA (Multitasking).

---

## 5. Mapa de Comunicação

```mermaid
graph TD
    User((Usuário)) --> SidePanel
    
    subgraph "Main Process (SidePanel)"
        SidePanel --> FeatureRouter
        FeatureRouter --> CoursesView
        FeatureRouter --> SettingsView
    end
    
    subgraph "Background Process"
        CoursesView -- "Message: Sync" --> ServiceWorker
        ServiceWorker -- "Chrome Storage" --> DB[(Storage)]
    end
    
    subgraph "Content Process"
        ServiceWorker -- "Port" --> ContentScript
        ContentScript -- "DOM Access" --> AVAPage
    end
```

---

## 6. Glossário Técnico (Ubiquitous Language)

Definição estrita dos termos utilizados no domínio do projeto.

### 6.1 Entidades de Domínio

**AVA (Ambiente Virtual de Aprendizagem)**  
Sistema Blackboard utilizado pela UNIVESP. Fonte primária de dados para scraping.

**Feature**  
Unidade funcional autônoma do sistema. Representa um Bounded Context na arquitetura.  
Ex: `courses`, `session`, `settings`.

**View**  
Interface gráfica de alto nível que ocupa a área principal do painel lateral. Equivalente a uma "Página" em SPAs.  
Ex: `CoursesView`, `HomeView`.

**Component**  
Elemento de interface reutilizável e de escopo menor que uma View.  
Ex: `WeekItem`, `CourseItem`, `Modal`.

### 6.2 Conceitos Arquiteturais

**Vertical Slice Architecture**  
Arquitetura onde o sistema é dividido verticalmente por funcionalidades. Cada fatia contém toda a lógica necessária (UI, Service, Model) para funcionar, evitando dependências entre camadas horizontais globais.

**Modular Monolith (Monolito Modular)**  
Estratégia de implantação onde o sistema é um único artefato distribuível (extensão Chrome), mas internamente é organizado em módulos altamente desacoplados.

**Feature-Sliced Design (Adaptado)**  
Metodologia que divide o sistema em fatias (Features) e segmentos técnicos (Segments: `logic`, `ui`, `data`). O projeto adapta este conceito ao usar `shared/` como kernel comum.

**Screaming Architecture**  
Padrão arquitetural onde a estrutura de diretórios comunica a intenção de negócio do sistema.

### 6.3 Termos Técnicos

**Chips de Navegação**  
Componente de UI (`ContextualChips`) que permite navegação rápida entre semanas dentro da view de atividades, mantendo contexto e persistência.

**Content Script**  
Script que roda no contexto da página web (AVA).

**Isolated World**  
Contexto de execução dos Content Scripts no Chrome, onde compartilham o DOM da página hospedeira mas possuem um escopo JavaScript isolado.

**Service Worker (Background)**  
Script de event-handling que roda em background, independente da interface gráfica. Responsável pela persistência e lógica de longa duração.

**Repository Pattern**  
Padrão de acesso a dados que abstrai a fonte de persistência (`chrome.storage`), oferecendo uma interface de coleção para o domínio.

**@typedef (JSDoc)**  
Diretiva de documentação utilizada para criar definições de tipos reutilizáveis em JavaScript puro. Utilizado extensivamente em `features/*/models`.

**ActivityProgress**  
Modelo canônico (Entidade) que representa o estado de conclusão de uma tarefa. Unifica dados de scraping ('TODO'/'DONE') e interação do usuário (toggle manual).

**QuickLinks Scraper**  
Estratégia de extração de dados que utiliza o modal nativo "Links Rápidos" do Blackboard. Mais rápido que scraping via DOM, mas fornece apenas IDs e Títulos.

**Scraper**  
Serviço especializado em extrair dados estruturados a partir do DOM de páginas HTML (AVA/SEI).

### 6.4 Diferenciações Importantes

| Termo | Definição | Contraparte |
| :--- | :--- | :--- |
| **Logic** | Regras de negócio puras (Testável unitariamente). | **Service** (Integração externa/IO). |
| **Feature** | Módulo de domínio específico. | **Shared** (Módulo genérico reutilizável). |
| **Modal** | Overlay de interrupção temporária. | **View** (Navegação persistente). |
