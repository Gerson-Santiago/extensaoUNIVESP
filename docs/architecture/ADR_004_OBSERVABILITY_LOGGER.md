# ADR-004: Observability Logger
**Status**: Aceito | **Data**: 2025-12-30

## Problema
`console.log` disperso poluía produção e dificultava auditoria. Não havia forma de desabilitar logs sem rebuild ou identificar origem de mensagens.

## Solução
Logger centralizado em `shared/utils/Logger.js`:
- **Métodos estruturados**: `info()`, `warn()`, `error()`
- **Namespaces semânticos**: `#LOG_UI`, `#LOG_SYSTEM`, `#LOG_DATA` (via tags JSDoc)
- **Controle**: `localStorage.setItem('UNIVESP_DEBUG', 'true')`
- **Regra**: Proibido `console.*` direto em código de produção
- **Scripts injetados**: Recebem flag `isDebugEnabled` + log local com prefixo `[Extension]`
- **Helper**: `Logger.create(namespace)` para instâncias

### Implementação (v2.9.7+)
- **Centralizador**: `Logger.js`
- **Acesso**: `localStorage` flag
- **Saída**: Zero console.log em bundle produção
- **Roadmap**: Centralizar via `sendMessage`, exportar para suporte

## Trade-offs
- ✅ **Benefícios**: Logs estruturados facilitam debugging, produção limpa por padrão, auditoria via namespace
- ⚠️ **Riscos**: Verbosidade em setup (mitigado por `Logger.create(namespace)` helper)

## Refs
- [ADR-009](ADR_009_SECURITY_COMPLIANCE.md) - Debug mode sem expor dados sensíveis
- [ADR-012](ADR_012_DEFINITION_OF_DONE.md) - DoD inclui logging estruturado
- `shared/utils/Logger.js` - Implementação

