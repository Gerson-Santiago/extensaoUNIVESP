/**
 * @file TrustedTypesPolicy.js
 * @description Implementação da Trusted Types API para blindagem contra XSS.
 */

let domSafePolicy = null;

/**
 * Inicializa a política de Trusted Types.
 * Deve ser chamado no início da execução (background, popup, content scripts).
 */
export function initTrustedTypes() {
  if (domSafePolicy) return; // Já inicializado

  // @ts-ignore - Window extension
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
      // @ts-ignore
      domSafePolicy = window.trustedTypes.createPolicy('dom-safe-policy', {
        // 1. createHTML: Validação para innerHTML (evitar se possível)
        createHTML: (input) => {
          // NUNCA permitir HTML arbitrário.
          // Se for estritamente necessário, usar DOMPurify aqui.
          // Por padrão na Issue-030, não usamos innerHTML, então retornamos string vazia ou erro.
          console.warn('[Security] createHTML called blocked by policy:', input);
          throw new Error('Direct HTML injection is forbidden. Use DOMSafe.createElement.');
        },

        // 2. createScriptURL: Validação para <script src="...">
        createScriptURL: (input) => {
          // Whitelist de origens para scripts
          const allowedOrigins = [
            chrome.runtime.getURL(''), // Nossa própria extensão
          ];

          if (allowedOrigins.some((origin) => input.startsWith(origin))) {
            return input;
          }

          console.error('[Security] Script URL blocked:', input);
          throw new Error('Script URL source not allowed.');
        },

        // 3. createScript: Validação para <script>...</script> inline (eval, etc)
        createScript: (_input) => {
          console.error('[Security] Inline script execution blocked.');
          throw new Error('Inline scripts are strictly forbidden.');
        },
      });
      // eslint-disable-next-line no-console
      console.log('[Security] Trusted Types Policy "dom-safe-policy" active.');
    } catch (e) {
      console.warn('[Security] Failed to create Trusted Types policy:', e);
    }
  } else {
    console.warn('[Security] Trusted Types API not supported in this browser.');
  }
}

/**
 * Retorna a política ativa ou null.
 * @returns {Object|null}
 */
export function getTrustedTypesPolicy() {
  return domSafePolicy;
}
