# 📝 Issues para Melhorias do Projeto

## Como Usar Este Documento

Este arquivo contém templates de issues prontos para serem criados no GitHub. Cada issue está formatada para facilitar a cópia direta.

---

## 🔴 Issue #1: Configurar ESLint e Prettier

**Labels:** `chore`, `infrastructure`, `priority-high`

**Milestone:** Fase 1 - Infraestrutura

### Descrição

Adicionar ESLint e Prettier ao projeto para garantir qualidade e consistência do código.

### Problema Atual
- Sem linting configurado
- Sem formatação automática
- Código inconsistente em alguns lugares

### Solução Proposta

Configurar ESLint e Prettier com:
- `.eslintrc.json` para regras de linting
- `.prettierrc` para formatação
- Scripts npm para `lint`, `lint:fix`, `format`

### Checklist de Implementação

- [ ] Instalar dependências: `eslint`, `prettier`
- [ ] Criar `.eslintrc.json`
- [ ] Criar `.prettierrc`
- [ ] Criar `.prettierignore`
- [ ] Adicionar scripts ao `package.json`
- [ ] Executar `npm run lint` e corrigir erros
- [ ] Executar `npm run format`
- [ ] Testar que extensão funciona após formatação
- [ ] Executar `npm test` (21 testes devem passar)

### Critérios de Aceitação

- ✅ `npm run lint` executa sem erros críticos
- ✅ `npm run format` formata todo o código
- ✅ Todos os testes continuam passando
- ✅ Extensão funciona normalmente (popup + sidepanel)

### Commit Esperado
```
chore: adicionar ESLint e Prettier para qualidade de código
```

---

## 🔴 Issue #2: Consolidar settings.js Duplicado

**Labels:** `refactor`, `priority-high`, `code-quality`

**Milestone:** Fase 1 - Infraestrutura

### Descrição

Eliminar duplicação de código consolidando `settings.js` em uma única localização compartilhada.

### Problema Atual

Código duplicado em dois lugares:
- `/popup/logic/settings.js` (58 linhas)
- `/sidepanel/utils/settings.js` (58 linhas)

**Impacto:**
- Bug fixes precisam ser aplicados em 2 lugares
- Inconsistência entre popup e sidepanel
- Manutenção duplicada

### Solução Proposta

Criar pasta `shared/utils/` e mover `settings.js` para lá, tornando-o a única fonte de verdade.

### Estrutura Nova
```
shared/
└── utils/
    └── settings.js  ← Única fonte de verdade
         ↑
         ├── popup.js
         └── SettingsView.js
```

### ✅ Status: CONCLUÍDA (2025-12-12)

> **Nota:** Esta issue foi implementada em commits anteriores e validada em 2025-12-12.

### Checklist de Implementação

- [x] Criar pasta `shared/utils/`
- [x] Mover um dos `settings.js` para `shared/utils/settings.js`
- [x] Atualizar import em `popup/popup.js`
- [x] Atualizar import em `sidepanel/views/SettingsView.js`
- [x] Remover `popup/logic/settings.js` (pasta vazia)
- [x] Remover `sidepanel/utils/settings.js` (não existia duplicata)
- [x] Executar `npm test` (3 testes passaram)
- [x] Testar popup (salvar RA, Domain, restaurar padrão)
- [x] Testar sidepanel settings

### Critérios de Aceitação

- ✅ Arquivo `shared/utils/settings.js` existe
- ✅ Nenhum arquivo `settings.js` duplicado
- ✅ Imports corretos em popup e sidepanel
- ✅ Todos os testes passam
- ✅ Configurações salvam corretamente em ambos

### Commit Esperado
```
refactor: consolidar settings.js em shared/utils para eliminar duplicação
```

---

## 🔴 Issue #3: Criar Testes Unitários para storage.js

**Labels:** `test`, `priority-high`, `coverage`

**Milestone:** Fase 1 - Infraestrutura

### Descrição

Adicionar cobertura completa de testes para o módulo crítico `storage.js`.

### Problema Atual

- `storage.js` tem 121 linhas de código
- **0 testes** atualmente
- Módulo crítico responsável por CRUD de cursos
- Cobertura estimada: 0%

### Solução Proposta

Criar `tests/unit/storage.test.js` com testes para todas as 7 funções exportadas.

### Funções a Testar

1. `loadItems` - Carregar cursos
2. `saveItems` - Salvar cursos
3. `addItem` - Adicionar curso único
4. `addItemsBatch` - Adicionar múltiplos cursos
5. `deleteItem` - Remover curso
6. `updateItem` - Atualizar curso
7. `clearItems` - Limpar todos os cursos

### Checklist de Implementação

- [ ] Criar pasta `tests/unit/`
- [ ] Criar `tests/unit/storage.test.js`
- [ ] Configurar mocks para `chrome.storage.sync`
- [ ] Testar `loadItems` (vazio e com dados)
- [ ] Testar `saveItems`
- [ ] Testar `addItem` (sucesso e duplicado)
- [ ] Testar `addItemsBatch` (múltiplos, ignorar duplicados)
- [ ] Testar `deleteItem` (existente e inexistente)
- [ ] Testar `updateItem` (sucesso e falha)
- [ ] Testar `clearItems`
- [ ] Executar `npm test`
- [ ] Executar `npm run test:coverage`

### Critérios de Aceitação

- ✅ Arquivo `tests/unit/storage.test.js` criado
- ✅ Mínimo de 15 testes criados
- ✅ Cobertura de `storage.js` > 90%
- ✅ Todos os casos de sucesso testados
- ✅ Todos os casos de erro testados
- ✅ Total de testes: 21 → 36+

### Commit Esperado
```
test: adicionar cobertura completa de testes para storage.js
```

---

## 🟡 Issue #4: Refatorar SettingsView.js (245 Linhas)

**Labels:** `refactor`, `priority-medium`, `code-splitting`

**Milestone:** Fase 2 - Refatoração

**Depende de:** #1, #2, #3

### Descrição

Dividir `SettingsView.js` (atualmente 245 linhas) em módulos menores e mais gerenciáveis.

### Problema Atual

- Arquivo muito grande: **245 linhas**
- Alta complexidade
- Método `render()` com 70 linhas
- Método `setupConfigLogic()` com 61 linhas
- Método `handleAddCurrent()` com 40 linhas
- Difícil de testar e manter

### Solução Proposta

Extrair responsabilidades para módulos separados:

```
sidepanel/
├── logic/
│   ├── raManager.js          🆕 Gerencia RA
│   └── domainManager.js      🆕 Gerencia Domain
├── utils/
│   └── feedback.js           🆕 Sistema de feedback
├── components/
│   └── Forms/
│       └── ConfigForm.js     🆕 Formulário de config
└── views/
    └── SettingsView.js       ✏️ Reduzir para ~80 linhas
```

### ✅ Status: CONCLUÍDA (2025-12-12)

> **Nota:** Esta issue foi implementada e validada em 2025-12-12.

### Checklist de Implementação

- [x] Criar `sidepanel/logic/raManager.js`
- [x] Criar `sidepanel/logic/domainManager.js`
- [x] Criar `sidepanel/utils/feedback.js`
- [x] Criar `sidepanel/components/Forms/ConfigForm.js`
- [x] Refatorar `SettingsView.js` para usar novos módulos
- [x] Criar `tests/unit/raManager.test.js`
- [x] Criar `tests/unit/domainManager.test.js`
- [x] Executar `npm test`
- [x] Testar todas as funcionalidades de settings

### Funcionalidades a Testar

- [ ] Salvar RA
- [ ] Salvar Domain
- [ ] Restaurar padrão do domain
- [ ] Adicionar curso atual
- [ ] Batch import modal
- [ ] Legacy batch import modal
- [ ] Adicionar manual modal
- [ ] Limpar dados
- [ ] Feedback visual

### Critérios de Aceitação

- ✅ `SettingsView.js` reduzido de 245 → ~80 linhas
- ✅ Novos módulos criados e testados
- ✅ Todos os testes passam
- ✅ Todas as funcionalidades continuam funcionando
- ✅ Código mais legível e manutenível

### Commit Esperado
```
refactor: dividir SettingsView.js em módulos menores (245→80 linhas)
```

---

## 🟡 Issue #5: Modularizar sidepanel.css (535 Linhas)

**Labels:** `refactor`, `priority-medium`, `css`, `maintainability`

**Milestone:** Fase 2 - Refatoração

**Depende de:** #1

### Descrição

Dividir `sidepanel.css` (atualmente 535 linhas) em módulos CSS organizados por componentes e views.

### Problema Atual

- Arquivo CSS monolítico: **535 linhas**
- Difícil de encontrar estilos específicos
- Carrega estilos não usados em todas as views
- Sem separação por responsabilidade

### Solução Proposta

Criar estrutura modular de CSS:

```
sidepanel/
├── styles/
│   ├── global.css            🆕 Variáveis, reset
│   ├── layout.css            🆕 Grid, estrutura
│   ├── components/
│   │   ├── nav.css           🆕 Navegação
│   │   ├── card.css          🆕 Cards
│   │   ├── modal.css         🆕 Modais
│   │   └── button.css        🆕 Botões
│   └── views/
│       ├── home.css          🆕 Home view
│       ├── courses.css       🆕 Courses view
│       └── settings.css      🆕 Settings view
└── sidepanel.html            ✏️ Atualizar imports
```

### ✅ Status: CONCLUÍDA (2025-12-12)

> **Nota:** Esta issue foi implementada e validada em 2025-12-12.

### Checklist de Implementação

- [x] Criar pasta `sidepanel/styles/`
- [x] Criar `styles/global.css` (variáveis CSS, reset)
- [x] Criar `styles/layout.css` (grid, flex, estrutura)
- [x] Criar `styles/components/nav.css`
- [x] Criar `styles/components/card.css`
- [x] Criar `styles/components/modal.css`
- [x] Criar `styles/components/button.css`
- [x] Criar `styles/views/home.css`
- [x] Criar `styles/views/courses.css`
- [x] Criar `styles/views/settings.css`
- [x] Atualizar `sidepanel.html` com novos imports
- [x] Remover `sidepanel.css` antigo
- [x] Testar visualmente todas as views

### Testes Visuais Necessários

- [ ] Home view - layout idêntico
- [ ] Courses view - lista de cursos
- [ ] Course details view - semanas
- [ ] Settings view - formulários
- [ ] Todos os botões
- [ ] Todos os cards
- [ ] Todos os modais
- [ ] Navegação top bar

### Critérios de Aceitação

- ✅ CSS dividido em múltiplos arquivos lógicos
- ✅ `sidepanel.css` antigo removido
- ✅ Visual permanece **idêntico** em todas as views
- ✅ Sem quebras de layout
- ✅ Hover effects funcionam
- ✅ Transições funcionam

### Commit Esperado
```
refactor: modularizar CSS do sidepanel (535 linhas → múltiplos arquivos)
```

---

## 🟡 Issue #6: Investigar e Remover Código Legado

**Labels:** `chore`, `priority-medium`, `cleanup`

**Milestone:** Fase 2 - Refatoração

### Descrição

Investigar o uso de `legacy_batchScraper.js` e remover se não estiver em uso.

### Problema Atual

- Arquivo chamado `legacy_batchScraper.js` (113 linhas)
- Nome indica código legado
- Existe `logic/batchScraper.js` como versão atual
- Não está claro se ainda é usado

### Investigação Necessária

```bash
# Verificar se está sendo importado
grep -r "legacy_batchScraper" . --exclude-dir=node_modules
```

### Cenário 1: NÃO Está em Uso

**Ação:**
- [ ] Confirmar que não há imports
- [ ] Remover arquivo
- [ ] Executar `npm test`
- [ ] Testar batch import manualmente

**Commit:**
```
chore: remover código legado não utilizado (legacy_batchScraper.js)
```

### Cenário 2: ESTÁ em Uso

**Ação:**
- [ ] Criar `docs/LEGACY_CODE.md`
- [ ] Documentar motivo da manutenção
- [ ] Documentar plano de migração
- [ ] Adicionar comentários no código

**Commit:**
```
docs: documentar código legado e plano de migração (legacy_batchScraper.js)
```

### Critérios de Aceitação

- ✅ Uso do arquivo investigado
- ✅ Se não usado: arquivo removido
- ✅ Se usado: documentado
- ✅ Testes passam
- ✅ Batch import funciona

---

## 🔵 Issue #7: Criar Testes de Integração

**Labels:** `test`, `priority-low`, `integration`

**Milestone:** Fase 3 - Melhorias

**Depende de:** #3

### Descrição

Criar testes de integração para fluxos completos da aplicação.

### Testes a Criar

1. **Fluxo: Adicionar Curso**
   - Abrir sidepanel
   - Navegar para settings
   - Adicionar curso manualmente
   - Verificar que aparece na lista

2. **Fluxo: Scraping + Storage**
   - Simular página AVA
   - Executar scraping
   - Verificar que semanas foram extraídas
   - Salvar no storage
   - Carregar e validar

3. **Fluxo: Batch Import**
   - Simular múltiplos cursos
   - Executar batch import
   - Verificar contadores (adicionados/ignorados)
   - Validar storage

4. **Fluxo: Navegação Completa**
   - Home → Courses → Details → Settings → Home

### Checklist

- [ ] Criar `tests/integration/`
- [ ] Criar `addCourse.integration.test.js`
- [ ] Criar `scrapeCourse.integration.test.js`
- [ ] Criar `batchImport.integration.test.js`
- [ ] Criar `navigation.integration.test.js`
- [ ] Atualizar script npm: `test:integration`

### Commit Esperado
```
test: adicionar testes de integração para fluxos principais
```

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

---

## 🔵 Issue #10: Configurar GitHub Actions CI/CD

**Labels:** `ci`, `priority-low`, `automation`

**Milestone:** Fase 3 - Melhorias

**Depende de:** #1, #3

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

---

## 📌 Como Criar Issues no GitHub

1. Ir para: https://github.com/Gerson-Santiago/extensaoUNIVESP/issues
2. Clicar em "New Issue"
3. Copiar o conteúdo da issue acima
4. Adicionar labels apropriadas
5. Adicionar ao Milestone correto
6. Criar issue

## 📌 Ordem Sugerida de Implementação

### Sprint 1 (Semana 1)
1. Issue #1 - ESLint e Prettier
2. Issue #2 - Consolidar settings.js
3. Issue #3 - Testes storage.js

### Sprint 2 (Semana 2-3)
4. Issue #4 - Refatorar SettingsView
5. Issue #5 - Modularizar CSS
6. Issue #6 - Remover código legado

### Sprint 3 (Futuro)
7. Issues #7-10 conforme necessidade
