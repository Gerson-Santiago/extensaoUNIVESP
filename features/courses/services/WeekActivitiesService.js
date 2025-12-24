import { WeekContentScraper } from './WeekContentScraper.js';
import { QuickLinksScraper } from './QuickLinksScraper.js';

/**
 * Service to manage fetching week activities.
 * Decouples scraping orchestration from the View layer.
 */
export class WeekActivitiesService {
  /**
   * Get activities for a week, using cache if available for the same method.
   * @param {Object} week - The week object (from course.weeks).
   * @param {'DOM' | 'QuickLinks'} method - The scraping method to use.
   * @returns {Promise<Array>} List of activities.
   */
  static async getActivities(week, method = 'DOM') {
    // Cache Hit: Return if already scraped with the SAME method
    if (week.items && week.items.length > 0 && week.method === method) {
      return week.items;
    }

    // Select Scraper Strategy
    const scraper = method === 'QuickLinks' ? QuickLinksScraper : WeekContentScraper;
    const scrapeMethod = method === 'QuickLinks' ? 'scrapeFromQuickLinks' : 'scrapeWeekContent';

    try {
      console.warn(`[WeekActivitiesService] Scraping via ${method}...`);

      // Execute Scraping
      const items = await scraper[scrapeMethod](week.url);

      // Update Cache
      week.items = items;
      week.method = method;

      return items;
    } catch (error) {
      console.error(`[WeekActivitiesService] Error fetching activities via ${method}:`, error);
      // Propagate error so View can handle UI state (e.g. remove active class)
      throw error;
    }
  }
}
