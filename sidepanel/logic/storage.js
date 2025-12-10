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
