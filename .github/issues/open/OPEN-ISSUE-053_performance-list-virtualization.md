# 📜 ISSUE-053: Virtualização de Listas no CoursesView

---
**Type:** ⚡ Performance  
**Priority:** 🟡 Medium  
**Status:** 📋 Open  
**Component:** UI/CoursesView  
**Effort:** 3-5 days  
**Labels:** `performance` `ui` `virtualization`
---


**Status:** 📋 Aberta  
**Prioridade:** 🟡 Média  
**Componente:** `features/courses/views/CoursesView`  
**Versão:** v2.11.0+  
**Impacto:** Performance perceptível com 20+ disciplinas

---

## 🎯 Problema

A `CoursesView` renderiza **todos os cursos no DOM simultaneamente**, causando performance degradada com muitas disciplinas.

### Cenário Atual

```javascript
// Com 30 disciplinas (5 semestres completos):
grouped.forEach((group) => {
  group.courses.forEach((course) => {
    ul.appendChild(li); // ❌ 30+ elementos sempre no DOM
  });
});
```

**Consequências:**
- Com 30 disciplinas: ~300+ elementos DOM (curso + semanas)
- Scrolling pode ficar lento em dispositivos menos potentes
- Memória aumenta conforme usuário avança no curso (acumula semestres)

---

## 💡 Solução Proposta

Implementar **virtual scrolling** - renderizar apenas itens visíveis no viewport.

### Opção 1: Biblioteca Leve

```javascript
import { VirtualList } from 'virtual-list-js'; // ~2kb minified

const virtualList = new VirtualList({
  container: '#coursesListContainer',
  itemHeight: 60, // altura fixa do CourseItem
  items: courses,
  renderer: (course) => createCourseElement(course)
});
```

### Opção 2: Implementação Custom

```javascript
class VirtualCoursesRenderer {
  constructor(container, courses, itemHeight = 60) {
    this.container = container;
    this.courses = courses;
    this.itemHeight = itemHeight;
    this.visibleRange = { start: 0, end: 10 };
    
    this._setupScrollListener();
  }
  
  render() {
    const { start, end } = this._calculateVisibleRange();
    const visibleCourses = this.courses.slice(start, end);
    
    // Renderizar apenas visíveis
    visibleCourses.forEach(course => {
      this.container.appendChild(createCourseElement(course));
    });
    
    // Spacers para manter altura total
    this._addSpacers(start, end);
  }
}
```

---

## ✅ Critérios de Aceite

- [ ] Renderiza apenas 10-15 itens no DOM simultaneamente
- [ ] Scrolling permanece suave (60 FPS) com 50+ disciplinas
- [ ] UX idêntica (usuário não percebe diferença)
- [ ] Todos os itens permanecem acessíveis (scroll funciona normalmente)
- [ ] Search/filter funcionam com lista virtualizada
- [ ] Bundle size aumenta ≤ 3kb

---

## 🧪 Plano de Testes

### Testes de Performance

```bash
# Benchmark com 50 disciplinas simuladas
npm run test -- tests/performance/VirtualList.perf.test.js
```

**Métricas:**
- FPS durante scroll (antes/depois)
- Tempo de renderização inicial (antes/depois)
- Memória utilizada (antes/depois)

### Testes Funcionais

```javascript
test('deve renderizar apenas itens visíveis', () => {
  const courses = generateMockCourses(50);
  const view = new CoursesView({});
  view.loadCourses(courses);
  
  const renderedElements = container.querySelectorAll('.course-item');
  expect(renderedElements.length).toBeLessThanOrEqual(15);
});

test('deve manter scroll height correto', () => {
  const courses = generateMockCourses(50);
  view.loadCourses(courses);
  
  const expectedHeight = 50 * 60; // 50 items * 60px
  expect(container.scrollHeight).toBe(expectedHeight);
});
```

---

## 📊 Impacto Esperado

| Métrica | Antes (30 cursos) | Depois | Melhoria |
|---------|-------------------|--------|----------|
| Elementos DOM | ~300 | ~15 | 95% ⚡ |
| FPS scroll | ~45 FPS | ~60 FPS | 33% ⚡ |
| Memória | ~15 MB | ~5 MB | 66% ⚡ |
| Load inicial | ~200ms | ~50ms | 75% ⚡ |

---

## ⚠️ Considerações

### Complexidade
- Alta: Requer mudanças significativas na estrutura de renderização
- Pode afetar outros componentes que dependem de `CoursesView`

### Alternativas
1. **Paginação:** Mais simples, mas UX pior (cliques extras)
2. **Lazy Loading:** Carregar conforme scroll, mas mantém itens no DOM
3. **Scroll Observer:** IntersectionObserver para mostrar/ocultar (meio-termo)

### Recomendação
- Implementar **apenas se ISSUE-034 não for suficiente**
- Priorizar reconciliação (ISSUE-034) primeiro
- Avaliar impacto real com usuários antes de implementar

---

## 🔗 Relacionado

- **ISSUE-034:** Re-renders (deve ser resolvida primeiro)
- **Análise:** [implementation_plan.md](file:///home/sant/.gemini/antigravity/brain/fc2368ed-2c8e-4483-aee9-e3e77262bcd1/implementation_plan.md)
- **Arquivo:** [CoursesView/index.js](file:///home/sant/extensaoUNIVESP/features/courses/views/CoursesView/index.js)

---

## 🔗 GitHub Issue

- **Status:** N/A
- **Link:** Aguardando publicação
- **Data:** -

---
**Tags:** `//ISSUE-performance-virtualization` | **Tipo:** Performance Enhancement  
**Criado:** 2026-01-08 | **Autor:** Auditoria de Performance
