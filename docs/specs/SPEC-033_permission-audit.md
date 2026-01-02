# SPEC-033: Permission Audit & Justification

**ID:** SPEC-033  
**Epic Parent:** EPIC-003 (Pre-Launch Compliance)  
**Prioridade:** 🔴 Crítica (CWS Permission Warnings)  
**Estimativa:** 2 dias  
**Status:** 📋 Aberta

---

## 🎯 Objetivo

Auditar permissões solicitadas no `manifest.json` e remover/justificar permissões redundantes ou excessivas para evitar warnings assustadores na instalação.

**Foco:** `tabs` vs `activeTab` redundancy

---

## 📋 Ações

### RF-001: Grep Audit de Uso de `tabs`
```bash
# Encontrar TODOS os usos da API tabs
rg "chrome\.tabs\." --type js -g '!*.test.js'
```

**Decisão:**
- Se APENAS usa `tabs.query()` com tab ativa → Migrar para `activeTab`
- Se monitora abas em background → `tabs` é justificado

### RF-002: Atualizar Justificativa no Manifest
Adicionar ao Developer Dashboard (campo "Permission Justification"):
```
tabs: Monitoramento de navegação contextual no AVA UNIVESP para histórico de chips.
activeTab: Injeção de scripts de scraping apenas quando usuário clica na extensão.
```

---

## ✅ Critérios de Aceite
- [ ] Grep validation executado e documentado
- [ ] Se `tabs` for redundante, removido do manifest
- [ ] Justificativa escrita para permissões mantidas

**Estimativa:** 2 dias
