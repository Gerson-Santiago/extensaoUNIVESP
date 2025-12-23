# Issue #011: QuickLinksScraper - Scraper Alternativo com Modal Links Rápidos

**Status**: 🚧 Em Progresso (90% completo)  
**Prioridade**: Média  
**Tipo**: Feature  
**Branch**: `feat/issue-011-quicklinks-scraper`  
**Relacionada**: Issue #010 (DetailsActivitiesView)

---

## 📋 Objetivo

Implementar scraper alternativo usando modal "Links Rápidos" do Blackboard, oferecendo ao usuário dois botões para escolher o método de scraping preferido.

```
[📋 Tarefas] [🔍 Atividades] [⚡ Rápido]
              ↑ DOM           ↑ QuickLinks
```

---

## ✅ O Que Já Está Pronto (90%)

### 1. Service Layer
- ✅ `QuickLinksScraper.js` implementado (117 linhas)
- ✅ Métodos: `extractFromModal()`, `scrapeFromQuickLinks()`
- ✅ Scraping inline na página
- ✅ Extração de ID do `onclick` attribute

### 2. Testes
- ✅ `QuickLinksScraper.test.js` criado (185 linhas)
- ✅ **9/9 testes passando** 🎉
- ✅ Cobertura: extração DOM, scraping, error handling

### 3. UI/UX
- ✅ Botão "⚡ Rápido" adicionado ao `WeekItem.js`
- ✅ Callback `onViewQuickLinks` em `CourseWeeksView`
- ✅ Integração com `DetailsActivitiesWeekView`
- ✅ Tag `w.method` para identificar scraper usado

### 4. Qualidade
- ✅ **Lint**: 0 warnings
- ✅ **Testes**: 9/9 passando
- ❌ **TypeScript**: 6 erros pendentes (BLOCKER)

---

## 🚨 Blockers - Erros TypeScript

### Erro 1: QuickLinksScraper.js (linha 52)
```
TS6133: 'weekUrl' is declared but its value is never read
```
**Solução**: Já aplicada (prefixo `_weekUrl`)

### Erros 2-5: WeekContentScraper.js (linhas 110, 114, 131, 132)
```typescript
// Linha 110 e 114
Property 'href' does not exist on type 'Element'

// Linha 131 e 132  
Property 'src'/'alt' does not exist on type 'Element'
```

**Causa**: Elementos retornados por `querySelector` são tipados como `Element`, não `HTMLAnchorElement` ou `HTMLImageElement`.

**Solução Necessária**: Adicionar type casts
```javascript
// ANTES
const h3Link = li.querySelector('h3 a');
if (!h3Link || !h3Link.href) return;

// DEPOIS
const h3Link = /** @type {HTMLAnchorElement} */ (li.querySelector('h3 a'));
if (!h3Link || !h3Link.href) return;
```

**Arquivos a corrigir**:
- `WeekContentScraper.js` linhas 110, 114, 131, 132

### Erro 6: QuickLinksScraper.test.js (linha 23)
```
Type 'mockChrome' is missing properties from type 'typeof chrome'
```

**Solução**: Adicionar `@ts-ignore`
```javascript
// ANTES
global.chrome = mockChrome;

// DEPOIS
// @ts-ignore - Mock parcial para testes
global.chrome = mockChrome;
```

---

## 📝 Próximos Passos para Engenheiros

### Passo 1: Corrigir Erros TypeScript
```bash
# Ver erros específicos
npm run type-check
```

**Arquivos para editar**:
1. `features/courses/services/WeekContentScraper.js`
   - Adicionar type casts em 4 locais (linhas ~110-132)
2. `features/courses/tests/QuickLinksScraper.test.js`
   - Adicionar `@ts-ignore` antes de `global.chrome = mockChrome`

**Template de correção**:
```javascript
// Para links
const link = /** @type {HTMLAnchorElement} */ (element.querySelector('a'));

// Para imagens
const img = /** @type {HTMLImageElement} */ (element.querySelector('img'));
```

### Passo 2: Validar Correções
```bash
npm run type-check  # Deve passar sem erros
npm run lint        # Deve continuar 0 warnings
npm test -- QuickLinksScraper.test.js  # Deve manter 9/9
```

### Passo 3: Commit
```bash
git add .
git commit -m "feat(courses): adiciona QuickLinksScraper com botão alternativo

FEATURE:
- Scraper alternativo usando modal Links Rápidos
- Botão ⚡ Rápido ao lado de 🔍 Atividades
- 9/9 testes passando

IMPLEMENTAÇÃO:
- QuickLinksScraper.js: scraper usando li.quick_links_header_h3
- WeekItem.js: adiciona botão onViewQuickLinks  
- CourseWeeksView: callback para QuickLinksScraper
- Type casts adicionados para TypeScript

TESTES:
- 9/9 testes passando
- Lint OK
- Type-check OK

Issue #011"
```

### Passo 4: Teste Manual
1. Recarregar extensão
2. Minhas Matérias → Ver semanas
3. Testar **ambos** os botões:
   - [🔍 Atividades] → deve funcionar (DOM)
   - [⚡ Rápido] → deve funcionar (QuickLinks)
4. Comparar resultados

### Passo 5: Merge para `dev`
```bash
git checkout dev
git merge feat/issue-011-quicklinks-scraper
git push origin dev
```

---

## 🔍 Contexto Técnico

### Estrutura HTML do Modal "Links Rápidos"
```html
<h2 id="dialogheading">Links rápidos</h2>
<ul>
  <li class="quick_links_header_h3">
    <a href="#" onclick="quickLinks.messageHelper.activateElement('7722825', ...)">
      Videoaula 1 - Inglês sem mistério
    </a>
  </li>
</ul>
```

### Seletor Usado
```javascript
document.querySelectorAll('li.quick_links_header_h3 a')
```

### Extração de ID
```javascript
const onclick = link.getAttribute('onclick');
const match = onclick.match(/activateElement\s*\(\s*["']([^"']+)["']/);
const id = match[1]; // "7722825"
```

---

## 📊 Métricas

- **Linhas adicionadas**: ~350
- **Arquivos novos**: 2 (QuickLinksScraper.js, QuickLinksScraper.test.js)
- **Arquivos modificados**: 4
- **Testes**: 9/9 (100%)
- **Tempo estimado para conclusão**: 30min - 1h (corrigir TypeScript)
- **Complexidade**: Média

---

## 🎯 Critérios de Aceitação

- [ ] Type-check passando (0 erros)
- [ ] Lint passando (0 warnings)
- [ ] Testes passando (9/9)
- [ ] Commit realizado
- [ ] Teste manual: ambos botões funcionando
- [ ] Merge para `dev`
- [ ] Documentação atualizada

---

## 📚 Referências

- **Walkthrough**: [`walkthrough.md`](file:///home/sant/.gemini/antigravity/brain/e7fa500a-1ab2-446d-93e9-445d0a453257/walkthrough.md)
- **Implementation Plan**: [`implementation_plan.md`](file:///home/sant/.gemini/antigravity/brain/e7fa500a-1ab2-446d-93e9-445d0a453257/implementation_plan.md)
- **Issue Original**: `ISSUE-010-details-activities-view.md`

---

## 🔗 Arquivos Relacionados

### Service Layer
- `features/courses/services/QuickLinksScraper.js` ⚠️ (precisa type cast no JSDoc)
- `features/courses/services/WeekContentScraper.js` ⚠️ (precisa 4 type casts)  
- `features/courses/tests/QuickLinksScraper.test.js` ⚠️ (precisa @ts-ignore)

### UI Layer
- `features/courses/components/WeekItem.js` ✅
- `features/courses/views/CourseWeeksView/index.js` ✅
- `features/courses/views/DetailsActivitiesWeekView/index.js` ✅

---

## 💡 Observações para Engenheiros

### Decisão de Design: Por que dois botões?
- ✅ Preserva funcionalidade existente (sem risco)
- ✅ Permite A/B testing
- ✅ Usuário escolhe método preferido
- ✅ Futuro: adicionar fallback automático

### Por que Links Rápidos?
- Estrutura DOM mais simples e consistente
- Menos sujeita a mudanças do Blackboard
- Já filtrada (só conteúdo relevante)
- Blackboard mantém essa estrutura há anos

### Tag `w.method`
Cada semana scraped recebe uma tag indicando o método:
```javascript
w.method = 'DOM';        // Scraper tradicional
w.method = 'QuickLinks'; // Scraper alternativo
```

**Uso futuro**: Badge visual na UI mostrando método usado.

---

## 🚀 Status Atual

**Código**: 90% completo  
**Testes**: 100% passando (9/9)  
**Lint**: 100% OK  
**TypeScript**: ❌ 6 erros (fácil corrigir)

**Estimativa para conclusão**: 30-60 minutos (corrigir type casts + commit)

---

**Criado por**: Gerson Santiago  
**Data**: 23/12/2025  
**Última atualização**: 23/12/2025 09:01
