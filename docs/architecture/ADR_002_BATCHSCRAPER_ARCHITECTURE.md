# ADR 002: BatchScraper Architecture
**Status:** Aceito (v2.8.x) | **Data:** 2025-12-27

### Contexto
Injeção de script via `chrome.scripting.executeScript` proíbe imports ES6 (Manifest V3).

### Decisão
**NÃO modularizar** o BatchScraper (~380 LOC):
- **Monolito Funcional**: Código auto-contido para injeção sem serialização de módulos.
- **Organização**: Pasta dedicada com README avisando da restrição técnica.

### Consequências
- ✅ Funcionalidade garantida sem build step ou bundler.
- ⚠️ Duplicação de alguns helpers (necessário para injeção).
