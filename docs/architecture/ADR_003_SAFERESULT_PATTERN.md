# ADR 003: SafeResult Pattern
**Status:** Aceito | **Data:** 2025-12-29

### Contexto
Uso disperso de `try/catch` gerava exceções silenciosas e tipos ambíguos.

### Decisão
Utilizar `trySafe()` para normalizar retornos de operações assíncronas:
```javascript
export async function trySafe(promise) {
  try {
    const data = await promise;
    return { data, error: null, success: true };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(e), success: false };
  }
}
```

### Consequências
- ✅ Contratos explícitos (`{ success, data, error }`).
- ✅ Tratamento de erro obrigatório pelo consumidor.
