# 🤖 Regras do Agente IA - ExtensãoUNIVESP

**Versão**: 2.9.7 | **Atualização**: 2026-01-01

---

## 🚨 RESTRIÇÕES CRÍTICAS

### ❌ PROIBIDO Executar Sem Permissão
```bash
npm run verify | npm run test | npm test
npm run test:coverage | npm run test:debug
```
**Motivo**: Limite de RAM. Usuário executa no terminal.

### ✅ PERMITIDO Executar
```bash
npm run check        # Lint + types (< 1s)
npm run test:quick   # Testes falhos (~10s)
npm test file.test.js # Teste específico
```

**Comunicação**: Quando precisar de `verify`, SEMPRE pedir ao usuário executar.

---

## 💡 Princípio (Wittgenstein)
- **Respire e Pense**: Use `sequential-thinking` para planejar
- **Representação de Fatos**: Código = imagem lógica de requisitos
- **Limites do Sentido**: Clareza absoluta, zero ruído
- **Test First**: TDD obrigatório

---

## 🛠️ Stack
- **Core**: JavaScript ES2024, Manifest V3 (Vanilla)
- **Runtime**: Node.js v24, npm v11
- **Testes**: Jest + JSDOM, AAA pattern (PT-BR)
- **Qualidade**: ESLint, Prettier, SecretLint

---

## 🏗️ Arquitetura
**Screaming + Modular Monolith** (`docs/TECNOLOGIAS_E_ARQUITETURA.md`)
- `features/`: Vertical Slices (ui, logic, models, services, repository)
- `shared/`: Kernel compartilhado
- `background/`, `content/`: Scripts da extensão

---

## 📝 Protocolos

### Git & Commits
- **Branch**: Sempre criar (`/git-flow`)
- **Commits**: Conventional PT-BR (`feat(escopo): mensagem`)
- **Secrets**: Jamais commitar (use `npm run security:secrets`)

### Qualidade
- **Check rápido**: `npm run check` (lint + types)
- **Testes**: `npm run test:quick` (apenas falhos)
- **Gate completo**: Pedir usuário executar `npm run verify`

### Regra de Massa
**6+ arquivos** = Branch separada obrigatória

---

## 📚 ONDE ENCONTRAR

### Workflows (`.agent/workflows/`)
- `/bug-fix` - TDD Red-Green para bugs
- `/nova-feature` - TDD completo + ADR
- `/refactor` - Green-Green pattern
- `/git-flow` - Convenções de branches
- `/verificar` - Quality Gate
- `/versionamento` - Enterprise Protocol
- `/release-prod` - Merge dev→main

### Documentação (`docs/`)
- `ANTI_PADROES.md` - Padrões proibidos
- `TEST_TEMPLATES.md` - Templates oficiais
- `architecture/ADR_*.md` - Decisões arquiteturais
- `TECNOLOGIAS_E_ARQUITETURA.md` - Stack completa

### Regras de Negócio
- `docs/REGRAS_DE_NEGOCIO.md` - Lógica do domínio
- `docs/PADROES.md` - Convenções de código

---

**Idioma**: 🇧🇷 Português Brasileiro **OBRIGATÓRIO** (commits, comentários, artefatos)
