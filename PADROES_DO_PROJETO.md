# Padrões de Projeto (Project Standards)

Este documento define as tecnologias, ferramentas e padrões de código exigidos para o desenvolvimento da extensão UNIVESP.

## 1. Stack Tecnológica
*   **Linguagem:** JavaScript (ES6+ / ESModules).
*   **Plataforma:** Google Chrome Extension (Manifest V3).
*   **Ambiente (Node):** Node.js >= 20.x (Recomendado).

## 2. Qualidade de Código e Formatação

### 2.1 ESLint (Linting)
Utilizamos o **ESLint 9.x** com configuração em Flat Config (`eslint.config.mjs`).
*   **Comando:** `npm run lint` (verifica) / `npm run lint:fix` (corrige).
*   **Regras Principais:**
    *   `semi`: Ponto e vírgula **obrigatório** (`always`).
    *   `quotes`: Aspas simples **obrigatórias** (`single`).
    *   `no-console`: `console.log` gera aviso. Permitidos apenas `console.warn` e `console.error`.
    *   `no-unused-vars`: Variáveis não usadas geram aviso (exceto iniciadas com `_`).

### 2.2 Prettier (Formatação)
Utilizamos o **Prettier** para padronização visual.
*   **Comando:** `npm run format`.
*   **Configuração (`.prettierrc`):**
    *   `"semi": true`
    *   `"singleQuote": true`
    *   `"trailingComma": "es5"`
    *   `"printWidth": 100`

## 3. Testes Automatizados (Jest)

### 3.1 Framework
Utilizamos **Jest** (`jest`, `jest-environment-jsdom`) para testes unitários e de integração.
*   **Comando:** `npm test`.

### 3.2 Padrões de Teste
*   **Configuração:** `jest.config.js` e `jest.setup.js`.
*   **Mocks de Browser:** Utilizamos `jest-webextension-mock` para simular a API `chrome.*`.
    *   Não mockar `chrome` manualmente nos arquivos de teste; usar o ambiente global configurado.
*   **Localização:** Todos os testes devem estar na pasta `tests/`.
*   **Cobertura:** O objetivo é cobrir lógica de negócios (`logic/`), utils e views críticas.

## 4. Estrutura e Modularização
*   **Módulos:** Uso estrito de ES Modules (`import`/`export`).
*   **Separação:**
    *   `logic/`: Regras de negócio puras (sem manipulação direta de DOM se possível).
    *   `views/`: Manipulação de DOM e eventos de UI.
    *   `utils/`: Funções auxiliares puras e reutilizáveis.
*   **Tipagem:** Embora seja JavaScript, utilizamos verificação de tipos defensiva (Type Guards) para evitar erros em runtime (ex: `element instanceof HTMLInputElement`).

## 5. Hooks e Scripts
*   **package.json:**
    *   `npm run lint`: Validação de código.
    *   `npm test`: Execução de testes.
