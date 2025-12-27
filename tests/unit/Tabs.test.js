import { Tabs } from '../../shared/utils/Tabs.js';

// Note: global.chrome is already mocked in jest.setup.js which includes windows and tabs mocks.
// We just need to reset/mock specific implementations for our tests.

describe('Tabs.openOrSwitchTo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Ensure default mock behavior for create/update to prevent timeouts if not handled in setup
    // jest.setup.js defines basic mocks but maybe not callback invocations for all methods?
    // Let's explicitly mock the implementation for these tests to ensure callbacks run.

    // We need to cast to any to avoid "Property 'mockImplementation' does not exist" on the type definition
    // if the global type definition conflicts with the run-time mock.
    /** @type {any} */ (chrome.tabs.create).mockImplementation((_, cb) => cb && cb({ id: 999 }));
    /** @type {any} */ (chrome.tabs.update).mockImplementation(
      (_, __, cb) => cb && cb({ id: 999 })
    );
    /** @type {any} */ (chrome.windows.update).mockImplementation((_, __, cb) => cb && cb());
  });

  describe('Bug Regression: Open Subject Button (HomeView)', () => {
    const COURSE_DASHBOARD_URL = 'https://ava.univesp.br/ultra/course';
    const MATCH_PATTERN = 'ultra/course'; // The new fixed pattern
    const WEEK_CONTENT_URL =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_123_1&content_id=_456_1';

    test('should NOT match a Week tab when looking for Course Dashboard with specific pattern', async () => {
      // Scenario: User is in Home, Week 1 is open. User clicks "AVA (Cursos)".
      // Mock: tabs.query returns the Week tab
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: WEEK_CONTENT_URL, windowId: 999 }]);
      });

      // Execute
      await Tabs.openOrSwitchTo(COURSE_DASHBOARD_URL, MATCH_PATTERN);

      // Expectation:
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: COURSE_DASHBOARD_URL }),
        expect.anything()
      );
      expect(chrome.tabs.update).not.toHaveBeenCalled();
    });

    test('should match an existing Course Dashboard tab correctly', async () => {
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback)
          callback([
            { id: 101, url: WEEK_CONTENT_URL, windowId: 999 },
            { id: 202, url: COURSE_DASHBOARD_URL, windowId: 999 },
          ]);
      });

      await Tabs.openOrSwitchTo(COURSE_DASHBOARD_URL, MATCH_PATTERN);

      expect(chrome.tabs.update).toHaveBeenCalledWith(
        202, // ID of Dashboard tab
        expect.objectContaining({ active: true }),
        expect.anything()
      );
      expect(chrome.tabs.create).not.toHaveBeenCalled();
    });
  });

  describe('Bug Regression: Navigation Between Subjects (Tabs.js logic)', () => {
    const WEEK_A_URL =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_AAA_1&content_id=_111_1';
    const WEEK_B_URL =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_BBB_1&content_id=_222_1';

    test('should NOT reuse tab from Subject A when opening Subject B (Safety Check)', async () => {
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: WEEK_A_URL, windowId: 999 }]);
      });

      // Action: Try to open Week B
      await Tabs.openOrSwitchTo(WEEK_B_URL);

      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: WEEK_B_URL }),
        expect.anything()
      );
      expect(chrome.tabs.update).not.toHaveBeenCalled();
    });

    test('should open NEW tab for same course but different content', async () => {
      const WEEK_A_PART2_URL =
        'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_AAA_1&content_id=_333_1';

      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: WEEK_A_URL, windowId: 999 }]);
      });

      await Tabs.openOrSwitchTo(WEEK_A_PART2_URL);

      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: WEEK_A_PART2_URL }),
        expect.anything()
      );
      expect(chrome.tabs.update).not.toHaveBeenCalled();
    });
  });

  describe('Detailed Checklist Verification', () => {
    // Shared constants for these tests
    const COURSE_X_ID = '_123_1';
    const COURSE_X_WEEK_1_URL = `https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=${COURSE_X_ID}&content_id=_111_1`;
    const COURSE_X_WEEK_2_URL = `https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=${COURSE_X_ID}&content_id=_222_1`;

    test('C2. Loop Prevention: Should NOT reload if URL is identical (just focus)', async () => {
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: COURSE_X_WEEK_1_URL, windowId: 999 }]);
      });

      // Action: Go to same URL again
      await Tabs.openOrSwitchTo(COURSE_X_WEEK_1_URL);

      // Expectation: Update called with ONLY active:true, invalidating URL reload
      expect(chrome.tabs.update).toHaveBeenCalledWith(
        101,
        expect.not.objectContaining({ url: COURSE_X_WEEK_1_URL }), // Should NOT contain URL
        expect.anything()
      );
      expect(chrome.tabs.update).toHaveBeenCalledWith(
        101,
        expect.objectContaining({ active: true }),
        expect.anything()
      );
    });

    test('B1. Resilience: Should create NEW tab if AVA tab was manually closed (ID not found)', async () => {
      // Mock query returning empty (tab closed by user)
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([]);
      });

      await Tabs.openOrSwitchTo(COURSE_X_WEEK_1_URL);

      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: COURSE_X_WEEK_1_URL }),
        expect.anything()
      );
    });

    test('B2. Cross-Week: Should open NEW tab when navigating Week 1 -> Week 2', async () => {
      // Setup: Browser has Week 1 open
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: COURSE_X_WEEK_1_URL, windowId: 999 }]);
      });

      // Action: User clicks Week 2 in extension
      await Tabs.openOrSwitchTo(COURSE_X_WEEK_2_URL);

      // Expectation: Create NEW tab for Week 2 (don't reuse Week 1)
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: COURSE_X_WEEK_2_URL }),
        expect.anything()
      );
      expect(chrome.tabs.update).not.toHaveBeenCalled();
    });

    test('A2. Deep Link: Should create new tab when hash changes (different content)', async () => {
      const URL_NO_HASH = COURSE_X_WEEK_1_URL;
      const URL_WITH_HASH = COURSE_X_WEEK_1_URL + '#video-123';

      // Setup: Browser has page open without hash
      /** @type {any} */ (chrome.tabs.query).mockImplementation((_, callback) => {
        if (callback) callback([{ id: 101, url: URL_NO_HASH, windowId: 999 }]);
      });

      // Action: Click deep link
      await Tabs.openOrSwitchTo(URL_WITH_HASH);

      // Expectation: Create new tab (URLs don't match exactly)
      expect(chrome.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: URL_WITH_HASH }),
        expect.anything()
      );
    });
  });
});
