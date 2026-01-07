# 📝 ISSUE-023: Interface de Sobre, Diagnóstico e Suporte

**Status:** 📋 Aberta
**Prioridade:** Baixa
**Componente:** `features/settings`
**Versão:** v2.10.0

---

## 🎯 Objetivo

Implementar o bloco "Sobre" das configurações para dar transparência à versão do produto, facilitar o reporte de bugs e fornecer ferramentas de diagnóstico para o usuário.

---

## 🛠️ Requisitos

1.  **Versão e Créditos**: Exibir a versão dinamicamente a partir do `chrome.runtime.getManifest()`.
2.  **Links de Suporte**:
    - Link para o repositório GitHub.
    - Link direto para criação de Issues no GitHub (Reportar Bug).
3.  **Diagnóstico (Logs)**:
    - Adicionar um toggle "Habilitar modo de diagnóstico" que altere uma flag no storage local. Se ativado, o `Logger.js` deve exibir mensagens mesmo em ambiente de produção (ajuda o usuário a nos enviar prints do erro).

### 🛡️ Segurança (ADR-012, Issue-030)
- **Rendering:** Se exibir versão ou URLs dinamicamente, usar `textContent` (não `innerHTML`).
- **Logs:** Garantir que logs de diagnóstico não exponham tokens ou dados sensíveis do usuário.

---

## ✅ Critérios de Aceite

- [ ] A seção "Sobre" está presente no final das configurações.
- [ ] O link de reporte de bug funciona e aponta para as GitHub Issues.
- [ ] A flag de logs é persistida corretamente.

---

## 🔗 GitHub Issue

- **Status:** 📋 Published
- **Link:** [Issue #23](https://github.com/Gerson-Santiago/extensaoUNIVESP/issues/23)
- **Data:** 2026-01-03

---
**Tags:** `//ISSUE-settings-about` | **Tipo:** Support
