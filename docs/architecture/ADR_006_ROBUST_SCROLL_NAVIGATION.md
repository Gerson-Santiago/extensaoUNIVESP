# ADR 006: Robust Scroll Navigation
**Status:** Aceito | **Data:** 2025-12-29

### Contexto
Navegação falhava por lazy loading ou IDs dinâmicos no AVA.

### Decisão
1. **MutationObserver**: Monitora o DOM por até 10s até o elemento alvo surgir.
2. **Cascata de 4 Seletores**: ID exato, ID curto, `startsWith` e `contains`.
3. **Highlight**: Destaque visual temporário no elemento encontrado.

### Consequências
- ✅ Taxa de sucesso de navegação próxima a 100%.
- ⚠️ Scripts injetados levemente mais densos.
