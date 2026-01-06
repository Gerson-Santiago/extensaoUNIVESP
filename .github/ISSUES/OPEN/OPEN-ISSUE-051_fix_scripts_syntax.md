# [ISSUE-051] Fix Scripts Syntax and Line Endings

## Contexto
Os scripts `fix-publish.sh` e `publish-issues-github.sh` estão falhando devido a caracteres de fim de linha do Windows (CRLF) e erros de sintaxe Bash (octal base error).

## Problemas Identificados
1.  **CRLF Errors**: `$'\r': command not found`.
2.  **Octal Error**: `019: value too great for base`.
3.  **Bash Options**: Erros no comando `set -e` ou similar devido a caracteres invisíveis.

## Plano de Ação
- [ ] Criar branch `feat/issue-051-fix-scripts`.
- [ ] Converter line-endings de `scripts/` para LF.
- [ ] Corrigir lógica de tratamento de números para evitar erro de base octal.
- [ ] Validar execução básica.

## Commit
Seguir regra de commits em PORTUGUÊS.
