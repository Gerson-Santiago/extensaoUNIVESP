# [ISSUE-048] Manutenção: Limpeza de Rascunhos de ADR

---
**Type:** 🛠️ Maintenance  
**Priority:** 🟢 Low  
**Status:** 📋 Open  
**Component:** Docs/ADR  
**Effort:** 1 day  
**Labels:** `maintenance` `docs` `cleanup`
---


## Contexto
A análise do Dashboard revelou que a pasta `.github/ISSUES/30/` contém arquivos Markdown grandes que parecem ser versões de rascunho de ADRs arquivadas ou duplicadas (ex: `ADR_017_DOM_FACTORY_PATTERN.md`). Isso polui as métricas de complexidade e confunde a busca por documentação oficial.

## Problemas Identificados
1.  **Poluição**: Arquivos mortos aparecendo em relatórios de "Arquivos Mais Complexos".
2.  **Confusão**: Existência de "ADR-017" duplicada (a oficial é sobre Jest).

## Plano de Ação

- [ ] Identificar todos os arquivos Markdown soltos em `.github/ISSUES/` e subpastas que não sejam descrições de Issues ativas.
- [ ] Verificar se o conteúdo já foi migrado para `docs/architecture/` ou se é descartável.
- [ ] Deletar ou arquivar (mover para `docs/archive`) os arquivos obsoletos.

## Alvos Iniciais
- `./.github/ISSUES/30/ADR_017_DOM_FACTORY_PATTERN.md`
- `./.github/ISSUES/30/SEGURANCA_XSS_ISSUE_030.md` (Verificar relevância)
- `./.github/ISSUES/30/DEVTOOLS_VALIDATION.md` (Verificar relevância)
