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
Atualmente, usamos strings HTML para renderizar componentes:
```javascript
// ❌ Padrão Atual (Inseguro e Lento)
container.innerHTML = `<div class="chip">${userContent}</div>`;
```

Isso gera:
1.  **Vetor de XSS:** Se `userContent` contiver um script malicioso (ex: um título de curso manipulado), ele pode ser executado.
2.  **Performance:** O browser precisa re-instanciar o parser HTML a cada renderização.
3.  **Perda de Estado:** Event listeners nos elementos filhos são destruídos quando o pai é reescrito.

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

**Arquivos Afetados:**
- `shared/ui/ViewTemplate.js` (Núcleo)
- `shared/ui/ActionMenu.js`
- `features/courses/views/*View.js`
- `features/courses/views/DetailsActivitiesWeekView/ActivityItemFactory.js`

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

**Tags:** `//ISSUE-security-dom` | **Sprint:** v2.10.0-Security
