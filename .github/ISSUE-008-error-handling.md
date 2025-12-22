# Issue #8: Implementar Error Handling com Toaster

**Epic**: #EPIC-v2.8.0  
**Fase**: 3 - Avançado  
**Prioridade**: Alta  
**Esforço**: 2h  
**Categoria**: 🏆 CORE  
**Depende de**: #2, #3, #5

---

## 📝 Descrição

Adicionar tratamento de erros (try/catch) com feedback visual via Toaster em todas as operações assíncronas.

---

## 🎯 Acceptance Criteria

- [ ] Try/catch em `scrapeWeekContent()`
- [ ] Try/catch em `showPreview()`
- [ ] Try/catch em `loadWeekTasks()`
- [ ] Toaster mostra mensagem amigável ao usuário
- [ ] console.error para debug
- [ ] Testes mockando erros

---

## 🔧 Implementação (TDD)

### Step 1: Criar Testes (RED)
```javascript
// CourseWeekTasksView.test.js
describe('Error Handling', () => {
  it('should show error toast when scraping fails', async () => {
    jest.spyOn(WeekContentScraper, 'scrapeWeekContent')
      .mockRejectedValue(new Error('Network error'));
    
    const toasterSpy = jest.spyOn(toaster, 'show');
    
    view.setWeek({ name: 'Semana 1', url: 'http://test.com' });
    await view.loadWeekTasks();
    
    expect(toasterSpy).toHaveBeenCalledWith(
      expect.stringContaining('Erro ao carregar'),
      'error'
    );
  });
  
  it('should show empty state on error', async () => {
    jest.spyOn(WeekContentScraper, 'scrapeWeekContent')
      .mockRejectedValue(new Error('DOM changed'));
    
    view.setWeek({ name: 'Semana 1', url: 'http://test.com' });
    const element = view.render();
    document.body.appendChild(element);
    await view.loadWeekTasks();
    
    expect(document.body.textContent).toContain('Não foi possível');
  });
});
```

### Step 2: Implementar (GREEN)

**CourseWeekTasksView**:
```javascript
async loadWeekTasks(week) {
  try {
    const items = await WeekContentScraper.scrapeWeekContent(week.url);
    this.week.items = items;
    this.renderTasks();
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    toaster.show('Erro ao carregar tarefas. Tente novamente.', 'error');
    this.showEmptyState();
  }
}

showEmptyState() {
  const container = document.getElementById('tasksList');
  container.innerHTML = `
    <div style="text-align:center; padding:20px; color:#999;">
      <p>Não foi possível carregar as tarefas.</p>
      <button onclick="location.reload()">Tentar novamente</button>
    </div>
  `;
}
```

**CourseWeeksView (Mini Preview)**:
```javascript
async showPreview(week) {
  try {
    if (!week.items || week.items.length === 0) {
      week.items = await WeekContentScraper.scrapeWeekContent(week.url);
    }
    // ... renderização ...
  } catch (error) {
    console.error('Erro ao mostrar preview:', error);
    toaster.show('Erro ao carregar preview', 'error');
  }
}
```

**WeekContentScraper**:
```javascript
static async scrapeWeekContent(weekUrl) {
  try {
    // ... código de scraping ...
  } catch (error) {
    console.error('WeekContentScraper erro:', error);
    throw error; // Re-throw para view tratar
  }
}
```

---

## 📚 Tipos de Erro Cobertos

| Erro | Onde | Tratamento |
|------|------|------------|
| Scraping falha | WeekContentScraper | console.error + throw |
| DOM mudou | CourseWeekTasksView | Toaster + empty state |
| chrome.storage cheio | (futuro) | Toaster |
| URL inválida | WeekContentScraper | console.error + throw |

---

## 📚 Referências

- SPEC-GAPS: Seção 3 (Error Handling)
- Toaster: `shared/ui/feedback/Toaster.js`
- .cursorrules: Linha 29 (console.error permitido)

---

## ✅ Definition of Done

- [ ] Try/catch em todos métodos async
- [ ] Testes mockando erros
- [ ] Toaster integrado
- [ ] Empty state funcional
- [ ] `npm test` passando
- [ ] Commit: `feat(courses): adiciona error handling com Toaster`
