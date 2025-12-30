/**
 * @file CourseStructure.js
 * @description Centraliza a lógica de identificação e ordenação de semanas e revisões.
 * //ISSUE-missing-revision-week
 * #STEP-1: Implemente a regex e a função de peso aqui.
 */

/**
 * Regex musculosa para identificar Semanas e Revisões.
 * Deve capturar: "Semana 1", "Semana 10", "Revisão", "Semana de Revisão".
 */
export const WEEK_IDENTIFIER_REGEX = /REPLACE_ME/;

/**
 * Atribui um peso numérico para ordenação.
 * @param {string} _name - Nome da semana ou revisão.
 * @returns {number} Peso para o Sort.
 */
export const getWeekWeight = (_name) => {
  // DICA: Se for revisão, retorne um peso alto (ex: 99)
  // Se for numérica, extraia o número.
  return 0; // TODO: Implementar lógica de pesos
};

/**
 * Ordena um array de semanas usando a lógica de pesos.
 * @param {Array} weeks - Array de objetos {name, url}.
 * @returns {Array} Array ordenado.
 */
export const sortWeeks = (weeks) => {
  return [...weeks].sort((a, b) => getWeekWeight(a.name) - getWeekWeight(b.name));
};
