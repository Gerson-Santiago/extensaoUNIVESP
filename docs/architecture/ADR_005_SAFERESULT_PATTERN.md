# ADR-005: Adoção do SafeResult Pattern para Error Handling

**Status:** Aceito  
**Data:** 2025-12-29  
**Decisores:** Equipe de Desenvolvimento  
**Tags:** #error-handling #type-safety #architecture

---

## Contexto

### Problema
A aplicação usava `try/catch` de forma dispersa, levando a:
1. **Exceções silenciosas**: Erros capturados em blocos genéricos sem tratamento adequado
2. **Type safety frágil**: JSDoc não conseguia expressar a natureza dupla de funções (dados vs erro)
3. **Código verboso**: Múltiplos níveis de `try/catch` aninhados
4. **Debugging difícil**: Stack traces perdidos em propagação manual de erros

### Exemplo do Problema Anterior
```javascript
// ANTES: Type safety frágil e exceções escondidas
async function getActivities(week) {
  try {
    const items = await scraper.scrape(week.url);
    week.items = items; // Mutação silenciosa
    return items; // Tipo: Array - mas pode lançar exceção!
  } catch (e) {
    console.error(e); // Erro engolido
    return []; // Retorno vazio = sucesso vazio ou erro? Ambíguo!
  }
}
```

---

## Decisão

Adotar o **SafeResult Pattern** com a função utilitária `trySafe()`.

### Implementação
Criar `shared/utils/ErrorHandler.js`:

```javascript
/**
 * @template T
 * @typedef {Object} SafeResult
 * @property {T | null} data - Dado de sucesso
 * @property {Error | null} error - Erro capturado
 * @property {boolean} success - Flag de controle
 */

export async function trySafe(promise) {
  try {
    const data = await promise;
    return { data, error: null, success: true };
  } catch (originalError) {
    const error = originalError instanceof Error 
      ? originalError 
      : new Error(String(originalError));
    return { data: null, error, success: false };
  }
}
```

### Uso
```javascript
// DEPOIS: Type safety explícita e sem exceções escondidas
async function getActivities(week, method = 'DOM') {
  return trySafe(
    (async () => {
      const items = await scraper.scrape(week.url);
      week.items = items;
      return items;
    })()
  );
}

// Consumidor
const { success, data, error } = await getActivities(week);
if (!success) {
  console.error('Falha:', error.message);
  toaster.show('Erro ao carregar');
  return; // Early return explícito
}
// Aqui, data está garantido não-null pelo success=true
processItems(data);
```

---

## Consequências

### Positivas ✅
1. **Contratos Explícitos**: Função retorna `Promise<SafeResult<T>>` - tipo sempre conhecido
2. **Sem Exceções Silenciosas**: Todo erro DEVE ser tratado pelo consumidor (`if (!success)`)
3. **Error Normalization**: Garante que `error` sempre é `Error` instance (não strings ou objetos)
4. **Stack Traces Preservados**: Erro original mantido, não recriado
5. **Testing Simplificado**: Mocks retornam `{success: false, error: ...}` - sem `mockRejectedValue`

### Negativas ⚠️
1. **Verbosidade Ligeiramente Maior**: Precisa de desestruturação `const { success, data } = ...`
2. **Adoção Gradual**: Código legado ainda usa `try/catch` (requer evangelização)
3. **Pattern Desconhecido**: Desenvolvedores acostumados com exceções precisam aprender

### Mitigações
- **Verbosidade**: Aceitável vs. ganho em clareza e safety
- **Evangelização**: Fase 1 (Courses) completa; Fase 2 (Settings/Scripts) planejada
- **Onboarding**: `ENGINEERING_GUIDE.md` documenta o pattern com exemplos

---

## Alternativas Consideradas

### A. Bibliotecas Externas (ex: neverthrow)
**Prós:** Pattern maduro, TypeScript nativo  
**Contras:** Dependência externa desnecessária, curva de aprendizado maior  
**Decisão:** Rejeitado - solução simples (33 linhas) resolve 100% do problema

### B. Either Monad (Functional Programming)
**Prós:** Pattern conhecido em FP, composição elegante  
**Contras:** Muito abstrato para a equipe, não idiomático em JavaScript  
**Decisão:** Rejeitado - simplicidade >> pureza funcional

### C. Status Quo (try/catch)
**Prós:** Padrão da linguagem, zero curva de aprendizado  
**Contras:** Todos os problemas listados no Contexto  
**Decisão:** Rejeitado - problemas superam benefícios

---

## Referências
- **Código:** [`shared/utils/ErrorHandler.js`](file:///home/sant/extensaoUNIVESP/shared/utils/ErrorHandler.js)
- **Uso:** [`features/courses/services/WeekActivitiesService.js`](file:///home/sant/extensaoUNIVESP/features/courses/services/WeekActivitiesService.js)
- **Testes:** [`features/courses/tests/services/WeekActivitiesService/service.test.js`](file:///home/sant/extensaoUNIVESP/features/courses/tests/services/WeekActivitiesService/service.test.js)
- **Guia:** [`docs/ENGINEERING_GUIDE.md`](file:///home/sant/extensaoUNIVESP/docs/ENGINEERING_GUIDE.md)

---

## Implementação
- **Início:** 2025-12-28
- **Status:** ✅ Fase 1 Concluída (Módulo Courses)
- **Próximo:** Fase 2 - Settings & Scripts
