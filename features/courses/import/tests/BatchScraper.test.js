import {
  scrapeAvailableTerms,
  processSelectedCourses,
} from '@features/courses/import/services/BatchScraper/index.js';

describe('Lógica - Batch Scraper', () => {
  beforeEach(() => {
    // Arrange
    jest.clearAllMocks();
  });

  describe('scrapeAvailableTerms', () => {
    test('Deve retornar termos agrupados corretamente por Display ID', async () => {
      // Arrange
      const mockTerms = [
        { name: '2025/1 - 1º Bimestre', courses: [{ name: 'C1', url: 'u1', courseId: 'c1' }] },
        { name: '2025/1 - 2º Bimestre', courses: [{ name: 'C2', url: 'u2', courseId: 'c2' }] },
      ];

      // Aqui mockamos o RETORNO FINAL da função injetada (que é o que o executeScript devolve).
      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
        {
          result: {
            success: true,
            terms: mockTerms,
            message: '',
          },
        },
      ]);

      // Act
      const result = await scrapeAvailableTerms(101);

      // Assert
      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 101 },
        func: expect.any(Function),
      });

      expect(result.success).toBe(true);
      expect(result.terms).toHaveLength(2);
      expect(result.terms[0].name).toBe('2025/1 - 1º Bimestre');
    });

    test('Deve lidar com falha no script', async () => {
      // Arrange
      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockRejectedValue(
        new Error('Injection failed')
      );

      // Act
      const result = await scrapeAvailableTerms(101);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('Erro ao executar script');
    });
  });

  describe('processSelectedCourses', () => {
    test('Deve processar cursos selecionados (Deep Scraping)', async () => {
      // Arrange
      const mockInputCourses = [{ name: 'C1', url: 'u1', courseId: 'c1' }];
      const mockProcessed = [{ name: 'C1', url: 'final_u1', weeks: [] }];

      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
        { result: mockProcessed },
      ]);

      // Act
      const result = await processSelectedCourses(101, mockInputCourses);

      // Assert
      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 101 },
        func: expect.any(Function),
        args: [mockInputCourses, expect.any(String)],
      });

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('final_u1');
    });

    test('Deve retornar array vazio em caso de erro', async () => {
      // Arrange
      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockRejectedValue(
        new Error('Fail')
      );

      // Act
      const result = await processSelectedCourses(101, []);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
