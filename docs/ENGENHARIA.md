# Engenharia e Arquitetura - Central Univesp

Este documento consolida os padrões de código, arquitetura de software, fluxos de engenharia e guias de estilo do projeto.

---

## 🏗️ 1. Pilares Arquitetônicos

### Screaming Architecture
A organização é baseada em domínios funcionais dentro da pasta `features/`. Cada feature é auto-contida.
- **logic/**: Regras puras e lógica de negócio.
- **services/**: I/O, Integração com DOM do AVA, APIs de Storage.
- **repository/**: Camada de persistência (StorageGuard).
- **views/**: Componentes de UI (Side Panel).

### Local-First e MV3
- **Persistência**: Dados residem estritamente no `chrome.storage`. Zero backend.
- **Service Workers**: Arquitetura 100% orientada a eventos para conformidade com o ciclo de vida efêmero do Manifest V3.
- **Performance**: Vanilla JS nativo sem frameworks pesados para garantir rapidez no carregamento.

---

## 🛠️ 2. Guia de Estilo e Padrões

### Qualidade Estática
- **ESLint**: Semicolons obrigatórios, single quotes, sem variáveis não utilizadas.
- **JSDoc**: Tipagem obrigatória em todas as funções públicas e models (@typedef).
- **Trusted Types**: Todas as manipulações de DOM devem usar a policy `dom-safe-policy`. Uso de `innerHTML` é terminantemente proibido.

### Padrão de Implementação
- **SafeResult**: Funções críticas devem retornar `{ success, data, error }`.
- **Early Return**: Evite aninhamentos profundos; prefira cláusulas de guarda.
- **ESM**: Uso exclusivo de `import/export`.

---

## 🧪 3. Testes e Qualidade

O projeto utiliza **Jest** com o padrão **AAA (Arrange, Act, Assert)**.

- **Arrange**: Configuração de mocks e ambiente.
- **Act**: Invocação da unidade sob teste.
- **Assert**: Verificação rigorosa do resultado.

**Cobertura**: Foco em lógica de negócio e serviços de persistência.

---

## 🚦 4. Fluxos de Trabalho

### Git e Commits
- **Conventional Commits**: `<tipo>(<escopo>): <descrição>` (Ex: `feat(cursos): ...`).
- **Issues**: Referencie sempre `Refs: ISSUE-XXX` ou `Closes #XX`.
- **Branches**: Trabalhe sempre em `feat/`, `fix/` ou `refactor/`. Nunca direto na `dev` ou `main`.

### Scripts Úteis
- `npm run check`: Verifica lint e tipos de forma rápida.
- `npm run verify`: Executa a suíte completa de testes e verificações estáticas.
- `npm test path/to/file.test.js`: Executa um teste específico.

---

## 🚫 5. Anti-Padrões (O que EVITAR)
- **Placeholders**: Nunca deixe códigos comentados ou TODOs sem issue vinculada.
- **Global Scope**: Evite poluir o objeto global; use módulos ESM.
- **CSS Ad-hoc**: Use o sistema de design tokens se disponível; evite estilos inline em JS.
- **innerHTML**: Vulnerabilidade de XSS. Use `DOMSafe.createElement`.

---
[Voltar para o Índice](README.md)
