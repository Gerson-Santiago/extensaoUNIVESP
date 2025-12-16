export class BatchImportFlow {
  /**
   * @param {Object} dependencies
   * @param {Object} dependencies.batchImportModal - Modal for scraping/selecting courses
   * @param {Object} dependencies.loginWaitModal - Modal for waiting login
   */
  constructor({ batchImportModal, loginWaitModal }) {
    this.batchImportModal = batchImportModal;
    this.loginWaitModal = loginWaitModal;
  }

  async start() {
    try {
      // A. Smart Switch / Discovery
      const existingTabs = await new Promise((r) =>
        chrome.tabs.query({ url: '*://ava.univesp.br/*' }, r)
      );
      let targetTab = existingTabs.find((t) => t.url.includes('ava.univesp.br'));
      let newlyCreated = false;

      if (!targetTab) {
        // No tab found. Create one.
        newlyCreated = true;
        targetTab = await new Promise((resolve) => {
          chrome.tabs.create({ url: 'https://ava.univesp.br/ultra/course', active: true }, resolve);
        });
      } else {
        // Found one. Switch to it.
        await chrome.tabs.update(targetTab.id, { active: true });
        if (targetTab.windowId) {
          await chrome.windows.update(targetTab.windowId, { focused: true });
        }
      }

      // Allow a small tick for object stability if needed,
      // but 'targetTab' is the object from valid query or create.

      // B. Check State
      const isCoursePage =
        targetTab.url &&
        (targetTab.url.includes('/ultra/course') || targetTab.url.includes('bb_router'));

      // If we just created the tab, it is loading. We direct to Wait Modal to be safe.
      if (isCoursePage && !newlyCreated) {
        // Ready to scrape
        this.batchImportModal.open(targetTab.id);
      } else {
        // Login or other page OR newly created -> Wait
        this.loginWaitModal.open();
      }
    } catch (err) {
      console.error('BatchImportFlow Error:', err);
      // We could use a generic error modal or alert
      // alert('Erro no fluxo de importação: ' + err.message);
    }
  }
}
