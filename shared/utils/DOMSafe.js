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
   * Cria um elemento HTML de forma segura com atributos e filhos.
   * @param {string} tagName - Tag do elemento (ex: 'div', 'span').
   * @param {Object} [attributes={}] - Objeto chave-valor para atributos (class, id, href, etc).
   * @param {(string|HTMLElement|Array<string|HTMLElement>)} [children=[]] - Filhos do elemento.
   * @returns {HTMLElement} O elemento criado.
   */
  static createElement(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);

    // Definir atributos
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset' && typeof value === 'object') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      } else if (value !== null && value !== undefined && value !== false) {
        element.setAttribute(key, value);
      }
    });

    // Adicionar filhos
    const childrenArray = Array.isArray(children) ? children : [children];
    childrenArray.forEach((child) => {
      if (child instanceof Node) {
        element.appendChild(child);
      } else if (child !== null && child !== undefined) {
        element.appendChild(document.createTextNode(String(child)));
      }
    });

    return element;
  }
}
