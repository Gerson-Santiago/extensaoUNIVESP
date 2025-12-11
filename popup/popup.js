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
                        window.close();
                    } else {
                        alert("Seu navegador não suporta abrir o Painel Lateral automaticamente. Por favor, abra-o manualmente pelo menu do navegador.");
                    }
                }
            });
        });
    }

    // 6. ABRIR SIDE PANEL (alternativo, se houver um botão com id 'openSidePanel')
    // Este bloco foi adicionado com base na sua instrução, mas pode ser redundante ou precisar de um botão específico no HTML.
    // Se 'openSidePanelBtn' e 'openSidePanel' se referem ao mesmo elemento, este bloco pode ser mesclado ou removido.
    const openSidePanelById = document.getElementById('openSidePanel');
    if (openSidePanelById) {
        openSidePanelById.addEventListener('click', () => {
            // Tenta abrir o sidepanel programaticamente (requer permissão e user gesture)
            // Como fallback, o manifesto define o comportamento padrão do ícone se action não tivesse popup.
            // Mas como temos popup, usamos:
            chrome.sidePanel.setOptions({ path: 'sidepanel/sidepanel.html', enabled: true });
            chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT }).catch(err => {
                console.error('Erro ao abrir sidepanel:', err);
                // Fallback: orientar usuário
                alert('Clique no ícone da extensão na barra de ferramentas e selecione "Abrir Painel Lateral" se disponível, ou fixe a extensão.');
            });
        });
    }

    // 7. VISUALIZAR LOGS
    const viewLogsBtn = document.getElementById('viewLogs');
    if (viewLogsBtn) {
        viewLogsBtn.addEventListener('click', () => {
            chrome.storage.local.get(['lastDebugLog'], (result) => {
                const logs = result.lastDebugLog;
                if (logs && logs.length > 0) {
                    const logText = logs.join('\n');
                    // Copia para clipboard e avisa
                    navigator.clipboard.writeText(logText).then(() => {
                        alert('Logs copiados para a área de transferência:\n\n' + logText);
                    }).catch(err => {
                        alert('Logs (erro ao copiar):\n' + logText);
                    });
                } else {
                    alert('Nenhum log registrado ainda.\nTente usar "Atualizar Semanas" no Painel Lateral primeiro.');
                }
            });
        });
    }
});
