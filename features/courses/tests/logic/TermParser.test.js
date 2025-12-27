import { parseTerm } from '@features/courses/logic/TermParser.js';

describe('Utilitário termParser', () => {
  test('Deve interpretar formato padrão "2025/2 - 4º Bimestre"', () => {
    // Act
    const result = parseTerm('2025/2 - 4º Bimestre');

    // Assert
    expect(result).toEqual({
      year: 2025,
      semester: 2,
      term: 4,
      original: '2025/2 - 4º Bimestre',
      sortKey: 202524, // YYYY S T
    });
  });

  test('Deve interpretar formato tipo ID "2026S1B2" dentro de uma string', () => {
    // Act
    const result = parseTerm('Custom Name 2026S1B2');

    // Assert
    expect(result.year).toBe(2026);
    expect(result.semester).toBe(1);
    expect(result.term).toBe(2);
  });

  test('Deve retornar padrões para formato desconhecido', () => {
    // Act
    const result = parseTerm('Curso Extensão Generico');

    // Assert
    expect(result.year).toBe(0);
    expect(result.sortKey).toBe(0);
  });

  test('Deve lidar com entrada de objeto', () => {
    // Act
    const result = parseTerm({ name: '2024/1 - 1º Bimestre' });

    // Assert
    expect(result.year).toBe(2024);
  });

  test('Deve priorizar propriedade termName se presente', () => {
    // Act
    const result = parseTerm({
      name: 'Matéria Genérica',
      termName: '2025/2 - 3º Bimestre',
    });

    // Assert
    expect(result.year).toBe(2025);
    expect(result.term).toBe(3);
  });
});
