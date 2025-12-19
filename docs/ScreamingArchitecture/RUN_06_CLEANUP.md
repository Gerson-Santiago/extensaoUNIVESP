> Status: Active
> Last Update: 2025-12-18
> Owner: Gerson Santiago

# 👣 Phase 3: The Cleanup

> **Goal**: Delete `sidepanel_old` and remove legacy aliases.

## 3.1. Delete Legacy Directory

*   **Pre-condition**: `sidepanel_old` must be empty (or contain only unreferenced files).
*   **Action**: `rm -rf sidepanel_old`

## 3.2. Clean Configs

### 📋 Checklist
- [ ] **Jest Config**: Remove `@sidepanel` alias from `jest.config.js`.
- [ ] **JS Config**: Remove `@sidepanel` path from `jsconfig.json`.
- [ ] **Verify**: Run full test suite `npm test`.

## 3.3. Update Entry Points (Optional Check)

*   Ensure `sidepanel/sidepanel.js` and `popup/popup.js` are minimal and only importing from `features/`.
