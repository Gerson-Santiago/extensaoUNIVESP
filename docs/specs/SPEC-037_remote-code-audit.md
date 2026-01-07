# SPEC-037: Remote Code Audit (Zero Tolerance)

**ID:** SPEC-037  
**Epic Parent:** EPIC-003 (Pre-Launch Compliance)  
**Prioridade:** 🔴 Crítica (Instant Rejection)  
**Estimativa:** 1 dia  
**Status:** 📋 Aberta

---

## 🎯 Objetivo

Garantir **zero código remoto** na extensão, uma violação que leva a rejeição instantânea na CWS.

---

## 📋 Ações

### RF-001: Grep Validation (Código Proibido)
```bash
# 1. Buscar eval() ou Function()
rg "eval\(|new Function\(" --type js -g '!*.test.js'

# 2. Buscar fetch de .js externos
rg "fetch.*\.js|import.*http" --type js

# 3. Buscar CDN links
rg "cdn\.jsdelivr|unpkg\.com|cdnjs" --type js --type html

# 4. Buscar <script src="http
rg '<script.*src.*http' --type html
```

**Resultado Esperado:** ZERO matches (exceto comentários de código)

### RF-002: Documentar Exceções
Se houver matches legítimos (ex: comentários), documentar em `REMOTE_CODE_AUDIT.md`.

---

## ✅ Critérios de Aceite
- [ ] Todos os 4 greps executados
- [ ] Zero código remoto detectado
- [ ] Auditoria documentada e aprovada por QA

**Estimativa:** 1 dia (rápido, mas crítico)
