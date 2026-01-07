---
description: como rastrear e referenciar issues nos commits
---

# 🏷️ Workflow: Rastreamento de Issues

## Visão Geral

Este workflow define como referenciar issues locais (`.github/ISSUES/`) nos commits e quando criar issues no GitHub.

---

## 📝 Convenção de Commits com Issues

### Formato Padrão

```bash
tipo(escopo): descrição refs ISSUE-XXX
```

### Componentes

- **tipo**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- **escopo**: Componente afetado (ex: `settings`, `scraper`, `courses`)
- **descrição**: Mensagem em português brasileiro
- **refs ISSUE-XXX**: Referência à issue local (obrigatório se houver issue relacionada)

### Exemplos Corretos

```bash
# Feature nova relacionada à issue
feat(settings): implementa sistema de backup refs ISSUE-019

# Bug fix
fix(scraper): corrige seletor de semana refs ISSUE-001

# Documentação de issue
docs(issues): atualiza métricas de cobertura refs ISSUE-025

# Refatoração técnica
refactor(scripts): remove duplicação refs ISSUE-005

# Fechamento de issue
feat(ux): adiciona preferências de comportamento closes ISSUE-022

# Múltiplas issues
docs(specs): atualiza EPIC-001 refs ISSUE-030 ISSUE-033
```

### Exemplos Incorretos

```bash
❌ feat: implementa backup
   (falta escopo e referência à issue)

❌ implementa backup refs ISSUE-019
   (falta tipo e escopo)

❌ feat(settings): implementa backup ISSUE-019
   (falta palavra-chave 'refs')

❌ feat(settings): implement backup system refs ISSUE-019
   (mensagem em inglês)
```

---

## 🔍 Quando Referenciar Issues

### ✅ SEMPRE referenciar quando:

- Implementando feature de uma issue
- Corrigindo bug documentado em issue
- Atualizando documentação de issue
- Fechando/resolvendo issue
- Mudanças relacionadas a épicos/specs

### ⚠️ OPCIONAL quando:

- Commits de manutenção genérica (`chore`)
- Bumps de versão
- Merges de branches
- Commits de release

---

## 🌐 Issues no GitHub vs Local

### Sistema Local (.md) - Fonte de Verdade

**Todas as issues** vivem em `.github/ISSUES/OPEN/` ou `CLOSED/`

**Nomenclatura:**
```
OPEN-ISSUE-XXX_slug-descritivo.md
CLOSED-ISSUE-XXX_slug-descritivo.md
```

### GitHub Issues - Visibilidade Estratégica

**Criar no GitHub APENAS quando:**

#### 🔴 Categoria: Releases Públicas
- Milestones de versão (v2.10.0, v3.0.0)
- Issues de release engineering
- **Exemplo:** `ISSUE-021` (Release Documentation v2.10.0)

#### 🟠 Categoria: Features Visíveis ao Usuário
- Funcionalidades que o usuário final interage
- Mudanças de UX/UI importantes
- **Exemplos:**
  - `ISSUE-019` (Settings & Backup System)
  - `ISSUE-022` (UX Preferences)
  - `ISSUE-023` (About & Diagnostics)

#### 🟡 Categoria: Bugs Reportados Externamente
- Qualquer issue criada por usuários
- Bugs descobertos por terceiros
- **Formato:** Criar primeiro no GitHub, depois documentar em `.md`

#### ❌ NÃO criar no GitHub:
- Dívida técnica interna (`ISSUE-025`, `ISSUE-026`, `ISSUE-027`)
- Refatorações de código (`ISSUE-003`, `ISSUE-005`)
- Auditorias de segurança/tipos (`ISSUE-030`, `ISSUE-031`, `ISSUE-033`)
- Issues puramente administrativas

---

## 📋 Processo de Publicação de Issue

### Passo 1: Issue existe em .md

Certifique-se que existe `OPEN-ISSUE-XXX_slug.md` completo

### Passo 2: Decisão de publicar

Use critérios acima para decidir se vai pro GitHub

### Passo 3: Criar no GitHub

```bash
# Via GitHub CLI
gh issue create \
  --title "Título descritivo" \
  --body "$(cat .github/ISSUES/OPEN/OPEN-ISSUE-XXX_slug.md)" \
  --label "feature" \
  --milestone "v2.10.0"
```

### Passo 4: Atualizar .md com link

Adicionar no `.md`:
```markdown
## 🔗 GitHub Issue

- **Status:** Criada
- **Link:** [#42](https://github.com/Gerson-Santiago/extensaoUNIVESP/issues/42)
- **Data:** 2026-01-03
```

### Passo 5: Commits futuros referenciam ambos

```bash
feat(settings): implementa export refs ISSUE-019 #42
```

---

## 🔧 Validação Automática

### Hook de Commit

O hook `.husky/commit-msg` valida automaticamente:

✅ Formato Conventional Commits
✅ Mensagem em português
✅ Referência `refs ISSUE-XXX` quando aplicável
✅ Número de issue existe em `OPEN/` ou `CLOSED/`

### Bypass (use com cuidado)

```bash
# Em casos excepcionais
git commit --no-verify -m "mensagem"
```

---

## 📊 Rastreabilidade

### Ver todos os commits de uma issue

```bash
# Issue local
git log --all --grep="ISSUE-025"

# Issue do GitHub
git log --all --grep="#42"

# Ambos
git log --all --grep="ISSUE-025\|#42"
```

### Ver issues de um arquivo

```bash
git log --all --follow -- arquivo.js | grep -E "refs ISSUE-|#[0-9]+"
```

---

## 🎯 Checklist de Commit

Antes de commitar, verifique:

- [ ] Mensagem em português brasileiro
- [ ] Formato: `tipo(escopo): descrição`
- [ ] Referência `refs ISSUE-XXX` se aplicável
- [ ] Issue XXX existe em `.github/ISSUES/`
- [ ] Se issue estiver no GitHub, incluir `#número` também

---

## 📚 Ver Também

- [Git Flow](./../workflows/git-flow.md) - Estratégia de branches
- [README de Issues](./../../.github/ISSUES/README.md) - Estrutura de pastas
- [Regras do Projeto](./../rules/regras.md) - Convenções gerais

---

**Atualizado:** 2026-01-03  
**Versão:** 1.0.0
