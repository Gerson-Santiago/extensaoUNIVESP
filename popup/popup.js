import { formatEmail, extractRa, resolveDomain, CONSTANTS } from '../shared/utils/settings.js';
import { BrowserUtils } from '../shared/utils/BrowserUtils.js';
import { Tabs } from '../shared/utils/Tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLInputElement} */
  const raInput = document.getElementById('raInput');
  /** @type {HTMLInputElement} */
  const domainInput = document.getElementById('domainInput');
  const resetDomainBtn = document.getElementById('resetDomainBtn');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const openSidePanelBtn = document.getElementById('openSidePanelBtn');

  // 1. CARREGAR: Recupera o que estava salvo
  chrome.storage.sync.get(['userEmail', 'customDomain'], (result) => {
    // Resolve e preenche o domínio
    const domain = resolveDomain(result.userEmail, result.customDomain);
    domainInput.value = domain;

    // Extrai e preenche o RA
    if (result.userEmail) {
      raInput.value = extractRa(result.userEmail);
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
        console.error('Erro ao abrir painel:', error);
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
