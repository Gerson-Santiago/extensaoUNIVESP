# 📚 Feature: Courses

**Gerenciamento do Ciclo de Vida Acadêmico**

> **Responsabilidade**: Gerenciar matérias, semanas, tarefas e atividades (Core Domain).
> **Arquitetura**: Screaming Architecture + Vertical Slices.

> [!IMPORTANT]
> **Source of Truth:** A implementação de referência está em `features/courses/`.


## 📂 Estrutura (Atualizada)

```text
features/courses/
├── views/                           # Camada de Apresentação
│   ├── CoursesView/                 # Lista de Matérias
│   ├── CourseWeeksView/             # Lista de Semanas
│   ├── CourseWeekTasksView/         # Lista de Tarefas (Checklist)
│   └── DetailsActivitiesWeekView/   # Índice de Atividades (Modular)
│       ├── ActivityItemFactory.js
│       ├── ActivityRenderer.js
│       ├── ChipsManager.js
│       ├── HeaderManager.js
│       ├── SkeletonManager.js
│       ├── ViewTemplate.js
│       └── handlers/
├── services/                        # Orquestração
│   ├── WeekActivitiesService.js     # Facade de Scraping (SafeResult pattern)
│   ├── TaskProgressService.js       # Gestão de Status
│   ├── QuickLinksScraper.js         # Estratégia Rápida
│   └── WeekContentScraper.js        # Estratégia Completa (DOM)
├── logic/                           # Regras de Negócio (Pure JS)
│   ├── autoScrollService.js
│   ├── CourseGrouper.js
│   ├── TaskCategorizer.js
│   └── TermParser.js
├── data/                            # Dados (Cursos)
│   ├── CourseRepository.js          # API Pública
│   └── CourseStorage.js             # Driver Chrome Storage
├── repositories/                    # Dados (Atividades - localStorage)
│   └── ActivityRepository.js         # Cache 5MB (activities_CID_WID)
├── repository/                      # Dados (Progresso - sync storage)
│   └── ActivityProgressRepository.js
└── components/                      # Widgets Compartilhados
    ├── CourseItem.js
    └── WeekItem.js
```

---

## 🗺️ Visão Geral das Views

### 1. CoursesView (Home)
Lista todas as matérias agrupadas por semestre.
- **Funcionalidades**: Listagem de cards, Refresh geral.

### 2. CourseWeeksView
Lista as semanas de uma matéria específica.
- **Funcionalidades**:
    - **Links Rápidos (Atividades)**: Abre `DetailsActivitiesWeekView`.
    - **Tarefas (Checklist)**: Abre `CourseWeekTasksView`.
    - **Persistence**: Salva `weeks` automaticamente após scraping.

### 3. DetailsActivitiesWeekView
**"O Coração do Estudo"**. Índice navegável de atividades.
- **Destaques**:
    - **Chips**: Navegação rápida entre semanas.
    - **Deep Link**: Abre o AVA e rola até a atividade.
    - **Modular**: Componentes desacoplados (ver `README` interno).

### 4. CourseWeekTasksView
Checklist simples para controle manual de tarefas.
- **Destaques**: Barra de progresso visual.

---

## 🧠 Lógica & Dados

| Camada | Componente | Função |
| :--- | :--- | :--- |
| **Data** | `CourseRepository` | Persistência de estrutura (Matérias/Semanas). |
| **Repository** | `ActivityProgressRepository` | Persistência granulada de status (TODO/DONE). |
| **Service** | `WeekActivitiesService` | Decide se usa Cache, QuickLinks ou DOM Scraper. |
| **Logic** | `AuthScrollService` | Calcula posição exata do elemento no AVA. |

---

## 🛠️ Status da Feature (v2.10.0)

- ✅ **Navegação**: 100% Funcional (Robust Scroll Navigation v2.10.0).
- ✅ **Persistência**: Auto-save implementado em todas as etapas.
- ✅ **Modularização**: Views complexas refatoradas.
- ✅ **Error Handling**: SafeResult pattern em WeekActivitiesService.
- ✅ **Logging**: Sistema centralizado com `Logger.js` e tags semânticas (#LOG_*).
- ✅ **Renderização**: Container Freshness fix (DOM Zumbi eliminado).
- ✅ **Testes**: 455 testes passando (100% Green).

**Destaques v2.10.0:**
- 🕵️ **Observabilidade**: Logging estruturado com tags semânticas em toda a feature.
- 🚀 **Resiliência**: Navegação de scroll com `MutationObserver` (adeus timeouts arbitrários).
- 🛡️ **Segurança**: Regex de tarefas otimizada contra ataques de negação de serviço (ReDoS).
- 🧪 **Estabilidade**: 455 testes garantindo que nenhuma regressão ocorra.

---
*Última atualização: 29/Dezembro/2025 (Release v2.9.2)*
