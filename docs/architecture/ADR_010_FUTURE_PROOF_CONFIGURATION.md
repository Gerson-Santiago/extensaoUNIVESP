# ADR 010: Future-Proof Configuration Pattern
**Status:** Aceito (v2.9.6) | **Data:** 2025-12-31

### Contexto
Código com valores hardcoded (timeouts, delays) é difícil de testar e adaptar para diferentes ambientes. A ISSUE-015 (NavigationService) revelou que testes lentos e inflexibilidade eram consequências de magic numbers espalhados.

### Decisão
Adotar **Configuração Estática Injetável** para serviços críticos:

```javascript
export class Service {
  static config = {
    timeout: 10000,
    retryDelay: 800,
  };
  
  static configure(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}
```

**Princípios**:
1. **Valores Padrão Sensatos**: Config inicial funciona em produção sem ajustes.
2. **Injeção Explícita**: Testes podem reduzir timeouts (`configure({ timeout: 100 })`).
3. **Tipos Documentados**: `@typedef` descreve cada propriedade da config.
4. **Imutabilidade Superficial**: Spread operator evita mutação acidental.

### Consequências
- ✅ Testes 10x mais rápidos (10s → 1s em NavigationService).
- ✅ Ambientes customizáveis (CI, staging, dev) sem mudança de código.
- ✅ Documentação viva via JSDoc (`@typedef Config`).
- ⚠️ Requer disciplina: resetar config em `beforeEach()` de testes.

### Casos de Uso
- **NavigationService**: Timeouts de tab loading e MutationObserver.
- **QuickLinksScraper**: Delays de retry e timeout de modal.
- **Qualquer serviço assíncrono** com timeouts ou polling.

### Anti-Padrões
❌ **Não usar** para valores de negócio (ex: taxa de juros, regras de cálculo).  
❌ **Não usar** para configurações de usuário (usar Storage API).  
✅ **Usar** para infraestrutura, timeouts, e comportamento técnico.
