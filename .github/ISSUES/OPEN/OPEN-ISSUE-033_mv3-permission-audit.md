# 🛡️ ISSUE-033: Manifest V3 - Permission Justification & Reduction

**Status:** 📋 Aberta  
**Prioridade:** 🔴 Crítica (CWS Rejection Risk)  
**Componente:** `manifest.json`, `Governance`  
**Versão:** v2.10.0+

---

## 🎯 Objetivo
Reduzir permissões ao **mínimo necessário** e documentar justificativas robustas para evitar rejeição por "Purple Potassium" (Permission Creep).

## 📖 Contexto: Análise do Manifesto Atual

**Permissões Solicitadas:**
```json
["storage", "sidePanel", "scripting", "tabs", "activeTab", "downloads"]
```

### ⚠️ Redundância Crítica: `tabs` + `activeTab`
- **Problema:** Solicitar `tabs` E `activeTab` simultaneamente é um **red flag** para revisores.
- **Impacto:** `tabs` permite ler título/URL de **todas as abas** (perfil de navegação completo).
- **Pergunta do revisor:** "Por que precisa monitorar abas em background?"

### 🔍 Auditoria Necessária
1. **`tabs`:** Verificar se é usado apenas para `chrome.tabs.create/update` (navegação).
   - **Se SIM:** Trocar por `activeTab` (sem aviso assustador na instalação).
2. **`scripting`:** Confirmar se não pode ser substituído por `content_scripts` estático.
3. **`downloads`:** Garantir que só baixa PDFs/DOCX (não vídeos do YouTube = violação de copyright).

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
- [ ] Permissão `tabs` removida (SE não for essencial).
- [ ] Documento de justificação criado.
- [ ] Nenhum `chrome.downloads` de vídeos (YouTube/copyright).

---

**Relacionado:** CWS - [Permission Warnings](https://developer.chrome.com/docs/extensions/mv3/permission_warnings/)  
**Tags:** `//ISSUE-mv3-permissions` | **Tipo:** Compliance/Security
