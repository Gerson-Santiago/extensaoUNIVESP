export class DomUtils {
  /**
   * Tenta fechar o modal "Links Rápidos" (Lightbox) do Blackboard se estiver aberto.
   * Modais abertos podem bloquear a interação ou poluir a visualização.
   * @param {Document} dom - O documento onde buscar o modal.
   * @returns {boolean} - True se encontrou e fechou, False caso contrário.
   */
  static ensureModalClosed(dom = document) {
    // Seletor para o botão de fechar nativo do Lightbox do Blackboard
    // Geralmente é um link com classe lbAction e href="#close"
    /** @type {HTMLElement|null} */
    const closeBtn = dom.querySelector('a.lbAction[href="#close"]');

    if (closeBtn) {
      closeBtn.click();
      return true;
    }

    return false;
  }
}
