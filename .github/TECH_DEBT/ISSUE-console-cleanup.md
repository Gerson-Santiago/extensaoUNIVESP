# TECH DEBT: Limpeza de Logs e Warnings no Console

## Descrição
O console do navegador apresenta poluição visual causada por logs excessivos da extensão e avisos de performance do Chrome (Violations). Isso dificulta o debugging e pode impactar levemente a performance perceptível.

## Logs Identificados
### 1. Extensão (QuickLinksScraper)
Logs explícitos deixados no código para debug:
```javascript
// features/courses/services/QuickLinksScraper.js
console.warn(`🔗 [QuickLinks] Modal carregado após ${attempts * 100}ms`);
```
*Ação:* Remover ou converter para `console.debug` (apenas em dev) via flag de ambiente.

### 2. Violações do Chrome
Vários avisos de violação de performance detectados:
- `[Violation] 'setTimeout' handler took <N>ms`: Scripts bloqueando a main thread.
- `[Violation] 'visibilitychange' handler took 764ms`.
- `[Violation] 'setInterval' handler took 50ms`.

*Causa Provável:* Operações síncronas pesadas ou manipulação excessiva de DOM dentro de handlers de eventos.

## Plano de Ação
- [ ] **Auditoria**: Buscar e remover/silenciar `console.warn` e `console.log` deixados em produção (`QuickLinksScraper.js`, etc).
- [ ] **Performance (Opcional)**: Investigar handlers de eventos (visibilitychange) que estão estourando o budget de tempo (>50ms).
- [ ] **Preload**: Verificar avisos de "resource preloaded but not used" se houver algum injetado pela extensão.
