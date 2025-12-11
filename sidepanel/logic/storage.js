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
 * Evita duplicação verificando a URL.
 * @param {string} name - Nome da matéria.
 * @param {string} url - URL da matéria.
 * @param {Array} [weeks=[]] - Lista inicial de semanas.
 * @param {Function} [callback] - Função de retorno. Ex: (success, message) => {}
 */
export function addItem(name, url, weeks = [], callback) {
    loadItems((courses) => {
        // Normaliza a URL para comparação (opcional: remover query params se necessário, mas por enquanto exata)
        const exists = courses.some(c => c.url === url);

        if (exists) {
            console.warn(`Curso com URL já existe: ${url}`);
            if (callback) callback(false, 'Matéria já adicionada anteriormente.');
            return;
        }

        courses.push({ id: Date.now(), name, url, weeks });
        saveItems(courses, () => {
            if (callback) callback(true, 'Matéria adicionada com sucesso!');
        });
    });
}

/**
 * Adiciona múltiplas matérias de uma vez.
 * @param {Array} newItems - Lista de objetos {name, url, weeks}.
 * @param {Function} callback - Retorna (addedCount, totalIgnored).
 */
export function addItemsBatch(newItems, callback) {
    loadItems((courses) => {
        let addedCount = 0;
        let ignoredCount = 0;

        newItems.forEach(item => {
            const exists = courses.some(c => c.url === item.url);
            if (!exists) {
                courses.push({
                    id: Date.now() + Math.random(), // Ensure unique ID even in batch
                    name: item.name,
                    url: item.url,
                    weeks: item.weeks || []
                });
                addedCount++;
            } else {
                ignoredCount++;
            }
        });

        if (addedCount > 0) {
            saveItems(courses, () => {
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
export function clearItems(callback) {
    saveItems([], callback);
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
