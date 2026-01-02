# ADR 006: Robust Scroll Navigation
Status: Aceito | Data: 2025-12-30

## Contexto
Botão "Ir para atividade" falhava quando Side Panel carregava elementos dinamicamente. Scroll direto para `#id` falhava se elemento ainda não estivesse no DOM.

## Decisão
`NavigationService` com estratégia de retry robusta:
1. Tentar scroll direto para `#id`
2. Se falhar, usar `MutationObserver` para aguardar elemento (timeout 10s)
3. Fallback: tentar 4 estratégias de seletores diferentes
4. Feedback visual: item encontrado pisca em amarelo/dourado

**Configuração injetável**: Timeouts e delay configuráveis via construtor (ADR-010).

## Consequências
- **Positivo**: Navegação contextual estável mesmo em abas lentas
- **Positivo**: Feedback visual facilita localização do item
- **Negativo**: Complexidade adicional em lógica de navegação
- **Negativo**: Timeout de 10s pode frustrar usuário em falha
- **Mitigação**: Logging estruturado de cada tentativa de fallback

## Relacionado
- `features/courses/services/NavigationService.js`
- Issue-015 (100% cobertura de testes)
