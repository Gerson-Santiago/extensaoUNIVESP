# 📝 Exemplos de Commits com Nova Convenção

## ✅ Commits Corretos

### Feature com referência a issue
```bash
feat(settings): implementa sistema de backup refs ISSUE-019
```

### Bug fix
```bash
fix(scraper): corrige seletor de semana de revisão refs ISSUE-001
```

### Documentação
```bash
docs(issues): adiciona convenção de rastreamento refs ISSUE-021
```

### Refatoração
```bash
refactor(scripts): remove duplicação em batch import closes ISSUE-005
```

### Múltiplas issues
```bash
docs(architecture): atualiza EPIC-001 refs ISSUE-030 ISSUE-033
```

### Feature com GitHub issue
```bash
feat(ux): adiciona preferências de comportamento refs ISSUE-022 #9
```

### Commits sem issue (permitido para manutenção)
```bash
chore(deps): atualiza dependências do Jest
build(husky): configura hook de commit-msg
ci(github): adiciona workflow de testes
```

---

## ❌ Commits Incorretos

### Sem tipo/escopo
```bash
❌ implementa backup refs ISSUE-019
```

### Sem palavra-chave 'refs'
```bash
❌ feat(settings): implementa backup ISSUE-019
```

### Issue não existe
```bash
❌ feat(settings): implementa backup refs ISSUE-999
⚠️  Hook irá alertar: "ISSUE-999 não encontrada em .github/ISSUES/"
```

### Mensagem em inglês
```bash
❌ feat(settings): implement backup system refs ISSUE-019
```

---

## 🧪 Testando o Hook

### Teste 1: Commit válido com issue
```bash
git add .agent/workflows/issue-tracking.md
git commit -m "docs(workflows): adiciona rastreamento de issues refs ISSUE-021"
```

**Resultado esperado:** ✅ Commit aceito

### Teste 2: Commit sem issue (permitido)
```bash
git add commitlint.config.js
git commit -m "build(commitlint): adiciona validação de issues"
```

**Resultado esperado:** ✅ Commit aceito (issue não é obrigatória)

### Teste 3: Commit com issue inexistente
```bash
git add README.md
git commit -m "docs(readme): atualiza refs ISSUE-999"
```

**Resultado esperado:** ⚠️ Warning (mas aceita)

---

## 📋 Checklist antes de Commitar

- [ ] Mensagem em português brasileiro
- [ ] Formato: `tipo(escopo): descrição`
- [ ] Se houver issue relacionada, adicionar `refs ISSUE-XXX`
- [ ] Issue existe em `.github/ISSUES/OPEN/` ou `CLOSED/`
- [ ] Escopo representa o componente afetado
- [ ] Descrição é clara e concisa

---

**Gerado em:** 2026-01-03
