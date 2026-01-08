# [ISSUE-050] Tooling Fix: Dashboard Analytics (Seção 5)

---
**Type:** 🐛 Bug  
**Priority:** 🟡 Medium  
**Status:** 📋 Open  
**Component:** Scripts/Tooling  
**Effort:** 1-2 days  
**Labels:** `bug` `tooling` `dashboard`
---


## Contexto
O script de monitoramento `scripts/dashboard.sh` apresenta um erro na **Seção 5: Dívida Técnica**. O comando `grep` utilizado para contar TODOs e FIXMEs falha ao expandir corretamente a lista de exclusões, resultando em saída vazia ou incorreta dependendo do ambiente (Bash vs Zsh vs WSL).

## Problemas Identificados
1.  **Sintaxe de Exclusão**: A variável `GREP_EXCLUDE` usa `{a,b}` mas é passada entre aspas, impedindo a expansão de chaves pelo Shell antes da execução do comando.

## Plano de Ação

- [ ] Corrigir `scripts/dashboard.sh`:
    - Substituir a sintaxe `{dir1,dir2}` por múltiplos flags `--exclude-dir` explicítos ou garantir expansão correta.

## Exemplo de Fix
```bash
# Antes (Falha se aspas impedirem expansão)
GREP_EXCLUDE="--exclude-dir={node_modules,dist...}"

# Depois
GREP_EXCLUDE="--exclude-dir=node_modules --exclude-dir=dist ..."
```
