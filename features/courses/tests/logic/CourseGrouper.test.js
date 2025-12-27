import { groupCoursesByTerm } from '@features/courses/logic/CourseGrouper.js';

describe('Utilitário CourseGrouper', () => {
  test('Deve agrupar cursos por período letivo e ordenar grupos decrescente', () => {
    // Arrange
    const courses = [
      { name: 'Antigo', url: 'u1' },
      { name: '2024/1 - 1º Bimestre - Mat A', url: 'u2' },
      { name: '2025/2 - 4º Bimestre - Mat B', url: 'u3' },
      { name: '2025/2 - 4º Bimestre - Mat C', url: 'u4' },
      { name: '2025/1 - 1º Bimestre - Mat D', url: 'u5' },
    ];

    // Act
    const groups = groupCoursesByTerm(courses);

    // Assert
    expect(groups).toHaveLength(4);

    // Verificar Primeiro Grupo (Mais recente)
    expect(groups[0].title).toContain('2025/2');
    expect(groups[0].courses).toHaveLength(2);

    // Verificar Segundo Grupo
    expect(groups[1].title).toContain('2025/1');

    // Verificar Último Grupo (Termo desconhecido)
    expect(groups[3].title).toBe('Outros');
    expect(groups[3].courses).toHaveLength(1);
  });

  test('Deve lidar com lista vazia', () => {
    // Arrange
    const courses = [];

    // Act
    const groups = groupCoursesByTerm(courses);

    // Assert
    expect(groups).toEqual([]);
  });
});
