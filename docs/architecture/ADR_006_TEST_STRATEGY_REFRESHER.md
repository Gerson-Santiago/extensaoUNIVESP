# ADR-006: Hybrid Integration Testing
**Status**: Aceito | **Data**: 2025-12-31

## Problema
Testes unitários com mocks excessivos ("Mock Hell") em orquestradores como `CourseRefresher`. Testes passavam mas código falhava em produção porque mocks não refletiam comportamento real.

## Solução
Adotar **testes de integração híbridos**:
- Minimizar mocks internos (testar fluxo completo de orquestração)
- Mockar apenas I/O Borders (`chrome.storage`, `chrome.tabs`, DOM do AVA)
- Focar em contratos (validar interação entre camadas Service → Repository)
- Aplicar em orquestradores complexos (CourseRefresher, BatchScraper)

## Trade-offs
- ✅ **Benefícios**: Confiabilidade real (detecta bugs de integração), resiliência a refatorações internas
- ⚠️ **Riscos**: Testes mais lentos (fluxo completo), setup mais complexo (mitigados por usar apenas para fluxos críticos de negócio)

## Refs
- [ADR-000](ADR_000_FUNDAMENTALS.md) - AAA Testing Pattern
- [ADR-002](ADR_002_SAFERESULT_PATTERN.md) - SafeResult facilita assertividade
- `features/courses/tests/services/CourseRefresher.integration.test.js`

