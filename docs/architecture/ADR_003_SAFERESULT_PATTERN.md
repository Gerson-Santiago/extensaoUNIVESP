# ADR 003: SafeResult Pattern
Status: Aceito | Data: 2025-12-29

## Contexto
Try/catch dispersos pela aplicação geravam retornos ambíguos (`null`, `undefined`, exceções não tratadas). Consumidores não sabiam se falha era esperada ou bug crítico.

## Decisão
Adotar `trySafe()` wrapper para normalizar retornos:
```javascript
{ success: boolean, data?: T, error?: Error }
```

Aplicação obrigatória em:
- Chamadas a APIs externas (chrome.storage, fetch)
- Operações de parsing (DOM scraping, JSON.parse)
- Lógica de negócio com possibilidade de falha

## Consequências
- **Positivo**: Contratos explícitos facilita type-safety com JSDoc
- **Positivo**: Tratamento de erro obrigatório (early returns explícitos)
- **Positivo**: Logs estruturados de falhas
- **Negativo**: Verbosidade em código simples
- **Mitigação**: Usar apenas em boundaries (I/O, parsers)

## Relacionado
- `shared/utils/ErrorHandler.js`
- ADR-000-B (JSDoc Typing)
- ADR-009 (I/O Borders)
