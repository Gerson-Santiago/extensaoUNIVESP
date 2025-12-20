> Status: Active
> Last Update: 2025-12-18
> Owner: Gerson Santiago

# 🔎 Refactoring Cheat Sheet (Grep Commands)

Guia rápido de comandos para verificar o estado da refatoração e dependências.

## 📁 Pre-requisito
Sempre começar no diretório das features:
```bash
cd ~/extensaoUNIVESP/features
```

## 1. Auditoria Geral de Imports
Ver **todos os imports de todos os arquivos JS**:

```bash
grep -RIn --include="*.js" -E "import .* from |require\(" .
```

## 2. Dependência Reversa (Quem usa X?)
Ver **quem importa um arquivo/classe específica**:

```bash
grep -RIn --include="*.js" "NOME_DO_ARQUIVO_OU_CLASSE" .
```

### Exemplos Práticos
```bash
# Quem usa o Repositório de Cursos?
grep -RIn --include="*.js" "CourseRepository" .

# Quem usa o Serviço de Cursos?
grep -RIn --include="*.js" "CourseService" .

# Quem usa o Scraper?
grep -RIn --include="*.js" "ScraperService" .

# Quem usa os Parsers?
grep -RIn --include="*.js" "TermParser" .
grep -RIn --include="*.js" "CourseGrouper" .
```

## 3. Dependência Direta (O que X usa?)
Ver imports **de um único arquivo específico**:

```bash
grep -In -E "import .* from |require\(" caminho/do/arquivo.js
```

Exemplo:
```bash
grep -In -E "import .* from |require\(" courses/components/CoursesList.js
```

## 🧠 Regra de Ouro
* **grep com `import`** → o que o arquivo **precisa** (Dependências).
* **grep com `NomeDoArquivo`** → quem **precisa dele** (Consumidores).
