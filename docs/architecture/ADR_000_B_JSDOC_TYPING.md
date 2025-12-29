# ADR 000-B: Tipagem com JSDoc
**Status:** Aceito (v2.5.x) | **Data:** 2025-12-12

### Contexto
Necessidade de segurança de tipos sem o overhead de build/transpilação do TypeScript.

### Decisão
Adotar **JSDoc** para validação via `jsconfig.json`:
- **Casting**: Usar `/** @type {T} */` para mocks e APIs do Chrome.
- **Contratos**: @param e @returns obrigatórios em services/utils.
- **Modelos**: Centralizar `@typedef` para evitar duplicação.

### Consequências
- ✅ Erros detectados em tempo de dev sem build step.
- ⚠️ Sintaxe verbosa para tipos complexos.
