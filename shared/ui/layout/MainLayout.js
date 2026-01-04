import { TopNav } from './TopNav.js';

export class MainLayout {
  constructor(views) {
    this.views = views; // Objeto { home: viewInstance, courses: viewInstance, ... }
    this.currentViewId = 'home';
    this.topNav = new TopNav((viewId) => this.navigateTo(viewId));
    this.appContainer = document.getElementById('app');
  }

  init() {
    this.render();
    this.navigateTo('home');
  }

  render() {
    this.appContainer.replaceChildren();

    // Barra de Navegação (Fixa no topo)
    const navElement = this.topNav.render();
    this.appContainer.appendChild(navElement);

    // Container de Conteúdo (Scrollável)
    const content = document.createElement('main');
    content.id = 'main-content';
    this.appContainer.appendChild(content);
  }

  navigateTo(viewId) {
    this.currentViewId = viewId;
    const view = this.views[viewId];
    const contentContainer = document.getElementById('main-content');

    if (view && contentContainer) {
      contentContainer.replaceChildren(); // Limpa view anterior
      contentContainer.appendChild(view.render());

      // Se a view tiver lógica de pós-renderização (ex: listeners), chamamos aqui
      if (view.afterRender) {
        view.afterRender();
      }
    }
  }
}
