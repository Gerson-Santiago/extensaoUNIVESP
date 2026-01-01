# Index de Workflows

Este diretório contém os scripts operacionais e protocolos mandatórios do projeto.

## Workflows

| Comando | Descrição | Linhas |
| :--- | :--- | :--- |
| [/git-flow](./git-flow.md) | Git Flow + Quality Gate | ~190 |
| [/tdd](./tdd.md) | Bug-Fix, Features, Refactor (Red-Green-Refactor) | ~50 |
| [/release](./release.md) | Versionamento + Release dev→main | ~65 |

Total: 3 workflows consolidados (~305 linhas)

## Base de Conhecimento (ADRs)

Decisões que moldam a estrutura do projeto:

| ID | Título | Foco |
| :--- | :--- | :--- |
| [ADR-000-A](../../docs/architecture/ADR_000_A_SCREAMING_ARCHITECTURE.md) | Screaming Architecture | Organização por Features |
| [ADR-000-B](../../docs/architecture/ADR_000_B_JSDOC_TYPING.md) | JSDoc Typing | Tipagem profissional .js |
| [ADR-000-C](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md) | Padrão AAA | Estrutura de Testes |
| [ADR-001](../../docs/architecture/ADR_001_DOCS_CLEANUP.md) | Higiene Documental | Manutenção de Docs |
| [ADR-002](../../docs/architecture/ADR_002_BATCHSCRAPER_ARCHITECTURE.md) | BatchScraper Arch | Scripts Injetados Monolíticos |
| [ADR-003](../../docs/architecture/ADR_003_SAFERESULT_PATTERN.md) | SafeResult Pattern | Tratamento de Erros |
| [ADR-006](../../docs/architecture/ADR_006_ROBUST_SCROLL_NAVIGATION.md) | Robust Scroll | Lógica de Navegação |
| [ADR-009](../../docs/architecture/ADR_009_TEST_STRATEGY_REFRESHER.md) | Test Strategy | Mocks em I/O Borders |
| [ADR-010](../../docs/architecture/ADR_010_FUTURE_PROOF_CONFIGURATION.md) | Future-Proof Config | Configuração Injetável |

## Governança & Qualidade

Documentos que definem "Como" trabalhamos:

- [Fluxos de Trabalho](../../docs/FLUXOS_DE_TRABALHO.md): Diretrizes mandatórias e regras de branch.
- [Relatório de Compliance](../../docs/architecture/ADR_COMPLIANCE_REPORT.md): Status de aderência aos ADRs.
- [Plano de Observabilidade](../../docs/architecture/OBSERVABILITY_PLAN.md): Padrões de logging e monitoramento.
- [Changelog](../../CHANGELOG.md): Histórico oficial de mudanças e versões.

## Gestão & Roadmap

- [README do Projeto](../../README.md): Visão geral técnica.
- [Gestão de Issues](../../.github/README.md): Backlog de bugs e débitos técnicos.
- [Roadmap Estratégico](../../.github/ROADMAP.md): Visão trimestral e metas v3.0.0.

Dica para o Agente: Sempre verifique o /git-flow antes de iniciar qualquer comando de escrita para garantir que você não está na branch errada.
