import { resolveDomain, CONSTANTS } from '../../shared/utils/settings.js';

export class DomainManager {
    /**
     * Resolve o domínio atual baseado nas configurações salvas.
     * @param {string} userEmail
     * @param {string} customDomain
     * @returns {string}
     */
    static getCurrentDomain(userEmail, customDomain) {
        return resolveDomain(userEmail, customDomain);
    }

    /**
     * Retorna o domínio padrão do sistema.
     * @returns {string}
     */
    static getDefaultDomain() {
        return CONSTANTS.DEFAULT_DOMAIN;
    }
}
