# Issue #7: Implementar Cálculo de Progresso

**Epic**: #EPIC-v2.8.0  
**Fase**: 3 - Avançado  
**Prioridade**: Média  
**Esforço**: 2h  
**Categoria**: 🏆 CORE  
**Depende de**: #3

---

## 📝 Descrição

Adicionar método `calculateProgress()` em WeekTasksView para calcular % de conclusão com base nos status.

---

## 🎯 Acceptance Criteria

- [ ] Método `calculateProgress()` implementado
- [ ] Fórmula: DONE = 100%, DOING = 50%, TODO = 0%
- [ ] Retorna `{ percent, done, total }`
- [ ] Barra de progresso atualiza visualmente
- [ ] Testes com diferentes cenários

---

## 🔧 Implementação (TDD)

### Step 1: Criar Testes (RED)
```javascript
// features/courses/views/WeekTasksView/WeekTasksView.test.js
describe('Progress Calculation', () => {
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
  
  it('should return 0% for empty items', () => {
    view.setWeek({ name: 'Semana 1', items: [] });
    const progress = view.calculateProgress();
    
    expect(progress.percent).toBe(0);
    expect(progress.total).toBe(0);
  });
  
  it('should return 100% when all DONE', () => {
    const week = {
      name: 'Semana 1',
      items: [
        { name: 'T1', status: 'DONE' },
        { name: 'T2', status: 'DONE' }
      ]
    };
    
    view.setWeek(week);
    const progress = view.calculateProgress();
    
    expect(progress.percent).toBe(100);
  });
});
```

### Step 2: Implementar (GREEN)
```javascript
// WeekTasksView/index.js
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

### Step 3: Integrar no Render
```javascript
render() {
  // ...
  const progress = this.calculateProgress();
  
  div.innerHTML = `
    ...
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress.percent}%"></div>
      </div>
      <p class="progress-text">
        Progresso: ${progress.percent}% (${progress.done}/${progress.total} concluídas)
      </p>
    </div>
    ...
  `;
}
```

---

## 📚 Referências

- SPEC: Seção 3.2.3
- .cursorrules: Linha 17 (logic/ pura, sem DOM)

---

## ✅ Definition of Done

- [ ] Método implementado e testado
- [ ] Cobertura 100% (todos os cenários)
- [ ] Barra visual funcionando
- [ ] `npm test` passando
- [ ] Commit: `feat(courses): adiciona cálculo de progresso em WeekTasksView`
