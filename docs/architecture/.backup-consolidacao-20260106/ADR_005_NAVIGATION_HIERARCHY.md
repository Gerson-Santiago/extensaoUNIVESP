# ADR 005: Navigation Hierarchy
Status: Aceito | Data: 2025-12-30

## Contexto
Usuários precisavam alternar rapidamente entre semanas do curso sem voltar à listagem principal. UX linear (listagem → detalhes → voltar → selecionar outra) era lenta.

## Decisão
`ContextualChipsManager` mantém rastro de navegação:
- Renderiza chips de contexto (curso/semana) acima do conteúdo
- Permite navegação direta entre semanas via chips clicáveis
- Mantém histórico de navegação para breadcrumb futuro

Integração com `NavigationService` (ADR-006) para scroll suave entre contextos.

## Consequências
- **Positivo**: UX fluida para alternar entre semanas
- **Positivo**: Reduz cliques para navegação contextual
- **Negativo**: Complexidade adicional de gerenciamento de estado
- **Mitigação**: Estado centralizado em ChipsManager (single responsibility)

## Relacionado
- `features/courses/views/DetailsActivitiesWeekView/ChipsManager.js`
- `shared/ui/ContextualChips.js`
- ADR-006 (NavigationService)
