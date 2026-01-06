/**
 * @jest-environment jsdom
 */
import { DOMSafe } from '../utils/DOMSafe.js';

describe('DOMSafe Runtime Bug Fixes (ISSUE-045)', () => {
    test('deve permitir atributos de input range (min, max, step)', () => {
        const input = DOMSafe.createElement('input', {
            type: 'range',
            min: '1',
            max: '10',
            step: '1'
        });

        expect(input.getAttribute('min')).toBe('1');
        expect(input.getAttribute('max')).toBe('10');
        expect(input.getAttribute('step')).toBe('1');
    });

    test('deve permitir atributo checked para checkboxes', () => {
        // Teste com booleano true
        const checkbox = DOMSafe.createElement('input', {
            type: 'checkbox',
            checked: true
        });

        // Em HTML, checked="" ou checked
        expect(checkbox.hasAttribute('checked')).toBe(true);
    });

    test('deve permitir atributo selected para options', () => {
        const option = DOMSafe.createElement('option', {
            value: 'foo',
            selected: true
        });

        expect(option.hasAttribute('selected')).toBe(true);
    });
});
