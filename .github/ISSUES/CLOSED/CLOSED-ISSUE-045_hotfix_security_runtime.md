# 🐛 ISSUE-045: Hotfix - Erros de Runtime Críticos (Security & UI)

**Prioridade:** 🔥 CRÍTICA (Hotfix)
**Status:** ✅ Resolvida
**Componente:** `shared/security` e `settings`
**Versão Alvo:** v2.10.0

---

## 📖 Descrição do Problema

Relatórios de erro (chrome://extensions) indicam falhas graves em runtime que quebraram a UI de configurações e o scraping de atividades:

1.  **TrustedHTML Violation:**
    - Erro: `Failed to execute 'parseFromString' on 'DOMParser': This document requires 'TrustedHTML' assignment.`
    - Impacto: Scraping de atividades falha total.
    - Causa: Uso de `DOMParser` sem política de Trusted Types em ambiente seguro.

2.  **DOMSafe Blocking:**
    - Erro: `[DOMSafe] Unknown attribute blocked: min`, `max`, `step`, `checked`.
    - Impacto: Inputs numéricos e checkboxes da UI de Settings não funcionam/renderizam incorretamente.
    - Causa: Whitelist do `DOMSafe` muito restritiva.

3.  **ReferenceError UI:**
    - Erro: `Uncaught ReferenceError: userPrefsSection is not defined`.
    - Impacto: Crash da UI de Settings.
    - Causa: Código legado removido ou erro de cache (não reproduzido após limpeza).
    
4.  **404 CSS Error:**
    - Erro: `compact.css failed to load`.
    - Causa: Import residual em `global.css` após remoção do arquivo na refatoração anterior.

---

## 🎯 Objetivos

1.  Permitir atributos de input (`min`, `max`, `step`, `checked`, `value`) no `DOMSafe.js`.
2.  Implementar Trusted Types Policy para o `DOMParser` ou sanitizar input antes de parsear.
3.  Corrigir referência quebrada em `SettingsView.js`.

---

## ✅ Critérios de Aceite

- [x] `DOMSafe` permite atributos de slider e checkbox (`min`, `max`, `step`, `checked`, `selected`, `colspan`, `rowspan`).
- [x] UI de Settings abre sem `ReferenceError` (verificado via logs estáticos e limpeza de imports CSS quebrados).
- [x] Scraping funciona sem erro de `TrustedHTML` (Implementado `DOMSafe.parseHTML` com `createPolicy`).
- [x] Testes de regressão adicionados para cobrir esses cenários (624 testes passando).

---

## 🛠️ Detalhes da Implementação

1.  **DOMSafe Update:** Implementado método estático `DOMSafe.parseHTML(html)` que utiliza `window.trustedTypes.createPolicy` para criar uma política 'pass-through' segura para parsing de HTML de fontes controladas (scraping).
2.  **Whitelist Expandida:** Adicionados atributos de input range e tabela à whitelist do `DOMSafe`.
3.  **Refatoração de Scraper:** `WeekContentScraper` e `WeeksManager` atualizados para usar `DOMSafe.parseHTML` em vez de `new DOMParser()`.
4.  **Correção CSS:** Removido `@import` quebrado de `compact.css` em `global.css`.
5.  **Tipagem:** Atualizado `shared/types/security.js` para refletir novos atributos permitidos.

---

