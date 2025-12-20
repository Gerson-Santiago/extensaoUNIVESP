> Status: Active
> Last Update: 2025-12-18
> Owner: Gerson Santiago

# 👣 Step-by-Step: Session Migration (Phase 6)

> **Goal**: Create the `features/session` directory and migrate Auth/Session logic.

## 6.1. Create Session Feature Structure

*   **Rationale**: Formalize the "Symbiote" session strategy.
*   **Action**: `mkdir -p features/session/{components,logic,tests}`

## 6.2. Migrate RaManager

*   **Origin**: `features/settings/logic/raManager.js`
*   **Target**: `features/session/logic/SessionManager.js`
*   **Action**:
    - [x] `git mv features/settings/logic/raManager.js features/session/logic/SessionManager.js`
    - [x] Refactor class name: `RaManager` -> `SessionManager` (Optional, but better).
    - [x] Update usages in `ConfigForm.js`, `SettingsView.js`, `batchImport.integration.test.js`.

## 6.3. Migrate LoginWaitModal

*   **Origin**: `sidepanel/components/Modals/LoginWaitModal.js`
*   **Target**: `features/session/components/LoginWaitModal.js`
*   **Action**:
    - [x] `git mv sidepanel/components/Modals/LoginWaitModal.js features/session/components/LoginWaitModal.js`
    - [x] Update usages in `sidepanel.js` (or `BatchImportFlow.js`).
    - [x] Verify `npm test`.
