# NEXT: Checkbox de Conclusão nas Atividades

**Status**: 📋 Planejado  
**Prioridade**: Alta  
**Estimativa**: 3-4 horas  

---

## 🎯 Objetivo

Adicionar **checkbox de conclusão** nas atividades para o usuário marcar o que já fez, com **persistência de estado**.

---

## 💡 Motivação

**Problema atual**:
- Usuário não consegue marcar atividades como "feitas"
- Difícil acompanhar progresso visualmente
- Sem memória do que já foi completado

**Benefícios**:
- ✅ Rastreamento de progresso
- ✅ Organização pessoal
- ✅ Motivação visual (ver itens completados)
- ✅ Não perder controle do que falta

---

## 🎨 Mockup da UI

### Antes (Atual):
```
┌─────────────────────────────────────────────┐
│ #1  🎬  Videoaula 1 - Introdução      [Ir →]│
│ #2  📝  Quiz 1 - Semana 1             [Ir →]│
│ #3  📄  Texto-base - Leitura          [Ir →]│
└─────────────────────────────────────────────┘
```

### Depois (COM checkbox):
```
┌──────────────────────────────────────────────────┐
│ [ ] #1  🎬  Videoaula 1 - Introdução      [Ir →]│
│ [✓] #2  📝  Quiz 1 - Semana 1             [Ir →]│
│ [ ] #3  📄  Texto-base - Leitura          [Ir →]│
└──────────────────────────────────────────────────┘
```

### Com Progress Bar:
```
┌──────────────────────────────────────────────────┐
│ ← Voltar  │ Inglês - LET100        🗑️  ↻        │
│           │ Semana 1 - Atividades                │
│           │ Progresso: 1/3 (33%)                 │
│           │ [████░░░░░░░░] 33%                  │
├──────────────────────────────────────────────────┤
│ [ ] #1  🎬  Videoaula 1 - Introdução      [Ir →]│
│ [✓] #2  📝  Quiz 1 - Semana 1             [Ir →]│ ← Marcado!
│ [ ] #3  📄  Texto-base - Leitura          [Ir →]│
└──────────────────────────────────────────────────┘
```

---

## 🔧 Opções de Implementação

### **Opção 1: Cache Local** (simples, rápido)

**Persistência**: `chrome.storage.local`

**Estrutura**:
```javascript
{
  "completedActivities": {
    "LET100_semana1_anonymous_element_9": true,
    "LET100_semana1_anonymous_element_11": true,
    "MAT100_semana2_anonymous_element_5": false
  }
}
```

**Vantagens**:
- ✅ Rápido de implementar
- ✅ Funciona offline
- ✅ Dados privados (não vai para servidor)

**Desvantagens**:
- ❌ Não sincroniza entre dispositivos
- ❌ Se limpar cache, perde dados
- ❌ Não integra com AVA real

---

### **Opção 2: Scraping do AVA** (mais difícil, ideal)

**Lógica**: Consultar estado REAL do AVA (se atividade já foi completada)

**Vantagens**:
- ✅ Sincronizado com AVA
- ✅ Dados reais (não depende do usuário marcar)
- ✅ Funciona em qualquer dispositivo

**Desvantagens**:
- ❌ Mais complexo (scraping de status)
- ❌ Depende de estrutura do AVA
- ❌ Pode ser lento

**Scraping**:
```javascript
// Exemplo: extrair status de conclusão do AVA
const activityElement = document.getElementById(activityId);
const isCompleted = activityElement.querySelector('.completedIcon') !== null;
```

---

### **Opção 3: Híbrido** (recomendado)

**Lógica**:
1. **Tentar scraping** do AVA (se disponível)
2. **Fallback para cache local** (se scraping falhar ou offline)
3. **Permitir override manual** (usuário pode marcar/desmarcar)

**Fluxo**:
```javascript
async function getActivityStatus(activityId) {
  // 1. Tentar buscar do AVA
  const avaStatus = await scrapeActivityStatus(activityId);
  if (avaStatus !== null) return avaStatus;
  
  // 2. Fallback para cache local
  const localStatus = await chrome.storage.local.get(`completed_${activityId}`);
  return localStatus || false;
}

async function toggleActivity(activityId) {
  // Salvar no cache local (sempre)
  await chrome.storage.local.set({ [`completed_${activityId}`]: !current });
  
  // Re-renderizar UI
  renderActivities();
}
```

---

## 📂 Arquivos a Modificar

| Arquivo | Mudanças | LOC |
|---------|----------|-----|
| `views/DetailsActivitiesWeekView/index.js` | Adicionar checkbox + lógica toggle | +40 |
| `views/DetailsActivitiesWeekView/index.js` | Progress bar | +30 |
| `assets/styles/views/details-activities.css` | Estilos checkbox + progress | +50 |
| `services/ActivityStatusManager.js` | **[CRIAR]** Gerenciar estado | +80 |
| `tests/ActivityStatusManager.test.js` | **[CRIAR]** Testes | +50 |

**Total**: ~250 LOC

---

## 🎨 CSS

```css
/* Checkbox */
.activity-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--success-color);
}

/* Item completado */
.activity-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}

.activity-item.completed .activity-name {
  color: var(--text-light);
}

/* Progress Bar */
.activities-progress {
  padding: 15px;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--success-color), #8bc34a);
  transition: width 0.3s ease;
}
```

---

## 🔨 Implementação Sugerida

### 1. **Criar Service**

**Arquivo**: `services/ActivityStatusManager.js`

```javascript
export class ActivityStatusManager {
  /**
   * Verifica se atividade está completa
   * @param {string} activityId 
   * @returns {Promise<boolean>}
   */
  static async isCompleted(activityId) {
    // Buscar do storage local
    const key = `completed_${activityId}`;
    const result = await chrome.storage.local.get(key);
    return result[key] || false;
  }
  
  /**
   * Toggle status da atividade
   * @param {string} activityId 
   */
  static async toggle(activityId) {
    const current = await this.isCompleted(activityId);
    const key = `completed_${activityId}`;
    await chrome.storage.local.set({ [key]: !current });
    return !current;
  }
  
  /**
   * Calcular progresso (% completado)
   * @param {Array} activities 
   */
  static async getProgress(activities) {
    const statuses = await Promise.all(
      activities.map(a => this.isCompleted(a.id))
    );
    const completed = statuses.filter(s => s).length;
    return {
      completed,
      total: activities.length,
      percentage: Math.round((completed / activities.length) * 100)
    };
  }
}
```

---

### 2. **Atualizar View**

**Arquivo**: `views/DetailsActivitiesWeekView/index.js`

```javascript
// Renderizar com progress bar
async renderActivities() {
  // ... código existente
  
  // Adicionar progress bar
  const progress = await ActivityStatusManager.getProgress(this.week.items);
  const progressHTML = `
    <div class="activities-progress">
      <div class="progress-info">
        <span>Progresso: ${progress.completed}/${progress.total}</span>
        <span>${progress.percentage}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${progress.percentage}%"></div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('afterbegin', progressHTML);
  
  // Renderizar items com checkbox
  this.week.items.forEach(async (item, index) => {
    const li = await this.createActivityItem(item, index + 1);
    list.appendChild(li);
  });
}

// Criar item COM checkbox
async createActivityItem(task, position) {
  const li = document.createElement('li');
  const isCompleted = await ActivityStatusManager.isCompleted(task.id);
  
  li.className = `activity-item ${isCompleted ? 'completed' : ''}`;
  li.innerHTML = `
    <input 
      type="checkbox" 
      class="activity-checkbox" 
      ${isCompleted ? 'checked' : ''} 
      data-id="${task.id}"
    />
    <span class="activity-position">#${position}</span>
    <span class="activity-icon">${icon}</span>
    <span class="activity-name">${task.original.name}</span>
    <button class="btn-scroll">Ir →</button>
  `;
  
  // Event: toggle checkbox
  const checkbox = li.querySelector('.activity-checkbox');
  checkbox.onclick = async (e) => {
    e.stopPropagation();
    await ActivityStatusManager.toggle(task.id);
    this.renderActivities(); // Re-render para atualizar progress
  };
  
  return li;
}
```

---

## ✅ Critérios de Aceitação

- [ ] Checkbox aparece em cada atividade
- [ ] Click no checkbox marca/desmarca
- [ ] Estado persiste (não perde ao fechar extensão)
- [ ] Progress bar mostra % correto
- [ ] Items completados ficam esmaecidos (opacity + line-through)
- [ ] Não impacta performance (< 100ms para marcar)
- [ ] Testes unitários passando

---

## 🚀 Roadmap de Implementação

1. ✅ **Criar Service** (`ActivityStatusManager.js`)
2. ✅ **Adicionar CSS** (checkbox + progress bar)
3. ✅ **Atualizar View** (renderizar checkbox + events)
4. ✅ **Testar** manualmente
5. ✅ **Escrever testes** unitários
6. ✅ **Validar** (type-check, lint)
7. ✅ **Commit** e push

---

## 🔮 Melhorias Futuras

- **Sincronizar com AVA** (scraping real de status)
- **Export de progresso** (CSV, JSON)
- **Gráficos de progresso** por matéria
- **Notificações** ao completar semana

---

**Criado em**: 2025-12-23  
**Baseado em**: Feedback do usuário
