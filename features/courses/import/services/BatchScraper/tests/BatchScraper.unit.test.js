import {
  parseCourseTerm,
  extractWeeksFromHTML,
  DOM_scanTermsAndCourses_Injected,
  DOM_deepScrapeSelected_Injected,
} from '../index.js';
import { WEEK_IDENTIFIER_REGEX } from '@features/courses/logic/CourseStructure.js';

describe('BatchScraper Logic', () => {
  const mockRegex = WEEK_IDENTIFIER_REGEX.source;
  const baseUrl = 'https://ava.univesp.br';

  beforeAll(() => {
    // Mock global para JSDOM que não implementa scrollTo
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

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
      const mockLocation = { href: 'https://google.com', origin: 'https://google.com' };

      // @ts-ignore
      const result = await DOM_scanTermsAndCourses_Injected(mockLocation);
      expect(result.success).toBe(false);
      expect(result.message).toContain('acesse a página de Cursos');
    });

    it('deve retornar erro quando não há cursos na página', async () => {
      const mockLocation = {
        href: 'https://ava.univesp.br/ultra/course',
        origin: 'https://ava.univesp.br',
      };

      // Página com estrutura correta mas sem cursos
      document.body.innerHTML = `
                <div id="courses-overview-content">
                    <div id="main-content-inner"></div>
                </div>
            `;

      // @ts-ignore
      const result = await DOM_scanTermsAndCourses_Injected(mockLocation);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Nenhum curso encontrado');
    });
  });

  describe('DOM_deepScrapeSelected_Injected', () => {
    // Mock do fetch global
    global.fetch = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve extrair semanas corretamente quando encontrar link de Página Inicial', async () => {
      // Arrange
      const coursesToScrape = [{ courseId: '_123_1', name: 'Curso Teste', url: 'original_url' }];
      const mockLocation = {
        href: 'https://ava.univesp.br/ultra/course',
        origin: 'https://ava.univesp.br',
      };

      const mockLauncherHTML = `
        <html>
          <body>
            <a href="/webapps/blackboard/content/listContent.jsp?course_id=_123_1&content_id=_456_1">
              <span title="Página Inicial">Página Inicial</span>
            </a>
          </body>
        </html>
      `;

      const mockContentHTML = `
        <html>
          <body>
            <a href="/content/_week1">Semana 1</a>
            <a href="/content/_week2">Semana 2</a>
          </body>
        </html>
      `;

      /** @type {any} */ (fetch)
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockLauncherHTML),
        })
        .mockResolvedValueOnce({
          text: () => Promise.resolve(mockContentHTML),
        });

      const results = await DOM_deepScrapeSelected_Injected(
        coursesToScrape,
        mockRegex,
        // @ts-expect-error - Mock parcial de Location (apenas href e origin necessários)
        mockLocation
      );

      expect(results).toHaveLength(1);
      expect(results[0].weeks).toHaveLength(2);
      expect(results[0].weeks[0].name).toBe('Semana 1');
      expect(results[0].weeks[1].name).toBe('Semana 2');
      expect(results[0].url).toContain('listContent.jsp');
    });

    it('deve lidar com erro no fetch graciosamente', async () => {
      const coursesToScrape = [{ courseId: '_999_1', name: 'Curso Falha', url: 'original' }];
      const mockLocation = {
        href: 'https://ava.univesp.br/ultra/course',
        origin: 'https://ava.univesp.br',
      };

      // @ts-expect-error - Mock de fetch
      fetch.mockRejectedValue(new Error('Network Error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const results = await DOM_deepScrapeSelected_Injected(
        coursesToScrape,
        mockRegex,
        // @ts-expect-error - Mock parcial de Location (apenas href e origin necessários)
        mockLocation
      );

      expect(results).toHaveLength(0);

      consoleSpy.mockRestore();
    });

    it('deve retornar semanas vazio se não encontrar link de Página Inicial', async () => {
      const coursesToScrape = [{ courseId: '_888_1', name: 'Curso Sem Link', url: 'original' }];
      const mockLocation = {
        href: 'https://ava.univesp.br/ultra/course',
        origin: 'https://ava.univesp.br',
      };

      const mockNoLinkHTML = `
        <html><body><span>Apenas texto</span></body></html>
      `;

      // @ts-expect-error - Mock de fetch
      fetch.mockResolvedValueOnce({
        text: () => Promise.resolve(mockNoLinkHTML),
      });

      const results = await DOM_deepScrapeSelected_Injected(
        coursesToScrape,
        mockRegex,
        // @ts-expect-error - Mock parcial de Location (apenas href e origin necessários)
        mockLocation
      );

      expect(results).toHaveLength(1);
      expect(results[0].weeks).toHaveLength(0);
      expect(results[0].url).toBe('original');
    });
  });
});
