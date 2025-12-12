# Rastreabilidade e Regras de Linting

Este documento registra as correções aplicadas para garantir a conformidade com o `npm run lint` e estabelece regras para manutenção futura.

## 1. Correções de Tipagem Estrita (Type Safety)

O ESLint/TypeScript identificou erros acessando propriedades em tipos genéricos (ex: `HTMLElement`).

*   **Problema:** Acessar `.value` ou `.innerText` diretamente de um `HTMLElement` genérico (retorno de `getElementById`).
*   **Solução (Regra):** Sempre verificar o tipo específico do elemento antes do acesso.

```javascript
// ❌ Incorreto (Gera erro: Property 'value' does not exist on type 'HTMLElement')
const campo = document.getElementById('id');
if (campo.value === '') { ... }

// ✅ Correto (Regra aplicada)
const campo = document.getElementById('id');
if (campo instanceof HTMLInputElement && campo.value === '') { ... }
```

*   **Regra Adicional:** Para variáveis carregadas de storage ou fontes externas, verificar o tipo primitivo.
    ```javascript
    if (typeof variavel === 'string') { ... }
    ```

## 2. Configuração do ESLint

*   **Problema:** O Node.js emitia aviso `MODULE_TYPELESS_PACKAGE_JSON` ao ler `eslint.config.js` com sintaxe `import/export`.
*   **Solução:** O arquivo foi renomeado para `eslint.config.mjs` para forçar o reconhecimento como Módulo ES, independente do `package.json`.

## 3. Uso de Console (no-console)

A regra `no-console` está ativa para evitar poluição do console em produção.

*   **Regra:** Logs de produção devem ser removidos.
*   **Exceção 1:** Logs informativos para o usuário final (feedback visual/funcional) podem ser mantidos, mas devem ter a regra desativada explicitamente na linha anterior.
    ```javascript
    // eslint-disable-next-line no-console
    console.log('Feedback para o usuário');
    ```
*   **Exceção 2:** Logs de DEBUG devem ser condicionados a uma flag e suprimidos pelo linter.
    ```javascript
    if (DEBUG) console.debug('Log de desenvolvimento'); // Com eslint-disable
    ```

## 4. Variáveis Não Utilizadas (no-unused-vars)

*   **Regra:** Não deixar variáveis declaradas sem uso.
*   **Correção aplicada:** Em blocos `catch (_error)`, se o erro não for usado, remover a variável ou usar a sintaxe `catch {}` (ES2019+).

## 5. Mocks e Testes (JSDoc Casts)

*   **Problema:** O TypeScript/Linter não reconhece métodos do Jest (`mockImplementation`, `mockReturnValue`) em objetos globais como `chrome.storage` ou `chrome.tabs`, pois suas definições oficiais não incluem esses métodos.
*   **Solução (Regra):** Usar **JSDoc Cast** para forçar o tipo `jest.Mock` na linha da chamada.

    ```javascript
    // ❌ Incorreto (Erro: Property 'mockImplementation' does not exist)
    chrome.storage.sync.get.mockImplementation(...);

    // ✅ Correto
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation(...);
    ```

---
**Status Atual:**
*   `npm run lint`: **Sucesso** (0 erros, 0 warnings).
*   `npm test`: **Sucesso** (Todos os testes passando).
