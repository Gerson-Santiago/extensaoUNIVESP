# ADR 000-A: Screaming Architecture
Status: Aceito (v2.6.0) | Data: 2025-12-18

## Contexto
Estrutura MVC tradicional (`models/`, `views/`, `controllers/`) dificultava onboarding. Desenvolvedores não sabiam onde adicionar features do AVA (importação de cursos, navegação de semanas, progresso de leitura).

## Decisão
Organizar código por **Vertical Slices** (features de negócio):
```
features/
  courses/          # Scrapers, listagem, navegação
  import/           # Importação em lote
  session/          # Login no SEI
shared/             # Kernel compartilhado (UI, utils, services)
```

Cada feature agrupa UI, Lógica e Testes na mesma pasta (CCP: "coisas que mudam juntas").

## Consequências
- **Positivo**: Onboarding rápido (features gritam propósito de negócio)
- **Positivo**: Baixo acoplamento entre features
- **Negativo**: Risco de poluição em `shared/` com código específico de feature
- **Mitigação**: Code review rigoroso de PRs que tocam `shared/`

## Relacionado
- VIS_MANIFESTO.md (pilar "Domínio")
- ADR-008 (Repository Unification alinha com CCP)
