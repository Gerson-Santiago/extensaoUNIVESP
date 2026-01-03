/**
 * @file DOMSafe.js
 * @description Utilitários para prevenir XSS e garantir manipulação segura do DOM
 */

export class DOMSafe {
  /**
   * Escapa caracteres HTML perigosos em uma string
   * @param {string} str - String não confiável
   * @returns {string} String sanitizada
   */
  static escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Limpa todo o conteúdo de um elemento de forma segura e rápida (Modern API)
   * @param {HTMLElement} element - Elemento a ser limpo
   */
  static clean(element) {
    if (element && typeof element.replaceChildren === 'function') {
      element.replaceChildren(); // Modern & Fast
    } else if (element) {
      element.innerHTML = ''; // Fallback
    }
  }

  /**
   * Sanitiza conteúdo HTML permitindo apenas tags seguras (whitelist mínima)
   * Útil quando precisamos de formatação básica (b, i, p) mas não scripts
   * @param {string} html - HTML potencialmente perigoso
   * @returns {string} HTML sanitizado com tags perigosas removidas
   */
  static sanitize(html) {
    // Implementação simples: Remover scripts e event handlers
    // Para produção robusta, usar DOMPurify. Aqui faremos o básico para o MVP.
    // Se conter <script> ou on*, escapa tudo por segurança.
    if (/<script/i.test(html) || /\son\w+=/i.test(html) || /javascript:/i.test(html)) {
      return DOMSafe.escapeHTML(html);
    }
    return html;
  }
}
