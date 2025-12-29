# ADR 004: Container Freshness
**Status:** Aceito | **Data:** 2025-12-29

### Contexto
Bug "DOM Zumbi": renderização ocorria em elementos removidos do DOM por race condition.

### Decisão
**Always Fresh Container**: Nunca cachear referências DOM.
- **Scoped Query**: Usar `this.element.querySelector()` a cada render.
- **Fresh Renderer**: Criar `ActivityRenderer` com o container atual no `afterRender`.

### Consequências
- ✅ Eliminação de skeletons infinitos e fantasmas de UI.
- ✅ Blindagem com 5 testes de regressão (v2.9.0).
