# 🗂️ Gestão de Issues e Backlog

Este diretório organiza as issues do projeto seguindo uma auditoria estrita de estado.

## 📂 Estrutura de Pastas

Para manter a clareza e evitar poluição visual, adotamos a separação física por estado:

- **[`OPEN/`](./OPEN)**: Issues ativas, planejadas ou em andamento.
- **[`CLOSED/`](./CLOSED)**: Issues concluídas, arquivadas e resolvidas.

## 🏷️ Convenção de Nomenclatura

O nome do arquivo é a fonte de verdade sobre o estado e conteúdo da issue:

```text
STATUS-ISSUE-XXX_slug-descritivo.md
```

- **STATUS**: `OPEN` ou `CLOSED`.
- **XXX**: Número sequencial único (ex: `001`, `025`).
- **Slug**: Descrição curta em kebab-case.

### Exemplos:
- `OPEN-ISSUE-025_coverage-batch-import.md`
- `CLOSED-ISSUE-002_missing-revision-week.md`

## 🔄 Fluxo de Trabalho (Workflow)

1.  **Criar**: Crie o arquivo na pasta `OPEN/` com o prefixo `OPEN-`.
2.  **Resolver**: Ao concluir, mova o arquivo para `CLOSED/` e renomeie o prefixo para `CLOSED-`.
    - *Dica:* Use o script de manutenção (futuro) para automatizar isso.

---
**Nota:** Esta estrutura permite ver rapidamente o que está pendente apenas listando a pasta `OPEN/`.
