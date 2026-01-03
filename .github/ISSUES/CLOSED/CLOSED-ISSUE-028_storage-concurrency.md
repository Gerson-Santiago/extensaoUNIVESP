# 🛡️ ISSUE-028: Proteção contra Perda de Dados (Storage Concurrency)

**Status:** ✅ Resolvida
**Prioridade:** 🔴 CRÍTICA (Integridade de Dados)
**Componente:** `shared/storage` (Arquitetura)
**Versão:** v2.9.7+

---

## 🎯 Objetivo

Eliminar o risco de perda de dados acidental (Race Condition) quando o usuário utiliza a extensão em múltiplos dispositivos (ex: Computador da UNIVESP + Computador de Casa) ou múltiplas janelas. Devese implementar um mecanismo de **Versionamento Otimista** (Optimistic Concurrency Control) no acesso ao `chrome.storage`.

---

## 📖 Contexto (O Problema do "Last Write Wins")

Atualmente, a extensão lê e escreve no `chrome.storage.sync` de forma ingênua:

1.  PC A lê dados (Estado V1).
2.  PC B lê dados (Estado V1).
3.  PC A marca uma aula como concluída e Salva (Estado V2).
4.  PC B marca *outra* aula e Salva (Estado V2', baseado em V1).

**Resultado:** O Estado V2 (trabalho feito no PC A) é **SOBRESCRITO SILENCIOSAMENTE** pelo PC B. O progresso do aluno no PC A é perdido para sempre.

Como promovemos a extensão como uma "Central de Comando Confiável", essa fragilidade é inaceitável.

---

## 🚨 Evidência "Brutal" do Código (Audio 03/01/2026)

**Arquivo**: `features/courses/repositories/ActivityRepository.js`

```javascript
// Linha 23: Blind overwrite (Último a salvar ganha)
static async save(courseId, contentId, items, method) {
  // ...
  const data = {
    items,
    method,
    updatedAt: new Date().toISOString(), // ❌ Nenhuma verificação de versão!
  };
  // SOBRESCRITA CEGA: Não verifica se mudou desde o 'get'
  await chrome.storage.local.set({ [key]: data });
}
```

**Veredito**: A Race Condition não é teórica. É garantida se houver concorrência. Testes atuais (`save.test.js`) ignoram isso.

---

## 🛠️ Solução Proposta: Versionamento Otimista

### 1. Metadados de Intearidade
Todo objeto salvo no storage raiz deve conter metadados de controle:
```javascript
{
  "courses": { ... },
  "settings": { ... },
  "_meta": {
    "version": 142,        // Inteiro incremental
    "lastModified": 1735776000000,
    "modifiedBy": "client_id_temp_hash"
  }
}
```

### 2. Fluxo de Escrita Seguro (Atomic-ish)
Antes de qualquer `set()`, o sistema deve:
1.  Ler o storage atual (`get`).
2.  Comparar o `_meta.version` lido com o `_meta.version` que o cliente possui em memória.
3.  **Se Version(Disk) > Version(Memory):**
    *   🛑 **Abortar Escrita**.
    *   🔄 **Merge Strategy:** Tentar fusão automática (se chaves forem diferentes) OU alertar o usuário ("Dados foram alterados em outro local").
4.  **Se Version(Disk) == Version(Memory):**
    *   ✅ Incrementar versão.
    *   ✅ Escrever dados.

e/ou usar `chrome.storage.onChanged` para manter o estado em memória sempre atualizado ("Live Sync"), reduzindo a janela de conflito.

---

## ✅ Critérios de Aceite

- [x] Implementar classe `StorageGuard` ou wrapper sobre `chrome.storage`.
- [x] Garantir que toda escrita incremente um contador de versão.
- [x] Criar teste de integração simulando concorrência (Cliente A e B tentando escrever ao mesmo tempo).
- [x] A extensão deve ser capaz de detectar conflito e pelo menos *não sobrescrever* os dados remotos (fail-safe).

---

## 🎉 Implementação Realizada

**Data de Conclusão:** 03/01/2026

### Arquivos Criados/Modificados

1. **`shared/utils/StorageGuard.js`** (NOVO)
   - Implementa Optimistic Locking com campo `version`
   - Método `atomicSave(key, updateFn, maxRetries)` com retry automático
   - Exponential Backoff (100ms, 200ms, 400ms...)
   - Double-check antes de escrever para detectar conflitos
   - Método `get(key, defaultValue)` que desembrulha o wrapper automaticamente

2. **`features/courses/repositories/ActivityRepository.js`** (REFATORADO)
   - Migrou de `chrome.storage.local.set()` cego para `StorageGuard.atomicSave()`
   - **Merge Inteligente**: Preserva `completed: true` se já marcado localmente
   - Previne perda de dados em cenários de concorrência
   - Mantém compatibilidade com código existente

3. **`features/courses/tests/concurrency/StorageRace.test.js`** (NOVO)
   - Teste de integração simulando Race Condition
   - Cenário RED: Dois atores tentando salvar simultaneamente
   - Valida que o sistema NÃO perde dados (Last Write Wins eliminado)

### Mecanismo de Proteção

```javascript
// ANTES (INSEGURO):
await chrome.storage.local.set({ [key]: data }); // ❌ Sobrescreve cegamente

// DEPOIS (SEGURO):
await StorageGuard.atomicSave(key, (currentState) => {
  // Merge inteligente preservando dados críticos
  const merged = mergeLogic(currentState, newData);
  return merged;
}); // ✅ Detecta conflito, retenta ou falha graciosamente
```

### Estratégia de Resolução de Conflitos

- **Preservação de Estado Crítico**: `completed: true` nunca é revertido para `false`
- **Retry Automático**: Até 3 tentativas com backoff exponencial
- **Fail-Safe**: Se todas retries falharem, loga erro e não corrompe dados

---

## 🧪 Plano de Verificação (?)

Como simular concorrência localmente?
1.  Abrir 2 abas de inspeção (background).
2.  No Console A: `StorageGuard.set({foo: 1})`
3.  No Console B: Forçar escrita com versão antiga `StorageGuard.set({foo: 2})` -> **Deve Falhar**.

---

**Tags:** `//ISSUE-storage-concurrency` | **Tipo:** Bug/Architecture | **Sprint:** v2.9.7-Stabilization

## 🔗 GitHub Issue

- **Status:** N/A  
- **Link:** Issue local concluída
- **Data:** -

---
**Relatada por:** Auditoria Estratégica | **Data:** 01/01/2026
