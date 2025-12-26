---
description: Executa a verificação completa do projeto (Lint + Testes) conforme a política de qualidade.
---

# Passo Único: Verificação Completa
@docs/PADROES_DO_PROJETO.md
// turbo
Execute a pipeline de qualidade (Segurança + Testes + Lint + Types):
1. `npm run verify`

# Relatório
Se falhar, não prossiga.
- **Segurança**: Sem secrets detectados
- **Lint errors**: Devem ser zerados
- **Testes**: Devem estar todos passando (Green)

---

## 💡 Opções de Verificação

### Gate de Segurança (Pre-commit)
```bash
# Executado automaticamente em todo commit:
security:secrets → lint-staged (eslint + prettier + testes relacionados)
```

### Validação Manual Completa
```bash
npm run security  # Secrets + Audit + Security Lint
npm run verify    # Tests + Lint + Type-check
```

### Durante Desenvolvimento (Rápido)
```bash
npm run test:quick        # Apenas testes que falharam
npm run security:secrets  # Apenas detecção de secrets
npm run lint              # Apenas lint
```

### Opcional: Coverage
```bash
npm run test:coverage  # Gera relatório de cobertura
```

## 📊 Comandos Disponíveis

**Segurança:**
- `npm run security` - Gate completo (secrets + audit + lint)
- `npm run security:secrets` - Detecta API keys, tokens, passwords
- `npm run security:audit` - npm audit --audit-level=high
- `npm run security:lint` - ESLint com regras de segurança

**Testes:**
- `npm run test:quick` - Apenas testes que falharam
- `npm run test:watch` - Modo watch interativo
- `npm run test:debug` - Para no primeiro erro
- `npm test` - Suite completa
- `npm run test:ci` - Para CI/CD com coverage