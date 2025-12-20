# 📂 Categorias de Features

Este documento explica a organização das features em 3 categorias: CORE, INFRA e UTILITY.

---

## 🏆 CORE (Núcleo do Negócio)

**Definição**: Features que implementam o **domínio central** do projeto.

**Características**:
- Contêm lógica de negócio complexa
- Têm repositórios próprios (data/)
- São a razão de existir do app

**Features atuais**:
1. **`courses/`** - Gestão de matérias acadêmicas
2. **`import/`** - Importação em lote de cursos

**Quando criar uma CORE feature**:
- Se implementa um novo domínio de negócio
- Se tem regras de negócio específicas
- Se precisa de persistência própria

---

## 🔧 INFRA (Infraestrutura)

**Definição**: Features que fornecem **serviços transversais** para outras features.

**Características**:
- Não têm domínio de negócio próprio
- São usadas por múltiplas features
- Geralmente singleton ou stateful

**Features atuais**:
1. **`session/`** - Gerenciamento de autenticação
2. **`settings/`** - Configurações globais do app

**Quando criar uma INFRA feature**:
- Se é usado por várias features CORE
- Se gerencia estado global (auth, config)
- Se abstrai serviços externos (API, storage)

---

## 📦 UTILITY (Utilidades)

**Definição**: Features auxiliares que **não são críticas** para o negócio.

**Características**:
- Melhoram UX mas não são essenciais
- Geralmente telas simples sem lógica complexa
- Podem ser removidas sem quebrar o core

**Features atuais**:
1. **`home/`** - Tela de boas-vindas/dashboard
2. **`feedback/`** - Formulário de bug report

**Quando criar uma UTILITY feature**:
- Se é uma tela de boas-vindas, about, help
- Se é formulário de feedback/contato
- Se melhora UX mas não afeta regras de negócio

---

## 🤔 Como Decidir a Categoria?

**Pergunte-se:**

1. **"Se eu remover isso, o app para de funcionar?"**
   - ✅ Sim → CORE
   - ❌ Não → UTILITY ou INFRA

2. **"Outras features dependem disso?"**
   - ✅ Sim → INFRA
   - ❌ Não → CORE ou UTILITY

3. **"Isso tem regras de negócio complexas?"**
   - ✅ Sim → CORE
   - ❌ Não → UTILITY

---

## 📌 Exemplos Práticos

### Cenário: Adicionar feature de "Anotações"

**Análise**:
- ❓ Remove = app para? → Não (não é essencial)
- ❓ Outras features dependem? → Não
- ❓ Tem regras de negócio? → Sim (CRUD de notas, vinculação com cursos)

**Categoria**: 🏆 **CORE** (é domínio de negócio próprio, mesmo não sendo essencial)

### Cenário: Adicionar feature de "Dark Mode"

**Análise**:
- ❓ Remove = app para? → Não
- ❓ Outras features dependem? → Sim (todas as telas usam)
- ❓ Tem regras de negócio? → Não (só toggle CSS)

**Categoria**: 🔧 **INFRA** (configuração transversal)

### Cenário: Adicionar feature de "Help/Tutorial"

**Análise**:
- ❓ Remove = app para? → Não
- ❓ Outras features dependem? → Não
- ❓ Tem regras de negócio? → Não

**Categoria**: 📦 **UTILITY** (melhoria de UX)

---

> **Lembre-se**: As categorias são **guias mentais**, não regras rígidas. Use bom senso!
