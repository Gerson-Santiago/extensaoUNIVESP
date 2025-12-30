import { ScraperService } from '../../../../../features/courses/services/ScraperService.js';
// #STEP-2: Importe { WEEK_IDENTIFIER_REGEX, getWeekWeight } de CourseStructure aqui para o teste ser real!
// //ISSUE-missing-revision-week

/**
 * TESTE DE REGRESSÃO: ISSUE-missing-revision-week
 * Objetivo: Garantir que a "Semana de Revisão" seja capturada e ordenada corretamente ao final.
 */
describe.skip('ScraperService - Lógica de Semanas', () => {
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

      // Simulamos a lógica que deveria estar no scrapeWeeksFromTab
      // Atualmente o código faz: uniqueWeeks.sort((a, b) => parseInt(a.name.replace(/\D/g, '')) - parseInt(b.name.replace(/\D/g, '')))

      const sorted = [...rawWeeks].sort((a, b) => {
        // ESSA É A LÓGICA QUE O ALUNO DEVE MELHORAR
        // Por enquanto, vamos replicar a lógica ATUAL para provar que ela FALHA
        const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
        return numA - numB;
      });

      const names = sorted.map((w) => w.name);

      // O objetivo é que 'Revisão' e 'Semana de Revisão' fiquem por último.
      // Na lógica ATUAL (falha), 'Revisão' (NaN -> 0) ficaria no início.
      expect(names[names.length - 1]).toMatch(/Revisão/i);
      expect(names[0]).toBe('Semana 1');
    });
  });
});
