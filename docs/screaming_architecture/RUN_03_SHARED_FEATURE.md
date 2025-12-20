> Status: Active
> Last Update: 2025-12-18
> Owner: Gerson Santiago

# 👣 Phase 1: Shared Components Migration

> **Goal**: Move critical UI components used by multiple features to `shared/ui`.

## 1.1. Modal (`sidepanel_old/components/Modals/Modal.js`)

*   **Rationale**: The `Modal` class is a base class for all modals.
*   **Target**: `shared/ui/Modal.js`

### 📋 Checklist
- [x] **Rescue**: `git mv sidepanel.bak/components/Modals/Modal.js shared/ui/Modal.js`
- [x] **Fix Self**: Update internal imports in `shared/ui/Modal.js` (e.g., CSS paths).
- [x] **Fix Consumers**:
    - Update `features/import/components/BatchImportModal.js`
    - Update `features/courses/components/AddManualModal.js`
- [x] **Verify**: Run `npm test features/import features/courses`

---

## 1.2. ActionMenu (`sidepanel_old/components/Shared/ActionMenu.js`)

*   **Rationale**: The 3-dot menu used in Course Cards.
*   **Target**: `shared/ui/ActionMenu.js`

### 📋 Checklist
- [x] **Rescue**: `git mv sidepanel.bak/components/Shared/ActionMenu.js shared/ui/ActionMenu.js`
- [x] **Fix Self**: Update internal imports in `shared/ui/ActionMenu.js`.
- [x] **Fix Consumers**:
    - Update `features/courses/components/CoursesList.js`
- [x] **Verify**: Run `npm test tests/components/ActionMenu.test.js`
