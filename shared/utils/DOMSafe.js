/**
 * @file DOMSafe.js
 * @description Implementação de Factory segura para manipulação do DOM.
 */

// Importar tipos explicitamente para disponibilidade no JSDoc
/** @typedef {import('../types/security.js').SafeURL} SafeURL */
/** @typedef {import('../types/security.js').SafeAttributes} SafeAttributes */
/** @typedef {import('../types/security.js').SafeChildren} SafeChildren */

/**
 * Utilitário de segurança para operações DOM.
 * Previne XSS através de sanitização rigorosa e Whitelisting.
 */
export class DOMSafe {
  /**
   * Sanitiza uma string para uso seguro em HTML.
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
   * Lista de atributos HTML seguros (whitelist)
   */
  static #SAFE_ATTRIBUTES = new Set([
    'id',
    'className',
    'class',
    'title',
    'aria-label',
    'aria-describedby',
    'role',
    'tabindex',
    'disabled',
    'readonly',
    'required',
    'placeholder',
    'value',
    'type',
    'name',
    'alt',
    'for',
    'width',
    'height',
    'target',
    'rel',
    // Atributos de Iframe (FeedbackView)
    'frameborder',
    'marginwidth',
    'marginheight',
    'allowfullscreen',
    'allow',
    'loading',
    'min',
    'max',
    'step',
    'checked',
    'selected',
    'colspan',
    'rowspan',
  ]);

  /**
   * Lista de atributos perigosos (blacklist)
   */
  static #DANGEROUS_ATTRIBUTES = new Set(['srcdoc', 'codebase', 'archive', 'cite']);

  /**
   * Sanitiza URLs com validação COMPLETA
   * Bloqueia protocolos perigosos e valida formato de URL
   * @param {string} url - URL para sanitizar
   * @returns {SafeURL | ""} URL segura ou string vazia se inválida
   */
  static sanitizeUrl(url) {
    if (typeof url !== 'string') return '';

    const trimmed = url.trim();

    // 1. Bloqueia protocolos perigosos
    const dangerousProtocols = /^(javascript|vbscript|data|file|about):/i;
    if (dangerousProtocols.test(trimmed)) {
      console.error(`[DOMSafe] Blocked unsafe protocol: ${trimmed}`);
      return '';
    }

    // 2. Valida formato de URL
    try {
      const parsed = new URL(trimmed, window.location.origin);

      // 3. Whitelist de protocolos permitidos
      const allowedProtocols = ['http:', 'https:', 'chrome-extension:'];
      if (!allowedProtocols.includes(parsed.protocol)) {
        console.error(`[DOMSafe] Blocked protocol: ${parsed.protocol}`);
        return '';
      }

      return /** @type {SafeURL} */ (parsed.href);
    } catch {
      // URL inválida ou relativa - permitir URLs relativas
      if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
        return /** @type {SafeURL} */ (trimmed);
      }
      console.error(`[DOMSafe] Invalid URL: ${trimmed}`);
      return '';
    }
  }

  /**
   * Cria um elemento HTML de forma segura com atributos e filhos.
   * Substitui document.createElement para garantir sanitização centralizada.
   *
   * @template {keyof HTMLElementTagNameMap} T
   * @param {T} tagName - Tag do elemento (ex: 'div', 'a').
   * @param {SafeAttributes} [attributes={}] - Atributos seguros (whitelist).
   * @param {SafeChildren} [children=[]] - Filhos do elemento.
   * @returns {HTMLElementTagNameMap[T]} O elemento criado e blindado.
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

      // 5. Atributos PERIGOSOS - BLOQUEAR
      if (DOMSafe.#DANGEROUS_ATTRIBUTES.has(key.toLowerCase())) {
        console.error(`[DOMSafe] Blocked dangerous attribute: ${key}`);
        return;
      }

      // 6. Atributos de URL (href, src, action) - BLINDAGEM XSS
      if (['href', 'src', 'action', 'formAction', 'poster', 'background'].includes(key)) {
        const sanitized = DOMSafe.sanitizeUrl(String(value));
        if (sanitized) {
          element.setAttribute(key, sanitized);
        }
        return;
      }

      // 7. Atributos seguros da whitelist
      if (DOMSafe.#SAFE_ATTRIBUTES.has(key.toLowerCase())) {
        if (value !== null && value !== undefined && value !== false) {
          element.setAttribute(key, String(value));
        }
        return;
      }

      // 8. Atributos de dados (data-*) e acessibilidade (aria-*)
      if (key.toLowerCase().startsWith('data-') || key.toLowerCase().startsWith('aria-')) {
        element.setAttribute(key, String(value));
        return;
      }

      // 9. Atributo desconhecido - LOG e BLOQUEAR por segurança
      console.warn(`[DOMSafe] Unknown attribute blocked: ${key}`);
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

  /**
   * Cache da política TrustedTypes
   * @type {TrustedTypePolicy|null}
   */
  static #policy = null;

  /**
   * Realiza parse seguro de HTML lidando com TrustedTypes.
   * Essencial para o Scraper funcionar em ambientes com CSP estrita.
   * @param {string} html - String HTML bruta.
   * @returns {Document} Documento parseado.
   */
  static parseHTML(html) {
    const parser = new DOMParser();

    // Se TrustedTypes não estiver disponível, parse normal
    if (!window.trustedTypes) {
      return parser.parseFromString(html, 'text/html');
    }

    // Criar ou recuperar política
    if (!DOMSafe.#policy) {
      try {
        DOMSafe.#policy = window.trustedTypes.createPolicy('dom-safe-parser', {
          createHTML: (string) => string, // Pass-through intencional para parsing
        });
      } catch (e) {
        // Fallback se política já existir com mesmo nome (raro em extensão, comum em testes)
        console.warn('[DOMSafe] Falha ao criar política TrustedTypes:', e);
      }
    }

    const finalHtml = DOMSafe.#policy
      ? DOMSafe.#policy.createHTML(html)
      : html;

    return parser.parseFromString(finalHtml, 'text/html');
  }
}
