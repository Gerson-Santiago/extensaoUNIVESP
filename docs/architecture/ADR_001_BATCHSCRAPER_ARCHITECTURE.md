# ADR-001: BatchScraper Architecture
**Status**: Aceito (v2.8.x) | **Data**: 2025-12-27

## Problema
Chrome Manifest V3 proíbe `import` statements em content scripts injetados via `chrome.scripting.executeScript`, impedindo modularização tradicional de código injetado no AVA.

## Solução
`BatchScraper` implementado como **monolito funcional auto-contido**:
- Todas dependências (regex, parsers, helpers) duplicadas dentro do arquivo
- Funções puras quando possível para facilitar testes
- Injeção única sem necessidade de bundler ou build step
- Trade-off aceito: Duplicação de código (e.g., `WEEK_IDENTIFIER_REGEX`) em troca de simplicidade operacional

**Testes de paridade**: Garantem consistência entre duplicatas (BatchScraper vs `CourseStructure.js`)

## Trade-offs
- ✅ **Benefícios**: Funciona nativamente sem build step ou webpack, deploy simplificado (arquivo único)
- ⚠️ **Riscos**: Duplicação de lógica compartilhada, manutenção em dois lugares (mitigados por testes de paridade)

## Refs
- [ADR-009](ADR_009_SECURITY_COMPLIANCE.md) - MV3 limitação de imports
- `features/courses/import/services/BatchScraper/index.js`
- `shared/domain/CourseStructure.js`

