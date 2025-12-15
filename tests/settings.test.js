import { formatEmail, extractRa, resolveDomain, CONSTANTS } from '../shared/utils/settings.js';

describe('Settings - Formatação de Email e Domínio', () => {
  describe('formatEmail()', () => {
    test('Deve formatar RA simples com domínio que já tem @', () => {
      const result = formatEmail('1234567', '@aluno.univesp.br');
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve adicionar @ ao domínio se não tiver', () => {
      const result = formatEmail('1234567', 'aluno.univesp.br');
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve remover @ do RA se já estiver incluído', () => {
      const result = formatEmail('1234567@outro.com', '@aluno.univesp.br');
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve fazer trim em RA com espaços', () => {
      const result = formatEmail('  1234567  ', '@aluno.univesp.br');
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve fazer trim no domínio com espaços', () => {
      const result = formatEmail('1234567', '  @aluno.univesp.br  ');
      expect(result.fullEmail).toBe('1234567@aluno.univesp.br');
      expect(result.cleanDomain).toBe('@aluno.univesp.br');
    });

    test('Deve lidar com RA e domínio ambos precisando de limpeza', () => {
      const result = formatEmail('  1234567@antigo.com  ', '  custom.com  ');
      expect(result.fullEmail).toBe('1234567@custom.com');
      expect(result.cleanDomain).toBe('@custom.com');
    });
  });

  describe('extractRa()', () => {
    test('Deve extrair RA de email completo', () => {
      const ra = extractRa('1234567@aluno.univesp.br');
      expect(ra).toBe('1234567');
    });

    test('Deve retornar RA se já estiver sem @', () => {
      const ra = extractRa('1234567');
      expect(ra).toBe('1234567');
    });

    test('Deve retornar string vazia para null', () => {
      const ra = extractRa(null);
      expect(ra).toBe('');
    });

    test('Deve retornar string vazia para undefined', () => {
      const ra = extractRa(undefined);
      expect(ra).toBe('');
    });

    test('Deve retornar string vazia para string vazia', () => {
      const ra = extractRa('');
      expect(ra).toBe('');
    });

    test('Deve lidar com múltiplos @ no email', () => {
      const ra = extractRa('user@test@domain.com');
      expect(ra).toBe('user');
    });
  });

  describe('resolveDomain()', () => {
    test('Deve priorizar customDomain se fornecido', () => {
      const domain = resolveDomain('1234567@outro.br', '@custom.com');
      expect(domain).toBe('@custom.com');
    });

    test('Deve extrair domínio de userEmail se não há customDomain', () => {
      const domain = resolveDomain('1234567@outro.br', null);
      expect(domain).toBe('@outro.br');
    });

    test('Deve retornar DEFAULT_DOMAIN se ambos são null', () => {
      const domain = resolveDomain(null, null);
      expect(domain).toBe('@aluno.univesp.br');
    });

    test('Deve retornar DEFAULT_DOMAIN se userEmail não tem @', () => {
      const domain = resolveDomain('1234567', null);
      expect(domain).toBe('@aluno.univesp.br');
    });

    test('Deve retornar DEFAULT_DOMAIN se userEmail é string vazia', () => {
      const domain = resolveDomain('', null);
      expect(domain).toBe('@aluno.univesp.br');
    });

    test('Deve lidar com múltiplos @ no userEmail', () => {
      const domain = resolveDomain('user@test@domain.com', null);
      expect(domain).toBe('@test@domain.com');
    });

    test('Deve ignorar userEmail se customDomain está presente', () => {
      const domain = resolveDomain('1234567@ignorado.com', '@priority.com');
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
