import { formatEmail, extractRa, resolveDomain, CONSTANTS } from './logic/settings.js';

document.addEventListener('DOMContentLoaded', () => {
    const raInput = document.getElementById('raInput');
    const domainInput = document.getElementById('domainInput');
    const resetDomainBtn = document.getElementById('resetDomainBtn');
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');
    const githubLink = document.getElementById('githubLink');
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

            chrome.storage.sync.set({
                userEmail: fullEmail,
                customDomain: cleanDomain
            }, () => {
                status.style.display = 'block';
                setTimeout(() => {
                    status.style.display = 'none';
                }, 2000);
            });
        } else {
            alert("Por favor, digite o seu RA.");
        }
    });

    // 3. RESTAURAR DOMÍNIO
    resetDomainBtn.addEventListener('click', () => {
        domainInput.value = CONSTANTS.DEFAULT_DOMAIN;
    });

    // 4. LINK GITHUB
    if (githubLink) {
        githubLink.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: githubLink.href });
        });
    }

    // 5. ABRIR SIDE PANEL
    if (openSidePanelBtn) {
        openSidePanelBtn.addEventListener('click', () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const windowId = tabs[0].windowId;
                    if (chrome.sidePanel && chrome.sidePanel.open) {
                        chrome.sidePanel.open({ windowId: windowId })
                            .catch((error) => console.error("Erro ao abrir painel:", error));
                        window.close();
                    } else {
                        alert("Seu navegador não suporta abrir o Painel Lateral automaticamente. Por favor, abra-o manualmente pelo menu do navegador.");
                    }
                }
            });
        });
    }

    // 6. ABRIR SIDE PANEL (alternativo)
    const openSidePanelById = document.getElementById('openSidePanel');
    if (openSidePanelById) {
        openSidePanelById.addEventListener('click', () => {
            // Fallback usando setOptions se necessário, embora open() seja preferido onde suportado
            if (chrome.sidePanel && chrome.sidePanel.open) {
                chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT }).catch(err => {
                    console.error('Erro ao abrir sidepanel:', err);
                });
            } else {
                chrome.sidePanel.setOptions({ path: 'sidepanel/sidepanel.html', enabled: true });
            }
        });
    }
});
