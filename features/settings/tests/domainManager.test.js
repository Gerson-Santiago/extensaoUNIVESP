import { DomainManager } from '../logic/EmailDomainValidator.js';
import { CONSTANTS } from '../../../shared/utils/settings.js';

describe('DomainManager', () => {
  describe('getCurrentDomain', () => {
    test('deve retornar o domínio personalizado se fornecido', () => {
      // Agir & Verificar (Act & Assert)
      expect(DomainManager.getCurrentDomain('any@email.com', '@custom.com')).toBe('@custom.com');
    });

    test('deve extrair o domínio do e-mail se nenhum domínio personalizado for fornecido', () => {
      // Agir & Verificar (Act & Assert)
      expect(DomainManager.getCurrentDomain('user@extracted.com', null)).toBe('@extracted.com');
    });

    test('deve retornar o domínio padrão se nada for fornecido', () => {
      // Agir & Verificar (Act & Assert)
      expect(DomainManager.getCurrentDomain(null, null)).toBe(CONSTANTS.DEFAULT_DOMAIN);
    });
  });

  describe('getDefaultDomain', () => {
    test('deve retornar o domínio padrão constante', () => {
      // Agir & Verificar (Act & Assert)
      expect(DomainManager.getDefaultDomain()).toBe(CONSTANTS.DEFAULT_DOMAIN);
    });
  });
});
