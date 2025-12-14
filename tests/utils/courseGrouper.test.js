import { groupCoursesByTerm } from '../../sidepanel/utils/courseGrouper.js';

describe('courseGrouper Utility', () => {
  test('Should group courses by term and sort groups descending', () => {
    const courses = [
      { name: 'Antigo', url: 'u1' },
      { name: '2024/1 - 1º Bimestre - Mat A', url: 'u2' },
      { name: '2025/2 - 4º Bimestre - Mat B', url: 'u3' },
      { name: '2025/2 - 4º Bimestre - Mat C', url: 'u4' },
      { name: '2025/1 - 1º Bimestre - Mat D', url: 'u5' },
    ];

    const groups = groupCoursesByTerm(courses);

    expect(groups).toHaveLength(4);

    // Check First Group (Newest)
    expect(groups[0].title).toContain('2025/2');
    expect(groups[0].courses).toHaveLength(2);

    // Check Second Group
    expect(groups[1].title).toContain('2025/1');

    // Check Last Group (Unknown term)
    expect(groups[3].title).toBe('Outros');
    expect(groups[3].courses).toHaveLength(1);
  });

  test('Should handle empty list', () => {
    const groups = groupCoursesByTerm([]);
    expect(groups).toEqual([]);
  });
});
