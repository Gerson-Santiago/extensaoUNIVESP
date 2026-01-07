# SPEC-035: Privacy Policy Creation & Publication

**ID:** SPEC-035  
**Epic Parent:** EPIC-003 (Pre-Launch Compliance)  
**Prioridade:** 🔴 Crítica (Legal Blocker)  
**Estimativa:** 1 dia  
**Status:** 📋 Aberta

---

## 🎯 Objetivo

Criar e publicar Privacy Policy **obrigatória** para extensões com host permissions, atendendo GDPR/LGPD.

---

## 📋 Ações

### RF-001: Redigir Política
**Seções Obrigatórias:**
1. Dados Coletados (cursos, navegação AVA)
2. Como são Usados (apenas armazenamento local)
3. Não Compartilhamento (zero transmissão externa)
4. Direitos do Usuário:
   - Export (SPEC-019)
   - Delete (SPEC-020)

### RF-002: Publicar em GitHub Pages
```bash
# Criar arquivo privacy.html no repo
# Ativar GitHub Pages
# URL final: https://[usuario].github.io/extensaoUNIVESP/privacy.html
```

### RF-003: Adicionar ao Manifest
```json
{
  "homepage_url": "https://[usuario].github.io/extensaoUNIVESP/privacy.html"
}
```

---

## ✅ Critérios de Aceite
- [ ] Política redigida cobrindo SPEC-019 e SPEC-020
- [ ] Publicada e acessível via HTTPS
- [ ] Link adicionado ao manifest e CWS dashboard

**Estimativa:** 1 dia
