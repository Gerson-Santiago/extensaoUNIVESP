# 🚀 Feature Spec: Gestão de Tarefas v2.8.0

> **Status**: Planejamento  
> **Objetivo**: Adicionar gestão de tarefas acadêmicas com visualização de status por semana  
> **Filosofia**: MVP-First - Reutilizar código existente, fazer funcionar com TDD, desacoplar quando necessário  
> **Referência Arquitetural**: [Screaming Architecture](../TECNOLOGIAS_E_ARQUITETURA.md)

---

## 1. Visão Geral

### 1.1 Problema a Resolver
Estudantes da UNIVESP precisam acompanhar tarefas semanais de cada matéria, mas atualmente:
- ❌ Não há visão rápida do que foi feito
- ❌ Não há indicador de progresso por semana
- ❌ Precisa entrar no AVA toda vez para verificar

### 1.2 Solução Proposta (MVP)
Adicionar sistema de status de tarefas com 3 estados visuais:
- 🟢 **DONE** (Feito)
- 🔵 **DOING** (Fazendo)
- ⚪ **TODO** (A fazer)

### 1.3 Princípios de Implementação

> [!IMPORTANT]
> **MVP-First**: Começar modificando código existente, não criar features/ isoladas desde o início.

> [!NOTE]
> **Status das Tarefas**: A extensão LÊ o status do AVA ("Revisto" = 🟢 / "Marca Revista" = 🔵), não cria sistema próprio de marcação.

1. **Reutilizar** código existente (Week.js, WeekItem.js, CourseWeeksView)
2. **Fazer funcionar** com funcionalidade mínima
3. **TDD rigoroso** em cada passo
4. **Ler status do AVA** (não criar próprio)
5. **Desacoplar** apenas quando código ficar complexo demais

> [!NOTE]
> Features de gamificação e notas foram movidas para versões futuras. Ver [ROADMAP_FEATURES.md](../ROADMAP_FEATURES.md).

---

## 2. Código Existente para Reutilizar

### 2.1 Models (features/courses/models/)

#### Course.js (JÁ EXISTE)
```javascript
{
  id: number,
  name: string,           // "Cálculo I"
  url: string,
  termName: string,       // "Bimestre 1"
  weeks: Week[]
}
```

#### Week.js (JÁ EXISTE) ✨
```javascript
{
  name: string,           // "Semana 1"
  url: string,
  date: string,           // "01/09 a 07/09"
  items: [                // ← TAREFAS JÁ EXISTEM AQUI!
    {
      name: string,       // "Assistir videoaula 1.1"
      url: string,
      type: string        // "video", "pdf", "forum"
    }
  ]
}
```

**Modificação Necessária**: Adicionar propriedade `status` em cada item.

---

### 2.2 Views (features/courses/views/)

#### MyCoursesView/ (JÁ EXISTE)
- **O que faz**: Lista todas as matérias do aluno
- **TopNav**: 📚 Cursos
- **Não modificar**: Funciona perfeitamente

#### CourseWeeksView/ (JÁ EXISTE)
- **O que faz**: Lista semanas de UMA matéria
- **Navegação**: MyCoursesView → (clica em 👁️) → CourseWeeksView
- **Modificação mínima**: Chamar nova view ao clicar em [Tarefas]

---

### 2.3 Components (features/courses/components/)

#### WeekItem.js (JÁ EXISTE) ⚠️
**Código Atual**:
```javascript
// Renderiza: Semana 1  ›
export function createWeekElement(week, callbacks) {
  const div = document.createElement('div');
  div.className = 'week-item';
  
  const nameSpan = document.createElement('span');
  nameSpan.textContent = week.name;
  
  const arrow = document.createElement('span');
  arrow.innerHTML = '›';
  
  div.appendChild(nameSpan);
  div.appendChild(arrow);
  return div;
}
```

**Modificação Necessária**: Adicionar botão `[📋 Tarefas]`

---

### 2.4 Serviço de Scraping (features/courses/services/)

#### WeekContentScraper.js (NOVO - CRÍTICO)

**O que faz**: Extrai tarefas/conteúdos de uma semana do AVA

**Quando executa**: Lazy loading - ao clicar na semana (› ou [📋 Tarefas])

**Fonte dos dados**: **LÊ status do AVA** (não cria próprio)

**Estrutura do DOM do AVA**:
```html
<!-- Tarefa REVISADA (verde 🟢) -->
<li id="contentListItem:_ID_" class="clearfix liItem read">
  <h3>Videoaula 1 - Inglês sem mistério</h3>
  <a href="javascript:markUnreviewed('...')" class="button-5">
    <img src=".../reviewed_li.gif"> Revisto
  </a>
</li>

<!-- Tarefa NÃO REVISADA (azul 🔵) -->
<li id="contentListItem:_ID_" class="clearfix liItem read">
  <h3>Semana 1 - Quiz</h3>
  <a href="javascript:markReviewed('...')" class="button-5">
    <img src=".../needsreview_li.gif"> Marca Revista
  </a>
</li>
```

**Mapeamento de Status AVA → Extensão**:
- `Revisto` → 🟢 **DONE**
- `Marca Revista` → 🔵 **TODO**
- *(Não há "DOING" no AVA - usar dedução lógica ou definir no piloto)*

---

## 3. Plano de Implementação MVP-First

### Fase 1: MVP - Modificar Código Existente 🎯

#### 3.1.1 Estender Model Week.js
**Arquivo**: `features/courses/models/Week.js`

**Modificação**:
```javascript
/**
 * @typedef {Object} WeekItem
 * @property {string} name
 * @property {string} url
 * @property {string} type
 * @property {'TODO'|'DOING'|'DONE'} [status] - Status da tarefa (novo!)
 */

/**
 * @typedef {Object} Week
 * @property {string} name
 * @property {string} [url]
 * @property {string} [date]
 * @property {WeekItem[]} [items] - Tarefas da semana
 */
```

**Teste (TDD)**:
```javascript
// features/courses/models/Week.test.js
describe('Week Model', () => {
  it('should support status in items', () => {
    const week = {
      name: 'Semana 1',
      items: [
        { name: 'Tarefa 1', status: 'DONE' },
        { name: 'Tarefa 2', status: 'TODO' }
      ]
    };
    expect(week.items[0].status).toBe('DONE');
  });
});
```

---

#### 3.1.2 Modificar WeekItem.js (Adicionar Botão)
**Arquivo**: `features/courses/components/WeekItem.js`

**Modificação**:
```javascript
export function createWeekElement(week, callbacks) {
  const div = document.createElement('div');
  div.className = 'week-item';
  
  const nameSpan = document.createElement('span');
  nameSpan.textContent = week.name;
  
  // NOVO: Botão de Tarefas
  const tasksBtn = document.createElement('button');
  tasksBtn.className = 'btn-tasks';
  tasksBtn.textContent = '📋 Tarefas';
  tasksBtn.onclick = (e) => {
    e.stopPropagation(); // Não acionar onClick do div
    if (callbacks.onViewTasks) callbacks.onViewTasks(week);
  };
  
  const arrow = document.createElement('span');
  arrow.innerHTML = '›';
  
  div.appendChild(nameSpan);
  div.appendChild(tasksBtn); // ← NOVO
  div.appendChild(arrow);
  
  return div;
}
```

**Resultado Visual**:
```
┌──────────────────────────────┐
│ Semana 1  [📋 Tarefas]    ›  │
│ Semana 2  [📋 Tarefas]    ›  │
└──────────────────────────────┘
```

**Teste (TDD)**:
```javascript
// features/courses/components/WeekItem.test.js
describe('WeekItem with Tasks Button', () => {
  it('should render tasks button', () => {
    const week = { name: 'Semana 1', items: [] };
    const callbacks = { onViewTasks: jest.fn() };
    
    const element = createWeekElement(week, callbacks);
    const btn = element.querySelector('.btn-tasks');
    
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Tarefas');
  });
  
  it('should call onViewTasks when button clicked', () => {
    const week = { name: 'Semana 1', items: [] };
    const callbacks = { onViewTasks: jest.fn() };
    
    const element = createWeekElement(week, callbacks);
    const btn = element.querySelector('.btn-tasks');
    btn.click();
    
    expect(callbacks.onViewTasks).toHaveBeenCalledWith(week);
  });
});
```

---

#### 3.1.3 Criar CourseWeekTasksView (Nova View Simples)
**Arquivo**: `features/courses/views/CourseWeekTasksView/index.js` (NOVO)

**Implementação Mínima**:
```javascript
export class CourseWeekTasksView {
  constructor(callbacks) {
    this.callbacks = callbacks; // { onBack }
    this.week = null;
  }

  setWeek(week) {
    this.week = week;
  }

  render() {
    if (!this.week) return document.createElement('div');

    const div = document.createElement('div');
    div.className = 'view-week-tasks';
    div.innerHTML = `
      <div class="details-header">
        <button id="backBtn" class="btn-back">← Voltar</button>
        <h2>${this.week.name} - Tarefas</h2>
      </div>
      <div id="tasksList" class="tasks-container"></div>
    `;
    return div;
  }

  afterRender() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.onclick = () => this.callbacks.onBack();
    }
    
    this.renderTasks();
  }

  renderTasks() {
    const container = document.getElementById('tasksList');
    if (!container) return;

    container.innerHTML = '';
    
    if (!this.week.items || this.week.items.length === 0) {
      container.innerHTML = '<p style="color:#999;">Nenhuma tarefa encontrada.</p>';
      return;
    }

    this.week.items.forEach(item => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task-item';
      
      const statusIcon = this.getStatusIcon(item.status || 'TODO');
      
      taskDiv.innerHTML = `
        <span class="task-status">${statusIcon}</span>
        <span class="task-name">${item.name}</span>
      `;
      
      container.appendChild(taskDiv);
    });
  }

  getStatusIcon(status) {
    const icons = {
      'DONE': '🟢',
      'DOING': '🔵',
      'TODO': '⚪'
    };
    return icons[status] || '⚪';
  }
}
```

**Teste (TDD)**:
```javascript
// features/courses/views/CourseWeekTasksView/CourseWeekTasksView.test.js
describe('CourseWeekTasksView', () => {
  let view;
  
  beforeEach(() => {
    view = new CourseWeekTasksView({ onBack: jest.fn() });
    document.body.innerHTML = '';
  });

  it('should render week name', () => {
    view.setWeek({ name: 'Semana 1', items: [] });
    const element = view.render();
    
    expect(element.textContent).toContain('Semana 1');
  });

  it('should render tasks with status icons', () => {
    const week = {
      name: 'Semana 1',
      items: [
        { name: 'Tarefa 1', status: 'DONE' },
        { name: 'Tarefa 2', status: 'TODO' }
      ]
    };
    
    view.setWeek(week);
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();
    
    const tasks = document.querySelectorAll('.task-item');
    expect(tasks.length).toBe(2);
    expect(tasks[0].textContent).toContain('🟢');
    expect(tasks[1].textContent).toContain('⚪');
  });
});
```

---

#### 3.1.4 Integrar com CourseWeeksView
**Arquivo**: `features/courses/views/CourseWeeksView/index.js` (MODIFICAR)

**Modificação no método `renderWeeksList`**:
```javascript
renderWeeksList(weeksList) {
  if (!weeksList) return;
  weeksList.innerHTML = '';
  
  if (this.course.weeks && this.course.weeks.length > 0) {
    this.course.weeks.forEach((week) => {
      const wDiv = createWeekElement(week, {
        onClick: (url) => this.callbacks.onOpenCourse(url),
        onViewTasks: (w) => this.callbacks.onViewTasks(w) // ← NOVO
      });
      weeksList.appendChild(wDiv);
    });
  }
}
```

**Checklist Fase 1**:
- [ ] Week.js com status (typedef + teste)
- [ ] WeekItem.js com botão [Tarefas] (código + teste)
- [ ] WeekContentScraper (scraping do AVA - código + teste)
- [ ] CourseWeekTasksView básica (código + teste)
- [ ] Mini preview em CourseWeeksView (código + teste)
- [ ] Integração CourseWeeksView (código + teste)
- [ ] `npm run verify` - All Checks Passing (Test + Lint + Types)

---

### Fase 2: Funcionalidades - Interatividade e Persistência 🔄

#### 3.2.1 Adicionar Click Handler para Mudar Status
**Arquivo**: `features/courses/views/CourseWeekTasksView/index.js` (MODIFICAR)

**Adicionar no `renderTasks()`**:
```javascript
taskDiv.onclick = () => {
  const currentStatus = item.status || 'TODO';
  item.status = this.getNextStatus(currentStatus);
  this.renderTasks(); // Re-render
  this.saveWeekStatus(); // Persistir
};
```

**Adicionar método**:
```javascript
getNextStatus(current) {
  const cycle = { 'TODO': 'DOING', 'DOING': 'DONE', 'DONE': 'TODO' };
  return cycle[current] || 'TODO';
}
```

**Teste (TDD)**:
```javascript
it('should cycle status on click: TODO → DOING → DONE → TODO', () => {
  const week = {
    name: 'Semana 1',
    items: [{ name: 'Tarefa 1', status: 'TODO' }]
  };
  
  view.setWeek(week);
  const element = view.render();
  document.body.appendChild(element);
  view.afterRender();
  
  const taskItem = document.querySelector('.task-item');
  
  // Inicial: TODO (⚪)
  expect(taskItem.textContent).toContain('⚪');
  
  // Click 1: DOING (🔵)
  taskItem.click();
  expect(week.items[0].status).toBe('DOING');
  
  // Click 2: DONE (🟢)
  taskItem.click();
  expect(week.items[0].status).toBe('DONE');
  
  // Click 3: TODO (⚪)
  taskItem.click();
  expect(week.items[0].status).toBe('TODO');
});
```

---

#### 3.2.2 Persistir Status no chrome.storage
**Arquivo**: `features/courses/views/CourseWeekTasksView/index.js` (MODIFICAR)

**Adicionar método**:
```javascript
async saveWeekStatus() {
  // Salvar apenas status das tarefas (não todo o course)
  const storageKey = `week_status_${this.week.url}`;
  const statusMap = {};
  
  this.week.items.forEach((item, index) => {
    statusMap[index] = item.status || 'TODO';
  });
  
  await chrome.storage.local.set({ [storageKey]: statusMap });
}

async loadWeekStatus() {
  const storageKey = `week_status_${this.week.url}`;
  const result = await chrome.storage.local.get(storageKey);
  const statusMap = result[storageKey] || {};
  
  // Aplicar status salvo aos items
  this.week.items.forEach((item, index) => {
    item.status = statusMap[index] || 'TODO';
  });
}
```

**Chamar no `afterRender()`**:
```javascript
afterRender() {
  // ... código existente ...
  
  this.loadWeekStatus().then(() => {
    this.renderTasks();
  });
}
```

**Teste (TDD)**:
```javascript
// Mock chrome.storage
global.chrome = {
  storage: {
    local: {
      get: jest.fn((key) => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve())
    }
  }
};

it('should save status to chrome.storage', async () => {
  const week = {
    name: 'Semana 1',
    url: 'http://test.com/week1',
    items: [{ name: 'Tarefa 1', status: 'DONE' }]
  };
  
  view.setWeek(week);
  await view.saveWeekStatus();
  
  expect(chrome.storage.local.set).toHaveBeenCalledWith({
    'week_status_http://test.com/week1': { 0: 'DONE' }
  });
});
```

---

#### 3.2.3 Calcular e Exibir Progresso
**Arquivo**: `features/courses/views/CourseWeekTasksView/index.js` (MODIFICAR)

**Adicionar método**:
```javascript
calculateProgress() {
  if (!this.week.items || this.week.items.length === 0) {
    return { percent: 0, done: 0, total: 0 };
  }
  
  const total = this.week.items.length;
  const done = this.week.items.filter(i => i.status === 'DONE').length;
  const doing = this.week.items.filter(i => i.status === 'DOING').length;
  
  // DONE = 100%, DOING = 50%
  const percent = Math.round(((done + doing * 0.5) / total) * 100);
  
  return { percent, done, total };
}
```

**Modificar `render()` para incluir barra de progresso**:
```javascript
render() {
  // ... código existente ...
  
  const progress = this.calculateProgress();
  
  div.innerHTML = `
    <div class="details-header">
      <button id="backBtn" class="btn-back">← Voltar</button>
      <h2>${this.week.name} - Tarefas</h2>
    </div>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress.percent}%"></div>
      </div>
      <p class="progress-text">
        Progresso: ${progress.percent}% (${progress.done}/${progress.total} concluídas)
      </p>
    </div>
    
    <div id="tasksList" class="tasks-container"></div>
  `;
  return div;
}
```

**Teste (TDD)**:
```javascript
it('should calculate progress correctly', () => {
  const week = {
    name: 'Semana 1',
    items: [
      { name: 'T1', status: 'DONE' },  // 100%
      { name: 'T2', status: 'DOING' }, // 50%
      { name: 'T3', status: 'TODO' }   // 0%
    ]
  };
  
  view.setWeek(week);
  const progress = view.calculateProgress();
  
  expect(progress.percent).toBe(50); // (1 + 0.5) / 3 = 50%
  expect(progress.done).toBe(1);
  expect(progress.total).toBe(3);
});
```

**Checklist Fase 2**:
- [ ] Click handler para mudar status (código + teste)
- [ ] Persistência chrome.storage (código + teste)
- [ ] Cálculo de progresso (código + teste)
- [ ] Barra de progresso visual (código + teste)
- [ ] `npm run verify` - All Checks Passing (Test + Lint + Types)
- [ ] `/verificar` - Lint + Type-check

---

### Fase 3: Refatoração - Organizar Código (Opcional/Futuro) 🔧

> [!NOTE]
> Esta fase só deve ser executada SE o código da Fase 2 ficar complexo demais ou difícil de manter.

#### Quando Refatorar?
- ✅ `CourseWeekTasksView` passar de 300 linhas
- ✅ Lógica de status ficar duplicada em múltiplos lugares
- ✅ Adicionar nova feature que precise da mesma lógica

#### Como Refatorar (com TDD)? ✨

> [!IMPORTANT]
> Refatoração permanece DENTRO de `features/courses/` - tarefas são parte natural de cursos!

**3.3.1 Extrair Lógica para WeekProgress**
```javascript
// features/courses/logic/WeekProgress.js (NOVO)
export class WeekProgress {
  static getNextStatus(current) {
    const cycle = { 'TODO': 'DOING', 'DOING': 'DONE', 'DONE': 'TODO' };
    return cycle[current] || 'TODO';
  }
  
  static getStatusIcon(status) {
    const icons = { 'DONE': '🟢', 'DOING': '🔵', 'TODO': '⚪' };
    return icons[status] || '⚪';
  }
  
  static calculateProgress(items) {
    if (!items || items.length === 0) {
      return { percent: 0, done: 0, total: 0 };
    }
    
    const total = items.length;
    const done = items.filter(i => i.status === 'DONE').length;
    const doing = items.filter(i => i.status === 'DOING').length;
    const percent = Math.round(((done + doing * 0.5) / total) * 100);
    
    return { percent, done, total };
  }
}

// Teste antes de refatorar
// Teste depois de refatorar
// Garantir que nada quebrou
```

**3.3.2 Extrair Storage para WeekStorage**
```javascript
// features/courses/data/WeekStorage.js (NOVO)
export class WeekStorage {
  static async saveTaskStatus(weekUrl, statusMap) {
    const key = `week_status_${weekUrl}`;
    await chrome.storage.local.set({ [key]: statusMap });
  }
  
  static async loadTaskStatus(weekUrl) {
    const key = `week_status_${weekUrl}`;
    const result = await chrome.storage.local.get(key);
    return result[key] || {};
  }
}
```

**3.3.3 Organizar Estrutura Final em courses/**
```
features/courses/
├── views/
│   ├── MyCoursesView/
│   ├── CourseWeeksView/
│   └── CourseWeekTasksView/          (já existe)
├── components/
│   ├── CourseItem.js
│   └── WeekItem.js         (já modificado)
├── logic/
│   ├── CourseGrouper.js    (já existe)
│   ├── AutoScrollService.js (já existe)
│   └── WeekProgress.js     (novo - extraído)
├── data/
│   ├── CourseRepository.js (já existe)
│   └── WeekStorage.js      (novo - extraído)
└── models/
    ├── Course.js
    └── Week.js             (já modificado com status)
```

**Checklist Fase 3** (só se necessário):
- [ ] Extrair lógica para WeekProgress (TDD)
- [ ] Extrair storage para WeekStorage (TDD)
- [ ] Organizar imports em CourseWeekTasksView
- [ ] Todos os testes ainda passando
- [ ] Zero regressões

---

## 4. Estilos CSS

### 4.1 Botão de Tarefas (WeekItem)
**Arquivo**: `assets/styles/components/week-item.css` (MODIFICAR)

```css
.btn-tasks {
  padding: 4px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 0 8px;
}

.btn-tasks:hover {
  background: #45a049;
}
```

### 4.2 Lista de Tarefas
**Arquivo**: `assets/styles/views/week-tasks.css` (NOVO)

```css
.task-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
}

.task-item:hover {
  background: #f5f5f5;
}

.task-status {
  font-size: 20px;
  margin-right: 12px;
}

.task-name {
  flex: 1;
  font-size: 14px;
}

.progress-container {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 15px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
  text-align: center;
}
```

---

## 5. Fluxo de Navegação Completo

```
📚 TopNav: Cursos
    ↓
MyCoursesView (Lista de Matérias)
    ↓ clica em 👁️ de "Cálculo I"
CourseWeeksView (Lista de Semanas)
    ↓ clica em [📋 Tarefas] de "Semana 1"
CourseWeekTasksView (Lista de Tarefas da Semana 1)
    ↓ clica em tarefa
    Status muda: ⚪ → 🔵 → 🟢 → ⚪
```

---

## 6. Checklist Pré-Commit (Cada Fase)

### Validação Técnica
- [ ] `npm run type-check` - Zero Errors
- [ ] `npm run lint` - Zero Warnings  
- [ ] `npm run verify` - All Checks Passing (Test + Lint + Types)
- [ ] `npm run format:check` - All Formatted

### Cobertura de Testes
- [ ] **Models**: 100% (typedef)
- [ ] **Components**: ≥90% (WeekItem)
- [ ] **Views**: ≥90% (CourseWeekTasksView)
- [ ] **Lógica**: 100% (status cycle, progress calc)

### Funcionalidade
- [ ] Botão [Tarefas] aparece em cada semana
- [ ] CourseWeekTasksView abre corretamente
- [ ] Status muda ao clicar: ⚪ → 🔵 → 🟢
- [ ] Status persiste após fechar e reabrir
- [ ] Progresso calcula corretamente
- [ ] Botão ← Voltar funciona

---

## 7. Decisões Arquiteturais

### 7.1 Por que manter tudo em features/courses/?

**Razão**: Coesão de domínio 🎯
- Tarefas SÃO parte de semanas
- Semanas SÃO parte de cursos
- Não há indicação de que tarefas existirão fora desse contexto
- YAGNI (You Aren't Gonna Need It) - não criar abstração antes da hora

**Estrutura Natural**:
```
Curso → Semanas → Tarefas
```

**Quando criar features/tasks/ separada?**
- ❌ NUNCA fazer agora (over-engineering)
- ✅ APENAS se tarefas aparecerem fora de cursos no futuro
- ✅ APENAS se múltiplas features precisarem compartilhar lógica de tarefas

Enquanto isso, `features/courses/` é o lar natural! 🏠

### 7.2 Por que NÃO criar estrutura complexa desde o início?

**Problema**: Over-engineering prematuro
- Código fica em 3+ arquivos antes de funcionar
- Dificulta TDD (precisa mockar tudo)
- Adiciona complexidade desnecessária

**Solução MVP-First**:
- Tudo em `CourseWeekTasksView` inicialmente
- Funciona em ~200 linhas
- Fácil de testar
- Refatora DEPOIS se crescer (Fase 3)

### 7.3 Por que Week.items em vez de Task.js separado?

**Razão**: Reutilizar estrutura existente
- Week.items já tem 90% da estrutura necessária
- Só falta adicionar propriedade `status`
- Criar model separado é trabalho extra sem benefício

**Quando criar Task.js?**
- Se tarefas precisarem existir fora de semanas
- Se houver lógica complexa de validação de tarefa
- Se múltiplas features precisarem compartilhar Task

### 7.4 Por que storage por week.url em vez de global?

**Razão**: Simplicidade e isolamento
- Cada semana tem seu próprio storage
- Fácil limpar dados de uma semana
- Não precisa sincronizar com Course

**Desvantagem**: Se mudar URL, perde status
- Mitigação: Usar hash da URL ou ID único (Fase 3)

---

## 8. Workflows de Desenvolvimento

### 8.1 Iniciar Nova Feature (Fase 1)
```bash
/nova-feature
# Cria testes primeiro
# Implementa para passar os testes
```

### 8.2 Validar Antes de Commit
```bash
/verificar
# Roda lint + type-check + tests
```

### 8.3 Corrigir Bugs
```bash
/bug-fix
# TDD: escreve teste que reproduz o bug
# Corrige até teste passar
```

---

## 9. Próximos Passos

### Após v2.8.0 Funcionar
1. Coletar feedback de uso real
2. Medir complexidade do código
3. Decidir se refatoração (Fase 3) é necessária

### Features Futuras (Roadmap)
- Gamificação (XP por tarefa concluída)
- Gestão de notas
- Sincronização com AVA (scraping automático)

Ver [ROADMAP_FEATURES.md](../ROADMAP_FEATURES.md) para detalhes.

---

**Filosofia Final**: Faça funcionar, faça certo, faça rápido - nessa ordem, com TDD sempre! 🚀
