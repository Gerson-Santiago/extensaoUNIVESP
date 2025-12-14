import { DomainManager } from '../sidepanel/logic/domainManager.js';
import { CONSTANTS } from '../shared/utils/settings.js';

describe('DomainManager', () => {
  describe('getCurrentDomain', () => {
    test('Should return custom domain if provided', () => {
      expect(DomainManager.getCurrentDomain('any@email.com', '@custom.com')).toBe('@custom.com');
    });

    test('Should extract domain from email if no custom domain', () => {
      expect(DomainManager.getCurrentDomain('user@extracted.com', null)).toBe('@extracted.com');
    });

    test('Should return default domain if nothing provided', () => {
      expect(DomainManager.getCurrentDomain(null, null)).toBe(CONSTANTS.DEFAULT_DOMAIN);
    });
  });

  describe('getDefaultDomain', () => {
    test('Should return constant default domain', () => {
      expect(DomainManager.getDefaultDomain()).toBe(CONSTANTS.DEFAULT_DOMAIN);
    });
  });
});
