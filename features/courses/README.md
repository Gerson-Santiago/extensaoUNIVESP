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
├── views/                           ← Views (UI)
│   ├── CoursesView/                 ← Home: lista de matérias
│   ├── CourseWeeksView/             ← Semanas de uma matéria
│   ├── CourseWeekTasksView/         ← Tarefas filtradas
│   └── DetailsActivitiesWeekView/   ← Índice de atividades
├── components/                      ← Componentes reutilizáveis
│   └── WeekItem.js                  ← Card de semana
├── services/                        ← Lógica de negócio
│   ├── QuickLinksScraper.js         ← Scraping via Links Rápidos
│   ├── WeekContentScraper.js        ← Scraping via DOM
│   └── CourseRefresher.js           ← Atualização de cursos
├── logic/                           ← Regras de negócio
│   └── TaskCategorizer.js           ← Classifica atividades
├── repository/                      ← Persistência
│   └── CourseRepository.js          ← CRUD de cursos
└── tests/                           ← Testes unitários
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
  onViewActivities: (week) => {
    // Scrape se necessário
    if (!week.items) {
      week.items = await WeekContentScraper.scrape(week.url);
    }
    navigateTo('DetailsActivitiesWeekView');
  },
  onViewQuickLinks: (week) => {
    week.items = await QuickLinksScraper.scrape(week.url);
    week.method = 'QuickLinks';
    navigateTo('DetailsActivitiesWeekView');
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

## 🔄 Scrapers

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

## 📊 Diagrama de Dados

```
Course {
  id: string
  name: string
  url: string
  weeks: Week[]
}

Week {
  name: string
  url: string
  items: Activity[]
  method?: 'QuickLinks' | 'DOM'
  courseName?: string  // Para breadcrumb
}

Activity {
  name: string
  url?: string
  id: string           // DOM element ID
  type: 'document'
  completed?: boolean  // Para CourseWeekTasksView
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

**Total**: 304 testes passando ✅

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

**Última atualização**: 2025-12-23
