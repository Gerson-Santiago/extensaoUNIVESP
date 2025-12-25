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

## 5. Scripts de Automação (CI/CD Local)

Os scripts do `package.json` são a interface padrão para operações de desenvolvimento.

| Script | Descrição |
| :--- | :--- |
| `npm run verify` | **Gatekeeper**. Executa a pipeline completa de qualidade. Use antes de commit/push. |
| `npm test` | Executa testes unitários/integração. |
| `npm run lint` | Executa linter. |
| `npm run type-check` | Executa verificação de tipos TS. |

---

> **Compliance**: Pull Requests que não aderem a estes padrões serão reprovados na revisão estática ou dinâmica.
