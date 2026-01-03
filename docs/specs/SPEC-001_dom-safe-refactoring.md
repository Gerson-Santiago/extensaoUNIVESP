# SPEC-001: DOM Safe Refactoring (innerHTML → createElement/textContent)

**Prioridade**: 🔴 Crítica  
**Estimate**: 3-4 dias  
**Issues**: ISSUE-030  
**EPIC**: EPIC-001

## Escopo
Refatorar 14 arquivos identificados na auditoria de segurança como vulneráveis ou risco moderado de XSS.
Objetivo Zero `innerHTML` com dados dinâmicos.

### Arquivos Críticos (P0)
1. `ActivityItemFactory.js`
2. `ViewTemplate.js`
3. `DetailsActivitiesWeekView/index.js`
4. `PreviewManager.js`
5. `CourseWeekTasksView/index.js`
6. `Modal.js`
7. `ActionMenu.js`

### Arquivos Moderados (P1)
8. `DetailsActivitiesWeekView` (L173 Error handling)
9. Outros identificados

## Plano de Ação (Security TDD)

### FASE 1: Red (Testes que Falham)
Criar testes de segurança que **comprovam a vulnerabilidade atual**:
- `features/courses/tests/security/ActivityXSS.test.js`: Tenta injetar `<img onerror=alert(1)>`.
- `shared/ui/tests/security/ModalXSS.test.js`: Tenta injetar `<script>` no modal.
- **Expectativa**: Testes devem passar confirmando que o XSS *é possível* (ou falhar dizendo que achou a tag, dependendo da asserção).

### FASE 2: Helper & Refactor (Green)
1. **Helper**: Criar `shared/utils/DOMSafe.js` com `escapeHTML` e builders seguros.
2. **Refatoração Sistemática**:
   - **Modern API**: Usar `element.replaceChildren(...)` em vez de `innerHTML = ''`.
   - **Performance**: Usar `DocumentFragment` para renderização de listas (`ActivityRenderer`), evitando Reflows desnecessários (Lição de Addy Osmani).
   - **Sanitização**: Banir `innerHTML` exceto se estritamente necessário e sanitizado via `DOMSafe`.

### FASE 3: Refactor (Refinamento)
Garantir que nenhum `innerHTML` sobrou sem justificativa e revisão.

## Critérios de Aceite
- [ ] Testes de XSS (com payload `alert(1)`) criados para 100% dos componentes dinâmicos.
- [ ] Uso de `DocumentFragment` em listas (Performance Check).
- [ ] Helper `DOMSafe` implementado e isolado.
