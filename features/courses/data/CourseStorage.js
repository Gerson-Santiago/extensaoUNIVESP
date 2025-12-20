/**
 * @typedef {import('../models/Course.js').Course} Course
 */

/**
 * Driver de Armazenamento para Cursos (Camada de Infraestrutura).
 * Responsável por comunicar com o Chrome Storage e retornar Promises.
 * Isolamento total da API proprietária do navegador.
 */
export class CourseStorage {
  constructor() {
    this.STORAGE_KEY = 'savedCourses';
  }

  /**
   * Recupera todos os cursos salvos.
   * @returns {Promise<Course[]>} Lista de cursos.
   */
  getAll() {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get([this.STORAGE_KEY], (result) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          /** @type {Course[]} */
          const courses = /** @type {any} */ (result[this.STORAGE_KEY]) || [];
          resolve(courses);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Salva a lista completa de cursos.
   * @param {Course[]} courses Lista de cursos para salvar.
   * @returns {Promise<void>}
   */
  saveAll(courses) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({ [this.STORAGE_KEY]: courses }, () => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
