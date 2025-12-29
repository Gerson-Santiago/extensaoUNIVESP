// @ts-nocheck
/**
 * @typedef {import('../models/Course.js').Course} Course
 */

import { Logger } from '../../../shared/utils/Logger.js';
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
      Logger.warn('CourseStorage', 'Erro ao carregar cursos.'); /**#LOG_SYSTEM*/
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
      Logger.debug(
        'CourseStorage',
        `[STORAGE] Iniciando salvamento de ${courses.length} cursos...`
      ); /**#LOG_SYSTEM*/

      // 0. Carrega metadados ATUAIS (antes de sobrescrever) para saber o que deletar depois
      const currentMetadata = await ChunkedStorage.loadChunked(this.METADATA_KEY);
      const oldCourseIds = currentMetadata?.courseIds || [];

      // 1. Salva metadados NOVOS (lista de IDs)
      const newCourseIds = courses.map((c) => c.id);
      await ChunkedStorage.saveChunked(this.METADATA_KEY, { courseIds: newCourseIds });

      // 2. Salva cada curso separadamente (com chunks se necessário)
      for (const course of courses) {
        try {
          await ChunkedStorage.saveChunked(`course_${course.id}`, course);
        } catch (err) {
          Logger.error(
            'CourseStorage',
            `[STORAGE] Falha ao salvar curso ${course.id} (${course.name})`,
            err
          ); /**#LOG_SYSTEM*/
        }
      }

      // 3. Remove cursos deletados (IDs que estavam no oldIds mas não no newCourseIds)
      await this.cleanupDeletedCourses(oldCourseIds, newCourseIds);

      Logger.debug('CourseStorage', '[STORAGE] Salvamento concluído com sucesso.'); /**#LOG_SYSTEM*/
    } catch (error) {
      Logger.error('CourseStorage', 'Erro CRÍTICO ao salvar cursos:', error); /**#LOG_SYSTEM*/
      throw error;
    }
  }

  /**
   * Remove cursos que foram deletados
   * @private
   * @param {(string|number)[]} oldIds - IDs que existiam antes
   * @param {(string|number)[]} newIds - IDs que existem agora
   */
  async cleanupDeletedCourses(oldIds, newIds) {
    try {
      if (!oldIds || oldIds.length === 0) return;

      const deletedIds = oldIds.filter((id) => !newIds.includes(id));

      if (deletedIds.length > 0) {
        Logger.warn(
          'CourseStorage',
          `[STORAGE] Limpando ${deletedIds.length} cursos órfãos...`
        ); /**#LOG_SYSTEM*/
      }

      for (const id of deletedIds) {
        await ChunkedStorage.deleteChunked(`course_${id}`);
      }
    } catch (error) {
      Logger.warn('CourseStorage', 'Erro ao cleanup:', error); /**#LOG_SYSTEM*/
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

      Logger.warn(
        'CourseStorage',
        `Migrando ${legacyCourses.length} cursos para novo formato...`
      ); /**#LOG_SYSTEM*/

      // Salvar no novo formato
      await this.saveAll(legacyCourses);

      Logger.warn(
        'CourseStorage',
        'Migração concluída. Removendo dados antigos...'
      ); /**#LOG_SYSTEM*/
      await chrome.storage.sync.remove(['savedCourses']);

      Logger.warn('CourseStorage', 'Migração concluída!'); /**#LOG_SYSTEM*/
      return legacyCourses;
    } catch (error) {
      Logger.error('CourseStorage', 'Erro na migração:', error); /**#LOG_SYSTEM*/
      return [];
    }
  }
}
