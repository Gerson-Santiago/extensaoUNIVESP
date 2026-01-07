# ADR 000-C: AAA Testing Pattern
Status: Aceito (v2.6.0) | Data: 2025-12-18

## Contexto
Testes desorganizados com setup, execução e assertions misturados. Dificultar debugging quando testes falhavam (não era claro qual fase quebrou).

## Decisão
Padrão **Arrange, Act, Assert** obrigatório:
```javascript
test('deve calcular média', () => {
  // Arrange
  const notas = [7, 8, 9];
  
  // Act
  const resultado = calcularMedia(notas);
  
  // Assert
  expect(resultado).toBe(8);
});
```

Aplicar em todos os testes (unitários, integração, E2E).

## Consequências
- **Positivo**: Estrutura previsível facilita leitura
- **Positivo**: Depuração mais rápida (falha aponta fase específica)
- **Positivo**: Reduz testes com múltiplas responsabilidades
- **Negativo**: Verbosidade em testes triviais
- **Mitigação**: Aceitar verbosidade em prol de clareza

## Relacionado
- `docs/TEST_TEMPLATES.md` (templates exemplares)
- ADR-009 (AAA + Integration Testing)
