# 🗑️ Issues Excluídas (DELETED)

Este arquivo contém issues que foram canceladas ou removidas do escopo.

---

## 🔵 Issue #10: Configurar GitHub Actions CI/CD

**Labels:** `ci`, `priority-low`, `automation`

**Milestone:** Fase 3 - Melhorias

**Depende de:** #1, #3

### ❌ Status: CANCELADA (2025-12-12)
> **Motivo:** O usuário decidiu que CI/CD não é necessário para a extensão neste momento.

### Descrição

Adicionar CI/CD com GitHub Actions para executar testes automaticamente em PRs.

### Workflow a Criar

```yaml
name: Tests
on: [pull_request, push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm test
      - run: npm run test:coverage
```

### Checklist

- [ ] Criar `.github/workflows/test.yml`
- [ ] Configurar execução em PR
- [ ] Configurar execução em push para main/dev
- [ ] Adicionar badge no README
- [ ] Testar workflow

### Commit Esperado
```
ci: adicionar GitHub Actions para testes automatizados
```
