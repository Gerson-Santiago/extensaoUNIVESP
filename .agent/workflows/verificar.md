---
description: Executa a verificação completa do projeto (Quality Gate) conforme a política de qualidade.
---

# ✅ Quality Gate: Verificação Completa

Este workflow é o **Portal de Qualidade (Quality Gate)** do projeto. Nenhuma branch deve ser mergeada em `dev` ou `main` sem que este fluxo complete com status **GREEN**.

## 🛡️ Protocolo de Verificação (Zero Tolerância)

1. **Gate de Segurança**: `npm run security`
   - ✅ Sem secrets detectados (SecretLint)
   - ✅ Sem vulnerabilidades High/Critical (npm audit)
2. **Qualidade de Código**: `npm run lint` && `npm run type-check`
   - ✅ Zero warnings de ESLint
   - ✅ Zero erros de JSDoc Typing (TSC)
3. **Integridade Funcional**: `npm test`
   - ✅ Todos os testes passando (Green)
   - ✅ Cobertura de lógica crítica mantida ou aumentada

## 🔄 Fluxo de Execução

// turbo
```bash
# Execução do gate completo antes de qualquer commit ou push
npm run verify
```

---

## 💡 Comandos para Desenvolvimento Otimizado

Se você estiver em um ciclo de desenvolvimento ativo, use estes comandos para feedback rápido:

### ⚡ Rapidez e Foco
- `npm run test:quick` - Executa apenas testes que falharam na última rodada
- `npm run test:watch` - Modo watch interativo (ideal para TDD)
- `npm run test:debug` - Para no primeiro erro encontrado

### 🧪 Cobertura e Auditoria
- `npm run test:coverage` - Gera relatório de cobertura de testes
- `npm run security:secrets` - Verifica apenas vazamento de segredos

## ⛔ Bloqueadores
Se qualquer um dos passos acima falhar: **NÃO FAÇA PUSH**.
Corrija os problemas e execute `npm run verify` novamente.

> **Regra de Ouro:** O repositório deve permanecer "Green-Green" em todos os momentos.