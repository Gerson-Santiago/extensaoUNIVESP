import { CourseStorage } from './CourseStorage.js';

const storage = new CourseStorage();

/**
 * Repositório para gerenciar a persistência de cursos (Camada de Domínio).
 * Usa CourseStorage para acesso a dados.
 */
export class CourseRepository {
  /**
   * Carrega a lista de matérias salvas.
   * @param {Function} [callback] - Legado (opcional). Se fornecer, funciona como antes.
   * @returns {Promise<Array>}
   */
  static async loadItems(callback) {
    try {
      const courses = await storage.getAll();
      if (callback) callback(courses);
      return courses;
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      if (callback) callback([]);
      return [];
    }
  }

  /**
   * Salva a lista de matérias.
   * @param {Array} courses
   * @param {Function} [callback]
   */
  static async saveItems(courses, callback) {
    try {
      await storage.saveAll(courses);
      if (callback) callback();
    } catch (error) {
      console.error('Erro ao salvar cursos:', error);
    }
  }

  /**
   * Adiciona uma nova matéria.
   */
  static async add(name, url, weeks = [], optionsOrCallback, extraCallback) {
    let callback = optionsOrCallback;
    let termName = '';

    if (
      typeof optionsOrCallback === 'object' &&
      optionsOrCallback !== null &&
      !Array.isArray(optionsOrCallback)
    ) {
      termName = optionsOrCallback.termName || '';
      callback = extraCallback;
    }

    try {
      const courses = await this.loadItems();
      const exists = courses.some((c) => c.url === url);

      if (exists) {
        console.warn(`Curso com URL já existe: ${url}`);
        if (callback) callback(false, 'Matéria já adicionada anteriormente.');
        return;
      }

      courses.push({ id: Date.now(), name, url, weeks, termName });
      await this.saveItems(courses);

      if (callback) callback(true, 'Matéria adicionada com sucesso!');
    } catch (error) {
      console.error(error);
      if (callback) callback(false, 'Erro ao adicionar.');
    }
  }

  /**
   * Adiciona em lote.
   */
  static async addBatch(newItems, callback) {
    try {
      const courses = await this.loadItems();
      let addedCount = 0;
      let ignoredCount = 0;

      newItems.forEach((item) => {
        const exists = courses.some((c) => c.url === item.url);
        if (!exists) {
          courses.push({
            id: Date.now() + Math.random(),
            name: item.name,
            url: item.url,
            weeks: item.weeks || [],
            termName: item.termName || '',
          });
          addedCount++;
        } else {
          ignoredCount++;
        }
      });

      if (addedCount > 0) {
        await this.saveItems(courses);
      }

      if (callback) callback(addedCount, ignoredCount);
    } catch (error) {
      console.error(error);
      if (callback) callback(0, 0);
    }
  }

  static async clear(callback) {
    await this.saveItems([], callback);
  }

  static async delete(id, callback) {
    try {
      const courses = await this.loadItems();
      const newCourses = courses.filter((item) => item.id !== id);
      await this.saveItems(newCourses, callback);
    } catch (e) {
      console.error(e);
    }
  }

  static async update(id, updates, callback) {
    try {
      const courses = await this.loadItems();
      const index = courses.findIndex((c) => c.id === id);
      if (index !== -1) {
        courses[index] = { ...courses[index], ...updates };
        await this.saveItems(courses, callback);
      } else {
        console.warn(`Item com id ${id} não encontrado para atualização.`);
        if (callback) callback();
      }
    } catch (e) {
      console.error(e);
    }
  }
}
