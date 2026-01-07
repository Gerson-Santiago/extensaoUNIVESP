# ADR-003: Container Freshness
**Status**: Aceito | **Data**: 2025-12-30

## Problema
Bug crítico: atividades carregadas com sucesso (logs confirmavam 19 atividades) mas UI exibia skeleton vazio. `ActivityRenderer` renderizava em elemento DOM órfão após re-render da view, gerando "Zombie DOM".

## Solução
**Always Fresh Container**: Views sempre criam renderers com containers atuais:
```javascript
// ❌ Errado: cachear referência
this.renderer = new ActivityRenderer(document.getElementById('container'));

// ✅ Correto: buscar container no momento do render
const container = this.element.querySelector('#container');
const renderer = new ActivityRenderer(container);
```

**Regra**: Proibido cachear referências a elementos DOM em propriedades de instância de views.

## Trade-offs
- ✅ **Benefícios**: Elimina categoria crítica de bugs (DOM órfão), facilita debugging (container sempre existe quando usado)
- ⚠️ **Riscos**: Ligeira sobrecarga de `querySelector` (mitigado por operação O(1) em árvore DOM pequena do Side Panel)

## Refs
- [ADR-005](ADR_005_NAVIGATION_HIERARCHY.md) - Navegação depende de containers frescos
- `features/courses/views/DetailsActivitiesWeekView/index.js`
- `features/courses/tests/views/DetailsActivitiesWeekView/rendering-regression.test.js` (5 testes)

