# 🚀 Quick Start - v2.8.0

Guia rápido para começar a implementar as issues do Epic v2.8.0.

---

## 📋 Pré-requisitos

- [ ] Node.js 20.x+
- [ ] Git configurado
- [ ] VSCode com ESLint + Prettier
- [ ] Leitura completa de:
  - `.cursorrules`
  - `FLUXOS_DE_TRABALHO.md`
  - `SPEC-v2.8.0_GESTAO_ACADEMICA.md`

---

## 🎯 Primeira Issue: #001 Week.js

### 1. Preparação
```bash
cd /home/sant/extensaoUNIVESP
git switch dev
git pull origin dev
npm test  # Garantir que está tudo verde
```

### 2. Criar Branch
```bash
git switch -c feat/issue-001-week-model
```

### 3. TDD: RED Phase
Criar arquivo de teste:
```bash
touch features/courses/models/Week.test.js
```

Adicionar teste:
```javascript
describe('Week Model', () => {
  it('should support status in items', () => {
    const week = {
      name: 'Semana 1',
      items: [
        { name: 'Tarefa 1', status: 'DONE' },
        { name: 'Tarefa 2', status: 'TODO' }
      ]
    };
    expect(week.items[0].status).toBe('DONE');
  });
});
```

Rodar (deve FALHAR):
```bash
npm test -- Week.test.js
```

### 4. TDD: GREEN Phase
Editar `features/courses/models/Week.js`:
```javascript
/**
 * @typedef {Object} WeekItem
 * @property {string} name
 * @property {string} url
 * @property {string} type
 * @property {'TODO'|'DOING'|'DONE'} [status] - Status da tarefa
 */

/**
 * @typedef {Object} Week
 * @property {string} name
 * @property {string} [url]
 * @property {string} [date]
 * @property {WeekItem[]} [items]
 */
```

Rodar (deve PASSAR):
```bash
npm test -- Week.test.js
```

### 5. TDD: REFACTOR Phase
```bash
npm run type-check  # Zero erros
npm run lint        # Zero warnings
npm test            # All passing
```

### 6. Commit
```bash
git add features/courses/models/Week.js features/courses/models/Week.test.js
git commit -m "feat(courses): adiciona status aos items de Week"
```

### 7. Merge
```bash
git switch dev
git merge feat/issue-001-week-model
git push origin dev
git branch -d feat/issue-001-week-model
```

---

## ✅ Checklist de Cada Issue

Para TODAS as issues, seguir:

1. [ ] Criar branch `feat/issue-XXX-nome`
2. [ ] TDD: Escrever teste (RED)
3. [ ] TDD: Implementar código (GREEN)
4. [ ] TDD: Refatorar (REFACTOR)
5. [ ] Validar: `npm test`, `lint`, `type-check`
6. [ ] Commit semântico em PT-BR
7. [ ] Merge para dev
8. [ ] Delete branch local
9. [ ] Marcar issue como concluída em `IMPLEMENTATION-CHECKLIST.md`

---

## 🔄 Workflows Disponíveis

```bash
/nova-feature    # Para issues com lógica nova
/bug-fix         # Se encontrar bug durante implementação
/refactor        # Para melhorias de código existente
/verificar       # Roda lint + type-check + testes
```

---

## 📚 Documentação de Referência

| Documento | O que contém |
|-----------|--------------|
| `EPIC-v2.8.0-gestao-tarefas.md` | Visão geral e métricas |
| `ISSUE-00X-*.md` | Detalhes de cada issue |
| `IMPLEMENTATION-CHECKLIST.md` | Checklist de progresso |
| `SPEC-v2.8.0_GESTAO_ACADEMICA.md` | Especificação técnica completa |

---

## 🚨 Regras Importantes

1. **NUNCA** commitar código quebrado
2. **SEMPRE** rodar testes antes de commit
3. **SEMPRE** usar TDD (RED-GREEN-REFACTOR)
4. **ZERO warnings** (lint ou type-check)
5. Commits em **PT-BR**
6. Branch por issue (granularidade)

---

## 💡 Dicas

- Use `npm test -- --watch` para rodar testes automaticamente
- VSCode deve mostrar 0 sublinhados vermelhos
- Console.log é PROIBIDO (use console.error se necessário)
- Prefira const/let, nunca var
- JSDoc obrigatório em funções públicas

---

**Boa sorte! 🎯 Comece pela #001!**
