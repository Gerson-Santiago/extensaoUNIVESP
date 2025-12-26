---
description: Executa a verificação completa do projeto (Lint + Testes) conforme a política de qualidade.
---

# Passo Único: Verificação Completa
@docs/PADROES_DO_PROJETO.md
// turbo
Execute a pipeline de qualidade (Testes + Lint + Types):
1. `npm run verify`

# Relatório
Se falhar, não prossiga.
- Lint errors devem ser zerados.
- Testes devem estar todos passando (Green).

---

## 💡 Opções de Verificação

### Durante Desenvolvimento (Rápido)
```bash
npm run test:quick  # Apenas testes que falharam
npm run lint        # Apenas lint
```

### Antes de Commit (Completo)
```bash
npm run verify  # Testes + Lint + Type-check completo
```

### Opcional: Coverage
```bash
npm run test:coverage  # Gera relatório de cobertura
```

## 📊 Comandos Jest Disponíveis

- `npm run test:quick` - Apenas testes que falharam (mais rápido)
- `npm run test:dev` - Modo watch interativo
- `npm run test:debug` - Para no primeiro erro
- `npm test` - Suite completa (usado pelo verify)
- `npm run test:ci` - Para CI/CD com coverage