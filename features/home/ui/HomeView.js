import { Tabs } from '../../../shared/utils/Tabs.js';

import { AppLinks } from '../../../shared/constants/AppLinks.js';
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

export class HomeView {
  constructor(callbacks) {
    this.addCurrentPageCallback = callbacks.onAddCurrentInfo;
  }

  render() {
    const h = DOMSafe.createElement;

    // Helper for quick links
    const createLink = (url, pattern, iconSrc, text, isUnivesp) => {
      const classes = isUnivesp
        ? 'link-card js-smart-link blackboard-card'
        : 'link-card js-smart-link';
      // Apply extra class logic if needed based on text, or stick to params
      const finalClass = text.includes('AVA') ? 'link-card blackboard-card js-smart-link' : classes;

      const children = [];
      if (iconSrc) {
        const imgClass = isUnivesp ? 'bb-icon univesp-logo' : 'bb-icon';
        children.push(h('img', { src: iconSrc, className: imgClass, alt: text.trim() }));
        children.push(' ' + text.trim());
      } else {
        children.push(text.trim());
      }

      return h(
        'a',
        {
          href: url,
          className: finalClass,
          'data-match-pattern': pattern,
        },
        children
      );
    };

    const quickAccess = h('div', { className: 'quick-access-section' }, [
      h('h3', {}, 'Acesso Rápido'),
      h('div', { className: 'quick-links-grid' }, [
        createLink(AppLinks.SEI_HOME, 'sei.univesp.br', '../assets/icon_sei.png', 'Portal SEI'),
        createLink(
          AppLinks.AVA_HOME,
          'ultra/course',
          '../assets/icon_blackboard.png',
          'AVA (Cursos)'
        ),
        createLink(AppLinks.ALUNO_HOME, null, '../assets/logo_univesp.png', 'Área do Aluno', true),
        createLink(AppLinks.PROVAS_HOME, null, null, 'Sistema de Provas'),
      ]),
    ]);

    const footer = h('div', { className: 'footer-info' }, [
      h('span', {}, [
        'Desenvolvido por ',
        h(
          'a',
          {
            href: 'https://github.com/Gerson-Santiago/extensaoUNIVESP',
            target: '_blank',
            className: 'github-link',
          },
          'Gerson Santiago'
        ),
      ]),
    ]);

    return h('div', { className: 'view-home-dashboard' }, [quickAccess, footer]);
  }

  afterRender() {
    // Intercepta cliques nos links inteligentes para usar o gerenciador de abas
    const smartLinks = document.querySelectorAll('.js-smart-link');
    smartLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.getAttribute('href');
        const matchPattern = link.getAttribute('data-match-pattern');
        if (url) {
          Tabs.openOrSwitchTo(url, matchPattern);
        }
      });
    });
  }
}
