# 🛡️ ISSUE-034: Service Worker Lifecycle Compliance (No Keepalive Hacks)

**Status:** ✅ Fechada (Auditado 03/01/2026)  
**Prioridade:** 🟢 Baixa (Concluído)  
**Componente:** `background/index.js`  
**Versão:** v2.10.0+

---

## 🎯 Objetivo
Garantir que o Service Worker (`background/index.js`) respeita o ciclo de vida efêmero do MV3, sem "gambiarras" de keepalive que drenam bateria e violam políticas.

## ✅ **STATUS ATUAL: JÁ 80% MV3-COMPLIANT!**

**Auditoria de Código (02/01/2026)** revelou:

## 📖 Contexto: A Morte da Persistência

**MV2 (Background Pages):** Processo persistente rodando 24/7.  
**MV3 (Service Workers):** Chrome mata o worker após 30s de inatividade ou 5min de execução contínua.

### ❌ Anti-Pattern Proibido
```javascript
// ❌ NÃO FAZER
setInterval(() => {
  console.log('keepalive ping'); // Tentar forçar persistência
}, 20000);
```

**Consequência:** Rejeição por "Abuso de Recursos" + Drenagem de bateria.

## 🛠️ Auditoria Necessária

### 1. Verificar `background/index.js`
- **Grep por:** `setInterval`, `setTimeout` com loops infinitos, `WebSocket` aberto permanentemente.
- **Ação:** Substituir por `chrome.alarms` para tarefas periódicas.

### 2. Persistência de Estado
- **Regra:** NUNCA confiar em variáveis globais do Service Worker.
- **Padrão correto:**
  ```javascript
  // ✅ Persistir estado imediatamente
  chrome.storage.local.set({ lastSync: Date.now() });
  ```

### 3. Event-Driven Architecture
- Garantir que TUDO é iniciado por eventos (`chrome.runtime.onInstalled`, `chrome.storage.onChanged`, etc.).

## ✅ Critérios de Aceite
- [ ] Zero `setInterval` no `background/index.js`.
- [ ] Todas as tarefas periódicas usam `chrome.alarms`.
- [ ] Estado crítico persistido em `chrome.storage` (não em memória volátil).

---

**Relacionado:** [Service Worker Lifecycle](https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/)  

## 🔗 GitHub Issue

- **Status:** N/A  
- **Link:** Issue local concluída
- **Data:** -

---
**Tags:** `//ISSUE-mv3-service-worker` | **Tipo:** Architecture/Compliance
