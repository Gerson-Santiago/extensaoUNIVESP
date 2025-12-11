/**
 * Carrega a lista de matérias salvas do armazenamento.
 * @param {Function} callback - Função de retorno com a lista de cursos.
 */
export function loadItems(callback) {
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
export function saveItems(courses, callback) {
    chrome.storage.sync.set({ savedCourses: courses }, () => {
        if (callback) callback();
    });
}

/**
 * Adiciona uma nova matéria à lista.
 * @param {string} name - Nome da matéria.
 * @param {string} url - URL da matéria.
 * @param {Array} [weeks=[]] - Lista inicial de semanas.
 * @param {Function} [callback] - Função de retorno após salvar.
 */
export function addItem(name, url, weeks = [], callback) {
    loadItems((courses) => {
        courses.push({ id: Date.now(), name, url, weeks });
        saveItems(courses, callback);
    });
}

/**
 * Remove uma matéria pelo ID.
 * @param {number} id - ID da matéria a ser removida.
 * @param {Function} [callback] - Função de retorno após remover.
 */
export function deleteItem(id, callback) {
    loadItems((courses) => {
        const newCourses = courses.filter(item => item.id !== id);
        saveItems(newCourses, callback);
    });
}

/**
 * Atualiza propriedades de uma matéria específica.
 * @param {number} id - ID da matéria a ser atualizada.
 * @param {Object} updates - Objeto com as propriedades a serem atualizadas.
 * @param {Function} [callback] - Função de retorno após atualizar.
 */
export function updateItem(id, updates, callback) {
    loadItems((courses) => {
        const index = courses.findIndex(c => c.id === id);
        if (index !== -1) {
            courses[index] = { ...courses[index], ...updates };
            saveItems(courses, callback);
        } else {
            console.warn(`Item com id ${id} não encontrado para atualização.`);
            if (callback) callback();
        }
    });
}
