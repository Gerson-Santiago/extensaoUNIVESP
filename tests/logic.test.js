import { scrapeWeeksFromTab } from '../sidepanel/logic/scraper.js';



describe('Testes de Lógica - Scraper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('scrapeWeeksFromTab deve chamar executeScript corretamente', async () => {
    // Mock do retorno do script injetado
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      {
        result: {
          weeks: [{ name: 'Semana 1', url: 'http://test.com/s1' }],
          title: 'Curso Teste',
        },
      },
    ]);

    const result = await scrapeWeeksFromTab(123);

    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId: 123, allFrames: true },
      func: expect.any(Function),
    });

    expect(result).toEqual({
      weeks: [{ name: 'Semana 1', url: 'http://test.com/s1' }],
      title: 'Curso Teste',
    });
  });

  test('scrapeWeeksFromTab deve lidar com retorno vazio', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([]); // Retorno vazio/falha

    const result = await scrapeWeeksFromTab(123);

    expect(result).toEqual({ weeks: [], title: null });
  });

  test('scrapeWeeksFromTab deve mesclar resultados de múltiplos frames', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      {
        result: {
          weeks: [{ name: 'Semana 1', url: 'http://test.com/s1' }],
          title: 'Curso Frame 1',
        },
      },
      {
        result: {
          weeks: [{ name: 'Semana 2', url: 'http://test.com/s2' }],
          title: null,
        },
      },
    ]);

    const result = await scrapeWeeksFromTab(123);

    expect(result.weeks).toHaveLength(2);
    expect(result.weeks[0].name).toBe('Semana 1');
    expect(result.weeks[1].name).toBe('Semana 2');
    expect(result.title).toBe('Curso Frame 1'); // Primeiro título encontrado
  });

  test('scrapeWeeksFromTab deve remover duplicatas baseado em URL', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      {
        result: {
          weeks: [
            { name: 'Semana 1', url: 'http://test.com/s1' },
            { name: 'Semana 1', url: 'http://test.com/s1' }, // Duplicata
            { name: 'Semana 2', url: 'http://test.com/s2' },
          ],
          title: 'Curso Teste',
        },
      },
    ]);

    const result = await scrapeWeeksFromTab(123);

    expect(result.weeks).toHaveLength(2);
    expect(result.weeks[0].url).toBe('http://test.com/s1');
    expect(result.weeks[1].url).toBe('http://test.com/s2');
  });

  test('scrapeWeeksFromTab deve ordenar semanas por número', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      {
        result: {
          weeks: [
            { name: 'Semana 10', url: 'http://test.com/s10' },
            { name: 'Semana 2', url: 'http://test.com/s2' },
            { name: 'Semana 1', url: 'http://test.com/s1' },
          ],
          title: 'Curso Teste',
        },
      },
    ]);

    const result = await scrapeWeeksFromTab(123);

    expect(result.weeks[0].name).toBe('Semana 1');
    expect(result.weeks[1].name).toBe('Semana 2');
    expect(result.weeks[2].name).toBe('Semana 10');
  });

  test('scrapeWeeksFromTab deve ignorar semanas sem URL', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      {
        result: {
          weeks: [
            { name: 'Semana 1', url: 'http://test.com/s1' },
            { name: 'Semana 2', url: null }, // Sem URL
            { name: 'Semana 3', url: '' }, // URL vazia
          ],
          title: 'Curso Teste',
        },
      },
    ]);

    const result = await scrapeWeeksFromTab(123);

    expect(result.weeks).toHaveLength(1);
    expect(result.weeks[0].name).toBe('Semana 1');
  });

  test('scrapeWeeksFromTab deve lidar com erro no executeScript', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockRejectedValue(new Error('Falha na injeção'));

    const result = await scrapeWeeksFromTab(123);

    expect(result).toEqual({ weeks: [], title: null });
  });

  test('scrapeWeeksFromTab deve lidar com result undefined', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      { result: undefined },
      { result: null },
    ]);

    const result = await scrapeWeeksFromTab(123);

    expect(result).toEqual({ weeks: [], title: null });
  });

  test('scrapeWeeksFromTab deve lidar com weeks não sendo array', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      {
        result: {
          weeks: 'não é um array',
          title: 'Curso Teste',
        },
      },
    ]);

    const result = await scrapeWeeksFromTab(123);

    expect(result.weeks).toEqual([]);
    expect(result.title).toBe('Curso Teste');
  });

  test('scrapeWeeksFromTab deve usar primeiro título não-null encontrado', async () => {
    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([
      {
        result: {
          weeks: [],
          title: null,
        },
      },
      {
        result: {
          weeks: [],
          title: 'Primeiro Título Válido',
        },
      },
      {
        result: {
          weeks: [],
          title: 'Segundo Título',
        },
      },
    ]);

    const result = await scrapeWeeksFromTab(123);

    expect(result.title).toBe('Primeiro Título Válido');
  });
});
