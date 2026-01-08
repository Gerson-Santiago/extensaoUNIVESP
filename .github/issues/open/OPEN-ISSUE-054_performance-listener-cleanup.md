# 🔌 ISSUE-054: Audit e Cleanup de Event Listeners

---
**Type:** ⚡ Performance  
**Priority:** 🟡 Medium  
**Status:** 📋 Open  
**Component:** Sidepanel/Background  
**Effort:** 1-2 days  
**Labels:** `performance` `memory-leak` `cleanup`
---


**Status:** 📋 Aberta  
**Prioridade:** 🟡 Média  
**Componente:** `sidepanel/sidepanel.js` | `background/index.js`  
**Versão:** v2.10.0+  
**Impacto:** Memory leak potencial + overhead de processamento

---

## 🎯 Problema

Event listeners nunca são removidos, causando possível memory leak em MV3 onde sidepanel pode ser destruído/recriado.

### Listeners Identificados

#### 1. Chrome Tabs Listener (sidepanel.js:223-237)

```javascript
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // ❌ Nunca removido, pode duplicar se sidepanel recarregar
  const tab = await chrome.tabs.get(activeInfo.tabId);
  // ...
});
```

#### 2. Window Custom Events (sidepanel.js:201-220)

```javascript
window.addEventListener('request:add-manual-course', () => {...});
window.addEventListener('request:scrape-current-tab', () => {...});
window.addEventListener('request:clear-all-courses', async () => {...});
// ❌ Nunca removidos
```

#### 3. Background Tab Listener (background/index.js:37-55)

```javascript
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  // Executa em CADA atualização de aba
  const clickBehavior = await chrome.storage.sync.get(['clickBehavior']);
  // ...
});
```

---

## 💡 Solução Proposta

### Estratégia 1: AbortController para Window Listeners

```javascript
// No topo do sidepanel.js
const listenerController = new AbortController();

window.addEventListener('request:add-manual-course', 
  () => {...}, 
  { signal: listenerController.signal } // ✅ Auto-cleanup
);

// Cleanup ao unload
window.addEventListener('beforeunload', () => {
  listenerController.abort(); // Remove todos os listeners
});
```

### Estratégia 2: Named Functions para Chrome Listeners

```javascript
// Guardar referência para poder remover
const tabActivatedHandler = async (activeInfo) => {
  // ...
};

chrome.tabs.onActivated.addListener(tabActivatedHandler);

// Cleanup
window.addEventListener('beforeunload', () => {
  chrome.tabs.onActivated.removeListener(tabActivatedHandler);
});
```

### Estratégia 3: Debounce no Background Listener

```javascript
// background/index.js
import { debounce } from '../shared/utils/debounce.js';

const handleTabUpdate = debounce(async (tabId, info, tab) => {
  // Executa apenas após 200ms de inatividade
  // ✅ Reduz overhead em navegação rápida
}, 200);

chrome.tabs.onUpdated.addListener(handleTabUpdate);
```

---

## ✅ Critérios de Aceite

- [ ] Todos os window listeners usam AbortController
- [ ] Chrome listeners são removidos no beforeunload
- [ ] Memory profiling mostra que listeners não duplicam
- [ ] Background tab listener tem debounce de 200ms
- [ ] Testes garantem cleanup correto após unload do sidepanel

---

## 🧪 Plano de Testes

### Teste de Memory Leak

```javascript
test('não deve duplicar listeners após reload', async () => {
  // 1. Carregar sidepanel
  const initialListeners = getActiveListeners();
  
  // 2. Recarregar sidepanel 10x
  for (let i = 0; i < 10; i++) {
    await reloadSidepanel();
  }
  
  // 3. Verificar que listeners não duplicaram
  const finalListeners = getActiveListeners();
  expect(finalListeners.length).toBe(initialListeners.length);
});
```

### Memory Profiling (Manual)

```bash
# Chrome DevTools > Memory > Take heap snapshot
# 1. Snapshot inicial
# 2. Recarregar sidepanel 5x
# 3. Snapshot final
# 4. Comparar: não deve haver crescimento de listeners
```

---

## 📊 Impacto Esperado

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Listeners após reload | Duplicados | Corretos | Fix leak |
| Overhead tab update | Todo update | Debounced | 70% menos calls |
| Memória (10 reloads) | +5 MB | +0 MB | 100% ⚡ |

---

## 🛡️ Segurança

- **Type Safety:** Validar que AbortController é suportado
- **Graceful Degradation:** Fallback para navegadores sem AbortController
- **Error Handling:** Try/catch em removeListener (pode falhar se já removido)

---

## 🔗 Relacionado

- **Análise:** [implementation_plan.md](file:///home/sant/.gemini/antigravity/brain/fc2368ed-2c8e-4483-aee9-e3e77262bcd1/implementation_plan.md)
- **Arquivos:**
  - [sidepanel/sidepanel.js](file:///home/sant/extensaoUNIVESP/sidepanel/sidepanel.js)
  - [background/index.js](file:///home/sant/extensaoUNIVESP/background/index.js)

---

## 🔗 GitHub Issue

- **Status:** N/A
- **Link:** Aguardando publicação
- **Data:** -

---
**Tags:** `//ISSUE-performance-listeners` | **Tipo:** Performance + Memory Leak Fix  
**Criado:** 2026-01-08 | **Autor:** Auditoria de Performance
