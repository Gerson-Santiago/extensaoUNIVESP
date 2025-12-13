# 🕒 Issues Não Iniciadas (NOT_STARTED)

Este arquivo contém issues planejadas mas que ainda não foram iniciadas.

---

## 🔵 Issue #8: Implementar Testes E2E com Puppeteer

**Labels:** `test`, `priority-low`, `e2e`

**Milestone:** Fase 3 - Melhorias

### Descrição

Criar testes end-to-end usando Puppeteer para testar a extensão em um navegador real.

### Testes E2E a Criar

1. **Popup E2E**
   - Carregar extensão
   - Abrir popup
   - Preencher RA
   - Preencher Domain
   - Salvar
   - Verificar storage

2. **Sidepanel E2E**
   - Abrir sidepanel
   - Adicionar curso
   - Navegar para detalhes
   - Verificar semanas

3. **Content Script E2E**
   - Navegar para SEI
   - Verificar autofill

### Checklist

- [ ] Instalar `puppeteer`
- [ ] Criar `tests/e2e/`
- [ ] Criar helper para carregar extensão
- [ ] Criar `popup.e2e.test.js`
- [ ] Criar `sidepanel.e2e.test.js`
- [ ] Criar `contentScript.e2e.test.js`
- [ ] Adicionar script: `test:e2e`

### Commit Esperado
```
test: adicionar testes E2E com Puppeteer
```

---

## 🔵 Issue #9: Adicionar Husky e lint-staged

**Labels:** `chore`, `priority-low`, `developer-experience`

**Milestone:** Fase 3 - Melhorias

**Depende de:** #1

### Descrição

Adicionar hooks Git para garantir qualidade de código antes de commits e pushes.

### Hooks a Configurar

**Pre-commit:**
- Executar ESLint --fix em arquivos staged
- Executar Prettier em arquivos staged

**Pre-push:**
- Executar `npm test`

### Checklist

- [ ] Instalar `husky` e `lint-staged`
- [ ] Configurar `lint-staged` no `package.json`
- [ ] Configurar hook pre-commit
- [ ] Configurar hook pre-push
- [ ] Testar hooks localmente

### Commit Esperado
```
chore: adicionar Husky e lint-staged para validação no commit
```
