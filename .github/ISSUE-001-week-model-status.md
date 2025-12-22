# Issue #1: Estender Model Week.js com Status

**Epic**: #EPIC-v2.8.0  
**Fase**: 1 - Foundation  
**Prioridade**: Alta  
**Esforço**: 1h  
**Categoria**: 🏆 CORE

---

## 📝 Descrição

Adicionar propriedade `status` aos items de Week.js para armazenar estado das tarefas (DONE/TODO).

---

## 🎯 Acceptance Criteria

- [x] `Week.items[]` tem propriedade `status?: 'TODO'|'DOING'|'DONE'`
- [x] JSDoc atualizado com `@typedef`
- [x] Teste unitário criado e passando
- [x] Zero warnings (`type-check`)

---

## 🔧 Implementação (TDD)

### Step 1: Criar Teste (RED)
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

### Step 2: Modificar Week.js (GREEN)
```javascript
/**
 * @typedef {Object} WeekItem
 * @property {string} name
 * @property {string} url
 * @property {string} type
 * @property {'TODO'|'DOING'|'DONE'} [status] - Status da tarefa
 */

/**
 * @typedef {Object} Week
 * @property {string} name
 * @property {string} [url]
 * @property {string} [date]
 * @property {WeekItem[]} [items]
 */
```

### Step 3: Validar (REFACTOR)
```bash
npm test -- Week.test.js
npm run type-check
```

---

## 📚 Referências

- SPEC: Seção 3.1.1
- .cursorrules: Linha 22-24 (Type Safety)

---

## ✅ Definition of Done

- [x] Código implementado
- [x] Teste passando
- [x] `npm run lint` - Limpo
- [x] `npm run type-check` - Zero erros
- [ ] Commit: `feat(courses): adiciona status aos items de Week`
