# 🛡️ ISSUE-028: Proteção contra Perda de Dados (Storage Concurrency)

**Status:** 📋 Aberta
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

- [ ] Implementar classe `StorageGuard` ou wrapper sobre `chrome.storage`.
- [ ] Garantir que toda escrita incremente um contador de versão.
- [ ] Criar teste de integração simulando concoorrência (Cliente A e B tentando escrever ao mesmo tempo).
- [ ] A extensão deve ser capaz de detectar conflito e pelo menos *não sobrescrever* os dados remotos (fail-safe).

---

## 🧪 Plano de Verificação (?)

Como simular concorrência localmente?
1.  Abrir 2 abas de inspeção (background).
2.  No Console A: `StorageGuard.set({foo: 1})`
3.  No Console B: Forçar escrita com versão antiga `StorageGuard.set({foo: 2})` -> **Deve Falhar**.

---

**Tags:** `//ISSUE-storage-concurrency` | **Tipo:** Bug/Architecture | **Sprint:** v2.9.7-Stabilization
**Relatada por:** Auditoria Estratégica | **Data:** 01/01/2026
