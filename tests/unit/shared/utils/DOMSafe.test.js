/**
 * @jest-environment jsdom
 */
import { DOMSafe } from '../../../../shared/utils/DOMSafe.js';

describe('DOMSafe', () => {
  describe('escapeHTML', () => {
    it('deve escapar caracteres especiais HTML', () => {
      const input = '<script>alert("xss")</script>';
      const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
      expect(DOMSafe.escapeHTML(input)).toBe(expected);
    });

    it('deve retornar string vazia para inputs não string', () => {
      expect(DOMSafe.escapeHTML(null)).toBe('');
      expect(DOMSafe.escapeHTML(undefined)).toBe('');
      expect(DOMSafe.escapeHTML(/** @type {any} */ (123))).toBe('');
    });
  });

  describe('createElement', () => {
    it('deve criar um elemento com tag especificada', () => {
      const el = DOMSafe.createElement('div');
      expect(el.tagName).toBe('DIV');
    });

    it('deve aplicar atributos corretamente', () => {
      const el = DOMSafe.createElement('a', {
        href: 'https://example.com',
        className: 'btn primary',
        id: 'my-link',
        'data-test': 'value',
      });

      expect(el.getAttribute('href')).toBe('https://example.com');
      expect(el.className).toBe('btn primary');
      expect(el.id).toBe('my-link');
      expect(el.getAttribute('data-test')).toBe('value');
    });

    it('deve lidar com atributo dataset como objeto', () => {
      const el = DOMSafe.createElement('div', {
        dataset: { id: '123', type: 'test' },
      });
      expect(el.dataset.id).toBe('123');
      expect(el.dataset.type).toBe('test');
    });

    it('deve adicionar listeners de eventos', () => {
      const spy = jest.fn();
      const el = DOMSafe.createElement('button', {
        onClick: spy,
      });

      el.click();
      expect(spy).toHaveBeenCalled();
    });

    it('deve adicionar filhos de texto', () => {
      const el = DOMSafe.createElement('span', {}, 'Olá Mundo');
      expect(el.textContent).toBe('Olá Mundo');
    });

    it('deve adicionar filhos HTMLElement', () => {
      const child = document.createElement('strong');
      child.textContent = 'Negrito';
      const el = DOMSafe.createElement('p', {}, child);

      expect(el.innerHTML).toBe('<strong>Negrito</strong>');
    });

    it('deve lidar com array de filhos mistos', () => {
      const child = document.createElement('br');
      const el = DOMSafe.createElement('div', {}, ['Texto', child, 'Mais Texto']);

      expect(el.childNodes).toHaveLength(3);
      expect(el.childNodes[0].textContent).toBe('Texto');
      expect(/** @type {Element} */ (el.childNodes[1]).tagName).toBe('BR');
      expect(el.childNodes[2].textContent).toBe('Mais Texto');
    });

    it('deve ignorar atributos nulos ou falsos', () => {
      const el = DOMSafe.createElement('input', {
        disabled: false, // não deve adicionar atributo disabled
        required: true,
        value: null,
      });

      expect(el.hasAttribute('disabled')).toBe(false);
      expect(el.hasAttribute('required')).toBe(true);
      expect(el.hasAttribute('value')).toBe(false);
    });
  });
});
