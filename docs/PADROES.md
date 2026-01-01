# Guia de Estilo e Padrões

[[README](README.md)] | [[Arquitetura](TECNOLOGIAS_E_ARQUITETURA.md)]

### 1. Qualidade Estática
- ESLint (semicolon, single quotes, no-unused).
- Prettier (100 chars width).
- JSDoc (Tipagem obrigatória em models e funções públicas).

### 2. Implementação
- SafeResult: Retornos no formato {success, data, error}.
- Early Return: Evite aninhamento de if/else.
- ESM: Use estritamente import/export.

### 3. Testes (AAA)
- Arrange: Setup e mocks.
- Act: Invocação.
- Assert: Verificação.
Foco em Português Brasileiro para descrições.

### 4. Commits (Conventional)
Formato: <tipo>(<escopo>): <descrição>
Tipos: feat, fix, refactor, docs, test, chore.
Ex: feat(cursos): adiciona filtro de semestre

---
[README](README.md)
