import { SettingsController } from '../logic/SettingsController.js';

describe('SettingsController (About & Diagnostics)', () => {
    let controller;
    let mockToaster;
    let mockLogger;

    beforeEach(() => {
        mockToaster = { show: jest.fn() };
        mockLogger = { info: jest.fn(), error: jest.fn() };

        // Reset localStorage mock
        localStorage.clear();

        // Mock chrome.runtime.getManifest
        global.chrome = /** @type {any} */ ({
            runtime: {
                getManifest: jest.fn().mockReturnValue({ version: '1.0.0' }),
            },
        });

        controller = new SettingsController({
            toaster: mockToaster,
            logger: mockLogger,
        });
    });

    describe('handleToggleDiagnostic', () => {
        it('should enable diagnostic mode correctly', async () => {
            await controller.handleToggleDiagnostic(true);

            expect(localStorage.getItem('UNIVESP_DEBUG')).toBe('true');
            expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('ENABLED'));
            expect(mockToaster.show).toHaveBeenCalledWith(expect.stringContaining('ativado'), 'info');
        });

        it('should disable diagnostic mode correctly', async () => {
            localStorage.setItem('UNIVESP_DEBUG', 'true');
            await controller.handleToggleDiagnostic(false);

            expect(localStorage.getItem('UNIVESP_DEBUG')).toBeNull();
            expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('DISABLED'));
            expect(mockToaster.show).toHaveBeenCalledWith(expect.stringContaining('desativado'), 'info');
        });
    });

    describe('getAppVersion', () => {
        it('should return version from manifest', () => {
            const version = controller.getAppVersion();
            expect(version).toBe('1.0.0');
        });
    });
});
