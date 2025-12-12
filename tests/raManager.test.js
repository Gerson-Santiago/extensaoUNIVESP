import { RaManager } from '../sidepanel/logic/raManager.js';

describe('RaManager', () => {
    describe('getRaFromEmail', () => {
        test('Should extract RA from email', () => {
            expect(RaManager.getRaFromEmail('123456@aluno.univesp.br')).toBe('123456');
        });

        test('Should return unchanged if no @', () => {
            expect(RaManager.getRaFromEmail('123456')).toBe('123456');
        });

        test('Should return empty string for null/undefined', () => {
            expect(RaManager.getRaFromEmail(null)).toBe('');
            expect(RaManager.getRaFromEmail(undefined)).toBe('');
        });
    });

    describe('prepareCredentials', () => {
        test('Should return valid object for correct input', () => {
            const result = RaManager.prepareCredentials('123456', '@test.com');
            expect(result.isValid).toBe(true);
            expect(result.fullEmail).toBe('123456@test.com');
            expect(result.cleanDomain).toBe('@test.com');
        });

        test('Should return error if RA is empty', () => {
            const result = RaManager.prepareCredentials('', '@test.com');
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });

        test('Should clean inputs', () => {
            const result = RaManager.prepareCredentials(' 123456 ', ' test.com ');
            expect(result.isValid).toBe(true);
            expect(result.fullEmail).toBe('123456@test.com');
        });
    });
});
