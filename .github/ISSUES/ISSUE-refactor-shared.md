---
name: "Refactor: Shared"
about: Organize and document the shared directory
title: "[REFACTOR] Shared Directory"
labels: refactor, technical-debt, shared
assignees: ''

---

# Refactoring Goal: Shared

Target: `/shared`

## Objectives
- [ ] Audit `shared/` for domain logic (feature leak)
- [ ] Ensure only truly generic code exists here (Utils, UI Kit)
- [ ] Enforce clear subdirectories: `ui`, `utils`, `services` (infra)
- [ ] Document usage examples for shared components
