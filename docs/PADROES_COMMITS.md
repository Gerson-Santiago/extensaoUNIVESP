# 📝 Padrões de Commits (Conventional Commits)

Este projeto utiliza o **Conventional Commits** para garantir histórico de commits padronizado, legível e automatizável.

---

## **📋 Estrutura da Mensagem**

```
<tipo>(<escopo>): <subject>

[corpo opcional]

[rodapé opcional]
```

### **Regras Importantes** ⚠️

1. **Subject (assunto)**: SEMPRE em **lowercase** (minúsculas)
   - ✅ Correto: `feat: adiciona botão de export`
   - ❌ Errado: `feat: Adiciona Botão de Export`

2. **Máximo de 100 caracteres** na primeira linha

3. **Sem ponto final** no subject

---

## **🏷️ Tipos Disponíveis**

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `feat` | Nova funcionalidade | `feat: adiciona scraping de tarefas` |
| `fix` | Correção de bug | `fix: corrige duplicação de cursos` |
| `docs` | Apenas documentação | `docs: atualiza readme com exemplos` |
| `style` | Formatação, ponto-vírgula, etc (sem mudança de lógica) | `style: formata código com prettier` |
| `refactor` | Refatoração sem alterar comportamento | `refactor: extrai lógica de scraping` |
| `test` | Adiciona ou corrige testes | `test: adiciona testes para task scraper` |
| `chore` | Tarefas de build, configs, dependências | `chore: atualiza dependências` |
| `perf` | Melhoria de performance | `perf: otimiza renderização de lista` |
| `ci` | Mudanças em CI/CD | `ci: adiciona workflow de deploy` |
| `build` | Mudanças no sistema de build | `build: configura webpack` |
| `revert` | Reverte um commit anterior | `revert: reverte commit abc123` |

---

## **🎯 Exemplos Corretos**

### **Feature (Nova Funcionalidade)**
```bash
git commit -m "feat: adiciona importação em lote de cursos"

git commit -m "feat(courses): implementa scraping de semanas"

git commit -m "feat(ui): adiciona modal de confirmação de exclusão"
```

### **Fix (Correção de Bug)**
```bash
git commit -m "fix: corrige erro ao salvar curso sem url"

git commit -m "fix(scraper): resolve timeout ao carregar semanas"

git commit -m "fix(storage): previne duplicação de cursos"
```

### **Docs (Documentação)**
```bash
git commit -m "docs: adiciona guia de contribuição"

git commit -m "docs: atualiza spec v2.8.0 com gestão acadêmica"

git commit -m "docs(readme): adiciona seção de instalação"
```

### **Refactor (Refatoração)**
```bash
git commit -m "refactor: separa lógica de scraping em service"

git commit -m "refactor(courses): usa repository pattern para persistência"
```

### **Test (Testes)**
```bash
git commit -m "test: adiciona testes para course repository"

git commit -m "test(integration): cobre fluxo de importação em lote"
```

### **Chore (Tarefas de Manutenção)**
```bash
git commit -m "chore: atualiza dependências do npm"

git commit -m "chore: configura husky e commitlint"

git commit -m "chore(deps): atualiza jest para v29"
```

---

## **🔍 Escopo (Opcional mas Recomendado)**

O escopo indica a área afetada. Exemplos:

- `(courses)` - Feature de cursos
- `(settings)` - Configurações
- `(ui)` - Interface do usuário
- `(scraper)` - Scraping de dados
- `(storage)` - Persistência de dados
- `(session)` - Gerenciamento de sessão
- `(feedback)` - Sistema de feedback
- `(docs)` - Documentação
- `(tests)` - Testes

**Exemplo:**
```bash
git commit -m "feat(courses): adiciona filtro por semestre"
```

---

## **📝 Corpo e Rodapé (Opcional)**

### **Corpo**
Use para explicar **o quê** e **por quê**, não *como*:

```bash
git commit -m "fix(scraper): corrige timeout ao carregar semanas

O scraper estava falhando em páginas com muitas semanas devido
ao timeout de 3 segundos. Aumentado para 10 segundos e adicionado
retry automático."
```

### **Rodapé**
Use para referenciar issues ou breaking changes:

```bash
git commit -m "feat(api): adiciona endpoint de exportação

BREAKING CHANGE: remove endpoint antigo /export-courses
Refs: #42"
```

---

## **❌ Erros Comuns**

### **1. Subject com letra maiúscula**
```bash
❌ git commit -m "docs: Atualiza README"
✅ git commit -m "docs: atualiza readme"
```

### **2. Tipo errado**
```bash
❌ git commit -m "feat: corrige bug no scraper"
✅ git commit -m "fix: corrige bug no scraper"
```

### **3. Mensagem muito vaga**
```bash
❌ git commit -m "fix: correções"
✅ git commit -m "fix(scraper): previne duplicação de semanas"
```

### **4. Ponto final no subject**
```bash
❌ git commit -m "feat: adiciona botão."
✅ git commit -m "feat: adiciona botão"
```

### **5. Siglas em maiúsculas no subject**
```bash
❌ git commit -m "docs: atualiza SPEC v2.8.0"
✅ git commit -m "docs: atualiza spec v2.8.0"
```

---

## **🔧 Configuração Local**

Este projeto usa **Husky** + **Commitlint** para validar commits automaticamente.

### **Arquivos de configuração:**
- `.husky/commit-msg` - Hook que valida mensagens
- `commitlint.config.js` - Regras do commitlint

### **Testando seu commit antes de enviar:**
```bash
# Teste a mensagem sem fazer commit
echo "feat: teste" | npx commitlint
```

---

## **🚀 Workflow Recomendado**

```bash
# 1. Faça suas alterações
git add .

# 2. Escreva commit seguindo o padrão
git commit -m "feat(courses): adiciona validação de url"

# 3. Se errar, o commitlint vai avisar:
# ✖   subject must not be sentence-case, start-case, pascal-case, upper-case

# 4. Corrija e tente novamente
git commit -m "feat(courses): adiciona validação de url"
```

---

## **📚 Referências**

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Semantic Versioning](https://semver.org/)

---

## **💡 Dica Final**

**Seus commits devem contar uma história clara do projeto!**

Imagine alguém lendo o `git log` daqui a 6 meses. Ela deve entender:
- **O que** foi alterado
- **Por que** foi alterado
- **Quando** foi alterado

Commits bem escritos = facilitam code review, debugging e releases automáticos! 🎉
