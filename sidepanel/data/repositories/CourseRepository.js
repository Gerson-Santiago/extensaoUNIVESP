/**
 * Repositório para gerenciar a persistência de cursos.
 * Abstrai o acesso ao chrome.storage.sync.
 */
export class CourseRepository {
  /**
   * Carrega a lista de matérias salvas do armazenamento.
   * @param {Function} callback - Função de retorno com a lista de cursos.
   */
  static loadItems(callback) {
    chrome.storage.sync.get(['savedCourses'], (result) => {
      const courses = result.savedCourses || [];
      callback(courses);
    });
  }

  /**
   * Salva a lista de matérias no armazenamento.
   * @param {Array} courses - Lista de objetos de cursos.
   * @param {Function} [callback] - Função opcional a ser chamada após salvar.
   */
  static saveItems(courses, callback) {
    chrome.storage.sync.set({ savedCourses: courses }, () => {
      if (callback) callback();
    });
  }

  /**
   * Adiciona uma nova matéria à lista.
   * Evita duplicação verificando a URL.
   * @param {string} name - Nome da matéria.
   * @param {string} url - URL da matéria.
   * @param {Array} [weeks=[]] - Lista inicial de semanas.
   * @param {Object|Function} [optionsOrCallback] - Objeto de opções OU callback.
   * @param {Function} [extraCallback] - Callback se o 4º argumento for options.
   */
  static add(name, url, weeks = [], optionsOrCallback, extraCallback) {
    let callback = optionsOrCallback;
    let termName = '';

    // Check if 4th arg is options object
    if (
      typeof optionsOrCallback === 'object' &&
      optionsOrCallback !== null &&
      !Array.isArray(optionsOrCallback)
    ) {
      termName = optionsOrCallback.termName || '';
      callback = extraCallback;
    }

    this.loadItems((courses) => {
      // Normaliza a URL para comparação
      const exists = courses.some((c) => c.url === url);

      if (exists) {
        console.warn(`Curso com URL já existe: ${url}`);
        if (callback) callback(false, 'Matéria já adicionada anteriormente.');
        return;
      }

      courses.push({ id: Date.now(), name, url, weeks, termName: termName });
      this.saveItems(courses, () => {
        if (callback) callback(true, 'Matéria adicionada com sucesso!');
      });
    });
  }

  /**
   * Adiciona múltiplas matérias de uma vez.
   * @param {Array} newItems - Lista de objetos {name, url, weeks, termName}.
   * @param {Function} callback - Retorna (addedCount, totalIgnored).
   */
  static addBatch(newItems, callback) {
    this.loadItems((courses) => {
      let addedCount = 0;
      let ignoredCount = 0;

      newItems.forEach((item) => {
        const exists = courses.some((c) => c.url === item.url);
        if (!exists) {
          courses.push({
            id: Date.now() + Math.random(), // Ensure unique ID even in batch
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
        this.saveItems(courses, () => {
          if (callback) callback(addedCount, ignoredCount);
        });
      } else {
        if (callback) callback(0, ignoredCount);
      }
    });
  }

  /**
   * Remove todas as matérias salvas.
   * @param {Function} [callback] - Função de retorno após limpar.
   */
  static clear(callback) {
    this.saveItems([], callback);
  }

  /**
   * Remove uma matéria pelo ID.
   * @param {number} id - ID da matéria a ser removida.
   * @param {Function} [callback] - Função de retorno após remover.
   */
  static delete(id, callback) {
    this.loadItems((courses) => {
      const newCourses = courses.filter((item) => item.id !== id);
      this.saveItems(newCourses, callback);
    });
  }

  /**
   * Atualiza propriedades de uma matéria específica.
   * @param {number} id - ID da matéria a ser atualizada.
   * @param {Object} updates - Objeto com as propriedades a serem atualizadas.
   * @param {Function} [callback] - Função de retorno após atualizar.
   */
  static update(id, updates, callback) {
    this.loadItems((courses) => {
      const index = courses.findIndex((c) => c.id === id);
      if (index !== -1) {
        courses[index] = { ...courses[index], ...updates };
        this.saveItems(courses, callback);
      } else {
        console.warn(`Item com id ${id} não encontrado para atualização.`);
        if (callback) callback();
      }
    });
  }
}
