# ADR 004: Container Freshness
Status: Aceito | Data: 2025-12-30

## Contexto
Bug crítico: atividades carregadas com sucesso (logs confirmavam 19 atividades) mas UI exibia skeleton vazio. `ActivityRenderer` renderizava em elemento DOM órfão após re-render da view, gerando "Zombie DOM".

## Decisão
**Always Fresh Container**: Views sempre criam renderers com containers atuais:
```javascript
// ❌ Errado: cachear referência
this.renderer = new ActivityRenderer(document.getElementById('container'));

// ✅ Correto: buscar container no momento do render
const container = this.element.querySelector('#container');
const renderer = new ActivityRenderer(container);
```

Regra: Proibido cachear referências a elementos DOM em propriedades de instância de views.

## Consequências
- **Positivo**: Elimina categoria crítica de bugs (DOM órfão)
- **Positivo**: Facilita debugging (container sempre existe quando usado)
- **Negativo**: Ligeira sobrecarga de `querySelector` em cada render
- **Mitigação**: Operação é O(1) em árvore DOM pequena (Side Panel)

## Relacionado
- `features/courses/views/DetailsActivitiesWeekView/index.js`
- `features/courses/tests/views/DetailsActivitiesWeekView/rendering-regression.test.js` (5 testes de regressão)
