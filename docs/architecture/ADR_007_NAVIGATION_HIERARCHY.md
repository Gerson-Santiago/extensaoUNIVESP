# ADR 007: Navigation Hierarchy
**Status:** Aceito (v2.9.2) | **Data:** 2025-12-29

### Contexto
Risco de navegação "órfã" (abrir atividade sem o contexto da semana pai).

### Decisão
**Breadcrumb Logic**: Nenhuma atividade abre sem garantir sua semana pai carregada.
- **Workflow**: `Tabs.openOrSwitchTo(weekUrl)` -> aguarda loading -> scroll/highlight.

### Consequências
- ✅ Consistência total entre UI da extensão e estado do AVA.
- ✅ Prevenção de duplicação de abas.
