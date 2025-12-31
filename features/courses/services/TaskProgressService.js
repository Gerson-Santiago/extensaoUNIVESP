import { ActivityProgress } from '../models/ActivityProgress.js';
import { ActivityProgressRepository } from '../repositories/ActivityProgressRepository.js';

/**
 * @typedef {import('../models/Week.js').Week} Week
 */

/**
 * Service to manage task progress using unified ActivityProgress model.
 * Decouples views from direct storage manipulation.
 */
export class TaskProgressService {
  /**
   * Toggles the completion status of a task using ActivityProgressRepository.
   * @param {string} courseId - Course identifier (e.g., course.url)
   * @param {string} weekId - Week identifier (e.g., week.name)
   * @param {string} taskId - Task identifier
   * @returns {Promise<boolean>} The new completion status
   */
  static async toggleTask(courseId, weekId, taskId) {
    // Generate composite ID
    const activityId = ActivityProgress.generateId(courseId, weekId, taskId);

    // Toggle using repository
    const updated = await ActivityProgressRepository.toggle(activityId);

    return ActivityProgress.isCompleted(updated);
  }

  /**
   * Calculates progress statistics for a week.
   * Fetches real-time progress from ActivityProgressRepository.
   * @param {Week} week - Week object with items
   * @param {string} courseId - Course identifier
   * @returns {Promise<{completed: number, total: number, percentage: number}>}
   */
  static async calculateProgress(week, courseId) {
    if (!week || !week.items || week.items.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const total = week.items.length;

    // Fetch progress for all tasks in this week
    const activityIds = week.items.map((item) =>
      ActivityProgress.generateId(courseId, week.name, item.id)
    );

    const progressMap = await ActivityProgressRepository.getMany(activityIds);

    // Count completed tasks
    let completed = 0;
    week.items.forEach((item) => {
      const activityId = ActivityProgress.generateId(courseId, week.name, item.id);
      const progress = progressMap[activityId];

      // Check repository first, fallback to scraped status
      if (progress) {
        if (ActivityProgress.isCompleted(progress)) {
          completed++;
        }
      } else if (item.status === 'DONE') {
        // Fallback: item was scraped as DONE but not toggled by user yet
        completed++;
      }
    });

    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  }

  /**
   * Gets completion status for a specific task.
   * @param {string} courseId
   * @param {string} weekId
   * @param {string} taskId
   * @returns {Promise<boolean>}
   */
  static async isTaskCompleted(courseId, weekId, taskId) {
    const activityId = ActivityProgress.generateId(courseId, weekId, taskId);
    const progress = await ActivityProgressRepository.get(activityId);
    return ActivityProgress.isCompleted(progress);
  }
}
