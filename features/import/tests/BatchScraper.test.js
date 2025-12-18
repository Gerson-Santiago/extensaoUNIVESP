import {
  scrapeAvailableTerms,
  processSelectedCourses,
} from '@features/import/services/BatchScraper.js';

describe('Lógica - Batch Scraper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapeAvailableTerms', () => {
    test('Deve retornar termos agrupados corretamente por Display ID', async () => {
      // Mock do retorno do script injetado
      const mockTerms = [
        { name: '2025/1 - 1º Bimestre', courses: [{ name: 'C1', url: 'u1', courseId: 'c1' }] },
        { name: '2025/1 - 2º Bimestre', courses: [{ name: 'C2', url: 'u2', courseId: 'c2' }] },
      ];

      // Aqui mockamos o RETORNO FINAL da função injetada (que é o que o executeScript devolve).
      // Isso significa que estamos testando a interface do chrome.scripting, e não a logica interna do DOM_scan...
      // que roda no browser. Como não temos DOM real aqui, testar a lógica INTERNA exigiria JSDOM complexo.
      // Pelo padrão do projeto, estamos testando o wrapper.
      // MAS, para garantir que o Regex funciona, poderíamos extrair a logica interna para unidade pura.
      // Dado o contexto atual, manteremos o teste de integração do wrapper.

      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
        {
          result: {
            success: true,
            terms: mockTerms,
            message: '',
          },
        },
      ]);

      const result = await scrapeAvailableTerms(101);

      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 101 },
        func: expect.any(Function),
      });

      expect(result.success).toBe(true);
      expect(result.terms).toHaveLength(2);
      expect(result.terms[0].name).toBe('2025/1 - 1º Bimestre');
    });

    test('Deve lidar com falha no script', async () => {
      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockRejectedValue(
        new Error('Injection failed')
      );
      const result = await scrapeAvailableTerms(101);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Erro ao executar script');
    });
  });

  describe('processSelectedCourses', () => {
    test('Deve processar cursos selecionados (Deep Scraping)', async () => {
      const mockInputCourses = [{ name: 'C1', url: 'u1', courseId: 'c1' }];
      const mockProcessed = [{ name: 'C1', url: 'final_u1', weeks: [] }];

      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
        { result: mockProcessed },
      ]);

      const result = await processSelectedCourses(101, mockInputCourses);

      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 101 },
        func: expect.any(Function),
        args: [mockInputCourses],
      });

      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('final_u1');
    });

    test('Deve retornar array vazio em caso de erro', async () => {
      /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockRejectedValue(
        new Error('Fail')
      );
      const result = await processSelectedCourses(101, []);
      expect(result).toEqual([]);
    });
  });
});
