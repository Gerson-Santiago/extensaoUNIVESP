# ADR 000-B: JSDoc Typing
Status: Aceito (v2.6.0) | Data: 2025-12-18

## Contexto
Bugs de tipo em runtime no Vanilla JS (passagem de `string` para função que espera `number`). Não havia verificação estática sem adicionar build step (TypeScript).

## Decisão
JSDoc com verificação TypeScript via `npm run type-check`:
- **System de 3 camadas**:
  1. Domain Models (`features/*/models/`) - tipos canônicos
  2. Logic/DTO - contratos de serviços
  3. View Contracts - props de componentes UI
- **Regra**: Zero `@type {*}` ou `@type {Object}` em produção
- **CI/CD**: `type-check` obrigatório antes de merge

## Consequências
- **Positivo**: Segurança de tipo sem build step
- **Positivo**: Auto-complete em VS Code
- **Positivo**: Detecta contratos quebrados em refatorações
- **Negativo**: Verbosidade em JSDoc
- **Mitigação**: Templates de VSCode para tipos comuns

## Relacionado
- `jsconfig.json` (configuração TypeScript)
- ADR-003 (SafeResult facilita contratos explícitos)
- ADR-012 (tipos explícitos previnem bugs de segurança)
