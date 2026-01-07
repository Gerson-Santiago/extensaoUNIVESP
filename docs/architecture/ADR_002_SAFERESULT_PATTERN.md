# ADR-002: SafeResult Pattern
**Status**: Aceito | **Data**: 2025-12-29

## Problema
Try/catch dispersos pela aplicação geravam retornos ambíguos (`null`, `undefined`, exceções não tratadas). Consumidores não sabiam se falha era esperada ou bug crítico.

## Solução
Adotar `trySafe()` wrapper para normalizar retornos:
```javascript
{ success: boolean, data?: T, error?: Error }
```

**Aplicação obrigatória** em:
- Chamadas a APIs externas (`chrome.storage`, `fetch`)
- Operações de parsing (DOM scraping, `JSON.parse`)
- Lógica de negócio com possibilidade de falha

**Uso apenas em boundaries** (I/O, parsers) para evitar verbosidade excessiva em código simples.

## Trade-offs
- ✅ **Benefícios**: Contratos explícitos facilitam type-safety com JSDoc, tratamento de erro obrigatório (early returns explícitos), logs estruturados de falhas
- ⚠️ **Riscos**: Verbosidade em código simples (mitigado por usar apenas em boundaries)

## Refs
- [ADR-000](ADR_000_FUNDAMENTALS.md) - JSDoc Typing
- [ADR-009](ADR_009_SECURITY_COMPLIANCE.md) - I/O Borders seguros
- `shared/utils/ErrorHandler.js`

