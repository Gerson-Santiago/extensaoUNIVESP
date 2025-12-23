/**
 * @file TaskCategorizer.js
 * @description Categoriza tarefas do AVA por tipo (Videoaula, Quiz, etc.)
 * @architecture Screaming Architecture - Logic Layer
 */

/**
 * @typedef {Object} CategorizedTask
 * @property {string} type - Tipo da tarefa (VIDEOAULA, QUIZ, etc.)
 * @property {number|null} number - Número da videoaula/quiz (se aplicável)
 * @property {string} id - ID único da tarefa
 * @property {Object} original - Dados originais da tarefa
 */

/**
 * Categoriza uma tarefa baseado no título
 * @param {Object} task - Tarefa com { name, title, id, ... }
 * @returns {CategorizedTask}
 */
export function categorizeTask(task) {
    // Aceita 'name' ou 'title' (compatibilidade com diferentes fontes)
    const text = task.name || task.title || '';

    // Validação básica
    if (!text) {
        console.warn('[TaskCategorizer] Task sem name/title:', task);
        return {
            type: 'OUTROS',
            number: null,
            id: task.id || 'unknown',
            original: task,
        };
    }

    // Regex patterns para cada tipo (ordem IMPORTA! Mais específico primeiro)
    const patterns = {
        QUIZ: /Quiz\s+da\s+Videoaula\s+(\d+)/i, // Deve vir ANTES de VIDEOAULA
        VIDEOAULA: /Videoaula\s+(\d+)/i,
        VIDEO_BASE: /Video-base/i,
        TEXTO_BASE: /Texto-base/i,
        APROFUNDANDO: /Aprofundando\s+o\s+Tema/i,
    };

    // Tenta encontrar match para cada padrão
    for (const [type, pattern] of Object.entries(patterns)) {
        const match = text.match(pattern);
        if (match) {
            return {
                type,
                number: match[1] ? parseInt(match[1], 10) : null,
                id: task.id || 'unknown',
                original: task,
            };
        }
    }

    // Fallback: OUTROS
    return {
        type: 'OUTROS',
        number: null,
        id: task.id || 'unknown',
        original: task,
    };
}
