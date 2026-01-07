/**
 * Helper de log local para Content Scripts
 * Segue o padrão ADR-005 (Observabilidade)
 */
const Logger = {
  warn: (msg, data = null) => {
    try {
      if (localStorage.getItem('UNIVESP_DEBUG') === 'true') {
        const prefix = '[Extension:SeiLogin]';
        if (data) console.warn(prefix, msg, data);
        else console.warn(prefix, msg);
      }
    } catch {
      // Silencioso em caso de erro no localStorage (ex: restrições do browser)
    }
  },
};

function preencherEmail() {
  // 1. Busca o email salvo nas configurações da extensão
  chrome.storage.sync.get(['userEmail'], (result) => {
    const emailSalvo = result.userEmail;

    // Só executa se o usuário tiver configurado um email válido
    if (typeof emailSalvo !== 'string' || !emailSalvo) {
      /**#LOG_CONTENT*/
      Logger.warn('Nenhum e-mail configurado na extensão.');
      return;
    }

    const campoEmail = document.getElementById('form:email');

    // Verifica se o campo existe, é um input e está vazio
    if (campoEmail instanceof HTMLInputElement && campoEmail.value === '') {
      // Preenche com o valor recuperado da memória
      campoEmail.value = emailSalvo;

      // Eventos para validar no sistema Java/JSF
      campoEmail.dispatchEvent(new Event('input', { bubbles: true }));
      campoEmail.dispatchEvent(new Event('change', { bubbles: true }));
      campoEmail.dispatchEvent(new Event('blur', { bubbles: true }));

      // Pinta de amarelo suave para confirmar
      campoEmail.style.backgroundColor = '#ffffd0';
      /**#LOG_CONTENT*/
      Logger.warn('Email preenchido automaticamente.');
    }
  });
}

// Executa ao carregar
preencherEmail();

// Tenta de novo após 1s e monitora mudanças
setTimeout(preencherEmail, 1000);
const observer = new MutationObserver(() => preencherEmail());
observer.observe(document.body, { childList: true, subtree: true });
