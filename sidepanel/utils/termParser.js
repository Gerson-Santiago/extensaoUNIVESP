/**
 * Analisa uma string (nome do curso/termo) ou objeto e extrai ano, semestre e bimestre.
 *
 * Padrões suportados:
 * - "2025/2 - 4º Bimestre"
 * - ID-like: "2025S2B2"
 *
 * @param {string|Object} input - String ou objeto com propriedade name/title
 * @returns {Object} { year, semester, term, sortKey, original }
 */
export function parseTerm(input) {
  let text = '';
  if (typeof input === 'string') {
    text = input;
  } else if (input && typeof input === 'object') {
    // Prioritize explicit term metadata if saved
    text = input.termName || input.groupTitle || input.name || input.title || '';
  }

  const result = {
    year: 0,
    semester: 0,
    term: 0,
    sortKey: 0,
    original: text,
  };

  // Tenta encontrar Ano
  const yearMatch = text.match(/(\d{4})/);
  if (yearMatch) {
    result.year = parseInt(yearMatch[1], 10);
  }

  // Tenta encontrar Semestre (ex: /2 ou S2)
  const semMatch = text.match(/\/(\d)|S(\d)/i);
  if (semMatch) {
    // match[1] é para /d, match[2] é para Sd
    result.semester = parseInt(semMatch[1] || semMatch[2], 10);
  }

  // Tenta encontrar Bimestre (ex: 4º ou B4)
  const termMatch = text.match(/(\d)º|B(\d)/i);
  if (termMatch) {
    result.term = parseInt(termMatch[1] || termMatch[2], 10);
  }

  // Calcula Sort Key (YYYY + S + T) -> Ex: 202524
  if (result.year > 0) {
    result.sortKey = parseInt(`${result.year}${result.semester}${result.term}`);
  }

  return result;
}
