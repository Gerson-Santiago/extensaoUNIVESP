const DEFAULT_DOMAIN = "@aluno.univesp.br";

/**
 * Formata um RA e Domínio para um email completo.
 * @param {string} ra 
 * @param {string} domain 
 * @returns {Object} { fullEmail, cleanDomain }
 */
export function formatEmail(ra, domain) {
    let cleanRa = ra.trim();
    if (cleanRa.includes('@')) {
        cleanRa = cleanRa.split('@')[0];
    }

    let cleanDomain = domain.trim();
    if (!cleanDomain.startsWith('@')) {
        cleanDomain = '@' + cleanDomain;
    }

    return {
        fullEmail: cleanRa + cleanDomain,
        cleanDomain: cleanDomain
    };
}

/**
 * Extrai o RA de um email completo ou retorna o próprio valor se não for email.
 * @param {string} text 
 * @returns {string}
 */
export function extractRa(text) {
    if (!text) return '';
    const parts = text.split('@');
    return parts[0];
}

/**
 * Extrai o domínio de um email ou retorna o padrão.
 * @param {string} userEmail - Email completo salvo
 * @param {string} customDomain - Domínio customizado salvo
 * @returns {string}
 */
export function resolveDomain(userEmail, customDomain) {
    if (customDomain) return customDomain;

    if (userEmail && userEmail.includes('@')) {
        const parts = userEmail.split('@');
        if (parts.length > 1) {
            return '@' + parts.slice(1).join('@');
        }
    }

    return DEFAULT_DOMAIN;
}

export const CONSTANTS = {
    DEFAULT_DOMAIN
};
