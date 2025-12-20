# Padrões de Projeto (Project Standards)

Este documento define as tecnologias, ferramentas e padrões de código exigidos para o desenvolvimento da extensão UNIVESP.

## 1. Stack Tecnológica
*   **Linguagem:** JavaScript (ES6+ / ESModules).
*   **Plataforma:** Google Chrome Extension (Manifest V3).
*   **Ambiente (Node):** Node.js >= 20.x (Recomendado).

## 2. Qualidade de Código e Formatação

### 2.1 ESLint (Linting)
Utilizamos o **ESLint 9.x** com configuração em Flat Config (`eslint.config.mjs`).
*   **Comando:** `npm run lint` deve retornar sucesso (exit code 0).
*   **Política:** Zero Warnings. Qualquer aviso bloqueia o CI/CD (futuro) e deve ser corrigido imediatamente.
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

### 2.3 Automação (Husky & Lint-Staged)
Utilizamos Git Hooks para garantir a qualidade antes do código entrar no repositório.
*   **Hook (`pre-commit`):** Executado automaticamente ao rodar `git commit`.
*   **Ação:** O `lint-staged` verifica apenas os arquivos em *staging* (modificados).
    *   Arquivos `.js`: Roda `eslint --fix` e `prettier --write`. Se houver erro não corrigível automaticamente, o commit é abortado.
    *   Arquivos `.json`, `.css`, `.md`: Roda `prettier --write`.


### 2.4 Padrão de Commits
Utilizamos **Conventional Commits** estritamente em **Português Brasileiro**.

### 2.5 Diretrizes Estritas de Tipagem e Linter
Regras específicas para manter o "Zero Warnings":

*   **HTML Elements:** Nunca acesse propriedades (ex: `.value`) diretamente de um `HTMLElement` genérico. Use `instanceof` para garantir o tipo (ex: `HTMLInputElement`).
*   **Mocks Globais:** O TypeScript não reconhece mocks em objetos globais (`chrome`). Use JSDoc Cast:
    ```javascript
    /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation(...);
    ```
*   **Console:** Logs de produção são proibidos (`no-console`).

*   **Formato:** `<tipo>(<escopo opcional>): <descrição no imperativo>`
*   **Tipos Permitidos:**
    *   `feat`: Nova funcionalidade.
    *   `fix`: Correção de bug.
    *   `docs`: Alteração apenas em documentação.
    *   `style`: Formatação, pontos e vírgulas, etc (sem mudança de código).
    *   `refactor`: Alteração de código que não corrige bug nem cria feature.
    *   `perf`: Melhoria de performance.
    *   `test`: Adição ou correção de testes.
    *   `chore`: Alterações de build, ferramentas, deps, etc.
*   **Idioma:** A descrição DEVE ser em Português.
    *   ✅ `feat: adiciona botão de login`
    *   ❌ `feat: add login button` (Inglês proibido)
    *   ❌ `feat: adicionei botão` (Passado proibido, use Imperativo)

## 3. Testes Automatizados (Jest)

### 3.1 Framework
Utilizamos **Jest** (`jest`, `jest-environment-jsdom`) para testes unitários e de integração.
*   **Comando:** `npm test`.

### 3.2 Padrões de Teste
*   **Configuração:** `jest.config.js` e `jest.setup.js`.
*   **Mocks de Browser:** Utilizamos `jest-webextension-mock` para simular a API `chrome.*`.
    *   Não mockar `chrome` manualmente nos arquivos de teste; usar o ambiente global configurado.
    *   **Tipagem (JSDoc):** Para métodos mockados (ex: `.mockImplementation`), usar cast explicito: `/** @type {jest.Mock} */ (chrome.api.method).mock...`.
*   **Localização**: Testes unitários e de integração devem estar:
    - Colocalizados com o código em `features/*/tests/` (preferencial para testes de feature)
    - Na pasta global `tests/` (para testes de integração cross-feature ou utilitários globais)
*   **Cobertura:** O objetivo é cobrir lógica de negócios (`logic/`), utils e views críticas.

## 4. Estrutura e Modularização
*   **Módulos:** Uso estrito de ES Modules (`import`/`export`).
*   **Separação (Screaming Architecture):**
    *   `features/`: Cada pasta é um domínio (ex: `courses`, `session`). Contém sua própria UI (`ui/`), Lógica (`logic/`) e Serviços.
    *   `shared/`: Utilitários realmente genéricos e Design System reutilizável.
    *   `core/`: Mecanismos de base (Storage driver, Messaging) - se aplicável.
*   **Tipagem:** Embora seja JavaScript, utilizamos verificação de tipos defensiva (Type Guards) para evitar erros em runtime (ex: `element instanceof HTMLInputElement`).

## 5. Hooks e Scripts
*   **package.json:**
    *   `npm run lint`: Validação de código.
    *   `npm test`: Execução de testes.

---

### Documentação
<!-- Documentação do projeto -->
**[README.md](../README.md)**            Documentação do projeto.             
<!-- Histórico de versões e atualizações -->
**[CHANGELOG.md](../CHANGELOG.md)**      Histórico de versões e atualizações. 

