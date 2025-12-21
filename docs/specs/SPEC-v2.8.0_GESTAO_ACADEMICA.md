# 🚀 Feature Spec: Gestão Acadêmica v2.8.0 (Unified)

> **Status**: Rascunho / Planejamento
> **Objetivo**: Implementar granularidade de acompanhamento de estudo (Tasks) e monitoramento de desempenho (Performance).
> **Referência Arquitetural**: [Screaming Architecture](../TECNOLOGIAS_E_ARQUITETURA.md), [Categorias](../features/_CATEGORIES.md).

---

## 1. Visão Geral do Negócio
A versão 2.8.0 expande o domínio da extensão para cobrir o **nível micro** do aprendizado (Tarefas/Semana) e o **nível estratégico** (Progresso/Notas).

O escopo define duas novas **Features**:
1.  **`features/tasks`** (Gestão de Tarefas): Controle operacional (Visualização Semanal).
2.  **`features/performance`** (Gestão de Desempenho): Gamificação e Notas (XP & Grades).

### 1.1 Princípio de Preservação (Non-Breaking UI) 🛡️
> **Regra de Ouro**: Nenhuma **View** atual será removida ou alterada drasticamente.
As funcionalidades da v2.8.0 são estritamente **aditivas**.
*   **`CoursesView`**: Permanece idêntica, recebendo apenas pequenos **Components** (Badges) injetados.
*   **Nova Experiência**: O drill-down para a semana abre uma nova **View** dedicada, preservando a navegação principal.

---

## 2. Feature A: `features/task-week` (Gestão Semanal)
*Categoria: 🏆 CORE (Alta complexidade de regras e dados)*

### 2.1 UX: O Conceito de "Acesso Duplo"
O usuário pode interagir com suas tarefas por dois caminhos distintos, atendendo a momentos diferentes:

1.  **Caminho Hierárquico (Gestão)**:
    *   Fluxo: `TopNav(Cursos) > Lista de Cursos > [Matéria] > Lista de Semanas > [Semana Detalhe]`
    *   Uso: Organização profunda, marcar tarefas, ver detalhes.
2.  **Caminho Dashboard (Resumo)**:
    *   Fluxo: `TopNav(Início) > Widget "Meu Progresso" > [Semana Detalhe]`
    *   Uso: Visão rápida do dia ("O que falta fazer?").

### 2.2 Arquitetura de Pastas (Inspired by `courses/`)
Devido à complexidade de captura (Scraping vs Manual vs Cache), a estrutura deve ser robusta:

```
features/task-week/
├── components/          # Widgets Visuais
│   ├── StatusIcon.css   # 🟢🔵⚪
│   ├── TaskItem.js
│   ├── WeekList.js
│   └── WeekCard.js      # Usado na Home e Cursos
├── views/
│   └── WeekDetailView.js # A tela principal de gestão
├── logic/
│   ├── TaskStateMachine.js # (TODO -> DOING -> DONE)
│   └── ProgressCalculator.js # % de conclusão da semana
├── services/            # Camada de Integração (Externo)
│   ├── WeekScraper.js   # Extrai tarefas do HTML do AVA
│   └── TaskSyncer.js    # Decide se usa Cache ou Scraper novo
├── data/
│   └── TaskRepository.js # CRUD com chrome.storage
└── models/
    ├── Task.js          # @typedef
    └── Week.js          # @typedef
```

### 2.3 Fluxo de Dados Inteligente (Sync & Cache)
Assim como em `courses/import`, não podemos confiar apenas no scraping tempo real (lento).
1.  **Read Strategy**: `TaskRepository` tenta ler do cache local primeiro.
2.  **Stale-While-Revalidate**: Se o cache for antigo (> 24h) ou usuário pedir "Refresh", chama `WeekScraper`.
3.  **User Override**: Se usuário marcou manual (🟢), isso tem precedência sobre o Scraper na próxima sincronização.

---

## 3. Feature B: `features/performance` (Gamificação)
*Categoria: 📦 UTILITY (Focado em Engajamento)*

### 3.1 Sub-domínio: Grade Manager (Notas)
*   **Service**: `GradeScraper` (Extração de dados do DOM da página de notas).
*   **Logic**: `GradeCalculator` (Projeção de notas baseada em regras da UNIVESP).
*   **UI**: Injeção de componentes `GradeBadge` nos cards de curso existentes.

### 3.2 Sub-domínio: Gamification (XP System)
*   **Logic**: `XPEngine`. Escuta eventos de mudança de estado em `features/tasks`.
    *   Transition ⚪ -> 🔵 : +10 XP
    *   Transition 🔵 -> 🟢 : +50 XP
*   **UI**: `XPBarComponent`. Barra de progresso global injetada no `MainLayout`.

---

## 4. Arquitetura de Pastas (Screaming Arch)

```
features/
├── tasks/                 # [NOVO] CORE
│   ├── components/
│   │   ├── StatusIcon.css # Estilos isolados dos indicadores
│   │   ├── TaskItem.js    # Widget de tarefa
│   │   └── TaskList.js    # Container da lista
│   ├── logic/
│   │   └── TaskStateMachine.js # Lógica de transição de estados
│   ├── models/
│   │   └── Task.js        # @typedef {Object} Task
│   ├── data/
│   │   └── TaskRepository.js   # Persistência de status
│   └── views/
│       └── WeekDetailView.js   # Tela principal da semana
│
├── performance/           # [NOVO] UTILITY
│   ├── logic/
│   │   ├── GradeCalculator.js
│   │   └── XPEngine.js    # Observer de eventos
│   ├── services/
│   │   └── GradeScraper.js
│   ├── data/
│   │   └── PerformanceStorage.js
│   └── ui/
│       └── XPBar.js       # Componente injetável
```

### 4.1 Desacoplamento
*   **`performance` depende de `tasks`?**: Não diretamente.
*   **Comunicação**: Via **Event Bus** ou **Storage Observer**.
    *   Quando `TaskRepository` salva uma mudança, `XPEngine` detecta a mudança no storage e recalcula o XP. Isso evita importação direta entre features.

---

## 6. Código Base Reutilizável (Referências de Implementação)

Esta seção mapeia componentes existentes que servem como **base de código** para implementar as novas features. Reutilizar estes padrões garante consistência arquitetural.

### 6.1 Services de Scraping
**Base**: [ScraperService.js](file:///home/sant/extensaoUNIVESP/features/courses/services/ScraperService.js)
*   **Métodos Reutilizáveis**:
    *   `extractWeeksFromDoc(doc, baseUrl)`: Parsing do DOM usando seletores CSS.
    *   `scrapeWeeksFromTab(tabId)`: Injeção via `chrome.scripting.executeScript()`.
*   **Aplicação**: `WeekScraper` (features/tasks/services/) pode adaptar a lógica existente para extrair **tarefas** ao invés de semanas. A estrutura de regex e filtragem deve ser mantida.

### 6.2 Repositories de Persistência
**Base**: [CourseRepository.js](file:///home/sant/extensaoUNIVESP/features/courses/data/CourseRepository.js)
*   **Padrão CRUD**: `loadItems()`, `saveItems()`, `add()`, `delete()`, `update()`.
*   **Aplicação**: `TaskRepository` (features/tasks/data/) **DEVE** seguir a mesma assinatura de métodos para facilitar manutenção futura.
*   **Storage Layer**: Utiliza `CourseStorage` como abstração. `TaskRepository` deve criar `TaskStorage` análogo.

### 6.3 Components Visuais
**Base**: [CourseItem.js](file:///home/sant/extensaoUNIVESP/features/courses/components/CourseItem.js)
*   **Padrão de UI**: Elemento `<li class="item">` com callbacks (`onClick`, `onDelete`, `onViewDetails`).
*   **Aplicação**:
    *   `TaskItem.js`: Estrutura idêntica, mas com callback adicional `onStatusChange(status)`.
    *   `WeekCard.js`: Card compacto para widget da Home.

### 6.4 Modal Reutilizável
**Base**: [Modal.js](file:///home/sant/extensaoUNIVESP/shared/ui/Modal.js)
*   **API**: `render(contentHtml)`, `close()`, `setOnClose(callback)`.
*   **Aplicação**: Se necessário criar modal para detalhes de semana/tarefa, herdar desta classe base.

### 6.5 Gerenciamento de Abas
**Base**: [Tabs.js](file:///home/sant/extensaoUNIVESP/shared/utils/Tabs.js)
*   **Regra de Unicidade**: Método `openOrSwitchTo(url, matchPattern)` implementa a [Regra de Unicidade de Aba](file:///home/sant/extensaoUNIVESP/docs/REGRAS_DE_NEGOCIO.md#L11-L23).
*   **CRÍTICO**: `WeekDetailView` (se abrir em nova aba) **DEVE** usar este serviço:
    ```javascript
    import { Tabs } from '../../../shared/utils/Tabs.js';
    Tabs.openOrSwitchTo(weekUrl, /content_id=_\d+/);
    ```

### 6.6 Feedback Visual
**Base**: [Toaster.js](file:///home/sant/extensaoUNIVESP/shared/ui/feedback/Toaster.js)
*   **API**: `show(message, type, duration)` onde `type` = `'success'|'error'|'info'`.
*   **Aplicação**: Feedback de ações do usuário:
    *   Marcar tarefa: `toaster.show('Tarefa concluída!', 'success')`
    *   Salvar XP: `toaster.show('+50 XP ganhos!', 'info')`

### 6.7 Lógica de Agrupamento
**Base**: [CourseGrouper.js](file:///home/sant/extensaoUNIVESP/features/courses/logic/CourseGrouper.js)
*   **Padrão**: Função pura que agrupa array de objetos por critério (ano/bimestre).
*   **Aplicação**: `TaskGrouper.js` pode agrupar tarefas por status (🟢/🔵/⚪) ou por semana.

### 6.8 Models (Type Definitions)
**Base**: [Course.js](file:///home/sant/extensaoUNIVESP/features/courses/models/Course.js), [Week.js](file:///home/sant/extensaoUNIVESP/features/courses/models/Week.js)
*   **Padrão**: Arquivos de pura tipagem JSDoc (`@typedef`).
*   **Aplicação**: Criar `features/tasks/models/Task.js`:
    ```javascript
    /**
     * @typedef {Object} Task
     * @property {string} id - Identificador único
     * @property {string} name - Nome da tarefa
     * @property {'TODO'|'DOING'|'DONE'} status - Estado atual
     * @property {number} lastModifiedAt - Timestamp da última alteração
     */
    ```

---

## 7. Pontos de Integração com Código Existente

Esta seção documenta como as novas features se **integram** com o código atual **sem modificá-lo diretamente** (princípio Open/Closed).

### 7.1 Injeção de Badges em `CourseItem`
**Arquivo Alvo**: [CourseItem.js](file:///home/sant/extensaoUNIVESP/features/courses/components/CourseItem.js)

**Estratégia (Non-Invasive)**:
*   **SEM MODIFICAÇÃO** do componente original.
*   **Injeção via View**: Em `CoursesView`, após renderizar a lista, injeta badges dinamicamente:
    ```javascript
    // Pseudocódigo em features/courses/views/CoursesView/index.js
    const courseItems = container.querySelectorAll('.item');
    courseItems.forEach(item => {
      const badge = document.createElement('span');
      badge.className = 'task-status-badge';
      badge.textContent = '🟢'; // Obtido de TaskRepository
      item.querySelector('.item-name').appendChild(badge);
    });
    ```

**CSS**: Criar `assets/styles/components/task-status-badge.css` com estilos isolados.

### 7.2 Event Bus para Comunicação `tasks ↔ performance`
**Requisito**: Features desacopladas (Seção 4.1).

**Solução**: Usar `chrome.storage.onChanged` como Event Bus nativo:
```javascript
// Em features/performance/logic/XPEngine.js
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.tasks) {
    const oldTasks = changes.tasks.oldValue || [];
    const newTasks = changes.tasks.newValue || [];
    // Detecta transições de estado e calcula XP
    this.calculateXPDelta(oldTasks, newTasks);
  }
});
```

**Vantagem**: Zero importação direta entre features. `tasks` não conhece `performance`.

### 7.3 Reutilização de Estilos CSS
**Base**: [assets/styles/components/](file:///home/sant/extensaoUNIVESP/assets/styles/components/)

**Reutilizar Diretamente**:
*   `button.css`: Botões de ação (marcar tarefa).
*   `card.css`: Cards de semana.
*   `modal.css`: Modais de detalhes.

**Criar Novos**:
*   `task-status-icon.css`: Estilos para 🟢🔵⚪.
*   `xp-bar.css`: Barra de progresso de XP.

**Naming Convention (BEM)**:
```css
/* task-status-icon.css */
.task-status-badge {}
.task-status-badge--done { color: green; }
.task-status-badge--doing { color: blue; }
.task-status-badge--todo { color: gray; }
```

### 7.4 Navegação e Routing
**Integração com**: [MainLayout.js](file:///home/sant/extensaoUNIVESP/shared/ui/layout/MainLayout.js)

**Cenário**: Adicionar navegação para `WeekDetailView`.

**Estratégia**:
1.  **NÃO** adicionar botão no `TopNav` (preservação de UI).
2.  **Navegação drill-down**: Clicar em `WeekCard` (na Home ou Cursos) abre `WeekDetailView` via `MainLayout.showView('weekDetail', data)`.

---

## 8. Validação e Testes

### 8.1 Testes de Referência
As novas features devem seguir o padrão de testes existentes.

**Testes Unitários** (Referência):
*   [CourseRepository/](file:///home/sant/extensaoUNIVESP/features/courses/tests/CourseRepository/) - Suite completa para CRUD.
*   [ScraperService.test.js](file:///home/sant/extensaoUNIVESP/features/courses/tests/ScraperService.test.js) - Mocking de DOM.

**Testes de Components** (Referência):
*   [ActionMenu.test.js](file:///home/sant/extensaoUNIVESP/shared/ui/tests/ActionMenu.test.js) - Testes de interação UI.

**Aplicação**:
*   `features/tasks/tests/TaskRepository.test.js`: Espelhar estrutura de CourseRepository tests.
*   `features/tasks/tests/TaskStateMachine.test.js`: Testar transições TODO→DOING→DONE.
*   `features/performance/tests/XPEngine.test.js`: Testar cálculo de XP baseado em eventos.

### 8.2 Comandos de Validação
Antes de commitar **qualquer** implementação desta SPEC:

```bash
npm run type-check   # Zero Errors (JSDoc Strict)
npm run lint         # Zero Warnings (ESLint Policy)
npm test             # All Passing (Jest)
npm run format:check # All Formatted (Prettier)
```

Conforme [PADROES_DO_PROJETO.md](file:///home/sant/extensaoUNIVESP/docs/PADROES_DO_PROJETO.md#L10-L50).

### 8.3 Cobertura Esperada
*   **`features/tasks/logic/`**: **100%** (State Machine é crítica).
*   **`features/tasks/data/`**: **100%** (CRUD deve ser confiável).
*   **`features/performance/logic/`**: **90%+** (XP Engine).
*   **`features/tasks/services/`**: **80%+** (Scraping tem edge cases de DOM).

### 8.4 Integração com Workflows
Usar workflows existentes para desenvolvimento:
*   `/nova-feature`: Iniciar implementação com TDD.
*   `/verificar`: Executar suite completa de validação.
*   `/bug-fix`: Corrigir problemas encontrados em testes.

Conforme [FLUXOS_DE_TRABALHO.md](file:///home/sant/extensaoUNIVESP/docs/FLUXOS_DE_TRABALHO.md).

---

## 9. Regras Adicionais de Negócio

Esta seção complementa as [Regras de Negócio](file:///home/sant/extensaoUNIVESP/docs/REGRAS_DE_NEGOCIO.md) existentes com especificações da v2.8.0.

### 9.1 Regra de Precedência de Dados (User Override)
**QUANDO**: Scraper detecta tarefa como ⚪ (não feita), mas usuário marcou manualmente como 🟢 (feita).

**DECISÃO**:
1.  **Manual SEMPRE vence scraper** (linha 66 da SPEC).
2.  **Timestamp**: Toda mudança manual grava `lastModifiedAt` no `TaskRepository`.
3.  **Sincronização**: `TaskSyncer` compara `lastModifiedAt` vs `lastScraperRun`.

**Implementação (Pseudocódigo)**:
```javascript
// Em features/tasks/services/TaskSyncer.js
syncTask(taskId) {
  const localTask = await TaskRepository.getById(taskId);
  const scrapedTask = await WeekScraper.scrapeTask(taskId);
  
  if (localTask.lastModifiedAt > this.lastScraperRun) {
    return localTask; // Ignora scraper, manual tem precedência
  }
  
  return scrapedTask; // Atualiza com dados do AVA
}
```

### 9.2 Regra de Unicidade de Aba (Integração com Tabs.js)
**QUANDO**: Usuário clica em "Ver Semana Detalhe" de duas formas:
1.  Via `CoursesView > Lista de Semanas > [Semana X]`
2.  Via `HomeView > Widget "Meu Progresso" > [Semana Detalhe]`

**PROBLEMA**: Sem controle, cada clique abrirá nova aba, poluindo o navegador.

**SOLUÇÃO**: Usar [`Tabs.openOrSwitchTo()`](file:///home/sant/extensaoUNIVESP/shared/utils/Tabs.js#L9-L65)
```javascript
// Em features/tasks/views/WeekDetailView.js (se abrir em aba)
import { Tabs } from '../../../shared/utils/Tabs.js';

openWeekDetail(weekUrl) {
  // Match pattern ignora query params, foca em content_id
  Tabs.openOrSwitchTo(weekUrl, /content_id=_\d+/);
}
```

**Comportamento**:
*   **Se aba já existe**: Foca na aba existente (preserva estado do usuário).
*   **Se não existe**: Cria nova aba.

Conforme [REGRAS_DE_NEGOCIO.md - Regra de Unicidade de Aba](file:///home/sant/extensaoUNIVESP/docs/REGRAS_DE_NEGOCIO.md#L11-L23).

### 9.3 Regra de Gamificação (XP Calculation)
**QUANDO**: Usuário muda status de tarefa.

**DECISÃO (XP Rewards)**:
*   Transição ⚪ → 🔵 (Iniciou tarefa): **+10 XP**
*   Transição 🔵 → 🟢 (Concluiu tarefa): **+50 XP**
*   Transição direta ⚪ → 🟢 (Concluiu sem "Doing"): **+60 XP** (bônus de 10 XP)
*   Reversão 🟢 → ⚪ (Desmarcou): **-50 XP** (penalidade)

**Verificação de Integridade**:
*   XP não pode ser negativo (mínimo: 0).
*   Toda mudança de XP gera evento visual (Toaster).

---


## 10. Plano de Implementação

### Fases de Desenvolvimento

1.  **Fase 1 (Core - Tasks)**: Implementar `features/tasks` com `WeekDetailView` e persistência básica.
    *   Criar models (`Task.js`, `Week.js`).
    *   Implementar `TaskRepository` baseado em `CourseRepository`.
    *   Desenvolver `TaskStateMachine` com testes 100%.
    *   Validação: `npm test -- features/tasks/`

2.  **Fase 2 (UI - Visual)**: Implementar estilos visuais e UX de check/uncheck.
    *   Criar `TaskItem`, `WeekCard`, `StatusIcon` components.
    *   Adicionar CSS (`task-status-icon.css`).
    *   Injetar badges em `CourseItem` via `CoursesView`.
    *   Validação: Inspeção visual + testes de componentes.

3.  **Fase 3 (Performance - Gamification)**: Implementar `features/performance` (Scraper e XP).
    *   Criar `GradeScraper` baseado em `ScraperService`.
    *   Desenvolver `XPEngine` com event listener de `chrome.storage.onChanged`.
    *   Implementar `XPBar` component.
    *   Validação: `npm test -- features/performance/`

4.  **Fase 4 (Integration - Sync)**: Ligar o motor de XP aos eventos de tarefa.
    *   Implementar `TaskSyncer` com regra de precedência (Seção 9.1).
    *   Integrar `Tabs.openOrSwitchTo()` em navegação (Seção 9.2).
    *   Testes de integração cross-feature.
    *   Validação: `/verificar` (suite completa).

### Checklist Pré-Commit (Cada Fase)

- [ ] `npm run type-check` - Zero Errors
- [ ] `npm run lint` - Zero Warnings
- [ ] `npm test` - All Passing
- [ ] `npm run format:check` - All Formatted
- [ ] Documentação atualizada (se aplicável)
- [ ] Testes cobrindo ≥90% da lógica de negócio
