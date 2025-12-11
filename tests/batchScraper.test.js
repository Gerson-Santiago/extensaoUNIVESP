import { scanAvailableTerms } from '../sidepanel/logic/batchScraper.js';

// Mock de chrome global
global.chrome = {
    scripting: {
        executeScript: jest.fn()
    }
};

describe('Testes de Lógica - Batch Scraper', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('scanAvailableTerms deve retornar termos quando executeScript tem sucesso', async () => {
        // Mock do retorno estruturado
        const mockTerms = [
            {
                termName: '2025/2 - 4º Bimestre',
                courses: [
                    { name: 'Matéria 1', url: 'http://ava/c1' },
                    { name: 'Matéria 2', url: 'http://ava/c2' }
                ]
            }
        ];

        chrome.scripting.executeScript.mockResolvedValue([
            {
                result: { terms: mockTerms }
            }
        ]);

        const tabId = 999;
        const result = await scanAvailableTerms(tabId);

        // Verifica se chamou o script corretamente
        expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
            target: { tabId: tabId },
            func: expect.any(Function)
        });

        // Verifica o retorno
        expect(result).toEqual({ terms: mockTerms });
    });

    test('scanAvailableTerms deve retornar erro quando o script injetado retorna erro', async () => {
        chrome.scripting.executeScript.mockResolvedValue([
            {
                result: { error: 'Você precisa estar na página de Cursos.' }
            }
        ]);

        const result = await scanAvailableTerms(999);
        expect(result.error).toBe('Você precisa estar na página de Cursos.');
    });

    test('scanAvailableTerms deve tratar falha de execução (exception)', async () => {
        chrome.scripting.executeScript.mockRejectedValue(new Error('Falha de conexão'));

        const result = await scanAvailableTerms(999);
        expect(result.error).toContain('Erro interno ao executar script');
    });

    test('scanAvailableTerms deve tratar retorno vazio/nulo', async () => {
        chrome.scripting.executeScript.mockResolvedValue([]);

        const result = await scanAvailableTerms(999);
        expect(result.error).toBe('Falha ao comunicar com a página.');
    });
});
