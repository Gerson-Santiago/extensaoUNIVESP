# Issue #5: Implementar Mini Preview em CourseWeeksView

**Epic**: #EPIC-v2.8.0  
**Fase**: 2 - UI & Preview  
**Prioridade**: Média  
**Esforço**: 3h  
**Categoria**: 🏆 CORE  
**Depende de**: #2, #4

---

## 📝 Descrição

Adicionar div expandida abaixo da lista de semanas mostrando preview visual (✅✅🔵⚪) da semana ativa no navegador.

---

## 🎯 Acceptance Criteria

- [ ] Div `#activeWeekPreview` criada em CourseWeeksView
- [ ] Preview aparece ao clicar em › (abre semana)
- [ ] Mostra ícones de status e % de progresso
- [ ] Usa `WeekContentScraper` para buscar dados
- [ ] Error handling com Toaster

---

## 🔧 Implementação (TDD)

### Step 1: Criar Testes (RED)
```javascript
// features/courses/views/CourseWeeksView/CourseWeeksView.test.js (novo)
describe('CourseWeeksView - Mini Preview', () => {
  let view;
  
  beforeEach(() => {
    view = new CourseWeeksView({ onBack: jest.fn() });
    // Mock WeekContentScraper
    jest.spyOn(WeekContentScraper, 'scrapeWeekContent')
      .mockResolvedValue([
        { name: 'T1', status: 'DONE' },
        { name: 'T2', status: 'DONE' },
        { name: 'T3', status: 'TODO' }
      ]);
  });

  it('should show preview when week clicked', async () => {
    const week = { name: 'Semana 1', url: 'http://test.com', items: [] };
    
    await view.showPreview(week);
    
    const preview = document.getElementById('activeWeekPreview');
    expect(preview.style.display).toBe('block');
    expect(preview.textContent).toContain('Semana 1');
  });
  
  it('should render status icons correctly', async () => {
    const week = { name: 'Semana 1', url: 'http://test.com', items: [] };
    
    await view.showPreview(week);
    
    const statusDiv = document.getElementById('previewStatus');
    expect(statusDiv.textContent).toBe('✅✅🔵');
  });
  
  it('should calculate progress correctly', async () => {
    const week = { name: 'Semana 1', url: 'http://test.com', items: [] };
    
    await view.showPreview(week);
    
    const progress = document.getElementById('previewProgress');
    expect(progress.textContent).toContain('67%'); // 2/3 = 67%
  });
});
```

### Step 2: Implementar (GREEN)
**Arquivo**: `features/courses/views/CourseWeeksView/index.js` (MODIFICAR)

Ver SPEC-GAPS-RESOLVED seção 2.3 para código completo.

**Principais adições**:
- Div `#activeWeekPreview` no HTML
- Método `showPreview(week)` com scraping
- Renderização de ícones e progresso
- Try/catch com Toaster

### Step 3: Validar
```bash
npm test -- CourseWeeksView.test.js
npm run lint
```

---

## 🎨 CSS Necessário

```css
/* assets/styles/views/courses.css (adicionar) */
.week-preview {
  margin-top: 15px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  border-top: 2px solid #ddd;
}

.week-preview h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.status-icons {
  font-size: 20px;
  letter-spacing: 2px;
  margin: 8px 0;
}
```

---

## 📚 Referências

- SPEC-GAPS: Seção 2 (Mini Preview)
- Toaster: `shared/ui/feedback/Toaster.js`

---

## ✅ Definition of Done

- [ ] Código implementado
- [ ] Testes mockando WeekContentScraper
- [ ] CSS adicionado
- [ ] Error handling com Toaster
- [ ] `npm test` passando
- [ ] Commit: `feat(courses): adiciona mini preview em CourseWeeksView`
