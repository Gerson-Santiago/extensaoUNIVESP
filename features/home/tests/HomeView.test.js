import { HomeView } from '../ui/HomeView.js';

describe('HomeView - Renderização', () => {
  let homeView;
  let mockCallback;

  beforeEach(() => {
    // Preparar (Arrange)
    mockCallback = jest.fn();
    homeView = new HomeView({ onAddCurrentInfo: mockCallback });
  });

  test('Deve renderizar a view com a classe CSS de dashboard principal', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    expect(element.className).toBe('view-home-dashboard');
  });

  test('Deve conter a seção de acesso rápido aos serviços Univesp', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    const quickAccess = element.querySelector('.quick-access-section');
    expect(quickAccess).toBeTruthy();
  });

  test('Deve renderizar exatamente os 4 cartões de links principais', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    const links = element.querySelectorAll('.link-card');
    expect(links.length).toBe(4);
  });

  test('Deve conter link funcional e rotulado para o Portal SEI', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    const seiLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://sei.univesp.br/index.xhtml'
    );
    expect(seiLink).toBeTruthy();
    expect(seiLink.textContent).toContain('Portal SEI');
  });

  test('Deve conter link funcional e rotulado para o AVA (Blackboard)', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    const avaLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://ava.univesp.br/ultra/course'
    );
    expect(avaLink).toBeTruthy();
    expect(avaLink.textContent).toContain('AVA');
  });

  test('Deve conter link funcional para a Área do Aluno', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    const alunoLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://univesp.br/acesso_aluno.html'
    );
    expect(alunoLink).toBeTruthy();
  });

  test('Deve conter link funcional para o Sistema de Provas', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    const provaLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://prova.univesp.br/'
    );
    expect(provaLink).toBeTruthy();
  });

  test('Deve conter rodapé identificando o desenvolvedor Gerson Santiago', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    const footer = element.querySelector('.footer-info');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Gerson Santiago');
  });

  test('afterRender deve ser executado no ciclo de vida sem erros', () => {
    // Preparar (Arrange)
    const element = homeView.render();
    document.body.appendChild(element);

    // Agir & Verificar (Act & Assert)
    expect(() => homeView.afterRender()).not.toThrow();
    document.body.innerHTML = '';
  });

  test('Links inteligentes devem possuir atributos de comportamento (js-smart-link e data-match-pattern)', () => {
    // Agir (Act)
    const element = homeView.render();

    // Verificar (Assert)
    const seiLink = element.querySelector('a[href*="sei.univesp.br"]');
    expect(seiLink.classList.contains('js-smart-link')).toBe(true);
    expect(seiLink.getAttribute('data-match-pattern')).toBe('sei.univesp.br');

    const avaLink = element.querySelector('a[href*="ava.univesp.br"]');
    expect(avaLink.classList.contains('js-smart-link')).toBe(true);
    expect(avaLink.getAttribute('data-match-pattern')).toBe('ultra/course');
  });
});
