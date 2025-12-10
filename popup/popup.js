document.addEventListener('DOMContentLoaded', () => {
    const raInput = document.getElementById('raInput');
    const domainInput = document.getElementById('domainInput');
    const resetDomainBtn = document.getElementById('resetDomainBtn');
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');
    const githubLink = document.getElementById('githubLink');
    const openSidePanelBtn = document.getElementById('openSidePanelBtn');

    const DEFAULT_DOMAIN = "@aluno.univesp.br";

    // 1. CARREGAR: Recupera o que estava salvo
    chrome.storage.sync.get(['userEmail', 'customDomain'], (result) => {
        // Carrega o domínio
        if (result.customDomain) {
            domainInput.value = result.customDomain;
        } else if (result.userEmail && result.userEmail.includes('@')) {
            // Fallback
            const parts = result.userEmail.split('@');
            if (parts.length > 1) {
                domainInput.value = '@' + parts.slice(1).join('@');
            } else {
                domainInput.value = DEFAULT_DOMAIN;
            }
        } else {
            domainInput.value = DEFAULT_DOMAIN;
        }

        // Carrega o RA
        if (result.userEmail) {
            const parts = result.userEmail.split('@');
            raInput.value = parts[0];
        }
    });

    // 2. SALVAR
    saveBtn.addEventListener('click', () => {
        let ra = raInput.value.trim();
        let domain = domainInput.value.trim();

        if (ra.includes('@')) {
            const parts = ra.split('@');
            ra = parts[0];
        }

        if (ra) {
            if (!domain.startsWith('@')) {
                domain = '@' + domain;
            }

            const fullEmail = ra + domain;

            chrome.storage.sync.set({
                userEmail: fullEmail,
                customDomain: domain
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
        domainInput.value = DEFAULT_DOMAIN;
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
            // Tenta abrir o Side Panel na janela atual
            // Requer Chrome 116+ e permissão adequada
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const windowId = tabs[0].windowId;
                    // O método sidePanel.openOptions não existe, usamos sidePanel.open
                    // Atenção: Isto requer interação do usuário, que temos aqui (click).
                    if (chrome.sidePanel && chrome.sidePanel.open) {
                        chrome.sidePanel.open({ windowId: windowId })
                            .catch((error) => console.error("Erro ao abrir painel:", error));
                        // Opcional: fechar o popup? window.close();
                    } else {
                        alert("Seu navegador não suporta abrir o Painel Lateral automaticamente. Por favor, abra-o manualmente pelo menu do navegador.");
                    }
                }
            });
        });
    }
});
