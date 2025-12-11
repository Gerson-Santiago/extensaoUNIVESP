export function loadItems(callback) {
    chrome.storage.sync.get(['savedCourses'], (result) => {
        const courses = result.savedCourses || [];
        callback(courses);
    });
}

export function saveItems(courses, callback) {
    chrome.storage.sync.set({ savedCourses: courses }, () => {
        if (callback) callback();
    });
}

export function addItem(name, url, weeks = [], callback) {
    loadItems((courses) => {
        courses.push({ id: Date.now(), name, url, weeks });
        saveItems(courses, callback);
    });
}

export function deleteItem(id, callback) {
    loadItems((courses) => {
        const newCourses = courses.filter(item => item.id !== id);
        saveItems(newCourses, callback);
    });
}

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
