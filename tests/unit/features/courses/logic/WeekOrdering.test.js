import { ScraperService } from '../../../../../features/courses/services/ScraperService.js';
import { sortWeeks } from '../../../../../shared/logic/CourseStructure.js';

/**
 * Teste de regressão: Validação de captura e ordenação de semanas incluindo "Semana de Revisão".
 */
describe('ScraperService - Lógica de Semanas', () => {
  describe('Extração via DOM (extractWeeksFromDoc)', () => {
    it('deve capturar semanas numéricas e também a "Semana de Revisão"', () => {
      const html = `
        <div>
          <a href="/week1">Semana 1</a>
          <a href="/week8">Semana 8</a>
          <a href="/revisao">Semana de Revisão</a>
          <a href="/revisao2">Revisão</a>
        </div>
      `;
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const { weeks } = ScraperService.extractWeeksFromDoc(doc, 'https://ava.univesp.br');

      const names = weeks.map((w) => w.name);
      expect(names).toContain('Semana 1');
      expect(names).toContain('Semana 8');
      expect(names).toContain('Semana de Revisão');
      expect(names).toContain('Revisão');
    });
  });

  describe('Ordenação de Semanas', () => {
    // Nota: Como o ScraperService.scrapeWeeksFromTab é assíncrono e usa chrome.scripting,
    // vamos testar a lógica de ordenação simulando o comportamento interno.

    it('deve ordenar semanas numericamente e colocar "Revisão" ao final', () => {
      // Mock de dados brutos que viriam do scraper
      const rawWeeks = [
        { name: 'Semana 10', url: 'u10' },
        { name: 'Semana 1', url: 'u1' },
        { name: 'Revisão', url: 'ur' },
        { name: 'Semana 2', url: 'u2' },
        { name: 'Semana de Revisão', url: 'ur2' },
      ];

      // Usar a função sortWeeks() centralizada
      const sorted = sortWeeks([...rawWeeks]);

      const names = sorted.map((w) => w.name);

      // O objetivo é que 'Revisão' e 'Semana de Revisão' fiquem por último.
      // Na lógica ATUAL (falha), 'Revisão' (NaN -> 0) ficaria no início.
      expect(names[names.length - 1]).toMatch(/Revisão/i);
      expect(names[0]).toBe('Semana 1');
    });

    it('deve manter "Revisão" sempre ao final mesmo em diferentes ordens', () => {
      const testCases = [
        // Caso 1: Revisão no início
        [
          { name: 'Revisão', url: 'ur' },
          { name: 'Semana 1', url: 'u1' },
          { name: 'Semana 2', url: 'u2' },
        ],
        // Caso 2: Revisão no meio
        [
          { name: 'Semana 1', url: 'u1' },
          { name: 'Revisão', url: 'ur' },
          { name: 'Semana 2', url: 'u2' },
        ],
        // Caso 3: Revisão já no final
        [
          { name: 'Semana 1', url: 'u1' },
          { name: 'Semana 2', url: 'u2' },
          { name: 'Revisão', url: 'ur' },
        ],
      ];

      testCases.forEach((weekList) => {
        const sorted = sortWeeks([...weekList]);
        expect(sorted[sorted.length - 1].name).toBe('Revisão');
        expect(sorted[0].name).toBe('Semana 1');
      });
    });
  });
});
