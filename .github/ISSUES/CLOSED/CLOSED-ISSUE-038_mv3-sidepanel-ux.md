# 🛡️ ISSUE-038: sidePanel UX Compliance (MV3)

**Status:** ✅ Concluída  
**Prioridade:** 🟡 Alta (UX/Compliance)  
**Componente:** `sidepanel/`, `background/index.js`  
**Versão:** v2.9.7 (Stable)

---

## 🎯 Objetivo
Garantir que o `sidePanel` respeita as políticas de **Mínima Intrusão** e **User Gesture** do Manifest V3, evitando rejeição por comportamento invasivo.

## 📖 Contexto: Relatório MV3 (Seção 4)

O relatório de conformidade MV3 identifica 3 armadilhas críticas com `sidePanel`:

### 1. **User Gesture Requirement**
❌ **Erro:** Abrir `sidePanel` automaticamente ao carregar página.  
✅ **Correto:** Apenas em resposta a ação do usuário (clique no ícone).

```javascript
// ❌ PROIBIDO
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.sidePanel.open({ tabId }); // Invasivo!
  }
});

// ✅ PERMITIDO (configurar no background)
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
```

### 2. **Conflito action vs. sidePanel**
Se definimos `default_popup` no `action`, não podemos abrir `sidePanel` no clique.  
**Nossa configuração atual:** `manifest.json` define `action` mas NÃO define `default_popup` (correto), e `background/index.js` usa `setPanelBehavior` (verificar).

### 3. **Contexto e Persistência**
**Problema:** Mostrar o MESMO estado do painel para todas as abas quando a informação é contextual.  
**Solução:** Usar `chrome.tabs.onActivated` para limpar/atualizar o painel ao trocar de aba.

---

## 🛠️ Auditoria Necessária

### 1. Verificar `background/index.js`
- [x] Confirmar que usa `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })`.
- [x] Garantir que NÃO abre `sidePanel` automaticamente (sem user gesture).

### 2. Verificar Gestão de Contexto
- **Questão:** O `sidePanel` mostra dados globais ou específicos por aba?
- Se específicos (ex: "atividades da semana atual"):
  - [x] Implementar listener `chrome.tabs.onActivated` para atualizar contexto.
  - [x] Limpar ou desabilitar painel quando aba não é AVA UNIVESP.

### 3. Testar User Experience
- [x] Instalar extensão "limpa" e verificar: sidePanel só abre ao clicar no ícone?
- [x] Trocar de abas: o painel mantém estado correto ou vaza informação?

---

## 🛡️ Segurança & Privacy (Conexão Issue-035)

**Vazamento de Dados:**  
Se o painel mostra "Última semana acessada" e não limpa ao trocar de aba, um usuário pode ver dados do contexto anterior (vazamento de informação entre abas).

**Mitigação:** Reset do estado do painel ao sair de domínios UNIVESP.

---

## ✅ Critérios de Aceite
- [x] `sidePanel` só abre via user gesture (clique no ícone).
- [x] `setPanelBehavior` configurado corretamente no `background/index.js`.
- [x] Contexto do painel é gerenciado por aba (onActivated reset implemented).
- [x] Testes manuais confirmam UX não invasiva (enabled/disabled por domínio).

---

**Relacionado:** [sidePanel API Docs](https://developer.chrome.com/docs/extensions/reference/sidePanel/)  

## 🔗 GitHub Issue
- **Status:** ✅ Vinculada
- **Link:** [#22](https://github.com/Gerson-Santiago/extensaoUNIVESP/issues/22)
- **Data:** 04/01/2026

---
**Tags:** `//ISSUE-mv3-sidepanel` | **Tipo:** UX/Compliance
