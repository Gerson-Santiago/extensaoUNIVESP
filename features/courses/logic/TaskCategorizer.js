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
 * @param {Object} task - Tarefa com { title, id, ... }
 * @returns {CategorizedTask}
 */
export function categorizeTask(task) {
    const { title } = task;

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
        const match = title.match(pattern);
        if (match) {
            return {
                type,
                number: match[1] ? parseInt(match[1], 10) : null,
                id: task.id,
                original: task,
            };
        }
    }

    // Fallback: OUTROS
    return {
        type: 'OUTROS',
        number: null,
        id: task.id,
        original: task,
    };
}
