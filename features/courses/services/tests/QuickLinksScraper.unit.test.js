import { QuickLinksScraper, DOM_scrapeQuickLinks_Injected } from '../QuickLinksScraper.js';

describe('QuickLinksScraper Service', () => {
  describe('extractFromModal', () => {
    it('deve extrair items corretamente de um DOM mockado', () => {
      // Arrange
      const domMock = document.createElement('div');
      domMock.innerHTML = `
        <li class="quick_links_header_h3">
          <a onclick="quickLinks.messageHelper.activateElement('123', 'doc_id', 'etc')">
             Documento Teste 
          </a>
        </li>
        <li class="quick_links_header_h3">
          <a onclick="someOtherCall()">Link Sem ID</a>
        </li>
      `;

      // Act
      const items = QuickLinksScraper.extractFromModal(
        /** @type {Document} */ (/** @type {unknown} */ (domMock))
      );

      // Assert
      expect(items).toHaveLength(2);
      expect(items[0]).toEqual({
        name: 'Documento Teste',
        id: 'doc_id',
        type: 'document',
      });
      expect(items[1]).toEqual({
        name: 'Link Sem ID',
        id: null,
        type: 'document',
      });
    });

    it('deve lidar com erros de parsing graciosamente', () => {
      // @ts-ignore
      const result = QuickLinksScraper.extractFromModal(null); // Vai lançar erro no querySelectorAll
      expect(result).toEqual([]);
    });
  });

  describe('DOM_scrapeQuickLinks_Injected', () => {
    // Helper para resetar o DOM
    const resetDOM = () => {
      document.body.innerHTML = '';
      jest.clearAllMocks();
    };

    beforeEach(resetDOM);

    it('deve retornar items se o modal já estiver aberto', async () => {
      // Arrange: Links já presentes
      document.body.innerHTML = `
        <li class="quick_links_header_h3">
          <a onclick="quickLinks.messageHelper.activateElement('1','id_existente','x')">Já Aberto</a>
        </li>
      `;

      // Act
      const items = await DOM_scrapeQuickLinks_Injected();

      // Assert
      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Já Aberto');
    });

    it('deve abrir o modal e esperar carregar se links não existirem', async () => {
      // Arrange: Botão existe, mas links não. Links aparecem depois.
      document.body.innerHTML = `
        <a id="quick_links_lightbox_link">Abrir Modal</a>
        <div id="container"></div>
      `;

      const btn = document.getElementById('quick_links_lightbox_link');
      const clickSpy = jest.spyOn(btn, 'click');

      // Simula carregamento assíncrono: após 150ms, adiciona o link
      setTimeout(() => {
        const container = document.getElementById('container');
        if (container) {
          container.innerHTML = `
            <li class="quick_links_header_h3">
              <a onclick="activateElement('x','id_late','y')">Carregou Depois</a>
            </li>
          `;
        }
      }, 150);

      // Act
      const items = await DOM_scrapeQuickLinks_Injected();

      // Assert
      expect(clickSpy).toHaveBeenCalled();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('id_late');
    });

    it('deve retornar vazio e fechar se estourar o timeout', async () => {
      // Arrange: Botão existe, mas links NUNCA aparecem
      document.body.innerHTML = `
        <a id="quick_links_lightbox_link">Abrir Modal</a>
      `;

      // Mock setTimeout para acelerar o teste?
      // O loop espera 100ms * 100 tentativas = 10s.
      // Isso é muito lento para teste unitário.
      // Vamos mockar o setTimeout global apenas para esse teste?
      // Ou melhor, mockar document.querySelectorAll para simular timeout rápido?
      // Não, a função tem delay fixo.
      // Mas para o teste não travar, podemos usar jest.useFakeTimers().

      jest.useFakeTimers();

      const promise = DOM_scrapeQuickLinks_Injected();

      // Avança o tempo até estourar
      // Precisamos avançar em loop pois é async/await
      for (let i = 0; i < 110; i++) {
        jest.advanceTimersByTime(100);
        await Promise.resolve(); // Flush microtasks
      }

      const items = await promise;

      expect(items).toEqual([]);

      jest.useRealTimers();
    });

    it('deve retornar vazio se botão de abrir não existir', async () => {
      document.body.innerHTML = '<div>Nada aqui</div>';
      const items = await DOM_scrapeQuickLinks_Injected();
      expect(items).toEqual([]);
    });

    it('deve tentar fechar o modal ao final', async () => {
      // Arrange
      document.body.innerHTML = `
        <li class="quick_links_header_h3"><a>Link</a></li>
        <a class="lbAction" href="#close">Fechar</a>
      `;

      const closeBtn = document.querySelector('a.lbAction');
      const clickSpy = jest.spyOn(/** @type {HTMLElement} */ (closeBtn), 'click');

      await DOM_scrapeQuickLinks_Injected();

      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
