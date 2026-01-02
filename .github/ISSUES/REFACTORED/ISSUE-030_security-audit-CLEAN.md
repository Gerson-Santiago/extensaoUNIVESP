# ISSUE-030: Security Refactor - Eliminate innerHTML

Status: Open
Priority: Critical
Component: Security, Architecture
Version: v2.10.0
Epic: EPIC-001

----------

OBJECTIVE

Eliminate all use of innerHTML in Views and templates to mitigate Cross-Site Scripting (XSS) risks, aligning with Manifest V3 best practices.

Note: This issue focuses ONLY on DOM manipulation. Type safety (JSDoc) is covered in ISSUE-031.

----------

CONTEXT

Current Problem:

We currently use HTML strings to render components, creating security and performance issues:

```javascript
// Current pattern (Insecure and Slow)
container.innerHTML = `<div class="chip">${userContent}</div>`;
```

Risks:
1. XSS Vector: If userContent contains malicious script, it will execute
2. Performance: Browser must re-parse HTML on every render
3. State Loss: Event listeners on child elements are destroyed when parent is rewritten

Root Cause:
ViewTemplate.js returns strings instead of DOM elements, forcing consumers to use innerHTML.

Related:
- ADR-012: Security-First Development
- SPEC-001: DOM Safe Refactor
- ISSUE-031: Type Safety Hardening

----------

REQUIREMENTS

FR-001: Refactor ViewTemplate.js

Transform ViewTemplate from string generator to DOM Element factory:

Before:
```javascript
static render(text) { 
  return `<div>${text}</div>`; 
}
```

After:
```javascript
static render(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div;
}
```

Files affected:
- features/courses/views/DetailsActivitiesWeekView/ViewTemplate.js
- features/courses/views/CourseWeeksView/ViewTemplate.js

FR-002: Update ViewTemplate Consumers

Replace innerHTML assignments with DOM API methods:

Before:
```javascript
container.innerHTML = ViewTemplate.render(data);
```

After:
```javascript
container.replaceChildren(ViewTemplate.render(data));
```

Files affected:
- features/courses/views/DetailsActivitiesWeekView/index.js
- features/courses/views/CourseWeeksView/index.js
- features/courses/views/CourseWeekTasksView/index.js
- features/courses/views/DetailsActivitiesWeekView/ActivityItemFactory.js

FR-003: Refactor ActionMenu.js

Replace innerHTML in button/item rendering with createElement and textContent.

Files affected:
- shared/ui/ActionMenu.js

NFR-001: Security (ADR-012)

Zero use of innerHTML with dynamic data in production code.
Exception: Tests may use document.body.innerHTML for fixture setup.

NFR-002: Performance

Rendering 50 activities must not regress in performance.
innerHTML is slower due to HTML parser overhead, but change should be imperceptible.

----------

ACCEPTANCE CRITERIA

- [ ] ViewTemplate returns HTMLElement or DocumentFragment (not string)
- [ ] Zero .innerHTML = with dynamic data in production code
- [ ] UI renders identically (visual regression test)
- [ ] All automated tests pass without regression
- [ ] Code grep validation passes:

```bash
rg "innerHTML\s*=" src/ --type js --glob '!**/*.test.js'
# Expected: Zero matches
```

----------

TESTING

Validation Commands:

```bash
# 1. Grep for innerHTML violations
rg "innerHTML\s*=" src/ --type js --glob '!**/*.test.js'

# 2. Run test suite
npm run test

# 3. Check coverage (must maintain >85%)
npm run test:coverage
```

Manual QA:
- Visual test all views (Home, Courses, Weeks, Tasks)
- UI must be pixel-identical to current state
- Take screenshots before/after for comparison

Integration Test:
- Flow: Login → Load course → View week → See activities
- No console errors in browser DevTools

----------

NOTES

Implementation Strategy:
1. Start with ViewTemplate.js (core refactor)
2. Update consumers one by one
3. Add linter rule to prevent innerHTML reintroduction

Optional Enhancement:
Create DomBuilder helper class (per ADR-012 mitigation) to reduce verbosity:

```javascript
export class DomBuilder {
  static div(className, textContent) {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = textContent;
    return div;
  }
}
```

Risks:
- ViewTemplate refactor may break event listeners (use replaceChildren not innerHTML)
- Regression test coverage may be insufficient (requires manual QA)

----------

Tags: //ISSUE-security-dom
Type: Refactor
Sprint: v2.10.0-Security
Estimate: 5 days
