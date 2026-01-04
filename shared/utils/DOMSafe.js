export class DOMSafe {
  /**
   * Sanitiza uma string para uso seguro em HTML (embora devamos evitar innerHTML).
   * Útil para casos onde textContent não é suficiente.
   * @param {string} str - String potencialmente perigosa.
   * @returns {string} String com caracteres especiais escapados.
   */
  static escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Sanitiza URLs para evitar execução de script via protocolo (ex: javascript:alert(1))
   * @param {string} url - URL para sanitizar
   * @returns {string} URL segura ou string vazia se inválida
   */
  static sanitizeUrl(url) {
    if (typeof url !== 'string') return '';
    const trimmed = url.trim();
    // Bloqueia protocolos perigosos (javascript:, vbscript:, data:)
    if (/^(javascript|vbscript|data):/i.test(trimmed)) {
      console.error(`[DOMSafe] Blocked unsafe URL protocol: ${trimmed}`);
      return '';
    }
    return trimmed;
  }

  /**
   * Cria um elemento HTML de forma segura com atributos e filhos.
   * Substitui document.createElement para garantir sanitização centralizada.
   *
   * @param {string} tagName - Tag do elemento (ex: 'div', 'a').
   * @param {Object<string, any>} [attributes={}] - Atributos (class, href, onclick, style, etc).
   * @param {(string|Node|Array<string|Node>)} [children=[]] - Filhos do elemento.
   * @returns {HTMLElement} O elemento criado e blindado.
   */
  static createElement(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);

    // Definir atributos com sanitização
    Object.entries(attributes).forEach(([key, value]) => {
      // 1. Classes
      if (key === 'className' || key === 'class') {
        element.className = String(value);
        return;
      }

      // 2. Dataset
      if (key === 'dataset' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = String(dataValue);
        });
        return;
      }

      // 3. Event Listeners (onClick, etc)
      if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.substring(2).toLowerCase();
        element.addEventListener(eventName, value);
        return;
      }

      // 4. Estilos (objeto ou string)
      if (key === 'style') {
        if (typeof value === 'object' && value !== null) {
          Object.assign(element.style, value);
        } else if (typeof value === 'string') {
          element.style.cssText = value;
        }
        return;
      }

      // 5. Atributos de URL (href, src, action) - BLINDAGEM XSS
      if (['href', 'src', 'action', 'formAction'].includes(key)) {
        element.setAttribute(key, DOMSafe.sanitizeUrl(String(value)));
        return;
      }

      // 6. Outros atributos normais
      if (value !== null && value !== undefined && value !== false) {
        element.setAttribute(key, String(value));
      }
    });

    // Adicionar filhos recursivamente
    const childrenArray = Array.isArray(children) ? children : [children];
    childrenArray.forEach((child) => {
      if (child instanceof Node) {
        element.appendChild(child);
      } else if (child !== null && child !== undefined) {
        // Textos são sempre seguros via textContent (nunca innerHTML)
        element.appendChild(document.createTextNode(String(child)));
      }
    });

    return element;
  }
}
