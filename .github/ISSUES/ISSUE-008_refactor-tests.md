---
name: "Refactor: Tests"
about: Organize and document the tests directory
title: "[REFACTOR] Tests Directory"
labels: refactor, technical-debt, tests
assignees: ''

---

# Refactoring Goal: Tests

Target: `/tests`

## Objectives
- [x] Verify all Unit Tests are co-located in Features (`features/*/tests`)
- [x] Maintain `tests/` ONLY for E2E or Integration tests that span multiple features
- [x] Update `jest.config.js` if necessary
- [x] Clean up any legacy test files
