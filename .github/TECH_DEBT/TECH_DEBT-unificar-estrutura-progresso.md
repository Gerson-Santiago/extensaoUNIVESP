# TECH_DEBT: Unificar Estrutura de Dados de Progresso

**Status**: 📊 Análise de Dados Necessária  
**Prioridade**: Alta  
**Estimativa**: 4-6 horas  

---

## 🎯 Problema

A **estrutura de progresso de atividades** está **fragmentada** entre diferentes Views e modelos, usando propriedades inconsistentes:

- `task.completed` (CourseWeekTasksView)
- `week.status` ('TODO' | 'DOING' | 'DONE')
- `activity.done` (possível uso futuro)

**Consequências**:
- ❌ Dados não unificados
- ❌ Dificulta agregação (ex: "quantas atividades fiz essa semana?")
- ❌ Modelos inconsistentes entre Views

---

## 🔍 Estado Atual

### CourseWeekTasksView
```javascript
// Activity com 'completed'
{
  name: "Videoaula 1",
  id: "anonymous_element_9",
  type: "document",
  completed: false  // ← boolean
}
```

### Week Model (Issue-001)
```javascript
// Week.items[] com 'status'
{
  name: "Tarefa X",
  id: "...",
  status: 'TODO'  // ← enum string ('TODO' | 'DOING' | 'DONE')
}
```

### Futuro (DetailsActivitiesWeekView + Checkbox)
```javascript
// Vai usar qual propriedade? 🤔
{
  name: "Quiz 1",
  completed: true,   // ← CourseWeekTasksView
  status: 'DONE'     // ← Week Model
}
```

---

## 🤔 Análise

### Problema 1: **Semântica Diferente**

| Propriedade | Tipo | Significado | Usado em |
|-------------|------|-------------|----------|
| `completed` | boolean | Usuário marcou como feito | CourseWeekTasksView |
| `status` | enum | Estado do workflow (TODO/DOING/DONE) | Week Model |
| `done` | boolean? | Concluído no AVA? | QuickLinksScraper? |

**Confusão**: `completed` é toggle manual, `status` pode ser scraped do AVA.

---

### Problema 2: **Dados Desacoplados**

Views não compartilham estrutura:
```
CourseWeekTasksView → usa 'completed'
DetailsActivitiesWeekView → vai usar o quê? ❓
```

Se adicionar checkbox em DetailsActivities, precisa:
1. Usar `completed` (inconsistente com Week.status)
2. Converter `status` para boolean (lógica duplicada)

---

## ✅ Solução Proposta

### Modelo Unificado: **ActivityProgress**

**Novo arquivo**: `features/courses/models/ActivityProgress.js`

```javascript
/**
 * @typedef {Object} ActivityProgress
 * @property {string} activityId - ID da atividade
 * @property {'TODO' | 'DOING' | 'DONE'} status - Status workflow
 * @property {boolean} markedByUser - Usuário marcou manualmente?
 * @property {boolean} completedInAVA - Concluído no AVA (scraped)?
 * @property {number} lastUpdated - Timestamp
 */

export class ActivityProgress {
  static STATUS = {
    TODO: 'TODO',
    DOING: 'DOING',
    DONE: 'DONE'
  };
  
  /**
   * Cria progresso a partir de status scraped
   */
  static fromScraped(activityId, status) {
    return {
      activityId,
      status,
      markedByUser: false,
      completedInAVA: status === this.STATUS.DONE,
      lastUpdated: Date.now()
    };
  }
  
  /**
   * Cria progresso a partir de toggle manual
   */
  static fromUserToggle(activityId, isCompleted) {
    return {
      activityId,
      status: isCompleted ? this.STATUS.DONE : this.STATUS.TODO,
      markedByUser: true,
      completedInAVA: false,  // Não sabemos
      lastUpdated: Date.now()
    };
  }
  
  /**
   * Verifica se atividade está completa (qualquer fonte)
   */
  static isCompleted(progress) {
    return progress.status === this.STATUS.DONE;
  }
}
```

---

### Storage Separado

Salvar progresso em **namespace próprio**:

```javascript
// chrome.storage.local
{
  "activityProgress": {
    "LET100_semana1_anonymous_element_9": {
      activityId: "...",
      status: "DONE",
      markedByUser: true,
      completedInAVA: false,
      lastUpdated: 1703347200000
    }
  }
}
```

**Benefícios**:
- Separação de concerns (Course data vs Progress data)
- Fácil exportar/importar
- Não polui modelo de Course

---

### Views Usando Modelo Unificado

```javascript
// CourseWeekTasksView
const progress = await ActivityProgressRepository.get(task.id);
const isCompleted = ActivityProgress.isCompleted(progress);

// Renderizar
<input 
  type="checkbox" 
  checked="${isCompleted}" 
  data-id="${task.id}"
/>
```

---

## 📂 Arquivos Afetados

| Arquivo | Tipo de Mudança | LOC |
|---------|-----------------|-----|
| `features/courses/models/ActivityProgress.js` | **[CRIAR]** Novo modelo | +80 |
| `features/courses/repository/ActivityProgressRepository.js` | **[CRIAR]** CRUD de progresso | +100 |
| `features/courses/views/CourseWeekTasksView/index.js` | Usar novo modelo | -10, +15 |
| `features/courses/views/DetailsActivitiesWeekView/index.js` | Usar novo modelo | +20 |
| `features/courses/tests/ActivityProgress.test.js` | **[CRIAR]** Testes | +120 |

**Total**: ~325 LOC

---

## ✅ Critérios de Aceitação

- [ ] `ActivityProgress` modelo criado com `@typedef`
- [ ] Repository para progresso separado
- [ ] CourseWeekTasksView migrado para novo modelo
- [ ] DetailsActivitiesWeekView usa mesmo modelo
- [ ] Dados antigos migrados (se necessário)
- [ ] Testes passando (100% cobertura)
- [ ] Type-check sem warnings

---

## 🚀 Plano de Migração

1. ✅ **Criar modelo** `ActivityProgress`
2. ✅ **Criar Repository** para progresso
3. ✅ **Migrar CourseWeekTasksView** (mantém comportamento)
4. ✅ **Adicionar checkbox em DetailsActivities** (nova feature)
5. ✅ **Remover propriedades antigas** (`completed`, etc)
6. ✅ **Validar** com testes end-to-end

---

## 📝 Notas

- Migração pode ser incremental (adicionar novo modelo, depreciar antigo)
- Considerar sync com AVA no futuro (scraping de status real)
- Útil para analytics (ex: "quantas atividades completei essa semana?")

---

**Criado em**: 2025-12-23  
**Relacionado a**: [features/courses/README.md](file:///home/sant/extensaoUNIVESP/features/courses/README.md) - Linhas 166, 286
