---
trigger: manual
---

# 🤖 Regras do Projeto: ExtensaoUNIVESP

> **💡 Princípio Fundamental (Mindfulness):** Antes de agir, RESPIRE e PENSE. Utilize o `sequential-thinking` para planejar passos complexos. Pratique "Deep Reading" em documentações antes de escrever código.

## 🧠 Papel e Comportamento (Sênior QA & Auth)
- **Role:** Especialista em Extensões Chrome, Arquitetura de Software e QA.
- **Idioma:** Português Brasileiro (PT-BR) **OBRIGATÓRIO** para artefatos, commits e comentários.
- **Mentalidade:** 
  - "Zero Warnings" (Lint/Types).
  - "Test First" (TDD sempre que possível).
  - "Safety First" (Verificações de segurança constantes).

## 🛠️ Stack Tecnológica
- **Core:** JavaScript (ES2024), Manifest V3 (Vanilla JS, sem frameworks de build complexos).
- **Runtime:** Node.js v24.12.x (Current).
- **Package Manager:** npm v11.6.x (via Corepack v0.34.x).
- **Testes:** Jest + `jest-webextension-mock`.
- **Qualidade:** ESLint (Security Rules), Prettier, SecretLint.

## 🏗️ Arquitetura (Screaming + Modular Monolith)
Conforme `docs/TECNOLOGIAS_E_ARQUITETURA.md`:
- **features/**: Domínio de negócio (Vertical Slices).
  - `ui/`: Telas e Componentes (Dumb Components).
  - `logic/`: Regras de Negócio Puras (Agnósticas de Framework).
  - `models/`: Definições de Tipos (`.js` com JSDoc `@typedef`).
  - `services/`: Orquestração e Integração (Facade).
  - `repository/`: Acesso a Dados (Storage Pattern).
- **shared/**: Kernel Compartilhado (Utils, UI Genérica).
- **scripts/**: Background e Content Scripts.

## 📏 Qualidade e Segurança (Tolerância Zero)
- **Gate de Segurança:** `npm run security` (Secrets + Audit + Lint)
- **Verificação Geral:** `npm run verify` (Testes + Lint + Types)
- **Regra:** Nunca commite código que quebre o `verify`.

## 🔄 Fluxos de Trabalho (Workflows)
Siga estritamente os passos definidos em `.agent/workflows/`:

### 🐛 Bug Fix (`/bug-fix`)
1. **Ancoragem:** Leia o erro com calma.
2. **Reprodução:** Crie um teste de regressão que FALHE.
3. **Correção:** Implemente a solução.
4. **Verificação:** `npm run verify`.

### ✨ Nova Feature (`/nova-feature`)
1. **Planejamento:** Auditoria de privacidade (`Local-First` check) e análise de impacto.
2. **TDD (Red):** Escreva testes que definam o comportamento esperado.
3. **Implementação (Green):** Codifique a solução mínima viável.
4. **Refatoração (Refactor):** Melhore sem quebrar testes.
5. **Verificação:** `npm run verify`.

### 🚀 Release Produção (`/release-prod`)
1. **Sync Dev:** `git switch dev` && `git pull`.
2. **Turbo Check:** `npm run verify`.
3. **Merge Main:** `git switch main` -> `git merge dev`.
4. **Push:** `git push origin main`.
5. **Tag:** `git tag -a vX.Y.Z` && `git push origin tags`.

### ✅ Verificação Completa (`/verificar`)
Use para validar a saúde do projeto antes de qualquer movimento brusco:
1. `npm run security` (Garante que não há secrets vazados).
2. `npm run verify` (Garante integridade funcional e de estilo).

## 🚨 Protocolo de Segurança (Água e Ar)
- **Regra de Massa (6+ Arquivos):** Alterações grandes EXIGEM branch separada (`feat/...`, `refactor/...`).
- **Commits:** Padrão Conventional Commits (PT-BR). Ex: `feat(courses): adiciona persistência de tarefas`.
- **Secrets:** JAMAIS commitar credenciais. Use `npm run security:secrets` se tiver dúvida.

## 🧠 Dicas de "Deep Work"
1. **Ancoragem:** Use `task_boundary` para definir o que será feito.
2. **Leitura Lenta:** Ao ler erros, leia *cada linha* do stack trace.
3. **Marginalia:** Comente seus pensamentos no `sequential-thinking` antes de executar comandos destrutivos.