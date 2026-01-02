# ADR 009: Hybrid Integration Testing
Status: Aceito | Data: 2025-12-31

## Contexto
Testes unitários com mocks excessivos ("Mock Hell") em orquestradores como `CourseRefresher`. Testes passavam mas código falhava em produção porque mocks não refletiam comportamento real.

## Decisão
Adotar testes de integração híbridos:
- **Minimizar mocks internos**: Testar fluxo completo de orquestração
- **Mockar apenas I/O Borders**: `chrome.storage`, `chrome.tabs`, DOM do AVA
- **Foco em contratos**: Validar interação entre camadas (Service → Repository)

Aplicar em orquestradores complexos (CourseRefresher, BatchScraper).

## Consequências
- **Positivo**: Confiabilidade real (detecta bugs de integração)
- **Positivo**: Resiliência a refatorações internas
- **Negativo**: Testes mais lentos (fluxo completo)
- **Negativo**: Setup mais complexo (múltiplas camadas)
- **Mitigação**: Usar apenas para fluxos críticos de negócio

## Relacionado
- `features/courses/tests/services/CourseRefresher.integration.test.js`
- ADR-000-C (AAA Testing)
- ADR-003 (SafeResult facilita assertividade)
