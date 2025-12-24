import { CourseRepository } from '../data/CourseRepository.js';

/**
 * @typedef {import('../models/Course.js').Course} Course
 * @typedef {import('../models/Week.js').Week} Week
 * @typedef {import('../models/Week.js').WeekItem} WeekItem
 */

/**
 * Service to manage task progress and persistence.
 * Decouples CourseWeekTasksView from CourseRepository.
 */
export class TaskProgressService {
  /**
   * Toggles the completion status of a task and persists the course.
   * @param {Course} course - The course object
   * @param {string} weekName - Name of the week
   * @param {string} taskId - ID of the task
   * @returns {Promise<boolean>} The new completion status
   * @throws {Error} if week or task not found
   */
  static async toggleTask(course, weekName, taskId) {
    // 1. Find Week
    const week = course.weeks.find((w) => w.name === weekName);
    if (!week) {
      throw new Error(`Week not found: ${weekName}`);
    }

    // 2. Find Task
    const task = week.items.find((t) => t.id === taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 3. Toggle Status
    task.completed = !task.completed;

    // 4. Update Status String/Icon (Optional synchronization)
    // Legacy support: If the item has a 'status' string, update it too
    if (task.status) {
      task.status = task.completed ? 'DONE' : 'TODO';
    }

    // 5. Persist Change
    // We save the entire list of courses because the Repository API is coarse-grained.
    // In a real API we would PATCH /tasks/{id}
    await CourseRepository.saveItems(
      await CourseRepository.loadItems((_items) => {
        // Find and replace the course in the list to be safe OR just save the current course list
        // Since CourseRepository.saveItems takes an array of courses, we need to pass the FULL list.
        // Optimization: Let's re-load to ensure we have the latest state, find our course, update it, and save.
        // However, 'course' passed by reference might already be part of the app state.
        // For this MVP Service, we reuse usage pattern from existing codebase.
      })
    );

    // Correction: CourseRepository.saveItems expects an array of courses.
    // The current pattern in the app (e.g. CourseRepository.update) is:
    // loadItems -> update -> saveItems.
    // Since 'course' object is passed by reference from the View (which holds loaded state),
    // we should ideally update the specific course in storage.

    // Robust Implementation:
    const allCourses = await CourseRepository.loadItems();
    const courseIndex = allCourses.findIndex((c) => c.url === course.url);

    if (courseIndex !== -1) {
      // Merge the updated week into the stored course
      // We know 'course' (memory) is updated. We update the persistence.
      allCourses[courseIndex] = course;
      await CourseRepository.saveItems(allCourses);
    } else {
      console.warn('TaskProgressService: Attempted to save task for unknown course in storage.');
    }

    return task.completed;
  }

  /**
   * Calculates progress statistics for a week.
   * @param {Week} week
   * @returns {{completed: number, total: number, percentage: number}}
   */
  static calculateProgress(week) {
    if (!week || !week.items || week.items.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const total = week.items.length;
    // Count as completed if .completed is true OR status is 'DONE' (legacy/scraped)
    const completed = week.items.filter((t) => t.completed || t.status === 'DONE').length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  }
}
