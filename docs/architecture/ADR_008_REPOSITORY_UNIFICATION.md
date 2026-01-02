# ADR 008: Repository Unification
Status: Aceito (v2.9.5) | Data: 2025-12-31

## Contexto
Camada de dados fragmentada em 3 localizações:
- `data/` (repositórios legados)
- `repositories-progress/` (progresso de leitura)
- `features/courses/repositories/` (repositórios do domínio)

Desenvolvedores não sabiam onde adicionar novos repositórios, violando "Single Source of Truth".

## Decisão
Centralizar toda persistência em `features/courses/repositories/`:
- `ActivityRepository.js` (atividades e cache)
- `ProgressRepository.js` (progresso de leitura unificado)
- `CourseRepository.js` (metadados de cursos)

Deletar pastas `data/` e `repositories-progress/`. Migrar testes para nova estrutura.

## Consequências
- **Positivo**: "Single Source of Truth" para infraestrutura de dados
- **Positivo**: Alinha com CCP (dados de curso mudam juntos)
- **Negativo**: Refatoração de imports em toda aplicação
- **Mitigação**: Busca global por imports antigos antes de release

## Relacionado
- `features/courses/repositories/README.md` (guia de uso)
- ADR-000-A (Screaming Architecture)
- v2.9.5 (release de unificação)
