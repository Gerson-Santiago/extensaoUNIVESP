/**
 * @typedef {import('../models/Course.js').Course} Course
 */

import { ChunkedStorage } from '../../../shared/utils/ChunkedStorage.js';

/**
 * Driver de Armazenamento para Cursos (Camada de Infraestrutura).
 * Usa ChunkedStorage para lidar com cursos grandes (> 8KB).
 * Salva cada curso separadamente para evitar quota exceeded.
 */
export class CourseStorage {
  constructor() {
    this.METADATA_KEY = 'courses_metadata';
  }

  /**
   * Recupera todos os cursos salvos.
   * @returns {Promise<Course[]>} Lista de cursos.
   */
  async getAll() {
    try {
      // 1. Carrega metadados (lista de IDs)
      const metadata = await ChunkedStorage.loadChunked(this.METADATA_KEY);

      if (!metadata || !Array.isArray(metadata.courseIds)) {
        // Tenta migração de dados antigos
        return await this.migrateLegacyData();
      }

      // 2. Carrega cada curso separadamente
      const courses = [];
      for (const id of metadata.courseIds) {
        const course = await ChunkedStorage.loadChunked(`course_${id}`);
        if (course) {
          courses.push(course);
        }
      }

      return courses;
    } catch {
      console.warn('[CourseStorage] Erro ao carregar cursos.');
      return [];
    }
  }

  /**
   * Salva a lista completa de cursos.
   * @param {Course[]} courses Lista de cursos para salvar.
   * @returns {Promise<void>}
   */
  async saveAll(courses) {
    try {
      // 1. Salva metadados (lista de IDs)
      const courseIds = courses.map((c) => c.id);
      await ChunkedStorage.saveChunked(this.METADATA_KEY, { courseIds });

      // 2. Salva cada curso separadamente (com chunks se necessário)
      for (const course of courses) {
        await ChunkedStorage.saveChunked(`course_${course.id}`, course);
      }

      // 3. Remove cursos deletados (IDs que não estão mais na lista)
      await this.cleanupDeletedCourses(courseIds);
    } catch (error) {
      console.error('[CourseStorage] Erro ao salvar cursos:', error);
      throw error;
    }
  }

  /**
   * Remove cursos que foram deletados
   * @private
   */
  async cleanupDeletedCourses(currentIds) {
    try {
      const metadata = await ChunkedStorage.loadChunked(this.METADATA_KEY);
      if (!metadata || !metadata.courseIds) return;

      const oldIds = metadata.courseIds;
      const deletedIds = oldIds.filter((id) => !currentIds.includes(id));

      for (const id of deletedIds) {
        await ChunkedStorage.deleteChunked(`course_${id}`);
      }
    } catch (error) {
      console.warn('[CourseStorage] Erro ao cleanup:', error);
    }
  }

  /**
   * Migra dados antigos (savedCourses) para novo formato
   * @private
   * @returns {Promise<Course[]>}
   */
  async migrateLegacyData() {
    try {
      const result = await chrome.storage.sync.get(['savedCourses']);
      const legacyCourses = result.savedCourses;

      if (!legacyCourses || !Array.isArray(legacyCourses)) {
        return [];
      }

      console.warn(`[CourseStorage] Migrando ${legacyCourses.length} cursos para novo formato...`);

      // Salvar no novo formato
      await this.saveAll(legacyCourses);

      console.warn('[CourseStorage] Migração concluída. Removendo dados antigos...');
      await chrome.storage.sync.remove(['savedCourses']);

      console.warn('[CourseStorage] Migração concluída!');
      return legacyCourses;
    } catch (error) {
      console.error('[CourseStorage] Erro na migração:', error);
      return [];
    }
  }
}
