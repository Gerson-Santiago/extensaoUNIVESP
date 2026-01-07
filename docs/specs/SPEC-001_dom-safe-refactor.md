# SPEC-001: Refatoração DOM Safe (innerHTML → createElement)

**ID:** SPEC-001  
**Epic Parent:** EPIC-001 (Segurança e Conformidade MV3)  
**Prioridade:** 🔴 Crítica (Bloqueador de Release)  
**Estimativa:** 5 dias  
**Status:** 📋 Aberta  
**Owner:** TBD  
**QA Reviewer:** QA Lead  
**Data:** 02/01/2026

---

## 🎯 Objetivo de Negócio

Eliminar o vetor de ataque **Cross-Site Scripting (XSS)** presente na manipulação de DOM via `innerHTML`, substituindo por APIs seguras do browser (`createElement`, `textContent`).

**Justificativa CWS:** 
> "Extensions must not contain code that could be exploited for XSS attacks" (CWS Malicious Products Policy)

**Justificativa ADR-012:**
> "DOM Manipulation: Usar `textContent` ou `createElement`. `innerHTML` permitido APENAS se sanitizado explicitamente."

---

## 📖 Contexto Técnico

### Estado Atual (Anti-Pattern)
```javascript
// ❌ INSEGURO: ViewTemplate.js
static render(courseName) {
  return `<div class="course-card">${courseName}</div>`;
}

// ❌ INSEGURO: Consumidor (View)
container.innerHTML = ViewTemplate.render(userInput);
```

**Vulnerabilidade:**
Se `courseName` vier de uma fonte externa (ex: AVA UNIVESP) e contiver `<script>alert('XSS')</script>`, o código será executado.

### Estado Desejado (Seguro)
```javascript
// ✅ SEGURO: ViewTemplate.js
static render(courseName) {
  const div = document.createElement('div');
  div.className = 'course-card';
  div.textContent = courseName; // Escapa automaticamente
  return div;
}

// ✅ SEGURO: Consumidor (View)
container.replaceChildren(ViewTemplate.render(userInput));
```

---

## 📋 Requisitos Funcionais

### RF-001: Refatoração de ViewTemplate.js
**Dado** que existem 2 arquivos `ViewTemplate.js`:
- `features/courses/views/DetailsActivitiesWeekView/ViewTemplate.js`
- `features/courses/views/CourseWeeksView/ViewTemplate.js`

**Quando** refatorados:
- Método `render()` **DEVE** retornar `HTMLElement` ou `DocumentFragment`.
- **NÃO PODE** retornar `string`.

**Então:**
- Testes unitários de `ViewTemplate` passam.
- Nenhum teste de regressão quebra.

---

### RF-002: Refatoração de ActionMenu.js
**Dado** que `shared/ui/ActionMenu.js` usa `button.innerHTML` e `item.innerHTML`:

**Quando** refatorado:
- Usar `button.textContent` para texto simples.
- Usar `createElement` para ícones (se houver).

**Então:**
- Funcionalidade do menu permanece idêntica.
- Testes de `ActionMenu.test.js` passam (após atualização de asserts).

---

### RF-003: Refatoração de Views Consumidoras
**Arquivos afetados:**
- `features/courses/views/DetailsActivitiesWeekView/index.js`
- `features/courses/views/CourseWeeksView/index.js`
- `features/courses/views/CourseWeekTasksView/index.js`
- `features/courses/views/DetailsActivitiesWeekView/ActivityItemFactory.js`

**Quando** refatorados:
- Substituir `container.innerHTML = ViewTemplate.render()` por `container.replaceChildren(ViewTemplate.render())`.
- Substituir `container.innerHTML = ''` (clear) por `container.replaceChildren()` (sem args).

**Então:**
- UI renderiza corretamente.
- Nenhuma perda de funcionalidade.

---

## 🔒 Requisitos Não-Funcionais

### RNF-001: Segurança (ADR-012)
- **Zero uso de `innerHTML`** com dados dinâmicos em código de produção.
- **Exceção permitida:** Testes legados podem manter `document.body.innerHTML` para setup de fixtures (não afeta segurança de produção).

### RNF-002: Performance
- **Baseline:** Renderização de lista de 50 atividades não deve regredir.
- **Métrica:** Tempo de renderização <= tempo atual (innerHTML é mais lento, mas não deve ser perceptível).

### RNF-003: Manutenibilidade
- Criar helper `DomBuilder` (opcional, mas recomendado por ADR-012 "Mitigação").
- Exemplo:
```javascript
// shared/utils/DomBuilder.js
export class DomBuilder {
  static div(className, textContent) {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = textContent;
    return div;
  }
}
```

---

## ✅ Critérios de Aceite (Testáveis)

### CA-001: Code Validation
```bash
# ❌ Este comando DEVE retornar ZERO resultados (exceto testes)
rg "innerHTML\s*=" src/ --type js --glob '!**/*.test.js'
```

### CA-002: Visual Regression
- [ ] **Manual:** QA testa visualmente todas as views (Home, Courses, Weeks, Tasks).
- [ ] **Critério:** UI idêntica ao estado antes da refatoração (screenshots comparativos).

### CA-003: Unit Tests
- [ ] `npm run test` passa sem erros.
- [ ] Branch coverage mantém >= 85% (não regride).

### CA-004: Integration Tests
- [ ] Testar fluxo completo: Login → Carregar curso → Visualizar semana → Ver atividades.
- [ ] Nenhum erro no console do browser.

---

## 📦 Entregáveis

1. **Código Refatorado:**
   - [ ] `ViewTemplate.js` (2 arquivos)
   - [ ] `ActionMenu.js`
   - [ ] Views consumidoras (4 arquivos)
   - [ ] (Opcional) `DomBuilder.js`

2. **Testes Atualizados:**
   - [ ] Atualizar asserts de `ActionMenu.test.js` (verificar `textContent` em vez de `innerHTML`).

3. **Documentação:**
   - [ ] Atualizar ADR-012 com status "Implementado" (se aplicável).
   - [ ] PR com descrição detalhada da mudança.

---

## 🧪 Plano de Testes (AAA Pattern - ADR-000-C)

### Teste 1: ViewTemplate retorna DOM Element
```javascript
// ViewTemplate.test.js
describe('ViewTemplate.render', () => {
  it('deve retornar HTMLElement com texto sanitizado', () => {
    // Arrange
    const maliciousInput = '<script>alert("XSS")</script>';
    
    // Act
    const result = ViewTemplate.render(maliciousInput);
    
    // Assert
    expect(result).toBeInstanceOf(HTMLElement);
    expect(result.textContent).toBe(maliciousInput); // Texto bruto, não executado
    expect(result.innerHTML).not.toContain('<script>'); // Tag escapada
  });
});
```

### Teste 2: ActionMenu não injeta HTML
```javascript
// ActionMenu.test.js
it('deve escapar texto malicioso em botões', () => {
  // Arrange
  const menu = new ActionMenu();
  const maliciousLabel = '<img src=x onerror=alert(1)>';
  
  // Act
  const button = menu.createButton(maliciousLabel);
  
  // Assert
  expect(button.textContent).toBe(maliciousLabel);
  expect(button.querySelector('img')).toBeNull(); // Sem tag img injetada
});
```

---

## 🔗 Dependencies

| Dependency | Tipo | Bloqueador? |
|------------|------|-------------|
| ADR-012 aprovado | Governança | ❌ Não (já aprovado) |
| Testes unitários existentes | Técnica | ✅ Sim (devem ser atualizados) |
| Issue-030 fechada | Rastreamento | ✅ Sim (esta SPEC fecha Issue-030) |

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebra de event listeners ao trocar `innerHTML` | Alta | Médio | Usar `replaceChildren` (preserva listeners de elementos não recriados) |
| Testes de regressão insuficientes | Média | Alto | QA Lead deve validar visualmente TODAS as views |
| Performance degrada em listas grandes | Baixa | Baixo | Benchmarking antes/depois (opcional) |

---

## 📅 Timeline Sugerido

| Dia | Atividade |
|-----|-----------|
| **D1** | Refatorar `ViewTemplate.js` (2 arquivos) + testes |
| **D2** | Refatorar `ActionMenu.js` + atualizar testes |
| **D3** | Refatorar Views consumidoras (4 arquivos) |
| **D4** | Testes de integração + validação visual (QA) |
| **D5** | Code review + ajustes finais + merge |

---

**Aprovação QA Lead:** ✅ SPEC completa, requisitos claros, testes definidos. Pronta para implementação.
