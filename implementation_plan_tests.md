# Test Implementation Plan

## Goal
Improve test coverage by adding tests for the new `batchScraper.js` logic and updating the integrity checks.

## Proposed Changes

### 1. Update Integrity Tests
#### [MODIFY] [tests/imports.test.js](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/tests/imports.test.js)
- Add `'sidepanel/logic/batchScraper.js'` to `filesToVerify`.
- Add `'../sidepanel/logic/batchScraper.js'` to `modulesToImport`.

### 2. New Logic Tests
#### [NEW] [tests/batchScraper.test.js](file:///c:/Users/gerson_6061/Desktop/PROJETOS/extensaoUNIVESP/tests/batchScraper.test.js)
- **Mock Setup**: Global `chrome.scripting.executeScript` mock.
- **Test Case 1: Successful Scan**:
  - Mock `executeScript` returning a valid structure (terms list with courses).
  - Call `scanAvailableTerms(tabId)`.
  - Assert `executeScript` called with correct args.
  - Assert function returns the expected terms array.
- **Test Case 2: Error Handling**:
  - Mock `executeScript` returning null or error object.
  - Assert function handles it gracefully (returns error object or null).

## Verification
- Run `npm test` to verify all tests pass.
