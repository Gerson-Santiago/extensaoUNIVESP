# Issue #9: Testes de Integração

**Epic**: #EPIC-v2.8.0  
**Fase**: 3 - Avançado  
**Prioridade**: Alta  
**Esforço**: 3h  
**Categoria**: 🏆 CORE  
**Depende de**: #1, #2, #3, #4, #5

---

## 📝 Descrição

Criar testes de integração que validam o fluxo completo: navegação → scraping → renderização → interação.

---

## 🎯 Acceptance Criteria

- [ ] Teste end-to-end do fluxo completo
- [ ] Mock de chrome.scripting.executeScript
- [ ] Mock de chrome.storage.local
- [ ] Validação de navegação entre views
- [ ] Cobertura ≥90% em features/courses/

---

## 🔧 Implementação (TDD)

### Teste 1: Fluxo Completo de Navegação
```javascript
// features/courses/integration/navigation.test.js
describe('Integration: Navigation Flow', () => {
  it('should navigate from CoursesView to WeekTasksView', async () => {
    // Setup
    const course = {
      id: 1,
      name: 'Cálculo I',
      weeks: [
        { name: 'Semana 1', url: 'http://test.com/week1', items: [] }
      ]
    };
    
    // Mock scraping
    jest.spyOn(WeekContentScraper, 'scrapeWeekContent')
      .mockResolvedValue([
        { name: 'Tarefa 1', status: 'DONE' }
      ]);
    
    // 1. CoursesView renderiza
    const coursesView = new CoursesView({
      onViewDetails: (c) => {
        // 2. Abre CourseDetailsView
        const detailsView = new CourseDetailsView({
          onViewTasks: async (week) => {
            // 3. Abre WeekTasksView
            const tasksView = new WeekTasksView({ onBack: jest.fn() });
            tasksView.setWeek(week);
            await tasksView.loadWeekTasks();
            
            // 4. Valida renderização
            const element = tasksView.render();
            document.body.appendChild(element);
            tasksView.afterRender();
            
            const tasks = document.querySelectorAll('.task-item');
            expect(tasks.length).toBe(1);
            expect(tasks[0].textContent).toContain('Tarefa 1');
            expect(tasks[0].textContent).toContain('🟢');
          }
        });
        
        detailsView.setCourse(c);
        detailsView.render();
      }
    });
    
    // Simula click em "Ver semana"
    coursesView.callbacks.onViewDetails(course);
  });
});
```

### Teste 2: Scraping + Storage Integration
```javascript
// features/courses/integration/scraping-storage.test.js
describe('Integration: Scraping + Storage', () => {
  beforeEach(() => {
    // Mock chrome.storage
    global.chrome.storage.local.get = jest.fn(() => Promise.resolve({}));
    global.chrome.storage.local.set = jest.fn(() => Promise.resolve());
  });
  
  it('should scrape, save and load status', async () => {
    // Mock scraping
    jest.spyOn(WeekContentScraper, 'scrapeWeekContent')
      .mockResolvedValue([
        { name: 'T1', status: 'DONE' },
        { name: 'T2', status: 'TODO' }
      ]);
    
    const week = { name: 'Semana 1', url: 'http://test.com/week1' };
    const view = new WeekTasksView({ onBack: jest.fn() });
    view.setWeek(week);
    
    // 1. Carrega tarefas (scraping)
    await view.loadWeekTasks();
    
    // 2. Salva status
    await view.saveWeekStatus();
    
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      'week_status_http://test.com/week1': {
        0: 'DONE',
        1: 'TODO'
      }
    });
    
    // 3. Recarrega (simula reabrir extensão)
    await view.loadWeekStatus();
    
    expect(view.week.items[0].status).toBe('DONE');
    expect(view.week.items[1].status).toBe('TODO');
  });
});
```

### Teste 3: Mini Preview Integration
```javascript
// features/courses/integration/mini-preview.test.js
describe('Integration: Mini Preview', () => {
  it('should show preview when week opened', async () => {
    const course = {
      name: 'Cálculo I',
      weeks: [{ name: 'Semana 1', url: 'http://test.com/week1', items: [] }]
    };
    
    jest.spyOn(WeekContentScraper, 'scrapeWeekContent')
      .mockResolvedValue([
        { name: 'T1', status: 'DONE' },
        { name: 'T2', status: 'DONE' },
        { name: 'T3', status: 'TODO' }
      ]);
    
    const view = new WeeksCourseView({ onBack: jest.fn() });
    view.setCourse(course);
    const element = view.render();
    document.body.appendChild(element);
    view.afterRender();
    
    // Simula click em › (arrow)
    await view.showPreview(course.weeks[0]);
    
    // Valida preview
    const preview = document.getElementById('activeWeekPreview');
    expect(preview.style.display).toBe('block');
    expect(preview.textContent).toContain('67%'); // 2/3
  });
});
```

---

## 📚 Cobertura Esperada

```bash
npm test -- --coverage features/courses/
```

**Target**:
- `logic/` → 100%
- `services/` → ≥90%
- `views/` → ≥90%
- **Total** → ≥90%

---

## 📚 Referências

- .cursorrules: Linha 32-36 (Testes Jest)
- FLUXOS_DE_TRABALHO.md: Seção 3 (Codificação)

---

## ✅ Definition of Done

- [ ] 3+ testes de integração criados
- [ ] Cobertura ≥90% em features/courses/
- [ ] Mocks de chrome.* funcionando
- [ ] `npm test` passando
- [ ] Commit: `test(courses): adiciona testes de integração v2.8.0`
