/**
 * @file csp.test.js
 * @description Teste de validação da configuração de CSP no manifest.json
 */
const fs = require('fs');
const path = require('path');

describe('Security: CSP Configuration', () => {
  const manifestPath = path.resolve(__dirname, '../manifest.json');
  let manifest;

  beforeAll(() => {
    const content = fs.readFileSync(manifestPath, 'utf8');
    manifest = JSON.parse(content);
  });

  it('should have a strict CSP configuration', () => {
    expect(manifest.content_security_policy).toBeDefined();

    const csp = manifest.content_security_policy.extension_pages;
    expect(csp).toBeDefined();

    // Verifica Trusted Types
    expect(csp).toContain("require-trusted-types-for 'script'");
    expect(csp).toContain('trusted-types dom-safe-policy default');

    // Verifica restrições padrão
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("object-src 'none'");
  });

  it('should use module type for background service worker', () => {
    expect(manifest.background.service_worker).toBeDefined();
    expect(manifest.background.type).toBe('module');
  });
});
