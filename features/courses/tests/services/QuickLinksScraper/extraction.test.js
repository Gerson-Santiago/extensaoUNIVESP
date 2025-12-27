/**
 * @file extraction.test.js
 * @description Testes para extração de dados do modal "Links Rápidos"
 */

import { QuickLinksScraper } from '../../../services/QuickLinksScraper.js';

describe('QuickLinksScraper - Extração', () => {
  describe('extractFromModal', () => {
    it('deve extrair itens do DOM do modal de links rápidos corretamente', () => {
      // Preparar (Arrange) - Mock DOM
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

      // Agir (Act)
      const items = QuickLinksScraper.extractFromModal();

      // Verificar (Assert)
      expect(items).toHaveLength(3);
      expect(items[0].name).toBe('Videoaula 1 - Inglês sem mistério');
      expect(items[1].name).toBe('Semana 1 - Quiz da Videoaula 1');
      expect(items[2].name).toBe('Texto-base - How technology has revolutionized');
    });

    it('deve lidar graciosamente com modal vazio', () => {
      // Preparar (Arrange)
      document.body.innerHTML = '<ul></ul>';

      // Agir (Act)
      const items = QuickLinksScraper.extractFromModal();

      // Verificar (Assert)
      expect(items).toEqual([]);
    });

    it('deve limpar espaços em branco dos nomes dos itens', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#">
              
              
                  Videoaula 1   - Inglês    sem mistério
              
            </a>
          </li>
        </ul>
      `;

      // Agir (Act)
      const items = QuickLinksScraper.extractFromModal();

      // Verificar (Assert)
      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Videoaula 1 - Inglês sem mistério');
      expect(items[0].name).not.toMatch(/\s{2,}/); // Garante ausência de espaços duplos
    });

    it('deve extrair o ID do atributo onclick', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#" onclick="quickLinks.messageHelper.activateElement(&quot;7722825&quot;, &quot;anonymous_element_9&quot;, &quot;https://ava.univesp.br&quot;, true)">
              Videoaula 1
            </a>
          </li>
        </ul>
      `;

      // Agir (Act)
      const items = QuickLinksScraper.extractFromModal();

      // Verificar (Assert)
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('anonymous_element_9'); // Extrai o 2º parâmetro (elementId)
    });

    it('deve lidar graciosamente com links sem onclick', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#">Atividade sem onclick</a>
          </li>
        </ul>
      `;

      // Agir (Act)
      const items = QuickLinksScraper.extractFromModal();

      // Verificar (Assert)
      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Atividade sem onclick');
      expect(items[0].id).toBeNull();
    });

    it('deve definir o tipo padrão como "document"', () => {
      // Preparar (Arrange)
      document.body.innerHTML = `
        <ul>
          <li class="quick_links_header_h3">
            <a href="#">Videoaula 1</a>
          </li>
        </ul>
      `;

      // Agir (Act)
      const items = QuickLinksScraper.extractFromModal();

      // Verificar (Assert)
      expect(items[0].type).toBe('document');
    });
  });
});
