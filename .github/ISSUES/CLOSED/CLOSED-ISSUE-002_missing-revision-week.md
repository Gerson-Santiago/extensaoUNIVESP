# 🐛 TECH DEBT: Missing Revision Week in Scraper

## Manual do aluno

**Status:** ✅ CONCLUÍDO (2025-12-30) | **Prioridade:** Média | **Componentes:** `ScraperService`, `BatchScraper`, `CourseStructure`

---

## 📋 Contexto

A regex de identificação de semanas não capturava conteúdos sem numeração explícita, tornando invisível para a extensão a "Semana de Revisão" presente no AVA.

### Análise do DOM

Inspeção de elementos `<a>` no AVA revelou padrões não capturados:

```html
<a href="/course/123/revision">Revisão</a>
<a title="Semana de Revisão" href="/course/123/review">...</a>
```

**Regex anterior** (limitada a numeração):
```javascript
/^Semana\s+(\d{1,2})$/i  // ❌ Ignora "Revisão"
```

---

## ✅ Solução Implementada

### Abordagem Técnica

Regex expandida para capturar tanto semanas numeradas quanto conteúdo especial:

```javascript
/^(Semana\s+(\d{1,2})|Revisão)$/i
```

**Estratégia de análise dual**:
1. `innerText` do elemento `<a>`
2. Fallback para atributo `title` se texto principal falhar

### Arquitetura da Solução

```
┌─────────────────────────────────────┐
│    CourseStructure.js (Shared)      │
│  ┌───────────────────────────────┐  │
│  │ WEEK_IDENTIFIER_REGEX         │  │ ← Fonte única de verdade
│  │ sortWeeks(weeks)              │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ Importado por:
       ┌───────┴────────┐
       │                │
┌──────▼─────┐   ┌─────▼──────────┐
│ Scraper    │   │ BatchScraper   │
│ Service    │   │                │
└────────────┘   └────────────────┘
```

### Lógica de Ordenação

Peso numérico para garantir "Revisão" sempre ao final:

```javascript
function getWeekNumber(weekName) {
  if (/revisão/i.test(weekName)) return 999;
  const match = weekName.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
```

**Resultado**: `['Semana 1', 'Semana 2', ..., 'Revisão']`

---

## 🛠️ Implementação: Roadmap Técnico

| Step | Arquivo | Ação |
|------|---------|------|
| **#STEP-0** | [`WeekOrdering.test.js`](file:///home/sant/extensaoUNIVESP/tests/unit/features/courses/logic/WeekOrdering.test.js) | Remover `.skip` do teste |
| **#STEP-1** | [`CourseStructure.js`](file:///home/sant/extensaoUNIVESP/shared/logic/CourseStructure.js) | Criar `WEEK_IDENTIFIER_REGEX` + `sortWeeks()` |
| **#STEP-2** | [`WeekOrdering.test.js`](file:///home/sant/extensaoUNIVESP/tests/unit/features/courses/logic/WeekOrdering.test.js) | Importar nova lógica |
| **#STEP-3** | [`ScraperService.js`](file:///home/sant/extensaoUNIVESP/features/courses/services/ScraperService.js) | Usar regex centralizada |
| **#STEP-4** | [`ScraperService.js`](file:///home/sant/extensaoUNIVESP/features/courses/services/ScraperService.js) | Passar regex na injeção |
| **#STEP-5** | [`BatchScraper/index.js`](file:///home/sant/extensaoUNIVESP/features/courses/import/services/BatchScraper/index.js) | Replicar refatoração |

> [!TIP]
> **Comando Premium - Roadmap Colorido dos #STEPs:**
> ```bash
> echo -e "\033[1;36m===============================\033[0m" && echo -e "\033[1;36m STEPs Roadmap de Implementação \033[0m" && echo -e "\033[1;36m===============================\033[0m" && for i in {0..5}; do grep -rEn "#STEP-$i" . --exclude="*.md" --exclude-dir={.git,.cache,node_modules} | while IFS=: read -r f l c; do step_id=$(echo "$c" | grep -o "STEP-$i"); desc=$(echo "$c" | sed "s/.*STEP-$i:[ ]*//"); echo -e "\033[1;34m$step_id\033[0m"; echo -e "\033[1;33m: $desc\033[0m"; echo -e "\033[0;37m$f:$l\033[0m"; echo ""; done; done
> ```
> 
> **Versão Simples (sem cores):**
> ```bash
> grep -rn "#STEP-" . --exclude-dir={node_modules,.git} --exclude="*.md"
> ```

---

## ✅ Resultado

### Implementação

Todos os componentes foram atualizados seguindo padrão DRY:

| Componente | Mudança | Impacto |
|------------|---------|---------|
| `CourseStructure.js` | Regex central + `sortWeeks()` | Single source of truth |
| `ScraperService.js` | Import e aplicação | DOM parsing consistente |
| `BatchScraper/index.js` | Import e aplicação | Batch import alinhado |
| `WeekOrdering.test.js` | Teste de regressão | Garantia de qualidade |

### Qualidade Assegurada

- ✅ **458 testes passando** (cobertura completa)
- ✅ **0 warnings de lint** (conformidade ESLint + Security)
- ✅ **Validação manual** (extensão em produção)
- ✅ **Código profissional** (sem comentários didáticos)

### Técnicas Aplicadas

1. **DRY Principle**: Lógica centralizada em módulo compartilhado
2. **DOM Introspection**: Análise dual (`innerText` + `title`)
3. **Weighted Sorting**: Algoritmo numérico para ordenação consistente
4. **TDD**: Teste de regressão antes da implementação

---

## 📚 Referências Técnicas


```bash
# Validar
npm run lint && npm test

# Rodar testes específicos
npm test tests/unit/features/courses/logic/WeekOrdering.test.js
```

---

## 🔍 Conceitos Técnicos


- **Regular Expressions**: Pattern matching para análise de texto DOM
- **DRY Principle**: Centralização de lógica compartilhada
- **TDD**: Test-Driven Development com teste de regressão
- **DOM Introspection**: Análise de elementos HTML e atributos

---

**Etiquetas:** `scraping` `regex` `dom-parsing` `dry-principle`  
**Data de Conclusão:** 2025-12-30

## 🔗 GitHub Issue

- **Status:** 🔒 Published (Closed)
- **Link:** [Issue #18](https://github.com/Gerson-Santiago/extensaoUNIVESP/issues/18)
- **Data:** 2026-01-03

---

