# 📚 Features/Courses - Arquitetura de Views

Documentação da feature de **Gerenciamento de Cursos** seguindo Screaming Architecture.

---

## 🎯 Visão Geral

Esta feature gerencia a **navegação e visualização de cursos, semanas e atividades** do AVA UNIVESP.

**Funcionalidades**:
- ✅ Listar cursos (matérias)
- ✅ Navegar por semanas
- ✅ Ver tarefas filtradas por status
- ✅ Índice navegável de atividades com scroll automático
- ✅ Scraping via DOM ou Links Rápidos

---

## 📂 Estrutura de Diretórios

```
features/courses/
├── views/                           ← Views (UI - React-like)
│   ├── CoursesView/                 ← Home: lista de matérias
│   ├── CourseWeeksView/             ← Semanas de uma matéria
│   ├── CourseWeekTasksView/         ← Tarefas filtradas
│   └── DetailsActivitiesWeekView/   ← Índice de atividades
├── components/                      ← Componentes visuais
│   ├── CourseItem.js
│   ├── WeekItem.js
│   └── AddManualModal/
├── services/                        ← Integração e Orquestração
│   ├── TaskProgressService.js       ← Gerencia progresso de tarefas
│   ├── WeekActivitiesService.js     ← Facade: Scraping + Cache
│   ├── CourseRefresher.js           ← Atualização em lote
│   ├── ScraperService.js            ← Base para scrapers
│   ├── QuickLinksScraper.js         ← Estratégia: Links Rápidos
│   └── WeekContentScraper.js        ← Estratégia: DOM Parser
├── repository/                      ← Data Access Layer
│   └── ActivityProgressRepository.js ← CRUD de progresso (NEW!)
├── logic/                           ← Regras de Negócio Puras (No-UI)
│   ├── CourseService.js             ← Regras de alto nível de curso
│   ├── CourseGrouper.js             ← Agrupamento por período/semestre
│   ├── TermParser.js                ← Parse de strings de período
│   ├── AutoScrollService.js         ← Lógica matemática de scroll
│   └── TaskCategorizer.js           ← Classificação de tipos de tarefa
├── models/                          ← Entidades de Domínio
│   ├── Course.js                    ← Schema: Curso
│   ├── Week.js                      ← Schema: Semana
│   └── ActivityProgress.js          ← Schema: Progresso (NEW!)
├── data/                            ← Persistência de Courses
│   ├── CourseRepository.js          ← Repositório (Regras de acesso)
│   └── CourseStorage.js             ← Driver de Storage (Chrome API)
├── import/                          ← Sub-feature: Importação
│   └── ... (Fluxo de Batch Import)
└── tests/                           ← Testes unitários (Mirroring structure)
```

---

## 🗺️ Fluxo de Navegação

```
[Home/CoursesView]
   ↓ Clicar em matéria
[CourseWeeksView]
   ↓ Opções:
   ├─→ [📋 Tarefas] → [CourseWeekTasksView]
   └─→ [🔍 Atividades] → [DetailsActivitiesWeekView]
```

---

## 📄 Detalhamento das Views

### 1. **CoursesView** (Home)

**Localização**: `views/CoursesView/index.js`

**Responsabilidade**:
- Listar todos os cursos/matérias do usuário
- Exibir cards clicáveis por matéria
- Botão de refresh (atualizar lista)

**Funcionalidades**:
- ✅ Carrega cursos do `CourseRepository`
- ✅ Renderiza cards com nome e ícone
- ✅ Navegação para `CourseWeeksView` ao clicar

**Callbacks**:
```javascript
{
  onOpenCourse: (url) => Tabs.openOrSwitchTo(url),
  onViewWeeks: (course) => navigateTo('CourseWeeksView')
}
```

**Estado**:
- Lista de cursos (array)
- Loading state

---

### 2. **CourseWeeksView** (Semanas)

**Localização**: `views/CourseWeeksView/index.js`

**Responsabilidade**:
- Exibir lista de semanas de uma matéria
- Permitir navegação para tarefas ou atividades
- Gerenciar scraping de conteúdo

**Funcionalidades**:
- ✅ Lista semanas disponíveis
- ✅ **3 botões por semana**:
  - `📋 Tarefas` → `CourseWeekTasksView`
  - `🔍 Atividades` → `DetailsActivitiesWeekView` (QuickLinks)
- ✅ Scraping automático ao clicar em Atividades
- ✅ Cache de `week.items` (não recarrega se já scraped)

**Callbacks**:
```javascript
{
  onBack: () => navigateTo('CoursesView'),
  onOpenCourse: (url) => Tabs.openOrSwitchTo(url),
  onViewTasks: (week) => navigateTo('CourseWeekTasksView'),
  onViewTasks: (week) => navigateTo('CourseWeekTasksView'),
  onViewActivities: async (week) => {
    // Delega orquestração para Service
    try {
      await WeekActivitiesService.getActivities(week, 'DOM');
      navigateTo('DetailsActivitiesWeekView');
    } catch (err) {
      Toaster.show('Erro ao carregar');
    }
  },
  onViewQuickLinks: async (week) => {
    try {
      await WeekActivitiesService.getActivities(week, 'QuickLinks');
      navigateTo('DetailsActivitiesWeekView');
    } catch (err) {
      Toaster.show('Erro ao carregar');
    }
  }
}
```

**Estado**:
- `course` (matéria atual)
- `course.weeks[]` (lista de semanas)

---

### 3. **CourseWeekTasksView** (Tarefas)

**Localização**: `views/CourseWeekTasksView/index.js`

**Responsabilidade**:
- Exibir tarefas da semana filtradas por status
- Progress bar de conclusão
- Marcar tarefas como concluídas (toggle)

**Funcionalidades**:
- ✅ Progress bar visual (% de conclusão)
- ✅ Lista de tarefas com checkbox
- ✅ Ícones por status: ✅ (feito) ⏳ (pendente)
- ✅ Click para marcar/desmarcar
- ✅ Salva estado no `CourseRepository`

**UI**:
```
┌─────────────────────────────────────┐
│ ← Voltar    Semana 1 - Tarefas      │
├─────────────────────────────────────┤
│ Progresso: 3/5 (60%)                │
│ [████████████░░░░░░] 60%            │
├─────────────────────────────────────┤
│ ✅ Videoaula 1 - Introdução         │
│ ✅ Quiz 1 - Semana 1                │
│ ⏳ Texto-base - Leitura              │
│ ✅ Videoaula 2 - Aprofundando       │
│ ⏳ Fórum - Discussão                 │
└─────────────────────────────────────┘
```

**Estado**:
- `week` (semana atual)
- `week.items[]` (tarefas)
- `task.completed` (boolean)

---

### 4. **DetailsActivitiesWeekView** (Índice de Atividades)

**Localização**: `views/DetailsActivitiesWeekView/index.js`

**Responsabilidade**:
- Exibir índice navegável de TODAS atividades da semana
- Scroll automático até atividade no AVA
- Refresh e limpeza de cache

**Funcionalidades**:
- ✅ **Breadcrumb**: `Matéria > Semana > Atividades`
- ✅ Lista ordenada (ordem DOM original)
- ✅ Ícones por tipo: 🎬 📝 📄 📹 📚
- ✅ **Botão [Ir →]**: Navega + scroll automático
- ✅ **Botão [↻]**: Re-scraping
- ✅ **Botão [🗑️ Limpar]**: Limpa cache
- ✅ Indicador de método: Links Rápidos vs DOM

**UI**:
```
┌─────────────────────────────────────────────┐
│ ← Voltar  │ Inglês - LET100        🗑️  ↻   │
│           │ Semana 1 - Atividades           │
│           │ Clique em uma atividade...      │
│           │ Método: Links Rápidos           │
├─────────────────────────────────────────────┤
│ #1  🎬  Videoaula 1 - Introdução      [Ir →]│
│ #2  📝  Quiz 1 - Semana 1             [Ir →]│
│ #3  📄  Texto-base - Leitura          [Ir →]│
│ #4  🎬  Videoaula 2 - Aprofundando    [Ir →]│
│ #5  📹  Video-base - Complementar     [Ir →]│
└─────────────────────────────────────────────┘
```

**Funcionalidades Avançadas**:

#### Scroll Automático (`scrollToActivity`)
```javascript
async scrollToActivity(activityId, fallbackUrl) {
  // 1. Busca aba do AVA
  const [tab] = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });
  
  // 2. Navega para week.url (se necessário)
  if (week.url && !tab.url.includes(week.url)) {
    await chrome.tabs.update(tab.id, { url: week.url });
    await waitForLoad(); // Aguarda até 5s
  }
  
  // 3. Scroll até elemento + highlight amarelo (2s)
  await chrome.scripting.executeScript({
    func: (id) => {
      const el = document.getElementById(id);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.backgroundColor = '#fff3cd';
      setTimeout(() => el.style.backgroundColor = '', 2000);
    },
    args: [activityId]
  });
}
```

**Estado**:
- `week` (semana atual)
- `week.items[]` (atividades)
- `week.courseName` (para breadcrumb)
- `week.method` ('QuickLinks' | 'DOM')

---

## 🔄 Services (Orquestração e Scraping)

### WeekActivitiesService (Facade)
**Arquivo**: `services/WeekActivitiesService.js`

**Responsabilidade**:
- Atuar como ponto único de entrada para obtenção de atividades.
- Gerenciar cache (`week.items`).
- Delegar a estratégia de scraping (`DOM` vs `QuickLinks`).
- Propagar erros para tratamento na View.

**Fluxo**:
`View -> WeekActivitiesService -> (Cache Check) -> Scraper -> View`

### QuickLinksScraper
**Arquivo**: `services/QuickLinksScraper.js`

**Funcionalidade**:
- Abre modal "Links Rápidos" automaticamente
- Aguarda população dinâmica (polling 2s)
- Extrai `elementId` (2º parâmetro do onclick)
- **Vantagem**: Rápido, sempre disponível
- **Desvantagem**: Só IDs, sem URLs

### WeekContentScraper
**Arquivo**: `services/WeekContentScraper.js`

**Funcionalidade**:
- Scraping direto do DOM da página
- Extrai nome, URL e ID
- **Vantagem**: Mais completo
- **Desvantagem**: Mais lento

---

## 🧠 Logic Layer (Regras de Negócio)

A camada `logic/` contém código Javascript puro, testável e desacoplado de UI ou Chrome APIs.

| Arquivo | Responsabilidade |
| :--- | :--- |
| **`CourseGrouper.js`** | Agrupa cursos crus em semestres/períodos baseados no nome. |
| **`TermParser.js`** | Extrai metadados (ano, semestre) de strings de título. |
| **`TaskCategorizer.js`** | Define se um item é Videoaula, PDF, Quiz, etc. baseados em ícone/URL. |
| **`AutoScrollService.js`** | Calcula posições de scroll para a lista de atividades (Math heavy). |

---

## � Activity Progress (Modelo Unificado) ✨ NOVO

### Visão Geral

Data de implementação: **2025-12-24**  
TECH_DEBT resolvido: `TECH_DEBT-unificar-estrutura-progresso`

Anteriormente, o progresso de atividades estava fragmentado:
- ❌ `Week.items[].completed` (boolean)
- ❌ `Week.items[].status` (enum 'TODO'|'DOING'|'DONE')

**Problema**: Ambiguidade e dados duplicados dentro do modelo de Course.

**Solução**: Modelo unificado com **Separation of Concerns**.

### ActivityProgress Model

**Arquivo**: `models/ActivityProgress.js`

```javascript
/**
 * @typedef {Object} ActivityProgressData
 * @property {string} activityId - ID composto: courseId_weekId_taskId
 * @property {'TODO'|'DOING'|'DONE'} status - Workflow state
 * @property {boolean} markedByUser - Toggle manual do usuário?
 * @property {boolean} completedInAVA - Scraped como concluído no AVA?
 * @property {number} lastUpdated - Timestamp
 */

class ActivityProgress {
  static fromScraped(activityId, status) { ... }
  static fromUserToggle(activityId, isCompleted) { ... }
  static isCompleted(progress) { ... }
  static generateId(courseId, weekId, taskId) { ... }
}
```

### ActivityProgressRepository

**Arquivo**: `repository/ActivityProgressRepository.js`

**Namespace isolado**: `chrome.storage.local.activityProgress`

**CRUD Methods**:
- `get(activityId)` - Busca individual
- `getMany(activityIds)` - Batch (eficiente)
- `save(progress)` - Salva
- `toggle(activityId)` - Alterna TODO ↔ DONE
- `delete(activityId)` - Deleta
- `clear()` - Limpa tudo

**Benefícios**:
- ✅ Progresso separado de Course data
- ✅ Facilita sync futuro com AVA
- ✅ Tracking de provenance (user vs scraped)
- ✅ Namespace isolado (não polui courses)

### TaskProgressService (Refatorado)

**Arquivo**: `services/TaskProgressService.js`

**BREAKING CHANGES**:

```javascript
// ANTES
TaskProgressService.toggleTask(course, weekName, taskId)
TaskProgressService.calculateProgress(week)

// DEPOIS
TaskProgressService.toggleTask(courseId, weekId, taskId)  // async
TaskProgressService.calculateProgress(week, courseId)     // async
TaskProgressService.isTaskCompleted(courseId, weekId, taskId)  // NEW
```

**Motivação da mudança**:
- Remove dependência de mutação de objetos Course
- API mais funcional e testável
- Usa IDs ao invés de objetos complexos

### Views Migradas

**CourseWeekTasksView**: ✅ Migrada
- Rendering agora é async
- Usa `ActivityProgressRepository` via Service
- Fallback para status scraped se não há toggle do usuário

**DetailsActivitiesWeekView**: ⏳ Pendente
- Ainda usa padrão antigo
- Próximo alvo de migração

---

## �📦 Persistence Layer (Data)

Separação clara entre *O Que* salvar (Repository) e *Como* salvar (Storage).

- **`CourseRepository.js`**: Implementa a lógica de CRUD da aplicação. Sabe lidar com cache, validação e serialização de objetos de domínio.
- **`CourseStorage.js`**: Conhece a `chrome.storage.local`. Lida com quotas, erros de I/O e promessas da API do navegador.

---

## 🏗️ Models (Entidades)

Definições de estrutura de dados (Schemas simulados via JSDoc).

```javascript
// models/Course.js
class Course {
  id: string;
  name: string;
  weeks: Week[];
  // ...
}

// models/Week.js
class Week {
  name: string;
  url: string;
  items: Activity[];
}
```

---

## 🎨 CSS

**Arquivos**:
- `assets/styles/views/courses.css` - CoursesView
- `assets/styles/views/week-tasks.css` - CourseWeekTasksView
- `assets/styles/views/details-activities.css` - DetailsActivitiesWeekView ✨ **NOVO**

**Design System**:
- Usa variáveis CSS: `--primary-color`, `--text-color`, `--bg-white`
- Responsivo (media queries)
- Hover states e transições
- Seguir `global.css` e `layout.css`

---

## ✅ Testes

**Cobertura**:
- `tests/CoursesView.test.js`
- `tests/CourseWeeksView.test.js`
- `tests/CourseWeekTasksView.test.js`
- `tests/DetailsActivitiesWeekView.test.js`
- `tests/QuickLinksScraper.test.js`
- `tests/WeekContentScraper.test.js`

**Total**: 335 testes passando ✅

---

## 🐛 Issues Conhecidas

Ver `.github/ISSUES/`:
- `BUG-navegacao-abas.md` - Reuso de abas entre matérias
- `BUG-botao-abrir-materia.md` - Botão falha com aba de semana

---

## 📝 Próximas Features

Ver `.github/NEXT/`:
- Checkbox de conclusão nas atividades
- Melhorias de UX/UI

---

**Última atualização**: 2025-12-25
