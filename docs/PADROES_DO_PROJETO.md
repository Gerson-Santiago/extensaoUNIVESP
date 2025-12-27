# Padrões de Engenharia (Engineering Standards)

Este documento especifica os padrões técnicos, ferramentas e convenções de código para o projeto Extensão UNIVESP.

---

## 1. Stack Tecnológica
- **Plataforma**: Google Chrome Extension (Manifest V3).
- **Linguagem**: JavaScript (ES2024+ / ES Modules).
- **Runtime de Dev**: Node.js >= 20.x.

---

## 2. Padrões de Qualidade e Análise Estática

### 2.1 Linting (ESLint)
O projeto utiliza uma configuração rigorosa de ESLint para garantir consistência e prevenir erros.
- **Configuração**: `eslint.config.mjs` (Flat Config).
- **Política**: Tolerância Zero. O comando `npm run lint` deve retornar exit code 0.
- **Regras Críticas**:
    - `semi`: Obrigatório (`always`).
    - `quotes`: Aspas simples (`single`).
    - `no-console`: Proibido em produção (apenas `warn`/`error`).
    - `no-unused-vars`: Proibido (exceto prefixo `_`).

### 2.2 Formatação (Prettier)
A formatação é automatizada e não deve ser debatida em Code Review.
- **Configuração**: `.prettierrc`.
    - Largura: 100 caracteres.
    - Aspas simples, Ponto e vírgula, Trailing Comma (ES5).

### 2.3 Tipagem Estática (JSDoc)
Utilizamos TypeScript Check em arquivos JavaScript para segurança tipos em tempo de desenvolvimento.
- **Validação**: `npm run type-check`.
- **Padrões de Tipagem** (Ver `docs_audit.md`):
    1.  **Models Canônicos** (`features/*/models/`):
        - Fonte única da verdade para entidades de domínio.
        - Deve exportar objeto vazio (`export const Model = {}`) para ser módulo.
        - Ex: `features/courses/models/Week.js`.
    2.  **Imports de Tipos** (`@typedef {import(...)}`):
        - Uso preferencial para reutilizar modelos em serviços e views.
        - Ex: `/** @typedef {import('../models/Course.js').Course} Course */`.
    3.  **Definições Inline** (Documented Justification):
        - Permitido APENAS para tipos locais/configurações não reutilizáveis.
        - Deve incluir comentário explicando decisão.
        - Ex: `shared/logic/AutoScroll.js`.
- **Casting**: Use `/** @type {Type} */` para desambiguação.

---

## 3. Testes Automatizados

### 3.1 Framework
- **Runner**: Jest.
- **Environment**: `jest-environment-jsdom`.
- **Mocking**: `jest-webextension-mock` (Chrome API).

### 3.2 Estratégia de Testes
- **Localização**: Arquivos de teste devem ser colocalizados com a implementação ou em diretórios `tests/` dentro da feature.
- **Cobertura**: Foco em Regras de Negócio (`logic/`) e Serviços Críticos. Componentes de UI devem ter testes de renderização básica.
- **Mocks**: É proibido mockar `chrome` manualmente. Utilize o ambiente configurado globalmente.

---

## 4. Arquitetura e Modularização

### 4.1 Screaming Architecture
A estrutura do projeto deve refletir os domínios de negócio.
- **`features/`**: Módulos independentes por contexto (ex: `courses`, `grades`).
- **`shared/`**: Componentes agnósticos de domínio.
- **`models/`**: Definições de tipo colocalizadas com a feature.

### 4.2 Convenções de Código
- **ECMAScript Modules**: Uso estrito de `import`/`export`.
- **Classes vs Funções**:
    - **Classes**: Para serviços com estado ou "Singletons" (ex: `SessionManager`).
    - **Funções Puras**: Para lógica de negócio e helpers (ex: `TermParser.parseTerm`).

### 4.3 Padrões de Frontend (Interação)
- **Eventos**: Uso exclusivo de `PointerEvent` para interações de ponteiro (mouse, touch, pen).
    - ✅ **Preferível**: `element.addEventListener('click', (e) => ...)` tipado como `PointerEvent`.
    - ❌ **Evitar**: `onclick = ...` (Tipagem implícita/legada).
    - **Motivo**: Compatibilidade com padrão Interop 2025 e suporte nativo a hardware moderno.

---

## 5. Padrões de Persistência (Storage)
- **Repository Pattern**: O acesso a dados deve ser encapsulado em Repositories (ex: `CourseRepository`).
- **Auto-Save**: Operações de scraping devem persistir dados imediatamente.
- **Cache-First**: A UI deve sempre tentar renderizar dados do Storage antes de solicitar novo network request.

---

## 6. Scripts de Automação

O projeto disponibiliza scripts organizados por categoria para garantir qualidade, segurança e produtividade.

### 5.1 Verificação e Qualidade

| Script | Descrição | Quando Usar |
| :--- | :--- | :--- |
| `npm run verify` | **Pipeline completa** (tests + lint + type-check) | Obrigatório antes de PR |
| `npm run lint` | ESLint com zero tolerância | Validação de código |
| `npm run lint:fix` | ESLint com correção automática | Corrigir erros de lint |
| `npm run format` | Prettier (formata todo projeto) | Primeira vez ou mudança de config |
| `npm run format:check` | Verifica formatação sem modificar | CI/CD |
| `npm run type-check` | Verificação de tipos JSDoc | Validação estática |

### 5.2 Testes (Jest)

#### Core
| Script | Comando | Quando Usar |
| :--- | :--- | :--- |
| `npm test` | `jest` | Suite completa (365 testes) |
| `npm run test:watch` | `jest --watch` | Desenvolvimento ativo |
| `npm run test:coverage` | `jest --coverage` | Análise de cobertura |
| `npm run test:debug` | `jest --bail` | Debug (para no 1º erro) |
| `npm run test:quick` | `jest --onlyFailures` | Validação rápida |
| `npm run test:ci` | `jest --coverage --ci` | CI/CD otimizado |

#### Por Feature
- `npm run test:courses` - Apenas feature courses
- `npm run test:feedback` - Apenas feature feedback
- `npm run test:session` - Apenas feature session
- `npm run test:unit` - Apenas testes unitários
- `npm run test:integration` - Apenas testes de integração

### 5.3 Segurança

**3 Camadas de Proteção Automática:**

| Script | Ferramenta | O Que Detecta |
| :--- | :--- | :--- |
| `npm run security:secrets` | Secretlint | API keys, tokens, passwords |
| `npm run security:audit` | npm audit | CVE high/critical em dependências |
| `npm run security:lint` | ESLint Security | Vulnerabilidades no código (eval, injection, XSS) |
| `npm run security` | **Todas acima** | Gate completo de segurança |

**Bloqueadores Automáticos:**
- ❌ Commits com secrets detectados
- ❌ Dependências com CVE high/critical
- ❌ Código com vulnerabilidades conhecidas

### 5.4 Pre-commit (Automático)

**Executado em todo `git commit`:**

```
1. security:secrets  → Detecta secrets em todo projeto (~0.5s)
2. lint-staged       → ESLint + Prettier + Jest (apenas arquivos alterados)
   ├─ eslint --fix   → Corrige e valida código
   ├─ prettier --write → Formata automaticamente
   └─ jest --bail --findRelatedTests → Testes relacionados
```

**Performance:** ~16s (apenas testes dos arquivos alterados)

**Bypass:** `git commit --no-verify` (não recomendado)

---

> **Compliance**: Pull Requests que não aderem a estes padrões serão reprovados na revisão estática ou dinâmica.

