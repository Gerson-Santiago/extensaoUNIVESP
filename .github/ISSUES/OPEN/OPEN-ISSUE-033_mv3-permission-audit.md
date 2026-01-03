# 🛡️ ISSUE-033: Manifest V3 - Permission Justification & Reduction

**Status:** 📋 Aberta  
**Prioridade:** 🔴 Crítica (CWS Rejection Risk)  
**Componente:** `manifest.json`, `Governance`  
**Versão:** v2.10.0+

---

## 🎯 Objetivo
Reduzir permissões ao **mínimo necessário** e documentar justificativas robustas para evitar rejeição por "Purple Potassium" (Permission Creep).

## 📖 Contexto
**Permissões Solicitadas:** `["storage", "sidePanel", "scripting", "tabs", "activeTab", "downloads"]`

### 🔍 Auditoria Realizada (02/01/2026)
1. **`tabs`:** Usado apenas em `shared/utils/tests/Tabs.test.js` e para criar abas (`chrome.tabs.create`).
   - **Decisão:** Manter **APENAS** `activeTab`. Usar `tabs` somentes se estritamente necessário para *create* sem ler dados sensíveis.
   - **Status:** Justificativa sólida possível.

2. **`downloads`:** Usado em `BackupService.js` (Exportar dados).
   - **Decisão:** **MANTER**. Funcionalidade core de Backup.
   - **Justificativa:** "Permite ao usuário baixar seus próprios dados (Data Sovereignty)".

**Estimate Ajustado**: **0.5 dia** (Apenas documentar)

## 🛠️ Plano de Ação

### 1. Code Audit
- Grep por `chrome.tabs` e verificar qual API específica é usada.
- Se apenas `tabs.create/update/query`: **Remover `tabs`, manter `activeTab`**.

### 2. Justificativa Escrita
Criar `docs/CWS_PERMISSION_JUSTIFICATION.md`:
```markdown
## storage
Armazena cursos e atividades offline (função core).

## sidePanel
UI persistente para navegação contextual (não usa popup invasivo).

## scripting
Injeta scripts de scraping APENAS em ava.univesp.br (condicional, não estático).

## activeTab
Acessa aba atual quando usuário clica no ícone (privilégio mínimo).

## downloads
Permite baixar PDFs de material didático (restrito a .pdf, .docx).
```

### 3. 🛡️ Segurança (ADR-012)
- **Validação:** Antes de usar `chrome.downloads.download`, verificar extensão do arquivo.
- **User Gesture:** Garantir que downloads são sempre resposta a clique (não automático).

## ✅ Critérios de Aceite
- [ ] Permissão `tabs` removida (ou justificada com `create`).
- [ ] Documento de justificação criado.
- [ ] Nenhum `chrome.downloads` de vídeos.

---

**Relacionado:** CWS - [Permission Warnings](https://developer.chrome.com/docs/extensions/mv3/permission_warnings/)  
**Tags:** `//ISSUE-mv3-permissions` | **Tipo:** Compliance/Security
