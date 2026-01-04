/**
 * @file security.js
 * @description Definições de Tipos JSDoc para Segurança Extrema
 * Fornece tipos "branded" e interfaces estritas para prevenção de XSS.
 */

/**
 * HTML sanitizado e seguro para inserção no DOM.
 * Utiliza "Brand Type" para impedir que strings comuns sejam tratadas como HTML seguro.
 * @typedef {string & { __brand: 'TrustedHTML' }} TrustedHTML
 */

/**
 * URL de script validada e segura (protocolo whitelist).
 * @typedef {string & { __brand: 'TrustedScriptURL' }} TrustedScriptURL
 */

/**
 * URL genérica validada (http/https/chrome-extension).
 * @typedef {string & { __brand: 'SafeURL' }} SafeURL
 */

/**
 * Atributos permitidos na whitelist de segurança para DOMSafe.createElement.
 * Qualquer atributo fora desta lista deve ser rejeitado ou logado como warning.
 * @typedef {Object} SafeAttributes
 * @property {string} [id] - ID único do elemento
 * @property {string} [className] - Classes CSS (ou 'class')
 * @property {string} [class] - Alias para className
 * @property {string} [title] - Texto de tooltip
 * @property {string} [aria-label] - Label de acessibilidade
 * @property {string} [aria-describedby] - ID de descrição
 * @property {string} [role] - Papel ARIA
 * @property {number|string} [tabindex] - Ordem de tabulação
 * @property {boolean|string} [disabled] - Estado desabilitado
 * @property {boolean|string} [readonly] - Estado somente leitura
 * @property {boolean|string} [required] - Campo obrigatório
 * @property {string} [placeholder] - Texto placeholder
 * @property {string|number|null} [value] - Valor do input
 * @property {string} [type] - Tipo do input (text, button, etc)
 * @property {string} [name] - Nome do campo
 * @property {string} [alt] - Texto alternativo para imagens
 * @property {string} [for] - ID do alvo (label)
 * @property {string|number} [width] - Largura (imagens/tabelas)
 * @property {string|number} [height] - Altura (imagens/tabelas)
 * @property {string|number} [min] - Valor mínimo
 * @property {string|number} [max] - Valor máximo
 * @property {string|number} [step] - Passo do input
 * @property {boolean|string} [checked] - Checkbox marcado
 * @property {string} [loading] - Lazy loading
 * @property {string|number} [frameborder] - Borda de Iframe
 * @property {string|number} [frameBorder] - Alias para frameborder
 * @property {string|number} [marginwidth] - Margem Iframe
 * @property {string|number} [marginheight] - Margem Iframe
 * @property {boolean|string} [allowfullscreen] - Fullscreen Iframe
 * @property {string} [allow] - Permissions Policy
 * @property {SafeURL|string} [href] - Link (deve ser sanitizado)
 * @property {SafeURL|string} [src] - Fonte (deve ser sanitizada)
 * @property {SafeURL|string} [action] - Destino de form (deve ser sanitizado)
 * @property {SafeURL|string} [poster] - Imagem de vídeo
 * @property {SafeURL|string} [background] - Background (legado)
 * @property {string} [target] - Alvo do link
 * @property {string} [rel] - Relacionamento do link
 * @property {Object.<string, string>} [dataset] - Atributos data-*
 * @property {string} [data-match-pattern] - Padrão de match (HomeView)
 * @property {string} [data-test] - Atributo de teste
 * @property {Object|string} [style] - Estilos CSS inline
 * @property {Function} [onClick] - Handler de clique
 * @property {Function} [onclick] - Handler de clique (lowercase)
 * @property {Function} [onChange] - Handler de mudança
 * @property {Function} [onInput] - Handler de input
 * @property {Function} [onSubmit] - Handler de submissão
 * @property {Function|string} [onmouseover] - Handler de mouseover (teste)
 */

/**
 * Tipos de filhos seguros permitidos para inserção.
 * Restringe explicitamente contra HTML raw não confiável.
 * @typedef {string | Node | TrustedHTML | Array<string|Node|TrustedHTML>} SafeChildren
 */

export {};
