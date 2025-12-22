# Issue #3: Criar CourseWeekTasksView Básica

**Epic**: #EPIC-v2.8.0  
**Fase**: 1 - Foundation  
**Prioridade**: Alta  
**Esforço**: 3h  
**Categoria**: 🏆 CORE

---

## 📝 Descrição

Criar view para mostrar lista de tarefas de uma semana com ícones de status (🟢🔵⚪).

---

## 🎯 Acceptance Criteria

- [x] Classe `CourseWeekTasksView` criada em `features/courses/views/CourseWeekTasksView/`
- [x] Renderiza lista de tarefas com status visual
- [x] Botão "← Voltar" funcional
- [x] Tratamento para lista vazia
- [x] Testes de renderização

---

## 🔧 Implementação (TDD)

### Step 1: Criar Testes (RED)
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
    expect(tasks[1].textContent).toContain('🔵');
  });
  
  it('should show empty state when no items', () => {
    view.setWeek({ name: 'Semana 1', items: [] });
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();
    
    expect(document.body.textContent).toContain('Nenhuma tarefa');
  });
});
```

### Step 2: Implementar (GREEN)
**Arquivo**: `features/courses/views/CourseWeekTasksView/index.js`

Ver SPEC seção 3.1.3 para código completo.

**Principais métodos**:
- `setWeek(week)` - Define semana a exibir
- `render()` - Cria estrutura HTML
- `afterRender()` - Setup de eventos
- `renderTasks()` - Renderiza itens
- `getStatusIcon(status)` - Mapeia status → emoji

### Step 3: Validar
```bash
npm test -- CourseWeekTasksView.test.js
npm run lint
```

---

## 📚 Referências

- SPEC: Seção 3.1.3
- View similar: `CourseDetailsView` (padrão de callbacks)
- .cursorrules: Linha 16 (features/ui/)

---

## 🎨 CSS Necessário

Criar `assets/styles/views/week-tasks.css` (Issue #6)

Por enquanto, usar estilos inline básicos.

---

## ✅ Definition of Done

- [x] Código implementado
- [x] Testes com cobertura ≥90%
- [x] Botão Voltar executando callback
- [x] Empty state funcional
- [x] `npm test` passando
- [x] Commit: `feat(courses): adiciona CourseWeekTasksView básica`
