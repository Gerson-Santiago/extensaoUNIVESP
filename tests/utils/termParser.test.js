import { parseTerm } from '../../sidepanel/utils/termParser.js';

describe('termParser Utility', () => {
  test('Should parse standard name format "2025/2 - 4º Bimestre"', () => {
    const result = parseTerm('2025/2 - 4º Bimestre');
    expect(result).toEqual({
      year: 2025,
      semester: 2,
      term: 4,
      original: '2025/2 - 4º Bimestre',
      sortKey: 202524, // YYYY S T
    });
  });

  test('Should parse ID-like format "2026S1B2" inside a string', () => {
    const result = parseTerm('Custom Name 2026S1B2');
    expect(result.year).toBe(2026);
    expect(result.semester).toBe(1);
    expect(result.term).toBe(2);
  });

  test('Should return defaults for unknown format', () => {
    const result = parseTerm('Curso Extensão Generico');
    expect(result.year).toBe(0);
    expect(result.sortKey).toBe(0);
  });

  test('Should handle object input', () => {
    const result = parseTerm({ name: '2024/1 - 1º Bimestre' });
    expect(result.year).toBe(2024);
  });

  test('Should prioritize termName property if present', () => {
    const result = parseTerm({
      name: 'Matéria Genérica',
      termName: '2025/2 - 3º Bimestre',
    });
    expect(result.year).toBe(2025);
    expect(result.term).toBe(3);
  });
});
