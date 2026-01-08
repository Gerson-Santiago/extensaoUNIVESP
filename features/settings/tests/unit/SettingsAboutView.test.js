import { jest } from '@jest/globals';
import { SettingsAboutView } from '../../views/SettingsAboutView.js';

describe('SettingsAboutView', () => {
    let view;
    let mockProps;

    beforeEach(() => {
        mockProps = {
            version: '1.0.0',
            diagnosticEnabled: false,
            onToggleDiagnostic: jest.fn(),
        };

        // Clear DOM before each test
        document.body.innerHTML = '';
    });

    test('should render without crashing', () => {
        // Act
        view = new SettingsAboutView(mockProps);
        const container = document.createElement('div');
        view.render(container);

        // Assert
        expect(container.innerHTML).not.toBe('');
        expect(container.querySelector('.settings-about')).toBeTruthy();
    });

    test('should display version correctly', () => {
        // Act
        view = new SettingsAboutView(mockProps);

        // Assert
        // Note: We need to see how it's rendered. It uses DOMSafe.
        // Based on code: <span class="app-version">v${DOMSafe.escapeHTML(this.version)}</span>
        expect(view.element.innerHTML).toContain('v1.0.0');
    });

    test('should toggle diagnostic mode', () => {
        // Act
        view = new SettingsAboutView(mockProps);

        // Find toggle
        const toggle = view.element.querySelector('#diagnostic-toggle');
        expect(toggle).toBeTruthy();

        // Simulate change
        /** @type {HTMLInputElement} */ (toggle).checked = true;
        toggle.dispatchEvent(new Event('change'));

        // Assert
        expect(mockProps.onToggleDiagnostic).toHaveBeenCalledWith(true);
    });
});
