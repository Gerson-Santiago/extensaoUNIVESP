document.addEventListener('DOMContentLoaded', () => {
  const raInput = document.getElementById('raInput');
  const domainInput = document.getElementById('domainInput');
  const resetDomainBtn = document.getElementById('resetDomainBtn');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const githubLink = document.getElementById('githubLink');

  const DEFAULT_DOMAIN = "@aluno.univesp.br";

  // 1. CARREGAR: Recupera o que estava salvo
  chrome.storage.sync.get(['userEmail', 'customDomain'], (result) => {
    // Carrega o domínio
    if (result.customDomain) {
      domainInput.value = result.customDomain;
    } else if (result.userEmail && result.userEmail.includes('@')) {
      // Fallback para versões anteriores: extrai do email salvo
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

  // 2. SALVAR: Junta o RA com o domínio
  saveBtn.addEventListener('click', () => {
    let ra = raInput.value.trim();
    let domain = domainInput.value.trim();

    // Pequena proteção caso o usuário digite o email completo no RA
    if (ra.includes('@')) {
      const parts = ra.split('@');
      ra = parts[0];
      // Se o usuário colou o email todo, podemos assumir o domínio dele se o campo de domínio estiver default?
      // Melhor não complicar, apenas limpa o RA.
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

  // 4. LINK GITHUB (Garante abertura em nova guia)
  if (githubLink) {
    githubLink.addEventListener('click', (e) => {
      e.preventDefault(); // Evita comportamento padrão se não funcionar
      chrome.tabs.create({ url: githubLink.href });
    });
  }
});