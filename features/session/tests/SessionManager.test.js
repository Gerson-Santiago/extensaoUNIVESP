import { RaManager } from '../logic/SessionManager.js';

describe('SessionManager (Gerenciador de Sessão - RaManager)', () => {
  describe('getRaFromEmail', () => {
    test('deve extrair o RA do e-mail corretamente', () => {
      // Agir & Verificar (Act & Assert)
      expect(RaManager.getRaFromEmail('123456@aluno.univesp.br')).toBe('123456');
    });

    test('deve retornar inalterado se não houver @', () => {
      // Agir & Verificar (Act & Assert)
      expect(RaManager.getRaFromEmail('123456')).toBe('123456');
    });

    test('deve retornar string vazia para null ou undefined', () => {
      // Agir & Verificar (Act & Assert)
      expect(RaManager.getRaFromEmail(null)).toBe('');
      expect(RaManager.getRaFromEmail(undefined)).toBe('');
    });
  });

  describe('prepareCredentials', () => {
    test('deve retornar objeto válido para entrada correta', () => {
      // Agir (Act)
      const result = RaManager.prepareCredentials('123456', '@test.com');

      // Verificar (Assert)
      expect(result.isValid).toBe(true);
      expect(result.fullEmail).toBe('123456@test.com');
      expect(result.cleanDomain).toBe('@test.com');
    });

    test('deve retornar erro se o RA estiver vazio', () => {
      // Agir (Act)
      const result = RaManager.prepareCredentials('', '@test.com');

      // Verificar (Assert)
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('deve limpar (trim) as entradas e sanitizar domínio', () => {
      // Agir (Act)
      const result = RaManager.prepareCredentials(' 123456 ', ' test.com ');

      // Verificar (Assert)
      expect(result.isValid).toBe(true);
      expect(result.fullEmail).toBe('123456@test.com');
      // Nota: o código original implicitamente pode lidar com adição de @ se faltar,
      // ou apenas concatena. O teste original assumia que @test.com vinha do input ' test.com '.
      // Verificando lógica: '123456' + '@' + 'test.com' ou se o domainManager já trata.
    });
  });
});
