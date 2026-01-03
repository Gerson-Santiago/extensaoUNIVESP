# SPEC-004: Storage Concurrency Protection

**Prioridade**: 🔴 Crítica  
**Estimate**: 1-2 dias  
**Issues**: ISSUE-028  
**EPIC**: EPIC-001

## Problema
3 repositories fazem Read-Modify-Write sem lock nos dados do `chrome.storage`:
- `ActivityRepository`
- `CourseRepository`
- `ActivityProgressRepository`

**Evidência**: Comentário `[DEBUG-RACE]` no código.
**Risco**: Perda de dados se usuário usar 2 abas ou 2 devices.

## Solução
1. Criar `StorageGuard.js` wrapper (4h).
2. Implementar versionamento otimista (Optimistic Locking) (2h).
3. **Retry Strategy (Simpson's Async Check)**:
   - Se o conflito (Version Mismatch) ocorrer, o sistema deve fazer **Auto-Retry** (Exponential Backoff: 100ms, 200ms, 400ms) se for um merge não-destrutivo.
   - Só falhar para o usuário se o conflito for irresolvível.
4. Refatorar 3 repositories para usar `StorageGuard` (6h).
5. Testes de concorrência (2h).

## Critérios de Aceite
- Zero race conditions detectáveis em testes simulados.
- Mechanism de `retry` automático implementado.
- Testes simulando sync entre 2 clientes passando.
