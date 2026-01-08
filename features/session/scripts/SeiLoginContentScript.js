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

// Definir observer no escopo superior para acesso dentro da função
let observer;

function preencherEmail() {
  // Check if extension context is valid (Wrapped in try-catch because accessing chrome.runtime can throw)
  let contextValid = false;
  try {
    contextValid = !!(chrome.runtime && chrome.runtime.id);
  } catch {
    contextValid = false;
  }

  if (!contextValid) {
    // Se o contexto foi invalidado, desconectar o observer para parar tentativas
    if (observer) observer.disconnect();
    return;
  }

  try {
    // 1. Busca o email salvo nas configurações da extensão
    chrome.storage.sync.get(['userEmail'], (result) => {
      if (chrome.runtime.lastError) {
        // Silently fail if context is invalidated
        if (observer) observer.disconnect();
        return;
      }

      const emailSalvo = result.userEmail;

      // Só executa se o usuário tiver configurado um email válido
      if (typeof emailSalvo !== 'string' || !emailSalvo) {
        /**#LOG_CONTENT*/
        Logger.warn('Nenhum e-mail configurado na extensão.');
        if (observer) observer.disconnect(); // Não precisa mais observar se não tem email
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

        // Sucesso! Pode desconectar o observer para economizar recursos
        if (observer) observer.disconnect();
      }
    });
  } catch (e) {
    // Suppress "Extension context invalidated" errors during development reloads
    if (e.message && e.message.includes('Extension context invalidated')) {
      if (observer) observer.disconnect();
      return;
    }
    console.warn('[SeiLogin] Unexpected error:', e);
  }
}

// Executa ao carregar
preencherEmail();

// Tenta de novo após 1s e monitora mudanças
setTimeout(preencherEmail, 1000);
observer = new MutationObserver(() => preencherEmail());
observer.observe(document.body, { childList: true, subtree: true });
