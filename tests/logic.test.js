import { scrapeWeeksFromTab } from '../sidepanel/logic/scraper.js';

// Mock de chrome global
global.chrome = {
    scripting: {
        executeScript: jest.fn()
    }
};

describe('Testes de Lógica - Scraper', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('scrapeWeeksFromTab deve chamar executeScript corretamente', async () => {
        // Mock do retorno do script injetado
        chrome.scripting.executeScript.mockResolvedValue([
            {
                result: {
                    weeks: [{ name: 'Semana 1', url: 'http://test.com/s1' }],
                    title: 'Curso Teste'
                }
            }
        ]);

        const result = await scrapeWeeksFromTab(123);

        expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
            target: { tabId: 123, allFrames: true },
            func: expect.any(Function)
        });

        expect(result).toEqual({
            weeks: [{ name: 'Semana 1', url: 'http://test.com/s1' }],
            title: 'Curso Teste'
        });
    });

    test('scrapeWeeksFromTab deve lidar com retorno vazio', async () => {
        chrome.scripting.executeScript.mockResolvedValue([]); // Retorno vazio/falha

        const result = await scrapeWeeksFromTab(123);

        expect(result).toEqual({ weeks: [], title: null });
    });
});
