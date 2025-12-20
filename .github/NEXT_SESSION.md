# 📝 README: Como Retomar Fase 2

## 🎯 Status Atual
- ✅ Branch `refactor/settings-decouple` criada e pronta
- ✅ Plano TDD detalhado em `implementation_plan.md`
- ✅ v2.7.0 no ar (origin/dev)

## 🚀 Próxima Sessão: Começar Aqui

### Passo 1: Mudar para Branch de Trabalho
```bash
git checkout refactor/settings-decouple
```

### Passo 2: Verificar Baseline
```bash
npm test  # Deve ter 200 testes passando
```

### Passo 3: Executar Fase 1 do Plano TDD

**Criar arquivo de teste:**
```bash
touch tests/integration/settings-events.integration.test.js
```

**Seguir**: `implementation_plan.md` → Fase 1 (RED)

---

## 📋 Resumo da Sessão Anterior

### O Que Foi Entregue (v2.7.0):
1. **Reestruturação**: `features/import/` → `features/courses/import/`
2. **Documentação**: 
   - GLOSSARIO expandido (149 linhas)
   - docs/README hub criado
   - features/README + _CATEGORIES
3. **Nomenclatura**: CoursesList → CoursesView
4. **Testes**: 200/200 ✅

### Commits (já no origin/dev):
- `docs: adiciona categorização de features`
- `refactor: mover features/import para features/courses/import`
- `docs: atualização completa pós-refatoração v2.7.0`

---

## 🎯 Objetivo Fase 2
**Desacoplar `settings/` de `courses/` via eventos**

**Por quê?** 
`settings` importa diretamente:
- AddManualModal
- CourseRepository  
- CourseService

Violação: INFRA conhece CORE

**Como?**
Event-Driven: settings emite → sidepanel orquestra

---

## ⏱️ Estimativa Fase 2
- Fase 1 (Testes RED): 10-15 min
- Fase 2 (Implementar GREEN): 15-20 min
- Fase 3 (Refactor): 10 min
- Fase 4 (Verificação): 5 min
- **Total**: 40-50 min

---

## 📚 Recursos
- Plano completo: `implementation_plan.md`
- Issue: `.github/ISSUE_FASE_2_SETTINGS.md`
- Branch: `refactor/settings-decouple`

---

> **Próximo comando**: `git checkout refactor/settings-decouple`
