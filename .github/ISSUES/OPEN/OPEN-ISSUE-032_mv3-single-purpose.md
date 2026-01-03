# 🛡️ ISSUE-032: Manifest V3 - Single Purpose Policy Validation

**Status:** 📋 Aberta  
**Prioridade:** 🔴 Crítica (Chrome Web Store Compliance)  
**Componente:** `Governance`, `manifest.json`  
**Versão:** v2.10.0+

---

## 🎯 Objetivo
Garantir que a extensão esteja em conformidade com a **Single Purpose Policy** da Chrome Web Store, evitando rejeição por "Purple Potassium" ou "Yellow Zinc".

## 📖 Contexto (Chrome Web Store Rejection Risk)
A CWS rejeita extensões que parecem "canivetes suíços". Nossa extensão possui:
1. **Gestão de Cursos** (scraping, organização)
2. **Navegação Inteligente** (sidePanel, chips)
3. **Autopreenchimento SEI** (content script)

**Risco:** Revisores podem interpretar SEI (autofill) como "funcionalidade órfã" desconectada da gestão acadêmica.

## 🛠️ Ações Necessárias

### 1. Validação de Coesão Temática
- **Pergunta crítica:** Todas as funcionalidades convergem para "Produtividade Acadêmica UNIVESP"?
- **Hipótese de defesa:** O SEI é usado para protocolos/matrícula (função acadêmica), não genérica.

### 2. Documentação de Propósito
- Criar `SINGLE_PURPOSE_STATEMENT.md` explicando a convergência funcional.
- Atualizar descrição do `manifest.json` para enfatizar **foco único** (evitar lista de features desconexas).

### 3. Auditoria de "Feature Creep"
- Listar TODAS as funcionalidades atuais.
- Eliminar qualquer feature que não sirva diretamente ao objetivo acadêmico UNIVESP.

## ✅ Critérios de Aceite
- [ ] Documento `SINGLE_PURPOSE_STATEMENT.md` criado com narrative coesa.
- [ ] Descrição do manifest atualizada (max 132 chars, sem keyword stuffing).
- [ ] Zero features "acessórias" identificadas.

---

**Relacionado:** CWS Policy - [Single Purpose](https://developer.chrome.com/docs/webstore/program-policies/)  

## 🔗 GitHub Issue

- **Status:** N/A
- **Link:** Aguardando publicação
- **Data:** -

---
**Tags:** `//ISSUE-mv3-compliance` | **Tipo:** Governance/Compliance
