# Issue #4: Adicionar Botão [Tarefas] em WeekItem

**Epic**: #EPIC-v2.8.0  
**Fase**: 2 - UI & Preview  
**Prioridade**: Alta  
**Esforço**: 2h  
**Categoria**: 🏆 CORE  
**Depende de**: #1, #3

---

## 📝 Descrição

Modificar componente `WeekItem.js` para incluir botão `[📋 Tarefas]` ao lado do nome da semana.

---

## 🎯 Acceptance Criteria

- [x] Botão `[📋 Tarefas]` aparece em cada `WeekItem`
- [x] Botão aciona callback `onViewTasks(week)`
- [x] Click no botão NÃO aciona click do div (stopPropagation)
- [x] Layout visual correto: `Semana 1  [📋 Tarefas]  ›`
- [x] Testes atualizados

---

## 🔧 Implementação (TDD)

### Step 1: Atualizar Testes (RED)
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
  
  it('should stop propagation on button click', () => {
    const week = { name: 'Semana 1', url: 'http://test.com' };
    const callbacks = { 
      onClick: jest.fn(),
      onViewTasks: jest.fn() 
    };
    
    const element = createWeekElement(week, callbacks);
    const btn = element.querySelector('.btn-tasks');
    btn.click();
    
    // onClick do div NÃO deve ser chamado
    expect(callbacks.onClick).not.toHaveBeenCalled();
    expect(callbacks.onViewTasks).toHaveBeenCalledWith(week);
  });
});
```

### Step 2: Modificar WeekItem.js (GREEN)
Ver SPEC seção 3.1.2 para código completo.

**Mudanças principais**:
```javascript
// Adicionar botão entre nameSpan e arrow
const tasksBtn = document.createElement('button');
tasksBtn.className = 'btn-tasks';
tasksBtn.textContent = '📋 Tarefas';
tasksBtn.onclick = (e) => {
  e.stopPropagation(); // CRÍTICO!
  if (callbacks.onViewTasks) callbacks.onViewTasks(week);
};

div.appendChild(nameSpan);
div.appendChild(tasksBtn); // ← NOVO
div.appendChild(arrow);
```

### Step 3: Validar
```bash
npm test -- WeekItem.test.js
npm run lint
```

---

## 🎨 CSS Necessário

```css
/* assets/styles/components/week-item.css */
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

---

## 📚 Referências

- SPEC: Seção 3.1.2
- .cursorrules: Linha 32-36 (Testes)

---

## ✅ Definition of Done

- [x] Código implementado
- [x] Testes com stopPropagation
- [ ] CSS adicionado
- [x] `npm test` passando
- [x] Commit: `feat(courses): adiciona botão Tarefas em WeekItem`
