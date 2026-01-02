import { HomeView } from '../ui/HomeView.js';
import { AppLinks } from '../../../shared/constants/AppLinks.js';

describe('HomeView - Renderização', () => {
  let homeView;
  let mockCallback;

  beforeEach(() => {
    // Arrange (Preparar)
    mockCallback = jest.fn();
    homeView = new HomeView({ onAddCurrentInfo: mockCallback });
  });

  test('Deve renderizar a view com a classe CSS de dashboard principal', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    expect(element.className).toBe('view-home-dashboard');
  });

  test('Deve conter a seção de acesso rápido aos serviços Univesp', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    const quickAccess = element.querySelector('.quick-access-section');
    expect(quickAccess).toBeTruthy();
  });

  test('Deve renderizar exatamente os 4 cartões de links principais', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    const links = element.querySelectorAll('.link-card');
    expect(links.length).toBe(4);
  });

  test('Deve conter link funcional e rotulado para o Portal SEI', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    const seiLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://sei.univesp.br/index.xhtml'
    );
    expect(seiLink).toBeTruthy();
    expect(seiLink.textContent).toContain('Portal SEI');
  });

  test('Deve conter link funcional e rotulado para o AVA (Blackboard)', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    const avaLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://ava.univesp.br/ultra/course'
    );
    expect(avaLink).toBeTruthy();
    expect(avaLink.textContent).toContain('AVA');
  });

  test('Deve conter link funcional para a Área do Aluno', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    const alunoLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://univesp.br/acesso_aluno.html'
    );
    expect(alunoLink).toBeTruthy();
  });

  test('Deve conter link funcional para o Sistema de Provas', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    const provaLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === AppLinks.PROVAS_HOME
    );
    expect(provaLink).toBeTruthy();
  });

  test('Deve conter rodapé identificando o desenvolvedor Gerson Santiago', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    const footer = element.querySelector('.footer-info');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Gerson Santiago');
  });

  test('afterRender deve ser executado no ciclo de vida sem erros', () => {
    // Arrange (Preparar)
    const element = homeView.render();
    document.body.appendChild(element);

    // Act & Assert (Agir e Verificar)
    expect(() => homeView.afterRender()).not.toThrow();
    document.body.innerHTML = '';
  });

  test('Links inteligentes devem possuir atributos de comportamento (js-smart-link e data-match-pattern)', () => {
    // Act (Agir)
    const element = homeView.render();

    // Assert (Verificar)
    const seiLink = element.querySelector('a[href*="sei.univesp.br"]');
    expect(seiLink.classList.contains('js-smart-link')).toBe(true);
    expect(seiLink.getAttribute('data-match-pattern')).toBe('sei.univesp.br');

    const avaLink = element.querySelector('a[href*="ava.univesp.br"]');
    expect(avaLink.classList.contains('js-smart-link')).toBe(true);
    expect(avaLink.getAttribute('data-match-pattern')).toBe('ultra/course');
  });
});
