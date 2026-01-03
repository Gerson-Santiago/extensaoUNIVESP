# 🛡️ ISSUE-030: Security Refactor - Eliminar innerHTML (XSS)

**Status:** 📋 Aberta
**Prioridade:** 🔴 Crítica (Segurança)
**Componente:** `Security`, `Architecture`

---

## 🎯 Objetivo
Eliminar **completamente** o uso de `innerHTML` nas Views e templates da extensão para mitigar riscos de Cross-Site Scripting (XSS), alinhando o projeto com as melhores práticas do Manifesto V3.

> [!IMPORTANT]
> **Foco Único:** Esta issue trata APENAS de manipulação do DOM. Segurança de tipos (JSDoc) foi movida para a **ISSUE-031**.

---

## 🚨 O Problema: "Falsa Sensação de Segurança"

**Auditoria de Código (02/01/2026)** - 🚨 SEVERA
Status: **CRÍTICO**
Files analyzed: 158 (.js)
innerHTML findings: 58+ occurrences

**Resultado Real**:
- 🔴 **11 Arquivos Vulneráveis** (XSS confirmado)
- 🟡 **3 Arquivos com Risco Moderado**
- ✅ **Files SAFE** (incl. Settings/Home/Feedback)

### 🔴 Vulnerabilidades CRÍTICAS (P0)

O ataque segue o fluxo: **AVA DOM (Hostil) → BatchScraper → Storage → View → innerHTML**

1. **ActivityItemFactory.js** (L30-35)
   - `task.original.name` e `task.id` vêm do AVA.
   - XSS via títulos de atividades manipulados.

2. **ViewTemplate.js** (L17-18)
   - `courseName`, `weekName` vêm do AVA.
   - Renderizados no header de todas as views.

3. **DetailsActivitiesWeekView/index.js** (L59)
   - Consome ViewTemplate com dados hostis.

4. **PreviewManager.js** (L68, L82)
   - `week.name` injetado 2x em previews.

5. **CourseWeekTasksView/index.js** (L36, L132)
   - `week.name` no header.
   - `item.name` na lista de tarefas.

6. **Modal.js** (L46-51)
   - `title` e `contentHtml` dinâmicos.

7. **ActionMenu.js** (L31, L41)
   - `icon` e `label` dinâmicos.

### 🟡 Risco Moderado (P1)

8. **DetailsActivitiesWeekView** (L173)
   - `this.week.error` (mensagens de erro podem conter input refletido).

### ✅ Arquivos SAFE (Verificados)

| Arquivo | Motivo |
|---------|--------|
| `ConfigForm.js` | Renderiza HTML estático input values via DOM property |
| `SettingsView.js` | Chama ConfigForm (static) |
| `HomeView.js` | Constantes hardcoded |
| `FeedbackView.js` | URL iframe hardcoded |

---

## 🎯 Estimate Ajustado
**Original**: 2 arquivos, 1 dia (Otimista)
**Atual**: **11 arquivos, 3-4 Dias** (Realista)

### Breakdown Sugerido
1.  **Dia 1**: ActivityItemFactory + ViewTemplate + PreviewManager (P0)
2.  **Dia 2**: TasksView + DetailsView + Erro Handling (P0/P1)
3.  **Dia 3**: Modal + ActionMenu + ConfigForm (Audit final)
4.  **Dia 4**: Testes Automatizados (Anti-XSS) + Regressão Manual

---

## 🛡️ Solução Técnica (Mandatória)

1. Criar `shared/utils/DOMSafe.js` com sanitização.
2. Banir `innerHTML` para dados variáveis.
3. Usar `textContent` ou `DOMSafe.escapeHTML()`.

---

## 🛠️ Plano de Ação: "DOM Seguro"

### 1. Refatorar `ViewTemplate.js`
Transformar o `ViewTemplate` de um gerador de strings para uma **Factory de Elementos DOM**.

**De:**
```javascript
static render(text) { return `<div>${text}</div>`; }
```
**Para:**
```javascript
static render(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div;
}
```

### 2. Refatorar Views (Consumidores)
Atualizar todas as Views que consomem templates para usar `appendChild`, `replaceChildren` ou `append`.

**Arquivos a Refatorar (Auditoria 02/01/2026):**
- ✅ `shared/ui/Modal.js`
- ✅ `shared/ui/ActionMenu.js`
- ✅ `features/courses/views/DetailsActivitiesWeekView/ActivityItemFactory.js`
- ✅ `features/courses/views/DetailsActivitiesWeekView/ViewTemplate.js`
- ✅ `features/courses/views/DetailsActivitiesWeekView/index.js`
- ✅ `features/courses/views/CourseWeeksView/PreviewManager.js`
- ✅ `features/courses/views/CourseWeekTasksView/index.js`

**Total**: 11 Arquivos Críticos + 3 Moderados

**Estimate Ajustado**: **3-4 Dias** (vs 5 dias originais)

### 3. Banir `innerHTML`
- Adicionar regra de linter ou verificação manual para impedir reintrodução.
- Única exceção permitida: Sanitização explícita (se estritamente necessário, o que não parece ser o caso agora).

---

## ✅ Critérios de Aceite
- [ ] `ViewTemplate` retorna `HTMLElement` ou `DocumentFragment`.
- [ ] NENHUM arquivo `.js` (exceto testes legados específicas) usa `.innerHTML =` para renderizar dados dinâmicos.
- [ ] Interface gráfica permanece idêntica visualmente.
- [ ] Testes automatizados passam sem regressão.

---


## 🔗 GitHub Issue

- **Status:** N/A
- **Link:** Aguardando publicação
- **Data:** -

---
**Tags:** `//ISSUE-security-dom` | **Sprint:** v2.10.0-Security
