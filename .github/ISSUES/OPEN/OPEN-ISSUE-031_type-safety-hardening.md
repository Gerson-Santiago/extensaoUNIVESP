# 🛡️ ISSUE-031: Type Safety - Fortalecimento de JSDoc

**Status:** 📋 Aberta
**Prioridade:** 🟡 Média/Alta (Manutenibilidade)
**Componente:** `DX`, `TypeSystem`

---

## 🎯 Objetivo
Eliminar tipos genéricos (`any`, `Object`) e fortalecer o JSDoc nos Repositories e Services críticos para evitar o problema de "tipos que mentem".

---

## 🚨 O Problema
O uso de `@type {Object}` (apelidado de "The Lazy Type") desliga a inteligência do editor e esconde erros de contrato entre a API/Scraper e as Views.

**Exemplos Identificados:**
- `ActivityRepository.js`: Retorna objetos sem forma definida.
- `HistoryService.js`: Manipula estruturas de dados complexas sem documentação clara.

---

## 🛠️ Plano de Ação

### 1. Definir Tipos de Domínio (`@typedef`)
Criar definições claras para as entidades principais.

```javascript
/**
 * @typedef {Object} Activity
 * @property {string} id - Identificador único no AVA
 * @property {string} title - Título da atividade
 * @property {string} url - Link direto
 * @property {boolean} [completed] - Estado de conclusão
 * @property {string} type - 'quiz' | 'forum' | 'task'
 */
```

### 2. Aplicar nos Repositories
Substituir JSDoc genérico por JSDoc específico.

**De:**
```javascript
/** @returns {Object[]} */
```
**Para:**
```javascript
/** @returns {Activity[]} */
```

### 3. Validar Consistência
Garantir que os métodos de Serviço (`BatchScraper`, `HistoryService`) respeitem esses contratos.

---

## ✅ Critérios de Aceite
- [ ] `ActivityRepository.js` possui tipagem estrita para métodos de leitura/escrita.
- [ ] `HistoryService.js` possui `@typedef` para a estrutura do histórico.
- [ ] Zero ocorrências de `@type {Object}` em arquivos de Core Logic (Repositories/Services).
- [ ] `npm run type-check` (se existir) ou validação no VS Code não reporta erros.

---

**Tags:** `//ISSUE-type-safety` | **Sprint:** v2.10.0-Quality
