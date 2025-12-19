> Status: Active
> Last Update: 2025-12-18
> Owner: Gerson Santiago

# 👣 Phase 2: Settings & Utils Migration

> **Goal**: Clean up dependencies for the Settings feature.

## 2.1. StatusManager (`sidepanel_old/utils/statusManager.js`)

*   **Rationale**: Used by `SettingsView` to manage storage/status.
*   **Target**: `features/settings/logic/StatusManager.js`
    *   *Decision*: It seems specific to settings/sync status, so it belongs in the feature.

### 📋 Checklist
- [ ] **Move**: `git mv sidepanel_old/utils/statusManager.js features/settings/logic/StatusManager.js`
- [ ] **Fix Consumers**:
    - Update `features/settings/ui/SettingsView.js`
- [ ] **Verify**: `npm test`

---

## 2.2. ConfigForm (`sidepanel_old/components/Forms/ConfigForm.js`)

*   **Rationale**: The form used in the Settings page.
*   **Target**: `features/settings/components/ConfigForm.js`

### 📋 Checklist
- [ ] **Move**: `git mv sidepanel_old/components/Forms/ConfigForm.js features/settings/components/ConfigForm.js`
- [ ] **Fix Consumers**:
    - Update `features/settings/ui/SettingsView.js`
- [ ] **Verify**: `npm test`
