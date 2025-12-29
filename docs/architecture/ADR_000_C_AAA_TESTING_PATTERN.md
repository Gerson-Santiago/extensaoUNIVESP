# ADR 000-C: Padrão AAA de Testes
**Status:** Aceito (v2.5.x) | **Data:** 2025-12-12

### Contexto
Testes desestruturados dificultavam manutenção e leitura.

### Decisão
Padronizar testes sob o modelo **AAA** (Arrange, Act, Assert):
1. **Arrange**: Prep de mocks e estado.
2. **Act**: Execução da unidade (idealmente 1 linha).
3. **Assert**: Verificação de resultados e chamadas.
- **Idioma**: Títulos `test('Deve...')` em português.

### Consequências
- ✅ Testes legíveis que servem como documentação.
- ⚠️ Código levemente mais extenso pela separação clara.
