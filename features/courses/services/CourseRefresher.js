import { ScraperService } from './ScraperService.js';
import { CourseRepository } from '../data/CourseRepository.js';
import { Tabs } from '../../../shared/utils/Tabs.js';
import { Logger } from '../../../shared/utils/Logger.js';

/**
 * @typedef {import('../models/Course.js').Course} Course
 */

export class CourseRefresher {
  /**
   * Tenta atualizar as semanas de um curso
   * @param {Course} course - Objeto do curso
   * @param {HTMLButtonElement|null} btn - Botão de refresh para feedback visual
   * @returns {Promise<{success: boolean, weeks: Array, error?: any}>}
   */
  static async refreshCourse(course, btn = null) {
    if (btn && btn instanceof HTMLButtonElement) {
      btn.disabled = true;
      btn.textContent = '...';
    }

    try {
      // 1. Abre/troca para a aba da matéria
      Tabs.openOrSwitchTo(course.url);

      // 2. Aguarda carga
      await new Promise((r) => setTimeout(r, 1000));

      const activeTab = await Tabs.getCurrentTab();
      if (!activeTab) throw new Error('Falha ao obter aba ativa');

      // 3. Validação de ID da matéria
      const courseMatch = activeTab.url && activeTab.url.match(/course_id=(_.+?)(&|$)/);
      const expectedCourseMatch = course.url && course.url.match(/course_id=(_.+?)(&|$)/);
      const activeCourseId = courseMatch ? courseMatch[1] : null;
      const expectedCourseId = expectedCourseMatch ? expectedCourseMatch[1] : null;

      if (!activeCourseId || activeCourseId !== expectedCourseId) {
        alert(
          `Por favor, aguarde a página da matéria "${course.name}" carregar e tente novamente.`
        );
        return { success: false, weeks: [] };
      }

      // 4. Scraping
      const result = await ScraperService.scrapeWeeksFromTab(activeTab.id);
      const weeks = result.weeks || [];

      if (weeks && weeks.length > 0) {
        await CourseRepository.update(course.id, { weeks: weeks });
        alert(`${weeks.length} semanas atualizadas para "${course.name}"!`);
        return { success: true, weeks: weeks };
      } else {
        alert('Nenhuma semana encontrada nesta página.');
        return { success: false, weeks: [] };
      }
    } catch (error) {
      /**#LOG_SERVICE*/
      Logger.error('CourseRefresher', error);
      alert('Erro ao buscar semanas.');
      return { success: false, weeks: [], error };
    } finally {
      if (btn && btn instanceof HTMLButtonElement) {
        btn.disabled = false;
        btn.textContent = '↻';
      }
    }
  }
}
