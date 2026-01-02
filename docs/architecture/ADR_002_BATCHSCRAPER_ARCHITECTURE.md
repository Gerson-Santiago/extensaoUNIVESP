# ADR 002: BatchScraper Architecture
Status: Aceito (v2.8.x) | Data: 2025-12-27

## Contexto
Chrome Manifest V3 proíbe `import` statements em content scripts injetados via `chrome.scripting.executeScript`. Isso impede a modularização tradicional de código injetado no AVA.

## Decisão
`BatchScraper` implementado como monolito funcional auto-contido:
- Todas as dependências (regex, parsers, helpers) duplicadas dentro do arquivo
- Funções puras quando possível para facilitar testes
- Injeção única sem necessidade de bundler ou build step

**Trade-off aceito**: Duplicação de código (e.g., `WEEK_IDENTIFIER_REGEX`) em troca de simplicidade operacional.

## Consequências
- **Positivo**: Funciona nativamente sem build step ou webpack
- **Positivo**: Deploy simplificado (arquivo único)
- **Negativo**: Duplicação de lógica compartilhada com `CourseStructure.js`
- **Negativo**: Manutenção em dois lugares (script injetado + módulos principais)
- **Mitigação**: Testes de paridade garantem consistência entre duplicatas

## Relacionado
- `features/courses/import/services/BatchScraper/index.js`
- `shared/domain/CourseStructure.js`
