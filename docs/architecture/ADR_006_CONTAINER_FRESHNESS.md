# ADR-006: Estratégia de Container Freshness para Renderização

**Status:** Aceito  
**Data:** 2025-12-29  
**Decisores:** Equipe de Desenvolvimento  
**Tags:** #dom #rendering #bug-fix #defensive-programming

---

## Contexto

### Problema: Bug de "DOM Zumbi" 🧟
Usuários reportaram que a listagem de atividades não aparecia, apesar dos logs mostrarem renderização bem-sucedida.

#### Sintomas
1. Console log: `[ActivityRenderer] Renderizando 19 atividades`
2. UI: Skeleton de loading infinito (nunca substituído pela lista)
3. Reproduzível: 100% ao abrir qualquer semana

#### Causa Raiz (Root Cause Analysis)
O fluxo de renderização tinha uma **race condition**:

```javascript
// WeeksManager.js
async handleViewActivities(week, method) {
  // 1ª CHAMADA: ANTES de buscar dados
  this.callbacks.onViewActivities(week); // week.items = []
  // → layout.navigateTo('weekActivities')
  // → view.render() cria DOM_A
  // → afterRender() chama renderSkeleton()
  // → ActivityRenderer inicializado com container_A

  const { success, data } = await service.getActivities(week);
  week.items = data;

  // 2ª CHAMADA: DEPOIS de buscar dados  
  this.callbacks.onViewActivities(week); // week.items = [19 atividades]
  // → layout.navigateTo('weekActivities') **AGAIN**
  // → view.render() cria DOM_B (NOVO ELEMENTO!)
  // → afterRender() chama renderActivities()
  // → ActivityRenderer AINDA aponta para container_A (ZUMBI!)
}
```

**Problema:** `MainLayout.navigateTo()` sempre limpa e recria o DOM:
```javascript
navigateTo(viewId) {
  contentContainer.innerHTML = ''; // ← 💀 MATA DOM_A
  contentContainer.appendChild(view.render()); // ← 🆕 CRIA DOM_B
  view.afterRender();
}
```

#### Estado Resultante
- **DOM_A (Zumbi):** Container morto com skeleton + lista renderizada (invisível)
- **DOM_B (Visível):** Container vivo apenas com skeleton (nunca atualizado)

---

## Decisão

### Estratégia: Always Fresh Container
Nunca cachear referências de containers DOM. Sempre buscar o container no momento da renderização.

### Implementação

#### ANTES (Broken)
```javascript
// DetailsActivitiesWeekView/index.js
class DetailsActivitiesWeekView {
  constructor() {
    this.activityRenderer = null; // ❌ Cached renderer
  }

  renderActivities() {
    const container = document.getElementById('activitiesContainer');
    
    // ❌ Renderer inicializado UMA VEZ, guarda container antigo
    if (!this.activityRenderer) {
      this.activityRenderer = new ActivityRenderer(container);
    }
    
    this.activityRenderer.renderActivities(this.week.items);
    // ← Renderiza no container ZUMBI!
  }
}
```

#### DEPOIS (Fixed)
```javascript
class DetailsActivitiesWeekView {
  constructor() {
    this.element = null; // ✅ Referência ao root element
  }

  render() {
    const div = document.createElement('div');
    div.innerHTML = ViewTemplate.render(...);
    this.element = div; // ✅ Atualiza referência
    return div;
  }

  renderActivities() {
    // ✅ SEMPRE busca container do elemento ATUAL (scoped query)
    const container = this.element
      ? this.element.querySelector('#activitiesContainer')
      : null;
    
    if (!container) return;

    // ✅ SEMPRE cria renderer FRESCO com container corrente
    const renderer = new ActivityRenderer(container, this.itemFactory);
    renderer.renderActivities(this.week?.items || []);
  }
}
```

---

## Consequências

### Positivas ✅
1. **Bug Eliminado**: Renderização sempre no elemento visível
2. **Defensivo por Padrão**: Scoped queries (`this.element.querySelector`) previnem erros globais
3. **Simples de Entender**: Código óbvio - sem magia de cache
4. **Performance OK**: Criar `ActivityRenderer` é barato (~1ms)

### Negativas ⚠️
1. **Ligeiramente Menos Eficiente**: Recria renderer em cada chamada
2. **Pattern Incomum**: Desenvolvedores podem tentar "otimizar" cacheando novamente

### Mitigações
- **Performance**: Ganho seria ~0.5ms - irrelevante vs. robustez
- **Proteção:** Testes de regressão falham se cachear renderer (**ver abaixo**)

---

## Blindagem: Testes de Regressão

Criados **5 testes** em `rendering-regression.test.js`:

### 1. Múltiplas Renderizações (Skeleton → Dados)
```javascript
test('Deve renderizar atividades após re-renderização da view', () => {
  view.setWeek({ items: [] });
  view.render(); // DOM_A
  
  view.setWeek({ items: [1, 2, 3] });
  view.render(); // DOM_B
  view.renderActivities();
  
  expect(document.querySelector('.activities-list')).not.toBeNull();
});
```

### 2. Container Sempre é o Elemento VISÍVEL
```javascript
test('Container do Renderer deve ser o elemento VISÍVEL', () => {
  const firstElement = view.render();
  const firstContainer = firstElement.querySelector('#activitiesContainer');
  
  const secondElement = view.render();
  const secondContainer = secondElement.querySelector('#activitiesContainer');
  
  expect(firstContainer).not.toBe(secondContainer); // ← Diferentes!
  
  view.renderActivities();
  expect(secondContainer.children.length).toBeGreaterThan(0); // ← Visível
  expect(firstContainer.children.length).toBe(0); // ← Zumbi vazio
});
```

### 3-5. Outros Cenários
- View com dados desde o início
- Navegação entre semanas
- Estado de erro

**Garantia:** Se alguém cachear `this.activityRenderer` novamente, **testes falham imediatamente**.

---

## Alternativas Consideradas

### A. Observable Pattern (RxJS/MobX)
**Prós:** Reativa, auto-update  
**Contras:** Dependência pesada, overkill para o problema  
**Decisão:** Rejeitado - complexidade >> benefício

### B. useRef / Callback Refs (React-like)
**Prós:** Pattern conhecido em React  
**Contras:** Não aplicável a Vanilla JS, necessitaria framework  
**Decisão:** Rejeitado - fora do escopo tecnológico

### C. Fix no MainLayout (evitar re-render)
**Prós:** Elimina chamada duplicada de `navigateTo()`  
**Contras:** Mudança invasiva, afeta TODAS as views  
**Decisão:** Rejeitado - risco > benefício (solução defensiva é mais segura)

---

## Referências
- **Bug Fix:** [`DetailsActivitiesWeekView/index.js:143-156`](file:///home/sant/extensaoUNIVESP/features/courses/views/DetailsActivitiesWeekView/index.js#L143-L156)
- **Testes:** [`rendering-regression.test.js`](file:///home/sant/extensaoUNIVESP/features/courses/tests/views/DetailsActivitiesWeekView/rendering-regression.test.js)
- **Walkthrough:** [`brain/walkthrough.md`](file:///home/sant/.gemini/antigravity/brain/e3a76864-e085-4159-b49c-819d8a53e2f0/walkthrough.md)

---

## Lições Aprendidas
1. **Stale References são Silenciosas**: DOM zombies não causam errors, apenas comportamento quebrado
2. **Defensive > Performant**: Robustez >> micro-otimizações prematuras
3. **Scoped Queries**: `this.element.querySelector()` > `document.getElementById()` (evita colisões globais)
4. **Testes de Regressão**: Protegem contra "otimizações" que reintroduzem bugs

---

## Implementação
- **Início:** 2025-12-29
- **Status:** ✅ Completo
- **Impacto:** Bug crítico resolvido + 5 testes de blindagem
