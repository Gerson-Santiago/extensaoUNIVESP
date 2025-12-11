import { BottomNav } from './BottomNav.js';

export class MainLayout {
    constructor(views) {
        this.views = views; // Objeto { home: viewInstance, courses: viewInstance, ... }
        this.currentViewId = 'home';
        this.bottomNav = new BottomNav((viewId) => this.navigateTo(viewId));
        this.appContainer = document.getElementById('app');
    }

    init() {
        this.render();
        this.navigateTo('home');
    }

    render() {
        this.appContainer.innerHTML = '';

        // Container de Conteúdo (Scrollável)
        const content = document.createElement('main');
        content.id = 'main-content';
        this.appContainer.appendChild(content);

        // Barra de Navegação (Fixa no rodapé)
        const navElement = this.bottomNav.render();
        this.appContainer.appendChild(navElement);
    }

    navigateTo(viewId) {
        this.currentViewId = viewId;
        const view = this.views[viewId];
        const contentContainer = document.getElementById('main-content');

        if (view && contentContainer) {
            contentContainer.innerHTML = ''; // Limpa view anterior
            contentContainer.appendChild(view.render());

            // Se a view tiver lógica de pós-renderização (ex: listeners), chamamos aqui
            if (view.afterRender) {
                view.afterRender();
            }
        }
    }
}
