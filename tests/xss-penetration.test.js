/**
 * @file xss-penetration.test.js
 * @description Suite de testes de penetração XSS automatizados
 * Baseado em payloads OWASP e vetores de ataque comuns.
 */

import { DOMSafe } from '../shared/utils/DOMSafe.js';

describe('Security: XSS Penetration Testing', () => {
  // Payloads comuns de XSS (OWASP Cheat Sheet)
  const XSS_PAYLOADS = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '<svg/onload=alert("XSS")>',
    'javascript:alert("XSS")',
    'data:text/html,<script>alert("XSS")</script>',
    '<iframe src="javascript:alert(\'XSS\')">',
    '<object data="javascript:alert(\'XSS\')">',
    '<embed src="javascript:alert(\'XSS\')">',
    '<a href="javascript:alert(\'XSS\')">click</a>',
    '<form action="javascript:alert(\'XSS\')">',
    '"><script>alert(String.fromCharCode(88,83,83))</script>',
    '<IMG SRC=`javascript:alert("XSS")`>',
    "<IMG SRC=javascript:alert('XSS')>",
    "<IMG SRC=JaVaScRiPt:alert('XSS')>",
    '<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>',
  ];

  const DANGEROUS_ATTRIBUTES = ['srcdoc', 'codebase', 'archive', 'cite'];

  describe('DOMSafe.escapeHTML', () => {
    it('should escape all XSS characters', () => {
      const input = '<script>alert("XSS")&"\'</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&amp;&quot;&#039;&lt;/script&gt;';
      expect(DOMSafe.escapeHTML(input)).toBe(expected);
    });

    it('should handle non-string inputs safely', () => {
      // @ts-ignore - Testando robustez em runtime
      expect(DOMSafe.escapeHTML(null)).toBe('');
      // @ts-ignore - Testando robustez em runtime
      expect(DOMSafe.escapeHTML(undefined)).toBe('');
      // @ts-ignore - Testando robustez em runtime
      expect(DOMSafe.escapeHTML(123)).toBe('');
    });
  });

  describe('DOMSafe.sanitizeUrl', () => {
    it('should allow benign URLs', () => {
      const cases = [
        { input: 'https://univesp.br', expected: 'https://univesp.br/' },
        { input: 'http://example.com/path?q=1', expected: 'http://example.com/path?q=1' },
        // JSDOM resolve caminhos relativos na base http://localhost
        { input: '/local/path', expected: 'http://localhost/local/path' },
        {
          input: 'chrome-extension://abc/popup.html',
          expected: 'chrome-extension://abc/popup.html',
        },
      ];
      cases.forEach(({ input, expected }) => {
        expect(DOMSafe.sanitizeUrl(input)).toBe(expected);
      });
    });

    it('should block javascript: protocol', () => {
      const vectors = [
        'javascript:alert(1)',
        'JaVaScRiPt:alert(1)',
        'javascriptS:alert(1)', // protocolo invÃ¡lido mas bloqueado por whitelist
        ' javascript:alert(1)', // espaÃ§o inicial
      ];
      vectors.forEach((url) => {
        expect(DOMSafe.sanitizeUrl(url)).toBe('');
      });
    });

    it('should block data: and vbscript:', () => {
      const vectors = ['data:text/html,<script>alert(1)</script>', 'vbscript:msgbox("xss")'];
      vectors.forEach((url) => {
        expect(DOMSafe.sanitizeUrl(url)).toBe('');
      });
    });

    it('should block malformed URLs that fail parsing', () => {
      // 'not a url::' pode ser interpretado como relativo ou protocolo dependendo do browser
      // Vamos usar algo com caracteres inválidos para URL se o parser for estrito
      // Ou garantir que se falhar, retorna vazio
      expect(DOMSafe.sanitizeUrl('http://[invalid-ipv6]')).toBe('');
    });
  });

  describe('DOMSafe.createElement (XSS Injection)', () => {
    it('should treat children as text, not HTML', () => {
      XSS_PAYLOADS.forEach((payload) => {
        const div = DOMSafe.createElement('div', {}, [payload]);
        // O payload deve estar TEXT CONTENT, não interpretado como HTML
        expect(div.innerHTML).not.toContain('<script');
        // A representação interna deve ser escapada
        expect(div.textContent).toBe(payload);
      });
    });

    it('should sanitize URL attributes (href, src)', () => {
      const a = DOMSafe.createElement('a', {
        href: 'javascript:alert(1)',
      });
      // Atributo href deve estar vazio ou não definido (dependendo da impl)
      // Na impl atual, se retornar '', não seta o atributo?
      // Revisitando DOMSafe.js: if (sanitized) setAttribute
      // Então se for '', não deve ter o atributo.
      expect(a.hasAttribute('href')).toBe(false);

      const validA = DOMSafe.createElement('a', {
        href: 'https://google.com',
      });
      // Navegadores/URL constructor adicionam trailing slash ao normalizar
      expect(validA.getAttribute('href')).toBe('https://google.com/');
    });

    it('should block blacklist attributes', () => {
      DANGEROUS_ATTRIBUTES.forEach((attr) => {
        const div = DOMSafe.createElement('div', {
          [attr]: 'malicious',
        });
        expect(div.hasAttribute(attr)).toBe(false);
      });
    });

    it('should block unknown attributes', () => {
      const div = DOMSafe.createElement('div', {
        // @ts-ignore - Testando atributos inválidos
        onmouseover: 'alert(1)',
        // @ts-ignore - Testando atributos inválidos
        'style-expression': 'x',
        // @ts-ignore - Testando atributos inválidos
        'unknown-attr': 'value',
      });

      expect(div.hasAttribute('onmouseover')).toBe(false); // Eventos como string bloqueados fora de dataset/onX function
      expect(div.hasAttribute('unknown-attr')).toBe(false);

      // Test event listener via function (deve permitir)
      const handler = jest.fn();
      const btn = DOMSafe.createElement('button', {
        onClick: handler,
      });
      // onClick é tratado e adiciona event listener
      btn.click();
      expect(handler).toHaveBeenCalled();
    });

    it('should allow data-* and aria-* attributes', () => {
      const div = DOMSafe.createElement('div', {
        'data-test': '123',
        'aria-label': 'Test',
        'data-match-pattern': 'custom',
      });
      expect(div.getAttribute('data-test')).toBe('123');
      expect(div.getAttribute('aria-label')).toBe('Test');
      expect(div.getAttribute('data-match-pattern')).toBe('custom');
    });
  });
});
