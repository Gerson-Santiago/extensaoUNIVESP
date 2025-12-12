import { scrapeCourseList } from '../sidepanel/logic/batchScraper.js';



describe('Lógica - Batch Scraper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve realizar a extração correta da lista de cursos', async () => {
    // Mock the return value of the injected script
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
    {
      result: {
        success: true,
        courses: [
          { name: 'Curso 1', url: 'https://ava.univesp.br/ultra/course/_123_1' },
          { name: 'Curso 2', url: 'https://ava.univesp.br/ultra/course/_456_1' },
        ],
        message: 'Encontrados 2 cursos.',
      },
    },
  ]);

    const result = await scrapeCourseList(101, 3);

    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId: 101 },
      func: expect.any(Function), // We can't easily test the injected function body here without more complex setup
      args: [3],
    });

    expect(result.success).toBe(true);
    expect(result.courses).toHaveLength(2);
    expect(result.courses[0].name).toBe('Curso 1');
  });

  test('Deve lidar com falha na execução do script', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockRejectedValue(new Error('Injection failed'));

    const result = await scrapeCourseList(101);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Erro ao executar script');
  });

  test('Deve lidar com resultado vazio ou inválido do script', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([]); // Empty array

    const result = await scrapeCourseList(101);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Falha na comunicação com a página.');
  });
});
