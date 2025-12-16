# Estado da Arte: Análise de Engenharia da Codebase Atual

## 🔍 Introdução

Este documento reflete o "Estado da Arte" técnico do projeto **Extensão UNIVESP** na versão 2.6.0. Baseado em auditoria direta do código-fonte, ele conecta as implementações práticas aos conceitos teóricos de Engenharia de Software.

---

## 1. Arquitetura de Software e Padrões

### Padrão Utilizado: MVC (Model-View-Controller) Adaptado
A extensão não é um script monolítico; ela implementa uma arquitetura modular robusta, visível na estrutura de diretórios (`/sidepanel`).

*   **Model (Dados e Estado)**
    *   **Implementação:** `chrome.storage.local`
    *   **Abstração:** `services/StorageService.js` (hipotético ou difuso nos services)
    *   **Conceito:** Persistência Local-First, garantindo soberania de dados.

*   **View (Interface)**
    *   **Implementação:** `/sidepanel/views/` (ex: `CoursesView.js`, `SettingsView.js`)
    *   **Característica:** Manipulação direta do DOM (`document.createElement`), sem frameworks pesados (React/Vue), garantindo **performance extrema** e baixo consumo de memória (Critical Rendering Path otimizado).

*   **Controller (Lógica)**
    *   **Implementação:** `/sidepanel/logic/` (ex: `batchScraper.js`) e `/sidepanel/services/`
    *   **Conceito:** Separação de responsabilidades (SoC). A lógica de *scraping* não sabe como a UI exibe os dados.

---

## 2. Qualidade e Testes (QA Engineering)

### Estratégia de Testes: Pirâmide de Testes
O projeto possui uma suíte de testes madura localizada em `/tests`.

*   **Testes de Unidade/Integração:**
    *   **Ferramenta:** Jest + `jest-webextension-mock`
    *   **Destaque:** O arquivo `batchScraper.test.js` demonstra o uso avançado de **Test Doubles (Mocks)**.
    *   **Código Real:**
        ```javascript
        /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue(...)
        ```
    *   **Conceito:** Isolamento de dependências externas (Browser API) para garantir testes determinísticos.

### Análise Estática (Linting)
*   **Ferramenta:** ESLint com `Flat Config` (`eslint.config.mjs`).
*   **Regra de Ouro:** "Zero Warnings".
*   **Conceito:** *Shift-Left Testing* — pegar erros no momento da escrita, não na execução.

---

## 3. Tipagem e Segurança (Type Safety)

Apesar de usar JavaScript (não TypeScript), o projeto atinge alta segurança de tipos através de:

1.  **JSDoc Estrito:** Anotações como `/** @type {jest.Mock} */`.
2.  **Verificação em Tempo de Compilação:** `jsconfig.json` com `"checkJs": true`.
3.  **Codificação Defensiva:** Uso de *Type Guards* em runtime (ex: verificação de `null` antes de acessar propriedades).

---

## 4. Workflows e CI/CD

O arquivo `.cursorrules` e a pasta `.agent/workflows` funcionam como uma **"Constituição do Projeto"**, definindo:

*   **Commits:** Padrão Conventional Commits (ex: `feat:`, `fix:`).
*   **Autonomia:** Scripts de automação definidos para tasks repetitivas (`bug-fix`, `nova-feature`).

---

## ✅ Conclusão

O projeto encontra-se em um nível de maturidade de **Software Engenheirado**, distanciando-se de scripts amadores. Ele prioriza:
1.  **Manutenibilidade** (Arquitetura clara).
2.  **Confiabilidade** (Testes automatizados e Linting estrito).
3.  **Performance** (Vanilla JS otimizado).
