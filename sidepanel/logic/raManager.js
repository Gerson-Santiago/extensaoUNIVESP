import { formatEmail, extractRa } from '../../shared/utils/settings.js';

export class RaManager {
  /**
   * Obtém o RA formatado do email completo.
   * @param {string} userEmail
   * @returns {string}
   */
  static getRaFromEmail(userEmail) {
    return extractRa(userEmail);
  }

  /**
   * Formata e valida o RA e Domínio para salvamento.
   * @param {string} ra
   * @param {string} domain
   * @returns {{isValid: boolean, fullEmail: string, cleanDomain: string, error?: string}}
   */
  static prepareCredentials(ra, domain) {
    if (!ra || !ra.trim()) {
      return {
        isValid: false,
        error: 'Por favor, digite o seu RA.',
        fullEmail: '',
        cleanDomain: '',
      };
    }

    const { fullEmail, cleanDomain } = formatEmail(ra, domain);

    return {
      isValid: true,
      fullEmail,
      cleanDomain,
    };
  }
}
