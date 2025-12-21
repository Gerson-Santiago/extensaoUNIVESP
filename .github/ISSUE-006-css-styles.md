# Issue #6: Adicionar Estilos CSS

**Epic**: #EPIC-v2.8.0  
**Fase**: 2 - UI & Preview  
**Prioridade**: Média  
**Esforço**: 1h  
**Categoria**: 🏆 CORE  
**Depende de**: #3, #4, #5

---

## 📝 Descrição

Criar arquivos CSS para estilizar WeekTasksView e componentes de tarefa.

---

## 🎯 Acceptance Criteria

- [ ] `assets/styles/views/week-tasks.css` criado
- [ ] `.task-item`, `.progress-bar`, `.progress-fill` estilizados
- [ ] `.week-preview` adicionado em `courses.css`
- [ ] `.btn-tasks` adicionado em `components/week-item.css`
- [ ] Responsivo e acessível

---

## 🔧 Implementação

### Arquivo 1: week-tasks.css (NOVO)
**Path**: `assets/styles/views/week-tasks.css`

```css
/* Task Item */
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

/* Progress Bar */
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

/* Tasks Container */
.tasks-container {
  max-height: 400px;
  overflow-y: auto;
}
```

### Arquivo 2: courses.css (MODIFICAR)
**Path**: `assets/styles/views/courses.css`

Adicionar ao final:
```css
/* Mini Preview */
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

### Arquivo 3: week-item.css (NOVO ou MODIFICAR)
**Path**: `assets/styles/components/week-item.css`

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
  transition: background 0.2s;
}

.btn-tasks:hover {
  background: #45a049;
}
```

---

## 📚 Referências

- SPEC: Seção 4 (Estilos CSS)
- .cursorrules: Linha 28 (Formatação)

---

## ✅ Definition of Done

- [ ] 3 arquivos CSS criados/modificados
- [ ] Estilos responsivos
- [ ] Cores acessíveis (contraste WCAG)
- [ ] Commit: `style(courses): adiciona estilos para WeekTasksView`
