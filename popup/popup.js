import { formatEmail, extractRa, resolveDomain, CONSTANTS } from '../shared/utils/settings.js';
import { BrowserUtils } from '../shared/utils/BrowserUtils.js';
import { Tabs } from '../shared/utils/Tabs.js';
import { Logger } from '../shared/utils/Logger.js';
import { AppLinks } from '../shared/constants/AppLinks.js';

document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLInputElement | null} */
  const raInput = document.querySelector('#raInput');
  /** @type {HTMLInputElement | null} */
  const domainInput = document.querySelector('#domainInput');
  const resetDomainBtn = document.getElementById('resetDomainBtn');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const openSidePanelBtn = document.getElementById('openSidePanelBtn');

  // Itera sobre os links do popup e atualiza href se encontrar
  // (Note que precisamos adicionar IDs ou selecionar por href antigo no HTML)
  // Como não temos IDs no HTML, vamos usar querySelector específico.
  const linkMap = [
    { text: 'Portal SEI', url: AppLinks.SEI_HOME },
    { text: 'AVA (Cursos)', url: AppLinks.AVA_HOME },
    { text: 'Área do Aluno', url: AppLinks.ALUNO_HOME },
    { text: 'Sistema de Provas', url: AppLinks.PROVAS_HOME },
  ];

  linkMap.forEach((item) => {
    // Procura links que contenham o texto (abordagem robusta sem IDs)
    const linkEl = Array.from(document.querySelectorAll('a')).find((a) =>
      a.textContent.includes(item.text)
    );
    if (linkEl) {
      linkEl.href = item.url;
    }
  });

  if (!raInput || !domainInput || !saveBtn || !status) return;

  // 1. CARREGAR: Recupera o que estava salvo
  chrome.storage.sync.get(['userEmail', 'customDomain'], (result) => {
    // Resolve e preenche o domínio
    const domain = resolveDomain(
      /** @type {string} */ (result.userEmail),
      /** @type {string} */ (result.customDomain)
    );
    domainInput.value = domain;

    // Extrai e preenche o RA
    if (result.userEmail && raInput) {
      raInput.value = extractRa(/** @type {string} */ (result.userEmail));
    }
  });

  // 2. SALVAR
  saveBtn.addEventListener('click', () => {
    const ra = raInput.value;
    const domain = domainInput.value;

    if (ra.trim()) {
      const { fullEmail, cleanDomain } = formatEmail(ra, domain);

      chrome.storage.sync.set(
        {
          userEmail: fullEmail,
          customDomain: cleanDomain,
        },
        () => {
          status.style.display = 'block';
          setTimeout(() => {
            status.style.display = 'none';
          }, 2000);
        }
      );
    } else {
      alert('Por favor, digite o seu RA.');
    }
  });

  // 3. RESTAURAR DOMÍNIO
  resetDomainBtn.addEventListener('click', () => {
    domainInput.value = CONSTANTS.DEFAULT_DOMAIN;
  });

  // 5. ABRIR SIDE PANEL
  if (openSidePanelBtn) {
    openSidePanelBtn.addEventListener('click', () => {
      BrowserUtils.openSidePanel().catch((error) => {
        /**#LOG_UI*/
        Logger.error('Popup', 'Erro ao abrir painel:', error);
        alert(error.message);
      });
    });
  }

  // 6. LINKS DE RODAPÉ
  const devLink = document.getElementById('devLink');
  const githubIconLink = document.getElementById('githubIconLink');

  function openLink(e) {
    e.preventDefault();
    Tabs.create(this.href);
  }

  if (devLink) {
    devLink.addEventListener('click', openLink);
  }

  if (githubIconLink) {
    githubIconLink.addEventListener('click', openLink);
  }
});
