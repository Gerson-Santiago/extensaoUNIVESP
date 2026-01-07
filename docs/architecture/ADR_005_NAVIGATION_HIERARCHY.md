# ADR-005: Navigation Hierarchy
**Status**: Aceito | **Data**: 2025-12-30

## Problema
Usuários precisavam alternar rapidamente entre semanas do curso sem voltar à listagem principal. UX linear (listagem → detalhes → voltar → selecionar outra) era lenta.

## Solução
`ContextualChipsManager` mantém rastro de navegação:
- Renderiza chips de contexto (curso/semana) acima do conteúdo
- Permite navegação direta entre semanas via chips clicáveis
- Mantém histórico de navegação para breadcrumb futuro
- Integra com `NavigationService` para scroll suave entre contextos

## Trade-offs
- ✅ **Benefícios**: UX fluida para alternar entre semanas, reduz cliques para navegação contextual
- ⚠️ **Riscos**: Complexidade adicional de gerenciamento de estado (mitigado por centralização em ChipsManager - single responsibility)

## Refs
- [ADR-003](ADR_003_CONTAINER_FRESHNESS.md) - Containers frescos necessários para navegação confiável
- `features/courses/views/DetailsActivitiesWeekView/ChipsManager.js`
- `shared/ui/ContextualChips.js`

