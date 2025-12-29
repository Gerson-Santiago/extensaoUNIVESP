# Protocolo de Engenharia de Erros e Tipagem

Este documento estabelece as leis e estratégias técnicas para garantir a maturidade da engenharia de software do projeto.

---

## 🟢 1. As Leis da Engenharia (Resumo Executivo)

Estas são as regras invioláveis que o time deve seguir para evitar dívida técnica.

### 1. A Lei da Fronteira (The Edge Rule)
> **O try/catch deve existir majoritariamente nas bordas da aplicação.**

*   **Onde usar:** Controllers (Event Handlers da UI, Listeners do Chrome), Pontos de Entrada de Scripts.
*   **Onde evitar:** Repositories, Helpers, Utility Functions. Deixe o erro subir (*bubble up*) para quem chamou, a menos que você possa recuperar o fluxo silenciosamente e de forma segura.

### 2. Exceção ≠ Fluxo de Controle
> **Nunca use try/catch para lógica de negócios esperada.**

*   **Errado:** Tentar buscar um dado e usar `catch` para criar um novo se não existir.
*   **Certo:** Verificar `if (!data)` e criar o novo. O erro (`Exception`) é reservado para falhas técnicas imprevistas (corrupção de dados, falha de I/O crítica).

### 3. O Princípio do "Fail Loudly" (Falhe Barulhento)
> **Nunca silencie um erro vazio.**

*   **Proibido:** `catch (e) { return null; }` sem logar.
*   **Obrigatório:** Se capturar, você deve tratar (corrigir o estado), logar (para observabilidade) ou relançar (com mais contexto).

### 4. Tipagem Defensiva com JSDoc
> **A assinatura da função deve refletir a possibilidade de falha.**

O consumidor da função deve ser obrigado a lidar com a possibilidade de falha através da verificação de tipos, não apenas lendo a documentação.

---

## 🛠 2. Estratégia Técnica: O Padrão "Result"

Para implementar as leis acima, adotamos o padrão de retornar objetos de resultado (`SafeResult`) em vez de lançar exceções indiscriminadamente em funções de negócio.

### Definição de Tipos (JSDoc)

```javascript
/**
 * Estrutura padronizada de resposta segura.
 * @template T
 * @typedef {Object} SafeResult
 * @property {T | null} data - O dado de sucesso (se houver).
 * @property {Error | null} error - O erro capturado (se houver).
 * @property {boolean} success - Flag rápida para controle de fluxo.
 */
```

### O Wrapper de Segurança (`trySafe`)

Utilize este utilitário para envolver chamadas assíncronas perigosas:

```javascript
/**
 * Executa uma Promise de forma segura, retornando um objeto de resultado.
 * @template T
 * @param {Promise<T>} promise - A promessa a ser executada.
 * @returns {Promise<SafeResult<T>>}
 */
export async function trySafe(promise) {
  try {
    const data = await promise;
    return { data, error: null, success: true };
  } catch (originalError) {
    const error = originalError instanceof Error ? originalError : new Error(String(originalError));
    // Logger centralizado pode ser injetado aqui
    return { data: null, error, success: false };
  }
}
```

### Exemplo de Uso (Antes vs. Depois)

**❌ Forma Antiga (Frágil):**
```javascript
async function getUsuario(id) {
  // Se falhar, quebra o fluxo se não houver try/catch externo
  const user = await db.users.findUnique({ id });
  return user;
}
```

**✅ Forma Nova (Robusta):**
```javascript
import { trySafe } from './utils/error-handler.js';

/**
 * Busca usuário pelo ID.
 * @param {string} id
 * @returns {Promise<SafeResult<User>>} 
 */
async function getUsuario(id) {
  // 1. Execução segura
  const { data: user, error, success } = await trySafe(db.users.findUnique({ id }));

  // 2. O fluxo é linear (Early Return)
  if (!success) {
    console.error(`Falha ao buscar user ${id}:`, error.message);
    return { success: false, error, data: null };
  }

  // 3. Happy Path garantido
  return { success: true, error: null, data: user };
}
```

---

## 3. Benefícios
1.  **Eliminação de Ninhos:** Fim do `try { ... try { ... } }`.
2.  **Segurança de Tipo:** O editor alerta que `data` pode ser `null`.
3.  **Auditabilidade:** Fácil encontrar tratamentos de erro buscando por `trySafe` ou `!success`.

---

## 4. Checklist de Engenharia para Novos Recursos

Antes de considerar uma tarefa "Pronta":

*   [ ] **Try/Catch nas Bordas (Views):** Event Handlers têm proteção contra crash?
*   [ ] **Feedback UI:** O usuário recebe feedback visual em caso de falha (`success === false`)?
*   [ ] **Estado Limpo:** O `finally` (ou a lógica pós-trySafe) garante que spinners/skeletons sumam?
*   [ ] **Types:** O arquivo novo tem `@ts-check`? (Ou o projeto roda `npm run type-check` limpo?)

---

## 5. Padrões de Teste (QA AAA)

Todo teste unitário ou de integração deve seguir estritamente o padrão **AAA**:

1.  **Arrange (Preparar):** Configura o cenário, mocks e dados de entrada.
2.  **Act (Agir):** Executa a função ou método testado *uma única vez*.
3.  **Assert (Verificar):** Valida os resultados, chamadas de mock e estado final.

### Exemplo Obrigatório:

```javascript
it('deve retornar dados quando o scraping for bem sucedido', async () => {
  // 1. Arrange
  const week = { url: '...' };
  mockScraper.resolvedValue(['result']);

  // 2. Act
  const result = await Service.getActivities(week);

  // 3. Assert
  expect(result.success).toBe(true);
  expect(result.data).toHaveLength(1);
});
```

---

## 6. Workflow de Verificação (`npm run verify`)

A "Quality Assurance" (QA) automatizada é feita pelo comando:

```bash
npm run verify
```

Este comando executa em sequência (fail-fast):
1.  **Testes (`npm test`):** Garante lógica correta (AAA).
2.  **Lint (`npm run lint`):** Garante estilo e previne erros comuns.
3.  **Type Check (`npm run type-check`):** Garante contrato de tipos (JSDoc).

> 🛑 **Regra:** NENHUM código deve ser commitado se `npm run verify` falhar.
