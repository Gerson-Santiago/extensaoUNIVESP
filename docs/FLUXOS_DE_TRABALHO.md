# Fluxos de Engenharia

[[README](README.md)] | [[Git Flow (IA)](../.agent/workflows/git-flow.md)]

### 1. Diretrizes
- Veto: Instalação de pacotes requer aprovação.
- Proteção: Proibido commitar na main/dev. Use branches.
- Verificação: npm run verify antes de PRs.

### 2. Git Flow
- Branches: feat/, fix/, refactor/.
- Sincronia: Pull da dev diário; Push frequente.

### 3. Release
1. Validação total via npm run verify.
2. Merge dev -> main.
3. Tag de versão (vX.Y.Z).

### 4. Scripts
- npm run check: Lint + tipos.
- npm run verify: Check + testes.
- npm run test:quick: Apenas falhos.

---
[README](README.md)
