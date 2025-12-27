import {
  formatEmail,
  extractRa,
  resolveDomain,
  CONSTANTS,
} from '../../../shared/utils/settings.js';

describe('Settings - Formatação de Email e Domínio', () => {
  describe('formatEmail()', () => {
    test('Deve formatar RA simples com domínio que já tem @', () => {
      // Act
      const result = formatEmail('1234567', '@aluno.univesp.br');

      // Assert
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve adicionar @ ao domínio se não tiver', () => {
      // Act
      const result = formatEmail('1234567', 'aluno.univesp.br');

      // Assert
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve remover @ do RA se já estiver incluído', () => {
      // Act
      const result = formatEmail('1234567@outro.com', '@aluno.univesp.br');

      // Assert
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve fazer trim em RA com espaços', () => {
      // Act
      const result = formatEmail('  1234567  ', '@aluno.univesp.br');

      // Assert
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve fazer trim no domínio com espaços', () => {
      // Act
      const result = formatEmail('1234567', '  @aluno.univesp.br  ');

      // Assert
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve lidar com RA e domínio ambos precisando de limpeza', () => {
      // Act
      const result = formatEmail('  1234567@antigo.com  ', '  custom.com  ');

      // Assert
      expect(result.fullEmail).toBe('1234567@custom.com');
      expect(result.cleanDomain).toBe('@custom.com');
    });
  });

  describe('extractRa()', () => {
    test('Deve extrair RA de email completo', () => {
      // Act
      const ra = extractRa('1234567@aluno.univesp.br');

      // Assert
      expect(ra).toBe('1234567');
    });

    test('Deve retornar RA se já estiver sem @', () => {
      // Act
      const ra = extractRa('1234567');

      // Assert
      expect(ra).toBe('1234567');
    });

    test('Deve retornar string vazia para null', () => {
      // Act
      const ra = extractRa(null);
      // Assert
      expect(ra).toBe('');
    });

    test('Deve retornar string vazia para undefined', () => {
      // Act
      const ra = extractRa(undefined);
      // Assert
      expect(ra).toBe('');
    });

    test('Deve retornar string vazia para string vazia', () => {
      // Act
      const ra = extractRa('');
      // Assert
      expect(ra).toBe('');
    });

    test('Deve lidar com múltiplos @ no email', () => {
      // Act
      const ra = extractRa('user@test@domain.com');
      // Assert
      expect(ra).toBe('user');
    });
  });

  describe('resolveDomain()', () => {
    test('Deve priorizar customDomain se fornecido', () => {
      // Act
      const domain = resolveDomain('1234567@outro.br', '@custom.com');
      // Assert
      expect(domain).toBe('@custom.com');
    });

    test('Deve extrair domínio de userEmail se não há customDomain', () => {
      // Act
      const domain = resolveDomain('1234567@outro.br', null);
      // Assert
      expect(domain).toBe('@outro.br');
    });

    test('Deve retornar DEFAULT_DOMAIN se ambos são null', () => {
      // Act
      const domain = resolveDomain(null, null);
      // Assert
      expect(domain).toBe('@aluno.univesp.br');
    });

    test('Deve retornar DEFAULT_DOMAIN se userEmail não tem @', () => {
      // Act
      const domain = resolveDomain('1234567', null);
      // Assert
      expect(domain).toBe('@aluno.univesp.br');
    });

    test('Deve retornar DEFAULT_DOMAIN se userEmail é string vazia', () => {
      // Act
      const domain = resolveDomain('', null);
      // Assert
      expect(domain).toBe('@aluno.univesp.br');
    });

    test('Deve lidar com múltiplos @ no userEmail', () => {
      // Act
      const domain = resolveDomain('user@test@domain.com', null);
      // Assert
      expect(domain).toBe('@test@domain.com');
    });

    test('Deve ignorar userEmail se customDomain está presente', () => {
      // Act
      const domain = resolveDomain('1234567@ignorado.com', '@priority.com');
      // Assert
      expect(domain).toBe('@priority.com');
    });
  });

  describe('CONSTANTS', () => {
    test('Deve ter DEFAULT_DOMAIN definido corretamente', () => {
      expect(CONSTANTS.DEFAULT_DOMAIN).toBe('@aluno.univesp.br');
    });

    test('DEFAULT_DOMAIN deve ser uma string', () => {
      expect(typeof CONSTANTS.DEFAULT_DOMAIN).toBe('string');
    });

    test('DEFAULT_DOMAIN deve começar com @', () => {
      expect(CONSTANTS.DEFAULT_DOMAIN.startsWith('@')).toBe(true);
    });
  });
});
