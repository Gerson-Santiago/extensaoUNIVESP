# 📊 Central Univesp - Gestão de Issues

> **Sistema de rastreamento de issues local-first**  
> Última atualização: 2026-01-08

## 📈 Status Atual

| Status | Qtd | Descrição |
|--------|-----|-----------|
| 🟢 **OPEN** | 13 | Em desenvolvimento ou planejadas |
| 🟡 **BACKLOG** | 2 | Adiadas (baixa prioridade) |
| ✅ **CLOSED** | 8 | Concluídas e arquivadas |

**Total:** 23 issues | **Esforço estimado:** 33-50 dias (~2 meses)

---

## 🔍 Issues por Tipo

### 🐛 Bugs (2)
| # | Título | Prioridade | Est | caminho |
|---|--------|------------|------|---------|
| [050](open/OPEN-ISSUE-050_fix_dashboard_tooling.md) | Dashboard Tooling | 🟡 | 1-2d | Scripts |
| [051](open/OPEN-ISSUE-051_fix_scripts_syntax.md) | Scripts Syntax | 🟡 | 1d | Build |

### ♻️ Refatorações (1)
| # | Título | Prioridade | Est | Caminho |
|---|--------|------------|------|---------|
| [047](open/OPEN-ISSUE-047_refactor_weeks_manager.md) | WeeksManager | 🟢 | 3-5d | Architecture |

### ⚡ Performance (3)
| # | Título | Prioridade | Est | Caminho |
|---|--------|------------|------|---------|
| [052](open/OPEN-ISSUE-052_performance-rerenders-optimization.md) | Re-renders | 🔴 | 2-3d | CoursesView |
| [053](open/OPEN-ISSUE-053_performance-list-virtualization.md) | Virtualization | 🟡 | 3-5d | CoursesView |
| [054](open/OPEN-ISSUE-054_performance-listener-cleanup.md) | Listeners | 🟡 | 1-2d | Background |

### 🔧 Tech Debt (2)
| # | Título | Prioridade | Est | Caminho |
|---|--------|------------|------|---------|
| [044](open/OPEN-ISSUE-044_type-safety-enhancement.md) | Type Safety | 🔴 | 5-7d | TypeScript |
| [056](open/OPEN-ISSUE-056_technical-debt-unified.md) | Tech Debt Unified | 🟡 | 5-7d | Multiple |

### 📦 Features (1)
| # | Título | Prioridade | Est | Caminho |
|---|--------|------------|------|---------|
| [043](open/OPEN-ISSUE-043_data-security.md) | Data Security | 🟡 | 7-10d | Encryption |

### 🛠️ Maintenance (4)
| # | Título | Prioridade | Est | Caminho |
|---|--------|------------|------|---------|
| [036](open/OPEN-ISSUE-036_cws-metadata-prep.md) | CWS Metadata | 🟡 | 2-3d | Release |
| [040](open/OPEN-ISSUE-040_asset-quality-validation.md) | Asset Quality | 🟡 | 1-2d | Assets |
| [048](open/OPEN-ISSUE-048_cleanup_adr_drafts.md) | Cleanup ADRs | 🟢 | 1d | Docs |
| [055](open/OPEN-ISSUE-055_performance-bundle-analysis.md) | Bundle Analysis | 🟢 | 2-3d | Build |

---

## 🎯 Por Prioridade

### 🔴 Alta (2) - FOCO IMEDIATO
- **ISSUE-044:** Type Safety Enhancement
- **ISSUE-052:** Re-renders Optimization

### 🟡 Média (8)
036, 040, 043, 050, 051, 053, 054, 056

### 🟢 Baixa (3)
047, 048, 055

---

## 🚀 Roadmap 2026

### 🔴 Imediato (2 semanas)

**Sprint 1: Performance Crítica (3-5 dias)**
1. **ISSUE-052** - Re-renders (87-90% faster render) 🔴
2. **ISSUE-054** - Listeners (fix memory leak) 🟡

### 🟡 Curto Prazo (3-6 semanas)

**Sprint 2: Type Safety (10-14 dias)**
3. **ISSUE-044** - JSDoc + TypeScript 🔴
4. **ISSUE-056** - Tech Debt Unified 🟡

**Sprint 3: Pre-Launch CWS (3-5 dias)**
5. **ISSUE-036** - Metadata/Screenshots 🟡
6. **ISSUE-040** - Ícones 16/48/128 🟡

### 🟢 Pós-Launch

**Bugs & Tools (3 dias):**
- ISSUE-050, 051

**Refactors (4-6 dias):**
- ISSUE-047, 048
- ISSUE-053 (⚠️ avaliar se 052 resolveu)

### ⏳ Backlog v2.11+
- ISSUE-043 (Encryption, 7-10d)
- ISSUE-055 (Bundle, 2-3d)

---

## 🗂️ Estrutura de Pastas

```
.github/issues/
├── open/       13 issues ativas
├── backlog/     2 issues adiadas
└── closed/      8 issues concluídas
```

---

## 📋 Como Usar Este Sistema

### Criar Nova Issue

1. Copie o template: `.github/ISSUE_TEMPLATE/ISSUE_TEMPLATE.md`
2. Preencha metadata (Type, Priority, Component, Effort)
3. Salve em `open/OPEN-ISSUE-XXX_slug.md`
4. Atualize este INDEX.md

### Fechar Issue

1. Mova `open/` → `closed/`
2. Renomeie `OPEN-` → `CLOSED-`
3. Atue status para "✅ Concluída"
4. Atualize este INDEX.md

### Adiar para Backlog

1. Mova `open/` → `backlog/`
2. Renomeie `OPEN-` → `BACKLOG-`
3. Adicione nota do motivo
4. Atualize este INDEX.md

---

## 🔗 Commits e Rastreamento

### Convenção de Commit

```bash
tipo(escopo): descrição refs ISSUE-XXX
```

**Exemplos:**
```bash
feat(settings): adiciona backup refs ISSUE-019
fix(scraper): corrige seletor refs ISSUE-001
refactor(storage): simplifica cache closes ISSUE-044
```

### Hook de Validação

`.husky/commit-msg` valida automaticamente:
- ✅ Formato Conventional Commits
- ✅ Referência `refs ISSUE-XXX`
- ✅ Existência do arquivo

---

## 🌐 Integração GitHub (Opcional)

### Numeração Local vs GitHub

- **ISSUE-XXX** (local): Controle interno (001-056)
- **#N** (GitHub): Auto-incremento do GitHub

**Quando criar no GitHub:**
- ✅ Releases públicas
- ✅ Features visíveis ao usuário
- ✅ Bugs reportados externamente

**NÃO criar:**
- ❌ Tech debt interno
- ❌ Refactors
- ❌ Auditorias

**Vincular ambos:**
```markdown
## 🔗 GitHub Issue
- Local: ISSUE-019
- GitHub: #11
- Link: [#11](https://github.com/.../issues/11)
```

---

## 🟡 Issues em BACKLOG

### Critérios

Issues vão para BACKLOG quando:
- ✅ Sistema funciona sem ela
- ✅ Baixo impacto
- ✅ Sem demanda de usuários
- ✅ Esforço/benefício ruim

### Atuais

**BACKLOG-001:** Scraper Selector (ganho \<1ms, otimização prematura)  
**BACKLOG-024:** Settings Automation (funcionalide questionada, sistema atual atende)

**Revisar:** Trimestral ou pós-release

---

## 📝 Legenda

### Tipos
- 🐛 Bug - Comportamento incorreto
- ♻️ Refactor - Reestruturação de código funcional
- ⚡ Performance - Otimizações
- 🔧 Tech Debt - Tipagem, testes, qualidade
- 📦 Feature - Nova funcionalidade
- 🛠️ Maintenance - Limpeza, tooling

### Prioridades
- 🔴 Alta - Bloqueia release ou crítico
- 🟡 Média - Importante mas não bloqueia
- 🟢 Baixa - Nice to have

### Status
- 🟢 OPEN - Fazer
- 🟡 BACKLOG - Adiada
- ✅ CLOSED - Concluída

---

**Mantido por:** Equipe de Desenvolvimento  
**Template:** `.github/ISSUE_TEMPLATE/`
