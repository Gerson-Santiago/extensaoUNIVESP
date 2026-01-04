# Regras Consolidadas - Agente IA

Protocolos críticos para operação autonôma.

### 1. Restrições (RAM)
Proibido: npm run verify, npm run test, npm run test:coverage.
Permitido: npm run check, npm run test:quick, npm test file.test.js.
Protocolo: Pedir ao usuário para rodar verify completo.

### 2. Princípios
- Pense antes de agir (sequential-thinking).
- TDD Obrigatório em bugs e novas features.
- Minimalismo extremo: Zero emojis e ruído documental.

### 3. Integração
- Git: Feature branches obrigatórias. Commits Conventional PT-BR.
- Limite: Alterações em >6 arquivos exigem quebra em partes/branches.

### 4. Referências
Workflows: [TDD](../.agent/workflows/tdd.md) | [Git Flow](../.agent/workflows/git-flow.md) | [Release](../.agent/workflows/release.md)
Documentação: [README](README.md) | [Padrões](PADROES.md) | [Arquitetura](TECNOLOGIAS_E_ARQUITETURA.md)

Idioma: Português Brasileiro obrigatório.
---
[README](README.md)
