/**
 * @jest-environment jsdom
 */
import { DefaultStrategy } from '../../../../services/WeekContentScraper/strategies/DefaultStrategy.js';

describe('DefaultStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new DefaultStrategy();
  });

  describe('extract', () => {
    it('deve extrair contentId corretamente do elemento LI', () => {
      // Arrange
      const li = document.createElement('li');
      li.id = 'contentListItem:_12345_1';
      li.innerHTML = `
        <div class="item">
          <h3><a href="http://example.com">Activity</a></h3>
        </div>`;

      // Act
      const result = strategy.extract(li);

      // Assert
      expect(result).not.toBeNull();
      expect(result.contentId).toBe('_12345_1');
    });

    it('deve ignorar link "Marca Revista" e priorizar Iframe', () => {
      // Cenário real do bug "Marca Revista"
      const li = document.createElement('li');
      li.id = 'contentListItem:_999_1';
      li.innerHTML = `
        <div class="item">
           <h3><span>Videoaula 1</span></h3> <!-- Sem link no H3 -->
           <a href="javascript:markReviewed('123')" class="button-5">Marca Revista</a>
           <iframe src="https://video.com/123"></iframe>
        </div>
      `;

      const result = strategy.extract(li);

      expect(result.name).toBe('Videoaula 1');
      expect(result.url).toBe('https://video.com/123');
      expect(result.url).not.toContain('javascript');
    });

    it('deve limpar nome ignorando span .reorder (O Ouro)', () => {
      // Cenário real da estrutura de spans
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>
          <span class="reorder editmode hideme">Lixo do Sistema</span>
          <span>Nome Real da Atividade</span>
        </h3>
        <iframe src="http://url.com"></iframe>
      `;

      const result = strategy.extract(li);

      expect(result.name).toBe('Nome Real da Atividade');
      expect(result.name).not.toContain('Lixo');
    });

    it('deve retornar null se apenas links javascript estiverem presentes', () => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>Atividade Quebrada</h3>
        <a href="javascript:void(0)">Link Ruim</a>
        <a href="#" class="ally-alternative-formats">Ally</a>
      `;

      const result = strategy.extract(li);

      // Se não tem URL válida, deve retornar null (ou ser tratado, mas DefaultStrategy exige URL)
      // Com a nossa mudança, ele exige URL e Name
      expect(result).toBeNull();
    });
  });
});
