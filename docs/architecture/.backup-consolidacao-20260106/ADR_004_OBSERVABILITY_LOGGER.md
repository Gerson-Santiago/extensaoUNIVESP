# ADR 004: Observability Logger
Status: Aceito | Data: 2025-12-30

## Contexto
`console.log` disperso poluía produção e dificultava auditoria. Não havia forma de desabilitar logs sem rebuild ou identificar origem de mensagens.

## Decisão
Centralizar logging em `shared/utils/Logger.js`:
- Métodos estruturados: `info()`, `warn()`, `error()`
- Namespaces semânticos via tags JSDoc (`#LOG_UI`, `#LOG_SYSTEM`, `#LOG_DATA`)
- Controle via flag: `localStorage.setItem('UNIVESP_DEBUG', 'true')`
- **Regra**: Proibido `console.*` direto em código de produção

Scripts injetados (BatchScraper) recebem flag `isDebugEnabled` e fazem log local com prefixo `[Extension]`.

## Consequências
- **Positivo**: Logs estruturados facilitam debugging
- **Positivo**: Produção limpa por padrão
- **Positivo**: Auditoria via namespace
- **Negativo**: Verbosidade em setup de Logger
- **Mitigação**: Helper `Logger.create(namespace)` para instâncias

## Relacionado
- `shared/utils/Logger.js`
- `docs/architecture/OBSERVABILITY_PLAN.md`
- ADR-012 (Debug mode sem expor dados sensíveis)
