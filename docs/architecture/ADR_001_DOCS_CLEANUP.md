# ADR 001: Higiene Documental
**Status:** Aceito (v2.8.9) | **Data:** 2025-12-27

### Contexto
Acúmulo de docs obsoletos no `.github` gerava ruído visual.

### Decisão
Política de **Limpeza Pós-Release** (Matriz ISO 25010):
- **Efemeridade**: Deletar arquivos de tracking (`RESOLVED`, `FEATURE`) após a release.
- **Fonte da Verdade**: Git para histórico, `CHANGELOG.md` para marcos.
- **Centralização**: ADRs técnicos apenas em `docs/architecture/`.

### Consequências
- ✅ Repositório limpo e foco em débitos técnicos ativos.
- ✅ Redução de >1000 linhas de texto administrativo na v2.8.9.
