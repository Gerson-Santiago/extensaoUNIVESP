# Documentação de Scripts (NPM Scripts)

Este documento detalha todos os scripts disponíveis no `package.json` do projeto. Eles são executados via terminal usando o comando `npm run <nome-do-script>`.

## 🔍 Verificação Geral (Pipeline)

Scripts que combinam múltiplas checagens para garantir a integridade do código.

| Script | Comando Executado | Descrição |
| :--- | :--- | :--- |
| **`verify`** | `npm test && npm run lint && npm run type-check` | **Principal comando de validação.** Executa a suíte completa de testes, verifica o estilo de código (lint) e checagem estática de tipos baseada em JSDoc via TypeScript. Deve passar antes de qualquer push. |
| **`precommit`** | `npm run security:secrets && lint-staged` | Executado automaticamente pelo Husky antes de cada commit. Verifica segredos e roda lint apenas nos arquivos modificados (staged). |

## 🛠️ Linting e Formatação

Ferramentas para padronização de código, estilo e tipagem.

| Script | Comando Executado | Descrição |
| :--- | :--- | :--- |
| **`lint`** | `eslint . --max-warnings=0` | Verifica violações de estilo de código e erros lógicos usando ESLint. Não tolera nenhum aviso (`warnings`). |
| **`lint:fix`** | `eslint . --fix` | Tenta corrigir automaticamente o maior número possível de violações de lint. |
| **`format`** | `prettier --write .` | Formata automaticamente todo o código do projeto seguindo as regras do Prettier. |
| **`format:clean`** | `prettier --write . --list-different` | Formata o código e lista no terminal quais arquivos foram modificados durante o processo. |
| **`format:check`** | `prettier --check .` | Apenas verifica se o código está formatado corretamente, sem realizar alterações. Útil para CI/CD. |
| **`type-check`** | `tsc -p jsconfig.json --noEmit` | Realiza a checagem estática de tipos baseada no JSDoc e configurações do `jsconfig.json`, sem gerar arquivos de saída (`--noEmit`). |

## 🧪 Testes Automatizados (Jest)

Comandos para execução e monitoramento de testes.

### Execução Geral

| Script | Comando Executado | Descrição |
| :--- | :--- | :--- |
| **`test`** | `jest` | Executa todos os testes do projeto. |
| **`test:quick`** | `jest --onlyFailures` | Executa apenas os testes que falharam na última execução. Ótimo para correções rápidas. |
| **`test:debug`** | `jest --runInBand --verbose --detectOpenHandles` | Executa os testes de forma sequencial (runInBand), com log detalhado e detectando processos presas (open handles). |
| **`test:stable`** | `jest --runInBand --no-cache` | Executa os testes sequencialmente e sem cache para garantir um ambiente limpo. |
| **`test:watch`** | `jest --watch` | Mantém os testes rodando em segundo plano e re-executa automaticamente ao detectar alterações nos arquivos (TDD). |
| **`test:coverage`** | `jest --coverage` | Executa os testes e gera um relatório de cobertura de código (linhas, funções, branches cobertos). |
| **`test:list`** | `jest --listTests` | Lista todos os arquivos de teste que seriam executados, sem rodá-los. |
| **`test:ci`** | `jest --ci --coverage --runInBand` | Modo otimizado para CI: execução sequencial, com cobertura e flag de CI. |

### Escopo Específico

Scripts para testar apenas partes específicas da aplicação.

| Script | Comando Executado | Descrição |
| :--- | :--- | :--- |
| **`test:unit`** | `jest --testPathIgnorePatterns=tests/integration` | Executa apenas testes unitários, ignorando os de integração. |
| **`test:integration`** | `jest tests/integration` | Executa apenas os testes localizados na pasta de integração. |
| **`test:courses`** | `jest features/courses` | Testa apenas a feature de **Cursos**. |
| **`test:feedback`** | `jest features/feedback` | Testa apenas a feature de **Feedback**. |
| **`test:home`** | `jest features/home` | Testa apenas a feature **Home**. |
| **`test:session`** | `jest features/session` | Testa apenas a feature de **Sessão**. |
| **`test:settings`** | `jest features/settings` | Testa apenas a feature de **Configurações**. |
| **`test:shared`** | `jest shared/` | Testa apenas os módulos compartilhados (**Shared**). |

## 🔒 Segurança

Verificações de vulnerabilidades e segredos.

| Script | Comando Executado | Descrição |
| :--- | :--- | :--- |
| **`security`** | `npm run security:secrets && npm run security:audit && npm run security:lint` | **Gate completo de segurança.** Executa todas as verificações de segurança abaixo. |
| **`security:secrets`** | `secretlint '**/*'` | Varre o código em busca de segredos expostos (chaves de API, senhas, tokens) usando Secretlint. |
| **`security:audit`** | `npm audit --audit-level=high` | Verifica vulnerabilidades conhecidas nas dependências do projeto (CVEs) com nível alto ou crítico. |
| **`security:lint`** | `eslint . --max-warnings=0` | Alias para o lint focado em garantir que regras de segurança do ESLint sejam cumpridas. |
