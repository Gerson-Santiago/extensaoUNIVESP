import { HomeView } from '../ui/HomeView.js';

describe('HomeView - Renderização', () => {
  let homeView;
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
    homeView = new HomeView({ onAddCurrentInfo: mockCallback });
  });

  test('Deve renderizar a view com classe correta', () => {
    const element = homeView.render();
    expect(element.className).toBe('view-home-dashboard');
  });

  test('Deve conter seção de acesso rápido', () => {
    const element = homeView.render();
    const quickAccess = element.querySelector('.quick-access-section');
    expect(quickAccess).toBeTruthy();
  });

  test('Deve renderizar todos os 4 links de acesso rápido', () => {
    const element = homeView.render();
    const links = element.querySelectorAll('.link-card');
    expect(links.length).toBe(4);
  });

  test('Deve conter link para Portal SEI', () => {
    const element = homeView.render();
    const seiLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://sei.univesp.br/index.xhtml'
    );
    expect(seiLink).toBeTruthy();
    expect(seiLink.textContent).toContain('Portal SEI');
  });

  test('Deve conter link para AVA (Blackboard)', () => {
    const element = homeView.render();
    const avaLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://ava.univesp.br/ultra/course'
    );
    expect(avaLink).toBeTruthy();
    expect(avaLink.textContent).toContain('AVA');
  });

  test('Deve conter link para Área do Aluno', () => {
    const element = homeView.render();
    const alunoLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://univesp.br/acesso_aluno.html'
    );
    expect(alunoLink).toBeTruthy();
  });

  test('Deve conter link para Sistema de Provas', () => {
    const element = homeView.render();
    const provaLink = Array.from(element.querySelectorAll('a')).find(
      (a) => a.href === 'https://prova.univesp.br/'
    );
    expect(provaLink).toBeTruthy();
  });

  test('Deve conter footer com informações do desenvolvedor', () => {
    const element = homeView.render();
    const footer = element.querySelector('.footer-info');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Gerson Santiago');
  });

  test('afterRender deve executar sem erros', () => {
    const element = homeView.render();
    document.body.appendChild(element);
    expect(() => homeView.afterRender()).not.toThrow();
    document.body.innerHTML = '';
  });
});
