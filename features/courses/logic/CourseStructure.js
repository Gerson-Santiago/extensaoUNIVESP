/**
 * @file CourseStructure.js
 * @description Centraliza a lógica de identificação e ordenação de semanas e revisões.
 */

/**
 * Regex para identificar semanas e revisões.
 * Captura: "Semana 1", "Semana 10", "Revisão", "Semana de Revisão".
 */
export const WEEK_IDENTIFIER_REGEX = /^(Semana\s+(\d{1,2})|Semana\s+de\s+Revisão|Revisão)$/i;

/**
 * Extrai número da semana ou retorna 999 para "Revisão".
 * @param {string} weekName - Nome da semana ou revisão.
 * @returns {number} Peso numérico para ordenação.
 */
function getWeekNumber(weekName) {
  if (/revisão/i.test(weekName)) {
    return 999; // Revisão sempre por último
  }

  const match = weekName.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Ordena array de semanas usando a lógica de pesos.
 * @param {Array} weeks - Array de objetos {name, url}.
 * @returns {Array} Array ordenado.
 */

export function sortWeeks(weeks) {
  return weeks.sort((a, b) => {
    const numA = getWeekNumber(a.name);
    const numB = getWeekNumber(b.name);
    return numA - numB;
  });
}
