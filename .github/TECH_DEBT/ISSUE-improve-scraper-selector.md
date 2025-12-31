# 🔧 TECH DEBT: Improve ScraperService CSS Selector Strategy

**Status:** 📋 Planejado (Implementar APÓS [ISSUE-missing-revision-week](./ISSUE-missing-revision-week.md))  
**Prioridade:** Baixa (Enhancement/Optimization)  
**Componentes:** `ScraperService`, `DOM_extractWeeks_Injected`  
**Tipo:** Performance + Precisão

---

## 🔗 Relacionado

**ISSUE Pai:** [ISSUE-missing-revision-week](./ISSUE-missing-revision-week.md)

Durante a resolução do bug da "Semana de Revisão", descobrimos que o **seletor CSS atual** do ScraperService pode ser melhorado significativamente.

---

## 📋 Problema Atual

### **Estratégia Atual (Genérica):**

```javascript
// ScraperService.js - Linha 8 e 150
const links = document.querySelectorAll('a');  // ❌ TODOS os links da página
```

**Consequências:**
- ❌ Processa **TODOS** os links (avisos, fóruns, atividades, etc.)
- ❌ Precisa filtrar com regex depois
- ❌ Performance ruim (muitos elementos desnecessários)
- ❌ Perde dados importantes (`id`, `contentId` direto do elemento)
- ❌ Depende 100% da regex para identificar semanas

---

## ✅ Solução Proposta

### **Nova Estratégia (Específica):**

```javascript
// Usar seletor específico do Blackboard
const paletteItems = document.querySelectorAll('li[id^="paletteItem:"]');  // ✅ Só itens de menu
```

**Benefícios:**
- ✅ Processa **APENAS** itens do menu lateral
- ✅ Mais preciso (estrutura oficial do Blackboard)
- ✅ Performance melhor (menos elementos)
- ✅ Acesso direto a dados estruturados (`id`, `contentId`, `title`)
- ✅ Regex vira validação secundária, não filtro principal

---

## 📊 Comparação Técnica

### **Dados do Audit (Disciplina LET100):**

| Métrica | `querySelectorAll('a')` | `querySelectorAll('li[id^="paletteItem:"]')` |
|---------|-------------------------|---------------------------------------------|
| **Elementos encontrados** | ~150+ links | 26 itens ✅ |
| **Precisão** | Baixa (precisa filtrar) | Alta (só menu) |
| **Performance** | Lenta (processa todos) | Rápida (só relevantes) |
| **Dados disponíveis** | `text`, `href` | `id`, `title`, `text`, `href`, `contentId` |
| **Falsos positivos** | Muitos (avisos, fóruns) | Zero ✅ |

**Redução:** ~83% menos elementos processados! 🚀

---

## 🔍 Evidências

### **Output do Audit Script:**

```javascript
// scripts/tests/audit-ava-dom.js já usa paletteItem com sucesso:

const paletteItems = document.querySelectorAll('li[id^="paletteItem:"]');
// Encontrados: 26 itens

paletteData = [
  {
    id: 'paletteItem:_304005_1',
    title: 'Semana 1',
    href: '/webapps/blackboard/content/listContent.jsp?...',
    contentId: '_1763491_1'  ← Dados estruturados! ✅
  },
  {
    id: 'paletteItem:_304012_1',
    title: 'Revisão',
    href: '/webapps/blackboard/content/listContent.jsp?...',
    contentId: '_1763497_1'
  }
]
```

**Conclusão:** A estrutura `paletteItem` é **confiável** e **rica em dados**.

---

## 🛠️ Implementação Proposta

### **Código Novo:**

```javascript
/**
 * Função auxiliar para injeção no navegador (MELHORADA)
 */
function DOM_extractWeeks_Injected(weekRegexSource) {
  const weekRegex = new RegExp(weekRegexSource, 'i');
  const weeks = [];
  
  // ESTRATÉGIA 1: Usar paletteItem (preferencial)
  const paletteItems = document.querySelectorAll('li[id^="paletteItem:"]');
  
  if (paletteItems.length > 0) {
    paletteItems.forEach(item => {
      const span = item.querySelector('span[title]');
      const link = item.querySelector('a[href]');
      
      if (!span || !link) return;
      
      const title = span.getAttribute('title') || span.textContent?.trim();
      const href = link.getAttribute('href');
      
      // Validar com regex
      if (weekRegex.test(title)) {
        weeks.push({
          name: title,
          url: href.startsWith('http') ? href : window.location.origin + href,
          id: item.id,
          contentId: href.match(/content_id=([^&]+)/)?.[1] || ''
        });
      }
    });
  }
  
  // FALLBACK: Estratégia antiga se paletteItem não encontrar nada
  if (weeks.length === 0) {
    console.warn('[ScraperService] paletteItem não encontrado, usando fallback');
    // Código atual como backup...
  }
  
  return { 
    weeks, 
    title: getPageTitle(),
    strategy: weeks.length > 0 ? 'paletteItem' : 'fallback'  // Debug info
  };
}
```

---

## 🧪 Plano de Testes

### **Validações Necessárias:**

1. ✅ Testar em **múltiplas disciplinas** (LET100, MAT101, etc.)
2. ✅ Verificar se `paletteItem` existe em **todas** as páginas AVA
3. ✅ Comparar resultados: `paletteItem` vs `querySelectorAll('a')`
4. ✅ Garantir que **fallback funciona** se estrutura mudar
5. ✅ Medir **performance** (tempo de execução)

### **Comandos de Teste:**

```bash
# Executar testes existentes
npm run test tests/unit/features/courses/logic/WeekOrdering.test.js

# Testar manualmente
# 1. Instalar extensão
# 2. Abrir 5+ disciplinas diferentes
# 3. Executar scraping
# 4. Comparar resultados
```

---

## ✅ Critérios de Sucesso

- [ ] Mantém **TODAS** as semanas capturadas pela estratégia antiga
- [ ] **Adiciona** dados extras: `id`, `contentId`
- [ ] **Reduz** tempo de execução em >= 50%
- [ ] **Fallback** funciona se `paletteItem` não existir
- [ ] **Testes** passam em 5+ disciplinas diferentes
- [ ] **Zero regressão** em funcionalidades existentes

---

## ⚠️ Riscos e Mitigação

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| AVA muda estrutura `paletteItem` | Baixa | Fallback para estratégia antiga |
| Algumas páginas não têm `paletteItem` | Média | Detectar e usar fallback automaticamente |
| Quebra scraping em versões antigas do AVA | Baixa | Testes em múltiplas disciplinas |

---

## 📅 Roadmap de Implementação

### **Pré-requisitos:**
- ✅ [ISSUE-missing-revision-week](./ISSUE-missing-revision-week.md) **RESOLVIDA**
- ✅ Testes de regressão passando

### **Etapas:**

1. **#STEP-1:** Criar branch `feat/improve-scraper-selector`
2. **#STEP-2:** Implementar nova estratégia com fallback
3. **#STEP-3:** Adicionar testes unitários
4. **#STEP-4:** Testar em 5+ disciplinas manualmente
5. **#STEP-5:** Code review
6. **#STEP-6:** Merge para `dev`
7. **#STEP-7:** Validação em staging
8. **#STEP-8:** Deploy para produção

**Tempo Estimado:** 1-2 dias (incluindo testes)

---

## 📈 Benefícios Mensuráveis

### **Performance:**
```
Antes: ~150 elementos processados
Depois: ~26 elementos processados
Ganho: 83% menos processamento ⚡
```

### **Dados Extras:**
```javascript
// ANTES:
{ name: "Semana 1", url: "https://..." }

// DEPOIS:
{ 
  name: "Semana 1", 
  url: "https://...",
  id: "paletteItem:_304005_1",     // NOVO! ✨
  contentId: "_1763491_1"           // NOVO! ✨
}
```

**Uso futuro:**
- Cache por `contentId`
- Deep linking direto
- Detecção de mudanças

---

## 🔗 Referências

- **Script de Audit:** [`scripts/tests/audit-ava-dom.js`](file:///home/sant/extensaoUNIVESP/scripts/tests/audit-ava-dom.js)
- **Código Atual:** [`features/courses/services/ScraperService.js`](file:///home/sant/extensaoUNIVESP/features/courses/services/ScraperService.js)
- **Dados Reais:** [`docs/review_notes/listaSemanaRevisa.txt`](file:///home/sant/extensaoUNIVESP/docs/review_notes/listaSemanaRevisa.txt)

---

## 🎯 Prioridade: DEPOIS da ISSUE Atual

> [!CAUTION]
> **NÃO IMPLEMENTAR AGORA!**
> 
> Esta melhoria deve ser feita **APENAS DEPOIS** que:
> 1. ✅ [ISSUE-missing-revision-week](./ISSUE-missing-revision-week.md) estiver resolvida
> 2. ✅ Todos os testes passarem
> 3. ✅ Commit da solução atual feito
> 
> **Motivo:** Evitar mudanças simultâneas em múltiplas frentes.

---

**Tags:** `//ISSUE-improve-scraper-selector` | **Tipo:** Enhancement | **Versão:** 1.0  
**Criado:** 2025-12-30 | **Autor:** Prof. Antigravity
