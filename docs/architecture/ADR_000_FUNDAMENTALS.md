# ADR-000: Fundamentos Arquiteturais
**Status**: Aceito (v2.6.0) | **Data**: 2025-12-18

## Problema
Projeto sem princípios arquiteturais claros causava:
- Dificuldade de onboarding (estrutura MVC tradicional confusa)
- Bugs de tipo em runtime (JavaScript sem verificação estática)
- Testes desorganizados (debugging lento quando falhavam)

## Solução
Três pilares fundamentais obrigatórios:

### 1. Screaming Architecture (Vertical Slices)
- Organização por **features de negócio** (não camadas técnicas MVC)
- Estrutura: `features/courses/`, `features/import/`, `features/session/`
- **CCP** (Common Closure Principle): coisas que mudam juntas ficam juntas
- Cada feature agrupa UI, Lógica e Testes

### 2. Type Safety (JSDoc + TypeScript Check)
- JSDoc em **3 camadas**: Domain Models, Logic/DTO, View Contracts
- **Regra**: Zero `@type {*}` ou `@type {Object}` em produção
- Verificação: `npm run type-check` obrigatório em CI/CD
- Auto-complete em VS Code, detecção de contratos quebrados

### 3. AAA Testing Pattern
- **Arrange-Act-Assert** obrigatório em todos os testes
- Estrutura previsível facilita leitura e debugging
- Aplicar em unitários, integração e E2E
- Reduz testes com múltiplas responsabilidades

## Trade-offs
- ✅ **Benefícios**: Onboarding rápido (features gritam propósito), type-safety sem build step, testes legíveis, baixo acoplamento entre features
- ⚠️ **Riscos**: Verbosidade em JSDoc, risco de poluição em `shared/`, verbosidade em testes triviais (mitigados por templates VSCode, code review rigoroso de PRs em `shared/`, aceitar verbosidade em prol de clareza)

## Refs
- [VIS_MANIFESTO.md](VIS_MANIFESTO.md) - Pilares "Domínio" e "CCP"
- [ADR-002](ADR_002_SAFERESULT_PATTERN.md) - SafeResult facilita contratos explícitos
- [ADR-006](ADR_006_TEST_STRATEGY_REFRESHER.md) - AAA + Integration Tests
- [ADR-009](ADR_009_SECURITY_FIRST.md) - Tipos explícitos previnem bugs de segurança
- `jsconfig.json` - Configuração TypeScript
- `docs/TEST_TEMPLATES.md` - Templates AAA exemplares

- `docs/TEST_TEMPLATES.md` - Templates AAA exemplares
