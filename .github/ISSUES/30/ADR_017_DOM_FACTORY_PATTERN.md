# ADR-017: DOM Factory Pattern (DRY Enforcement)

**Status:** ✅ Accepted  
**Date:** 2026-01-04  
**Context:** ISSUE-030 (Security Audit - innerHTML Elimination)  
**Supersedes:** Implicit `document.createElement` usage  
**Related:** ADR-012 (Security-First), ADR-000-B (JSDoc Typing)

---

## Context

### The Problem: Scattered DOM Creation Logic

Before this ADR, DOM element creation was performed using raw `document.createElement()` calls scattered across **25+ files** in the codebase. This created multiple critical violations of the **DRY Principle** (Don't Repeat Yourself):

#### 1. Security Inconsistency (XSS Risk)
```javascript
// CourseItem.js - NO URL sanitization
const link = document.createElement('a');
link.href = userInput; // ❌ Vulnerable to javascript: URIs

// HomeView.js - ALSO no sanitization
const anchor = document.createElement('a');
anchor.href = externalUrl; // ❌ Same vulnerability, duplicated risk
```

**Problem:** Each developer must remember to sanitize URLs manually. One forgotten call = XSS vulnerability.

#### 2. Attribute Handling Duplication
```javascript
// Pattern repeated 15+ times across Views:
const button = document.createElement('button');
button.className = 'btn';
button.id = 'saveBtn';
button.textContent = 'Save';
button.addEventListener('click', handler);
```

**Problem:** 6 lines for a simple button. Multiply by hundreds of elements = thousands of repetitive LOC.

#### 3. Type Safety Gaps
```javascript
// No centralized JSDoc contract enforcement
function createCard(data) {
    const div = document.createElement('div'); // What's the return type? HTMLElement? HTMLDivElement?
    // ... 20 lines later
    return div; // Implicit any type
}
```

**Problem:** Without a typed factory, TypeScript/JSDoc cannot enforce contracts. Breaks ADR-000-B.

---

## Decision

### Adopt the **Abstract Factory Pattern** via `DOMSafe.createElement`

We establish `DOMSafe.createElement` as the **single, mandatory entry point** for all DOM element creation in the application layer (Views, Components, Templates).

#### Factory Signature

```javascript
/**
 * @param {string} tagName - HTML tag (e.g., 'div', 'a')
 * @param {Object<string, any>} [attributes={}] - Element attributes
 * @param {string|Node|Array<string|Node>} [children=[]] - Child elements/text
 * @returns {HTMLElement} Sanitized, type-safe DOM element
 */
static createElement(tagName, attributes = {}, children = [])
```

#### Enforcement Rules

| **Layer** | **Rule** | **Rationale** |
|-----------|----------|---------------|
| **Views** (`features/*/ui/`, `features/*/views/`) | ✅ MUST use `DOMSafe.createElement` | User-facing code, highest XSS risk |
| **Components** (`features/*/components/`, `shared/ui/`) | ✅ MUST use `DOMSafe.createElement` | Reusable elements, enforce consistency |
| **Services/Logic** | ⚠️ Avoid DOM creation; delegate to Views | Separation of Concerns |
| **Tests** | ✅ ALLOWED `document.createElement` | Test fixtures, performance |

---

## Rationale

### 1. **DRY:** Single Source of Truth

**Before (Scattered):**
```javascript
// 25+ files duplicating this logic
const element = document.createElement(tag);
element.className = cls;
element.setAttribute('data-id', id);
```

**After (Centralized):**
```javascript
// One line, one location to fix bugs
const element = DOMSafe.createElement(tag, { className: cls, dataset: { id } });
```

**Impact:** ~400 LOC reduction. Bug fixes propagate automatically to all consumers.

---

### 2. **Security:** Automatic XSS Mitigation

The factory **blocks dangerous URL protocols** by default:

```javascript
// Malicious Input
DOMSafe.createElement('a', { href: 'javascript:alert(document.cookie)' })

// Output
<a href=""></a> // ✅ Sanitized! Logs error to console.
```

**Blocked Protocols:**
- `javascript:`
- `vbscript:`
- `data:` (image/svg+xml, etc.)

**Rationale:** Per ADR-012 (Security-First), we assume **all external data is hostile**. The factory is the enforcement choke point.

---

### 3. **Type Safety:** JSDoc Contract Enforcement

```javascript
/**
 * @returns {HTMLElement} Guaranteed non-null, type-safe element
 */
render() {
    return DOMSafe.createElement('div', { className: 'view' }, [
        // TypeScript knows this array contains Nodes or strings
        this.header(),
        this.body()
    ]);
}
```

**Benefit:** Explicit return type (`HTMLElement`). No more implicit `any` in view contracts.

---

### 4. **Developer Experience:** Concise Syntax

**Verbose Native API:**
```javascript
const container = document.createElement('div');
container.className = 'modal';
const title = document.createElement('h2');
title.textContent = 'Confirm';
const button = document.createElement('button');
button.textContent = 'OK';
button.onclick = () => close();
container.append(title, button);
```

**Concise Factory:**
```javascript
const container = h('div', { className: 'modal' }, [
    h('h2', {}, 'Confirm'),
    h('button', { onclick: () => close() }, 'OK')
]); // where h = DOMSafe.createElement
```

**LOC Reduction:** 8 lines → 4 lines (50% less code).

---

## Consequences

### ✅ Positive

1. **Security:** XSS vulnerabilities eliminated at architectural level (not developer discipline).
2. **Maintainability:** One factory to patch, not 25+ scattered `createElement` calls.
3. **Consistency:** All views follow same pattern (Screaming Architecture compliance).
4. **Type Safety:** JSDoc contracts become enforceable via centralized typing.

### ⚠️ Negative (Mitigated)

1. **Learning Curve:** Developers must learn factory API.
   - **Mitigation:** Add examples to `docs/PADROES.md` + ESLint rule.
   
2. **Test Overhead:** Tests must now mock `DOMSafe`.
   - **Mitigation:** Tests can still use native `document.createElement` (allowed exception).
   
3. **Performance:** One extra function call per element.
   - **Mitigation:** Negligible (<1ms overhead). Factory overhead < HTML parser overhead.

---

## Implementation

### Phase 1: Core Factory (✅ Complete - ISSUE-030)
- [x] Implement `DOMSafe.createElement` with URL sanitization
- [x] Add JSDoc typing (`@returns {HTMLElement}`)
- [x] Refactor critical Views: `SettingsView`, `HomeView`, `CoursesView`, `FeedbackView`, `ConfigForm`

### Phase 2: Universal Adoption (✅ Complete - 04/01/2026)
- [x] Refactor 28 arquivos total:
  - [x] `CourseItem.js`, `WeekItem.js`, `ActionMenu.js`, `ContextualChips.js`
  - [x] `BatchImportModal.js`, `MainLayout.js`, `TopNav.js`, `SkeletonLoader.js`
  - [x] `ViewTemplate.js` (CourseWeeksView, DetailsActivitiesWeekView)
  - [x] `WeeksManager.js`, `PreviewManager.js`, `ActivityRenderer.js`, `ChipsManager.js`
  - [x] `SkeletonManager.js`, `ConfigForm.js`, `DOMSafe.js`
- [x] Zero innerHTML violations alcançado ✓

### Phase 3: Enforcement (📋 Planned)
- [ ] Add ESLint rule: `no-restricted-syntax` for raw `document.createElement` in `features/`
- [ ] Pre-commit hook: `rg "innerHTML\s*=" features/ --type js`
- [ ] Update `CONTRIBUTING.md` with factory usage guidelines

---

## Validation

### Security Test
```javascript
// Attempt XSS injection
const malicious = DOMSafe.createElement('a', { 
    href: 'javascript:alert(1)' 
});
console.assert(malicious.href === '', 'XSS blocked');
```

### DRY Audit
```bash
# Count raw createElement usage (should decrease over time)
rg "document\.createElement" features/ --type js | wc -l
# Target: 0 (except tests)
```

---

## References

- **Issue:** ISSUE-030 (Security Audit - innerHTML Elimination)
- **Related ADRs:** 
  - ADR-012 (Security-First Development)
  - ADR-000-B (JSDoc Typing)
- **Pattern Source:** React's `React.createElement`, Vue's `h()` function
- **Security:** OWASP XSS Prevention Cheat Sheet

---

**Approved By:** Architecture Team  
**Next Review:** v2.11.0 (Após conclusão da Phase 2)
