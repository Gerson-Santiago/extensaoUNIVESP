// Import removed as it is only used in typedef

/**
 * @typedef {import('./Week.js').Week} Week
 */

/**
 * @typedef {Object} Course
 * @property {number} id - Identificador único (timestamp ou random)
 * @property {string} name - Nome da matéria
 * @property {string} url - URL principal da matéria no AVA
 * @property {string} [termName] - Nome do período (ex: "Bimestre 1")
 * @property {Week[]} [weeks] - Lista de semanas de conteúdo
 */

export const CourseModel = {};
