# REFACTOR: Extrair Persistência de CourseWeekTasksView

**Status**: ✅ **Concluído** (Implementado ~2025-12)  
**Prioridade**: ~~Média~~ → N/A (Concluído)  
**Estimativa Original**: 2-3 horas  
**Nota**: TaskProgressService implementado e em uso em CourseWeekTasksView
  

---

## 🎯 Problema

A view `CourseWeekTasksView` **salva diretamente no Repository**, criando **acoplamento excessivo** entre camadas de UI e Dados.

**Violações**:
- ❌ View conhece detalhes de persistência
- ❌ Dificulta testar a View (mock do Repository necessário)
- ❌ Lógica de negócio (salvar progresso) misturada com UI

---

## 🔍 Código Atual

**Arquivo**: `features/courses/views/CourseWeekTasksView/index.js`

```javascript
// ❌ PROBLEMA: View salva diretamente
async toggleTask(taskId) {
  const task = this.findTask(taskId);
  task.completed = !task.completed;
  
  // View chama Repository diretamente!
  await CourseRepository.saveCourse(this.course);
  
  this.render(); // Re-render
}
```

**Problema**: A View tem **responsabilidade de persistência**, violando separação de camadas:
```
┌─────────────┐
│ View (UI)   │ ← Deveria APENAS renderizar
├─────────────┤
│ Logic       │ ← Regras de negócio aqui
├─────────────┤
│ Repository  │ ← Persistência aqui
└─────────────┘
```

**Atualmente**: View → Repository (pula camada de lógica!)

---

## ✅ Solução Proposta

### Criar **TaskProgressService**

**Novo arquivo**: `features/courses/services/TaskProgressService.js`

```javascript
export class TaskProgressService {
  /**
   * Toggle status de uma tarefa
   * @param {Course} course
   * @param {string} weekName
   * @param {string} taskId
   * @returns {Promise<void>}
   */
  static async toggleTask(course, weekName, taskId) {
    // 1. Encontrar tarefa
    const week = course.weeks.find(w => w.name === weekName);
    const task = week.items.find(t => t.id === taskId);
    
    // 2. Toggle
    task.completed = !task.completed;
    
    // 3. Persistir (via Repository)
    await CourseRepository.saveCourse(course);
    
    // 4. Retornar novo estado
    return task.completed;
  }
  
  /**
   * Calcular progresso de uma semana
   * @param {Week} week
   * @returns {Object} { completed, total, percentage }
   */
  static calculateProgress(week) {
    const total = week.items.length;
    const completed = week.items.filter(t => t.completed).length;
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  }
}
```

---

### View Refatorada

```javascript
// ✅ SOLUÇÃO: View delega para Service
async toggleTask(taskId) {
  // Apenas chama o Service
  await TaskProgressService.toggleTask(
    this.course, 
    this.week.name, 
    taskId
  );
  
  // Re-render (responsabilidade da View)
  this.render();
}
```

---

## 🎁 Benefícios

| Antes | Depois |
|-------|--------|
| View conhece Repository | View conhece apenas Service |
| Lógica de negócio na View | Lógica no Service (testável) |
| Difícil testar View isoladamente | View testável com mock do Service |
| Sem reuso de lógica | Service reutilizável |

---

## 📂 Arquivos Afetados

| Arquivo | Tipo de Mudança | LOC |
|---------|-----------------|-----|
| `features/courses/services/TaskProgressService.js` | **[CRIAR]** Novo serviço | +70 |
| `features/courses/views/CourseWeekTasksView/index.js` | Refatorar toggle | -8 |
| `features/courses/tests/TaskProgressService.test.js` | **[CRIAR]** Testes | +100 |

**Total**: ~162 LOC

---

## ✅ Critérios de Aceitação

- [ ] `TaskProgressService` criado
- [ ] View delega persistência para Service
- [ ] Cálculo de progresso movido para Service
- [ ] Testes do Service passando (100% cobertura)
- [ ] View testada com mock do Service
- [ ] Comportamento atual preservado (Green-Green)
- [ ] Lint e type-check passando

---

## 🔮 Melhorias Futuras

Após esta refatoração, considerar:

1. **Event-driven**: Service emite eventos de progresso
2. **Undo/Redo**: Implementar Command Pattern para toggle
3. **Sync**: Integrar com AVA real (scraping de status)

---

## 📝 Notas

- Refatoração não altera comportamento externo
- Seguir TDD: testes do Service primeiro
- Service pode ser usado por outras features no futuro (grades, etc)

---

**Criado em**: 2025-12-23  
**Relacionado a**: [features/courses/README.md](file:///home/sant/extensaoUNIVESP/features/courses/README.md) - Linha 145
