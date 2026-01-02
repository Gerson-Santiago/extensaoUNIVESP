# ADR 001: Higiene Documental
Status: Aceito (v2.8.9) | Data: 2025-12-27

## Contexto
Acúmulo de documentos administrativos, notas de processo e arquivos temporários geravam ruído cognitivo. Desenvolvedores perdiam tempo localizando informação relevante em meio a arquivos obsoletos.

## Decisão
Protocolo de limpeza pós-release:
- Deletar arquivos administrativos e metadados temporários
- Preservar apenas documentação técnica e arquitetural
- Histórico disponível via Git (não há perda de informação)
- Mover changelogs antigos para `docs/changelog_archive/`

## Consequências
- **Positivo**: Repositório limpo facilita onboarding e navegação
- **Positivo**: Foco exclusivo em documentação técnica
- **Negativo**: Requer disciplina para manter limpeza em releases futuras
- **Mitigação**: Checklist de limpeza em workflow de release

## Relacionado
Workflow: `/release-prod`
