/**
 * @typedef {Object} WeekItem
 * @property {string} name - Nome do item
 * @property {string} url - URL do item
 * @property {string} type - Tipo do item (video, quiz, document, etc)
 * @property {'TODO'|'DOING'|'DONE'} [status] - Status da tarefa (opcional)
 */

/**
 * @typedef {Object} Week
 * @property {string} name - Nome da semana (ex: "Semana 1")
 * @property {string} [url] - URL da semana (opcional)
 * @property {string} [date] - Data/Período da semana
 * @property {WeekItem[]} [items] - Itens da semana
 */

export const WeekModel = {}; // Empty export to make it a module
