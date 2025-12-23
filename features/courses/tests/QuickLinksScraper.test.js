/**
 * @file QuickLinksScraper.test.js
 * @description Testes para scraper alternativo usando modal "Links Rápidos"
 */

import { QuickLinksScraper } from '../services/QuickLinksScraper.js';

describe('QuickLinksScraper', () => {
  let mockChrome;

  beforeEach(() => {
    // Mock global chrome API
    mockChrome = {
      tabs: {
        query: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
      },
      scripting: {
        executeScript: jest.fn(),
      },
    };
    // @ts-ignore - Mock parcial para testes
    global.chrome = mockChrome;
  });

  afterEach(() => {
    delete global.chrome;
  });

  describe('extractFromModal', () => {
    it('should extract items from quick links modal DOM', () => {
      // Setup DOM
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#" onclick="quickLinks.messageHelper.activateElement('7722825', 'elem1', 'https://ava.univesp.br', true)">
              Videoaula 1 - Inglês sem mistério
            </a>
          </li>
          <li class="quick_links_header_h3">
            <a href="#" onclick="quickLinks.messageHelper.activateElement('7722826', 'elem2', 'https://ava.univesp.br', true)">
              Semana 1 - Quiz da Videoaula 1
            </a>
          </li>
          <li class="quick_links_header_h3">
            <a href="#" onclick="quickLinks.messageHelper.activateElement('7722827', 'elem3', 'https://ava.univesp.br', true)">
              Texto-base - How technology has revolutionized
            </a>
          </li>
        </ul>
      `;

      const items = QuickLinksScraper.extractFromModal();

      expect(items).toHaveLength(3);
      expect(items[0].name).toBe('Videoaula 1 - Inglês sem mistério');
      expect(items[1].name).toBe('Semana 1 - Quiz da Videoaula 1');
      expect(items[2].name).toBe('Texto-base - How technology has revolutionized');
    });

    it('should handle empty modal gracefully', () => {
      document.body.innerHTML = '<ul></ul>';

      const items = QuickLinksScraper.extractFromModal();

      expect(items).toEqual([]);
    });

    it('should clean whitespace from item names', () => {
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#">
              
              
                 Videoaula 1   - Inglês    sem mistério
              
            </a>
          </li>
        </ul>
      `;

      const items = QuickLinksScraper.extractFromModal();

      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Videoaula 1 - Inglês sem mistério');
      // Verifica que não tem espaços duplos ou quebras de linha
      expect(items[0].name).not.toMatch(/\s{2,}/);
    });

    it('should extract ID from onclick attribute', () => {
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#" onclick="quickLinks.messageHelper.activateElement(&quot;7722825&quot;, &quot;anonymous_element_9&quot;, &quot;https://ava.univesp.br&quot;, true)">
              Videoaula 1
            </a>
          </li>
        </ul>
      `;

      const items = QuickLinksScraper.extractFromModal();

      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('anonymous_element_9'); // Extrai 2º parâmetro (elementId), não 1º (frameId)
    });

    it('should handle links without onclick gracefully', () => {
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#">Atividade sem onclick</a>
          </li>
        </ul>
      `;

      const items = QuickLinksScraper.extractFromModal();

      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Atividade sem onclick');
      expect(items[0].id).toBeNull();
    });

    it('should set default type as document', () => {
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#">Videoaula 1</a>
          </li>
        </ul>
      `;

      const items = QuickLinksScraper.extractFromModal();

      expect(items[0].type).toBe('document');
    });
  });

  describe('scrapeFromQuickLinks', () => {
    it('should find AVA tab and execute scraping', async () => {
      const mockTab = {
        id: 123,
        url: 'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1',
      };

      mockChrome.tabs.query.mockResolvedValue([mockTab]);
      mockChrome.scripting.executeScript.mockResolvedValue([
        {
          result: [
            { name: 'Videoaula 1', id: '7722825', type: 'document' },
            { name: 'Quiz 1', id: '7722826', type: 'document' },
          ],
        },
      ]);

      const items = await QuickLinksScraper.scrapeFromQuickLinks(
        'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_15307_1&content_id=_1763491_1'
      );

      expect(mockChrome.tabs.query).toHaveBeenCalledWith({
        url: '*://ava.univesp.br/*',
      });
      expect(items).toHaveLength(2);
      expect(items[0].name).toBe('Videoaula 1');
    });

    it('should throw error if no AVA tab found', async () => {
      mockChrome.tabs.query.mockResolvedValue([]);

      await expect(
        QuickLinksScraper.scrapeFromQuickLinks('https://example.com')
      ).rejects.toThrow('Nenhuma aba do AVA encontrada');
    });

    it('should return empty array if modal returns no items', async () => {
      const mockTab = { id: 123, url: 'https://ava.univesp.br/' };
      mockChrome.tabs.query.mockResolvedValue([mockTab]);
      mockChrome.scripting.executeScript.mockResolvedValue([{ result: [] }]);

      const items = await QuickLinksScraper.scrapeFromQuickLinks('https://ava.univesp.br/');

      expect(items).toEqual([]);
    });
  });
});
