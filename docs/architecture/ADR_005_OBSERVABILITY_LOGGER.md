# ADR 005: Observabilidade (Logger)
**Status:** Aceito | **Data:** 2025-12-29

### Contexto
74 console statements dispersos poluíam o console e dificultavam o debug.

### Decisão
Implementar `Logger.js` estruturado:
- **Toggles**: Debug via `UNIVESP_DEBUG` no localStorage.
- **Tags**: `/**#LOG_UI*/`, `/**#LOG_SCRAPER*/` para auditoria via grep.
- **Audit Tooling**: Zero console.logs tolerados em código de produção.

### Consequências
- ✅ Console limpo em produção; telemetria rica em dev.
- ✅ Rastreabilidade por Namespace.
