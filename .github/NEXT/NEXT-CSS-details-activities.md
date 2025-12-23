# NEXT: Padronizar CSS da DetailsActivitiesWeekView

**Status**: 📋 Planejado  
**Prioridade**: Alta  
**Estimativa**: 1-2 horas  

---

## 🎯 Objetivo

Refatorar `DetailsActivitiesWeekView` para seguir os **padrões CSS do projeto**, removendo estilos inline e implementando melhorias de UX/UI.

---

## 🔍 Problemas Identificados

### 1. **Estilos Inline** (Anti-padrão)
```javascript
// ❌ PROBLEMA ATUAL (linhas 49, 52, 54, 55)
<div style="flex: 1;">
<p style="font-size: 11px; color: #666; margin-top: 4px;">
<div style="margin-left: auto; display: flex; gap: 8px;">
<button style="background: #dc3545; color: white;">
```

### 2. **Falta Contexto** (UX Problem)
- Header mostra apenas "Semana 1 - Atividades"
- Usuário não sabe de qual **MATÉRIA** são as atividades
- Falta breadcrumb: `Matéria > Semana > Atividades`

### 3. **Cores Hardcoded**
- `#666`, `#dc3545` em vez de variáveis CSS
- Não usa Design System (`--text-secondary`, `--danger-color`)

### 4. **Sem Estrutura de Classes**
- Divs sem classes semânticas
- Dificulta estilização e manutenção

---

## ✅ Solução Proposta

### 1. **Criar Arquivo CSS Separado**

**Arquivo**: `assets/styles/views/details-activities.css`

```css
/* ============================================
   DetailsActivitiesWeekView - Índice de Atividades
   ============================================ */

/* View Container */
.view-details-activities {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Header */
.details-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-white);
}

.details-header-info {
  flex: 1;
}

.details-header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

/* Breadcrumb */
.details-breadcrumb {
  font-size: 11px;
  color: var(--text-light);
  margin-bottom: 4px;
}

/* Títulos */
.details-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 4px 0;
}

.details-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.method-indicator {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 4px;
}

/* Botões */
.btn-clear {
  background: var(--danger-color);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.btn-clear:hover {
  background: #c9302c;
}

.btn-refresh {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.btn-refresh:hover {
  background: var(--primary-hover);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Lista de Atividades */
.activities-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.activities-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Item de Atividade */
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  margin-bottom: 8px;
  background: var(--bg-white);
  transition: all 0.2s;
}

.activity-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.activity-position {
  font-size: 11px;
  color: var(--text-light);
  font-weight: 600;
  min-width: 25px;
}

.activity-icon {
  font-size: 18px;
}

.activity-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.4;
}

.btn-scroll {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-scroll:hover {
  background: var(--primary-hover);
  transform: translateX(2px);
}

/* Estado Vazio */
.activities-container p {
  text-align: center;
  color: var(--text-light);
  font-size: 14px;
  padding: 40px 20px;
}

/* Responsividade */
@media (max-width: 600px) {
  .activity-item {
    padding: 10px;
    gap: 8px;
  }

  .activity-name {
    font-size: 13px;
  }

  .btn-scroll {
    padding: 5px 10px;
    font-size: 11px;
  }
}
```

---

### 2. **Refatorar HTML** (index.js)

**Antes** (estilos inline):
```javascript
const div = document.createElement('div');
div.innerHTML = `
  <div class="details-header">
    <button id="backBtn">← Voltar</button>
    <div style="flex: 1;">  <!-- ❌ inline -->
      <h2>${this.week.name} - Atividades</h2>
      <p style="font-size: 11px;">...</p>  <!-- ❌ inline -->
    </div>
    <div style="margin-left: auto;">  <!-- ❌ inline -->
      <button style="background: #dc3545;">...</button>  <!-- ❌ inline -->
    </div>
  </div>
`;
```

**Depois** (classes CSS):
```javascript
const div = document.createElement('div');
div.className = 'view-details-activities';
div.innerHTML = `
  <div class="details-header">
    <button id="backBtn" class="btn-back">← Voltar</button>
    <div class="details-header-info">
      <div class="details-breadcrumb">${this.week.courseName || 'Matéria'}</div>
      <h2 class="details-title">${this.week.name} - Atividades</h2>
      <p class="details-subtitle">Clique em uma atividade para rolar até ela no AVA</p>
      <p class="method-indicator">Método: ${methodLabel}</p>
    </div>
    <div class="details-header-actions">
      <button id="clearBtn" class="btn-clear" title="Limpar cache e voltar">🗑️ Limpar</button>
      <button id="refreshBtn" class="btn-refresh" title="Atualizar lista">↻</button>
    </div>
  </div>
  <div id="activitiesContainer" class="activities-container"></div>
`;
```

---

### 3. **Adicionar Course Name ao Week Object**

**Arquivo**: `CourseWeeksView/index.js`

```javascript
// Nos callbacks onViewActivities e onViewQuickLinks:
onViewActivities: async (w) => {
  // ... scraping logic
  
  // ✅ ADICIONAR:
  w.courseName = this.course.name;  // ← Passa nome da matéria
  
  if (callbacks.onViewActivities) callbacks.onViewActivities(w);
}
```

---

### 4. **Importar CSS no Sidepanel**

**Arquivo**: `sidepanel/sidepanel.html`

```html
<head>
  <!-- ... outros CSS -->
  <link rel="stylesheet" href="../assets/styles/views/details-activities.css">
</head>
```

---

## 📂 Arquivos a Modificar

| Arquivo | Mudanças | LOC |
|---------|----------|-----|
| `assets/styles/views/details-activities.css` | **[CRIAR]** Novo arquivo CSS | +180 |
| `features/courses/views/DetailsActivitiesWeekView/index.js` | Remover inline styles, adicionar classes | -10 |
| `features/courses/views/CourseWeeksView/index.js` | Adicionar `w.courseName` | +2 |
| `sidepanel/sidepanel.html` | Importar novo CSS | +1 |

**Total**: 4 arquivos | ~173 LOC

---

## 🎨 Melhorias de UX/UI

### Antes vs Depois:

**Header Antes**:
```
← Voltar    Semana 1 - Atividades    🗑️ Limpar  ↻
```

**Header Depois**:
```
← Voltar    Inglês - LET100          🗑️ Limpar  ↻
            Semana 1 - Atividades
            Clique em uma atividade...
            Método: Links Rápidos
```

### Melhorias:
- ✅ Breadcrumb mostra matéria
- ✅ Hierarquia visual clara
- ✅ Botões consistentes com projeto
- ✅ Hover states em todos interativos
- ✅ Responsivo (media queries)

---

## ✅ Critérios de Aceitação

- [ ] CSS em arquivo separado (`details-activities.css`)
- [ ] Zero estilos inline no JavaScript
- [ ] Usa variáveis CSS do Design System
- [ ] Header mostra nome da matéria
- [ ] Breadcrumb implementado
- [ ] Botões seguem padrão do projeto
- [ ] Responsivo (testado em diferentes larguras)
- [ ] Acessibilidade (contraste WCAG AA)

---

## 🚀 Ordem de Implementação

1. ✅ **Criar CSS file** (`details-activities.css`)
2. ✅ **Adicionar courseName** ao week object
3. ✅ **Refatorar HTML** (remover inline, adicionar classes)
4. ✅ **Importar CSS** no sidepanel.html
5. ✅ **Testar** visualmente
6. ✅ **Commit** com mensagem descritiva

---

## 📝 Notas

- Seguir padrões de `week-tasks.css` e `global.css`
- Usar variáveis CSS do Design System
- Testar em diferentes larguras de sidepanel
- Validar contraste de cores (WCAG AA)
- Manter consistent com o resto da aplicação

---

**Criado em**: 2025-12-23  
**Baseado em**: Análise do código atual e design system do projeto
