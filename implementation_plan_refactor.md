# Sidepanel UI & Architecture Refactoring Plan

## Goal
Clean up the main Sidepanel view by moving "Add" actions (Manual, Current Page, Batch) into a dropdown menu accessible via the Settings (gear) icon. Refactor the code to improve modularity by creating dedicated UI component files.

## Architecture Changes

We will introduce a more modular structure within `sidepanel/`:

*   **`sidepanel/ui/menu.js`**: Handles the Settings Dropdown Menu (rendering, event listeners).
*   **`sidepanel/ui/modals.js`**: Handles the "Batch Import" and "Manual Add" modals showing/hiding.
*   **`sidepanel/logic/courseActions.js`**: (New) Centralizes the logic for adding/removing courses (Add Manual, Add Current, Batch).

## Proposed Changes

### 1. UI Structure (`sidepanel.html`)
#### [MODIFY] [sidepanel.html](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/sidepanel.html)
- **Remove**: The visible `.add-form` block from the main view.
- **Add**: A Dropdown Menu container (`#settings-menu`) positioned below the gear icon.
    - Options: "Adicionar Manualmente", "Adicionar Página Atual", "Importação em Lote".
- **Add**: A new Modal for "Manual Add" (`#modal-manual-add`).

### 2. Styling (`sidepanel.css`)
#### [MODIFY] [sidepanel.css](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/sidepanel.css)
- Styles for the Dropdown Menu (hidden/visible states, positioning).
- Styles for the Manual Add Modal (reusing existing modal styles where possible).

### 3. Logic & Components
We will split the UI logic into specific form handlers:

#### [NEW] [sidepanel/ui/menu.js](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/ui/menu.js)
- Handles the Settings Dropdown state and clicks.
- Dispatches events/calls to open the appropriate forms.

#### [NEW] [sidepanel/ui/forms/manualForm.js](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/ui/forms/manualForm.js)
- Logic for the "Manual Add" modal.
- `initManualForm(onSubmit)`: Sets up listeners for the manual form.

#### [NEW] [sidepanel/ui/forms/batchForm.js](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/ui/forms/batchForm.js)
- Logic for the "Batch Import" modal (moved from `sidepanel.js`).
- `initBatchForm(onConfirm)`: Sets up listeners for Scan, Preview, and Confirm.

#### [MODIFY] [sidepanel/sidepanel.js](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/sidepanel/sidepanel.js)
- Import `initMenu`, `initManualForm`, `initBatchForm`.
- Glue everything together: pass the "Add Item" callback to the forms.

### 4. Structure Update
- Create directory `sidepanel/ui/forms/`.

## Verification Plan
1.  **Visual Check**: Verify the Sidepanel is clean (only course list visible initially).
2.  **Menu Interaction**: Click gear icon -> Menu appears.
3.  **Manual Add**: Click option -> Modal opens -> Fill -> Add -> Item appears.
4.  **Add Current**: Click option -> Confirm dialog -> Item appears.
5.  **Batch Import**: Click option -> Batch Modal opens -> Existing functionality works.
