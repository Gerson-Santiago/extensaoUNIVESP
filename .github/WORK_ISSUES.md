# 🔨 Em Andamento (WORK_ISSUES)

## 🔵 Issue #8: Implementar Testes E2E com Puppeteer

> **Status no GitHub:** [Issue #8](https://github.com/Gerson-Santiago/extensaoUNIVESP/issues/8)

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
