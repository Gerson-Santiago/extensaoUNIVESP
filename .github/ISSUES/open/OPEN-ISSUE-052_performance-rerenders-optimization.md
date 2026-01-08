# 🚀 ISSUE-052: Otimização de Re-renders no CoursesView

---
**Type:** ⚡ Performance  
**Priority:** 🔴 High  
**Status:** 📋 Open  
**Component:** UI/CoursesView  
**Effort:** 2-3 days  
**Labels:** `performance` `ui` `optimization`
---


**Status:** 📋 Aberta  
**Prioridade:** 🔴 Alta  
**Componente:** `features/courses/views/CoursesView`  
**Versão:** v2.10.0+  
**Impacto:** Performance perceptível com 10+ disciplinas

---

## 🎯 Problema

O método `loadCourses()` destrói e recria **TODA a lista de cursos** após cada operação (delete, add, import), causando lag perceptível com 10+ disciplinas.

### Código Atual (Linha 94-143)

```javascript
async loadCourses() {
  const container = document.getElementById('coursesListContainer');
  container.replaceChildren(); // ❌ Limpa TUDO
  
  grouped.forEach((group) => {
    group.courses.forEach((course) => {
      const li = createCourseElement(course, {...});
      ul.appendChild(li); // ❌ Re-cria cada elemento
    });
  });
}
```

**Chamado em:**
- `afterRender()` (renderização inicial)
- Após `delete()` (linha 128)
- Após importação em lote
- Após adição manual

---

## 💡 Solução Proposta

Implementar **reconciliação inteligente** que atualiza apenas os itens modificados.

### Estratégia 1: Diff de Arrays (Recomendada)

```javascript
async loadCourses() {
  const container = document.getElementById('coursesListContainer');
  const newCourses = await CourseRepository.loadItems();
  
  // Comparar com lista anterior (armazenada em this.currentCourses)
  const diff = this._calculateDiff(this.currentCourses, newCourses);
  
  // Atualizar apenas itens modificados
  diff.removed.forEach(id => removeElement(id));
  diff.added.forEach(course => appendElement(course));
  diff.updated.forEach(course => updateElement(course));
  
  this.currentCourses = newCourses;
}
```

### Estratégia 2: DocumentFragment para Batch Inserts

```javascript
// Se re-render completo for necessário
const fragment = document.createDocumentFragment();
grouped.forEach(group => {
  // Construir em memória
  fragment.appendChild(groupDiv);
});
container.replaceChildren(fragment); // ✅ 1 única operação DOM
```

---

## ✅ Critérios de Aceite

- [ ] Re-render completo ocorre **apenas** na renderização inicial
- [ ] Operações de delete/add atualizam **apenas o item afetado**
- [ ] Performance medida: `loadCourses()` com 20 disciplinas ≤ 50ms
- [ ] Todos os testes existentes passam
- [ ] UX permanece idêntica (sem regressão visual)

---

## 🧪 Plano de Testes

### Testes de Performance

```bash
# Criar benchmark
npm run test -- tests/performance/CoursesView.perf.test.js
```

**Métricas:**
- Tempo de `loadCourses()` (antes/depois)
- Tempo de operação de delete (antes/depois)
- Número de operações DOM (antes/depois)

### Testes Funcionais

```javascript
// Garantir reconciliação correta
test('deve atualizar apenas curso deletado', async () => {
  const view = new CoursesView({});
  await view.loadCourses(); // 10 cursos
  
  const initialElements = container.children.length;
  await CourseRepository.delete('curso-1');
  await view.loadCourses();
  
  expect(container.children.length).toBe(initialElements - 1);
  // Verificar que os outros 9 elementos DOM não foram recriados
});
```

---

## 📊 Impacto Esperado

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Tempo render (10 cursos) | ~80ms | ~10ms | 87.5% ⚡ |
| Tempo render (20 cursos) | ~150ms | ~15ms | 90% ⚡ |
| Operações DOM (delete 1) | ~100 | ~2 | 98% ⚡ |

---

## 🛡️ Segurança

- **XSS:** Manter uso de `DOMSafe.createElement`
- **Type Safety:** Validar estrutura de cursos antes de diff
- **Memory:** Limpar referências antigas após reconciliação

---

## 🔗 Relacionado

- **Análise:** [implementation_plan.md](file:///home/sant/.gemini/antigravity/brain/fc2368ed-2c8e-4483-aee9-e3e77262bcd1/implementation_plan.md)
- **ISSUE-035:** Virtualização (complementar)
- **Arquivo:** [CoursesView/index.js](file:///home/sant/extensaoUNIVESP/features/courses/views/CoursesView/index.js)

---

## 🔗 GitHub Issue

- **Status:** N/A
- **Link:** Aguardando publicação
- **Data:** -

---
**Tags:** `//ISSUE-performance-rerenders` | **Tipo:** Performance Optimization  
**Criado:** 2026-01-08 | **Autor:** Auditoria de Performance
