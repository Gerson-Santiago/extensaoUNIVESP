/**
 * @jest-environment jsdom
 */
import { VideoStrategy } from '../VideoStrategy.js';

describe('VideoStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new VideoStrategy();
    document.body.innerHTML = '';
  });

  describe('matches()', () => {
    it('deve detectar por ícone de vídeo clássico', () => {
      // Arrange
      document.body.innerHTML = `
        <li>
          <img class="item_icon" src="/images/video_icon.png" alt="Vídeo">
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act & Assert
      expect(strategy.matches(li)).toBe(true);
    });

    it('deve detectar por iframe do YouTube', () => {
      // Arrange
      document.body.innerHTML = `
        <li>
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act & Assert
      expect(strategy.matches(li)).toBe(true);
    });

    it('deve detectar por iframe do Vimeo', () => {
      // Arrange
      document.body.innerHTML = `
        <li>
          <iframe src="https://player.vimeo.com/video/12345"></iframe>
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act & Assert
      expect(strategy.matches(li)).toBe(true);
    });

    it('deve detectar por tag <video>', () => {
      // Arrange
      document.body.innerHTML = `
        <li>
          <video src="video.mp4"></video>
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act & Assert
      expect(strategy.matches(li)).toBe(true);
    });

    it('não deve detectar li sem vídeo ou ícone correto', () => {
      // Arrange
      document.body.innerHTML = `
        <li>
          <img class="item_icon" src="/images/pdf_icon.png" alt="Documento">
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act & Assert
      expect(strategy.matches(li)).toBe(false);
    });
  });

  describe('extract()', () => {
    it('deve extrair dados do formato padrão (ícone + link)', () => {
      // Arrange
      document.body.innerHTML = `
        <li id="contentListItem:video123">
          <img class="item_icon" src="video.png">
          <h3>
            <a href="https://univesp.br/aula1"><span>Aula 1</span></a>
          </h3>
          <button class="button-5">Marca Revista</button>
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act
      const result = strategy.extract(li);

      // Assert
      expect(result).toEqual({
        name: 'Aula 1',
        url: 'https://univesp.br/aula1',
        type: 'video',
        contentId: 'video123',
        status: 'TODO',
      });
    });

    it('deve extrair do iframe se link H3 estiver ausente', () => {
      // Arrange
      document.body.innerHTML = `
        <li id="li-vimeo">
          <iframe src="https://player.vimeo.com/video/123" title="Aula Extra"></iframe>
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act
      const result = strategy.extract(li);

      // Assert
      expect(result).toMatchObject({
        name: 'Aula Extra',
        url: 'https://player.vimeo.com/video/123',
        type: 'video',
      });
    });

    it('deve extrair da tag <video> se link e iframe estiverem ausentes', () => {
      // Arrange
      document.body.innerHTML = `
        <li>
          <video src="video.webm"></video>
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act
      const result = strategy.extract(li);

      // Assert
      expect(result).toMatchObject({
        name: 'Vídeo HTML5',
        url: expect.stringContaining('video.webm'),
        type: 'video',
      });
    });

    it('deve limpar URLs do YouTube para formato watch', () => {
      // Arrange
      document.body.innerHTML = `
        <li>
          <h3><a href="https://www.youtube.com/watch?v=123&t=10s&feature=emb_title">Aula</a></h3>
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act
      const result = strategy.extract(li);

      // Assert
      expect(result.url).toBe('https://www.youtube.com/watch?v=123');
    });

    it('deve retornar null se não houver link, iframe ou video com src', () => {
      // Arrange
      document.body.innerHTML = '<li><h3>Vazio</h3></li>';
      const li = document.body.querySelector('li');

      // Act
      const result = strategy.extract(li);

      // Assert
      expect(result).toBeNull();
    });

    it('deve usar nome genérico se não houver span ou title', () => {
      // Arrange
      document.body.innerHTML = `
        <li>
          <iframe src="https://univesp.tv/video"></iframe>
        </li>
      `;
      const li = document.body.querySelector('li');

      // Act
      const result = strategy.extract(li);

      // Assert
      expect(result.name).toBe('Vídeo detectado');
    });

    it('deve retornar URL original se sanitizeUrl falhar', () => {
      // Simular erro passando algo que não seja string se necessário ou apenas confiar no catch
      const result = strategy.sanitizeUrl('não-é-uma-url');
      expect(result).toBe('não-é-uma-url');
    });

    it('deve lidar com iconImg sem src ou alt', () => {
      document.body.innerHTML = '<li><img class="item_icon"></li>';
      const li = document.body.querySelector('li');
      expect(strategy.matches(li)).toBe(false);
    });

    it('deve lidar com iframe sem src', () => {
      document.body.innerHTML = '<li><iframe></iframe></li>';
      const li = document.body.querySelector('li');
      expect(strategy.matches(li)).toBe(false);
    });

    it('deve lidar com video sem src em extract', () => {
      document.body.innerHTML = '<li><video></video></li>';
      const li = document.body.querySelector('li');
      expect(strategy.extract(li)).toBeNull();
    });

    it('deve lidar com iframe sem src em extract', () => {
      document.body.innerHTML = '<li><iframe></iframe></li>';
      const li = document.body.querySelector('li');
      expect(strategy.extract(li)).toBeNull();
    });
  });
});
