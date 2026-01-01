---
description: Workflow para Git Flow correto (NUNCA trabalhar direto na dev/main)
---

# GIT FLOW OBRIGATÓRIO - Proteção de Branches

## REGRA ABSOLUTA

**NUNCA, EM HIPÓTESE ALGUMA, TRABALHE DIRETAMENTE NAS BRANCHES:**
- `main` (produção)
- `dev` (integração)

## Workflow Correto

### 1. Antes de Qualquer Trabalho
```bash
# SEMPRE verificar em qual branch você está
git branch --show-current

# Se estiver em dev ou main, PARE IMEDIATAMENTE
# e crie uma feature branch
```

### 2. Criar Feature Branch

// turbo
```bash
# Atualizar dev
git switch dev
git pull origin dev

# Criar branch da issue
git switch -c feat/issue-XXX-descricao
# Exemplos:
# git switch -c feat/issue-015-navigation-mock
# git switch -c fix/bug-scroll-loading
# git switch -c refactor/cleanup-imports
```

### 3. Trabalhar na Feature Branch

```bash
# Verificar que está na branch correta (NÃO deve ser dev ou main)
git branch --show-current

# Fazer commits normalmente
git add .
git commit -m "feat: implementa feature X"
```

### 4. Integrar na Dev

```bash
# Atualizar com últimas mudanças da dev
git switch dev
git pull origin dev

# Voltar para sua branch
git switch feat/issue-XXX-descricao

# Rebase (recomendado) OU Merge
git rebase dev
# OU: git merge dev

# Resolver conflitos se houver

# Push da feature branch
git push origin feat/issue-XXX-descricao
```

### 5. Merge para Dev (via PR ou local)

```bash
# OPÇÃO A: Via Pull Request (RECOMENDADO para times)
# - Criar PR no GitHub
# - Code review
# - Merge via interface

# OPÇÃO B: Merge local (solo development)
git switch dev
git merge feat/issue-XXX-descricao --no-ff
git push origin dev

# Deletar branch após merge
git branch -d feat/issue-XXX-descricao
git push origin --delete feat/issue-XXX-descricao
```

## ANTI-PADRÕES (Erros Comuns)

### ERRADO - Trabalhar direto na dev
```bash
git switch dev
# ... fazer mudanças ...
git commit -m "feat: alguma coisa"  # ❌ NUNCA FAÇA ISSO!
```

### CORRETO - Criar branch
```bash
git switch dev
git switch -c feat/minha-feature
# ... fazer mudanças ...
git commit -m "feat: alguma coisa"  # ✅ Correto!
```

## Checklist Antes de Cada Commit

- [ ] Executou `git branch --show-current`?
- [ ] A branch atual NÃO é `dev` nem `main`?
- [ ] A branch segue o padrão `feat/`, `fix/`, `refactor/`?
- [ ] Se sim, pode prosseguir com segurança!

## Proteção Automatizada

Se você acidentalmente fizer commit na `dev` ou `main`:

1. **NÃO FAÇA PUSH!**
2. Desfaça o commit:
   ```bash
   git reset HEAD~1  # Desfaz último commit, mantém mudanças
   ```
3. Crie a branch correta:
   ```bash
   git switch -c feat/issue-XXX-descricao
   git commit -m "mensagem original"
   ```

## Exemplo Completo

```bash
# 1. Verificar issue que vai trabalhar (ex: ISSUE-015)
# 2. Criar branch
git switch dev
git pull origin dev
git switch -c feat/issue-015-navigation-mock

# 3. Trabalhar
# ... fazer mudanças ...
git add .
git commit -m "refactor(services): implementa tipos JSDoc"

# 4. Push da feature
git push origin feat/issue-015-navigation-mock

# 5. Integrar
git switch dev
git pull origin dev
git merge feat/issue-015-navigation-mock --no-ff
git push origin dev

# 6. Limpar
git branch -d feat/issue-015-navigation-mock
git push origin --delete feat/issue-015-navigation-mock
```

## Penalidade por Violação

Commits diretos em `dev` ou `main`:
- Dificultam rollback
- Quebram rastreabilidade
- Violam Git Flow
- Podem causar perda de trabalho

**Sempre use feature branches!**

---

## Quality Gate

Validação de código antes de commit/push.

### Durante Desenvolvimento
```bash
npm run check  # Lint + types (< 1s)
```

### Antes de Commit
```bash
npm run test:quick  # Testes falhos + imports (~10s)
```

### Antes de Push dev/main (SOLICITAR usuário)
```bash
npm run verify  # TODOS testes + lint + types (~4min)
```

**⚠️ IMPORTANTE**: IA **NUNCA** executa `verify` sem permissão explícita do usuário (limite de RAM).

### Segurança (Opcional)
```bash
npm run security:secrets  # Detecta vazamento de credenciais
```

---

**Refs**: `docs/ANTI_PADROES.md`, `docs/RESTRICOES_INFRAESTRUTURA.md`
