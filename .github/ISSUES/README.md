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

## 🔗 Rastreamento em Commits

Para manter rastreabilidade no histórico git, **sempre referencie a issue nos commits**:

### Convenção de Commit

```bash
tipo(escopo): descrição refs ISSUE-XXX
```

### Exemplos

```bash
feat(settings): implementa sistema de backup refs ISSUE-019
fix(scraper): corrige seletor de semana refs ISSUE-001
docs(issues): atualiza métricas refs ISSUE-025
refactor(scripts): remove duplicação closes ISSUE-005
```

### Validação Automática

O hook de commit (`.husky/commit-msg`) valida:
- ✅ Formato Conventional Commits
- ✅ Referência `refs ISSUE-XXX` quando aplicável
- ✅ Existência do arquivo de issue

📚 **Ver:** [Workflow completo de issue tracking](../.agent/workflows/issue-tracking.md)

## 🌐 Integração com GitHub

### Campo GitHub Issue (Opcional)

Quando uma issue for publicada no GitHub, adicione ao `.md`:

```markdown
## 🔗 GitHub Issue

- **Status:** Criada | Concluída | Cancelada
- **Link:** [#42](https://github.com/Gerson-Santiago/extensaoUNIVESP/issues/42)
- **Data:** YYYY-MM-DD
```

### Quando Criar no GitHub?

Apenas para:
- 🔴 **Releases públicas** (milestones de versão)
- 🟠 **Features visíveis ao usuário** (backup, preferências, about)
- 🟡 **Bugs reportados externamente**

**NÃO criar para:**
- ❌ Dívida técnica interna
- ❌ Refatorações de código
- ❌ Auditorias de segurança/tipos

---
**Nota:** Esta estrutura permite ver rapidamente o que está pendente apenas listando a pasta `OPEN/`.

