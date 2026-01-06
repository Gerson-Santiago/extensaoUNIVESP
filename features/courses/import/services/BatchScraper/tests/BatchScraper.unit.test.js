import {
  parseCourseTerm,
  extractWeeksFromHTML,
  DOM_scanTermsAndCourses_Injected,
} from '../index.js';
import { WEEK_IDENTIFIER_REGEX } from '@features/courses/logic/CourseStructure.js';

describe('BatchScraper Logic', () => {
  const mockRegex = WEEK_IDENTIFIER_REGEX.source;
  const baseUrl = 'https://ava.univesp.br';

  describe('parseCourseTerm', () => {
    it('deve parsear corretamente bimestres do primeiro semestre', () => {
      const input = 'ADM001-2025S1B1-T001';
      const result = parseCourseTerm(input);
      expect(result.termKey).toBe('2025/1 - 1º Bimestre');
      expect(result.sortOrder).toBe(202511);
    });

    it('deve parsear corretamente bimestres do segundo semestre (B1 -> 3º Bimestre)', () => {
      const input = 'MAT002-2024S2B1-T999';
      const result = parseCourseTerm(input);
      expect(result.termKey).toBe('2024/2 - 3º Bimestre');
      expect(result.sortOrder).toBe(202421);
    });

    it('deve retornar "Outros Cursos" para formatos inválidos', () => {
      const result = parseCourseTerm('INVALIDO-123');
      expect(result.termKey).toBe('Outros Cursos');
      expect(result.sortOrder).toBe(0);
    });
  });

  describe('extractWeeksFromHTML', () => {
    it('deve extrair semanas e revisões corretamente', () => {
      // Arrange
      const parser = new DOMParser();
      const html = `
                <div>
                    <a href="/content/1">Semana 1</a>
                    <a href="/content/10">Semana 10</a>
                    <a href="/content/99">Revisão</a>
                </div>
            `;
      const doc = parser.parseFromString(html, 'text/html');

      // Act
      const weeks = extractWeeksFromHTML(doc, baseUrl, mockRegex);

      // Assert
      expect(weeks).toHaveLength(3);
      expect(weeks[0].name).toBe('Semana 1');
      expect(weeks[1].name).toBe('Semana 10');
      expect(weeks[2].name).toBe('Revisão');
    });
  });

  describe('DOM_scanTermsAndCourses_Injected', () => {
    it('deve retornar mensagem de erro se não estiver na página correta', async () => {
      // @ts-ignore - Mock para teste
      delete window.location;
      // @ts-ignore - Mock para teste
      window.location = { href: 'https://google.com' };
      const result = await DOM_scanTermsAndCourses_Injected();
      expect(result.success).toBe(false);
      expect(result.message).toContain('acesse a página de Cursos');
    });

    it('deve retornar erro quando não há cursos na página', async () => {
      // Arrange
      // @ts-ignore - Mock para teste
      delete window.location;
      // @ts-ignore - Mock para teste
      window.location = {
        href: 'https://ava.univesp.br/ultra/course',
        origin: 'https://ava.univesp.br',
      };

      // Página com estrutura correta mas sem cursos
      document.body.innerHTML = `
                <div id="courses-overview-content">
                    <div id="main-content-inner"></div>
                </div>
            `;

      // Act
      const result = await DOM_scanTermsAndCourses_Injected();

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('Nenhum curso encontrado');
    });
  });
});
