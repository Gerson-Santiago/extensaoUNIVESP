# REFACTOR: Desacoplar Scraping de CourseWeeksView

**Status**: ✅ Concluído  
**Prioridade**: Alta  
**Estimativa**: 4-6 horas  

---

## 🎯 Problema

A view `CourseWeeksView` possui **múltiplas responsabilidades**, violando o **Single Responsibility Principle (SRP)**:

1. ✅ Exibir lista de semanas de uma matéria
2. ⚠️ Permitir navegação para tarefas ou atividades
3. ❌ **Gerenciar scraping de conteúdo** (viola SRP!)

---

## 🔍 Código Atual

**Arquivo**: `features/courses/views/CourseWeeksView/index.js`

```javascript
// ❌ PROBLEMA: View orquestra scraping diretamente
onViewActivities: async (w) => {
  // Scraping acontece DENTRO do callback da View
  if (!w.items) {
    w.items = await WeekContentScraper.scrape(w.url);
  }
  navigateTo('DetailsActivitiesWeekView');
},

onViewQuickLinks: async (w) => {
  // Outro scraping DENTRO da View
  w.items = await QuickLinksScraper.scrape(w.url);
  w.method = 'QuickLinks';
  navigateTo('DetailsActivitiesWeekView');
}
```

**Problema**: A View está **orquestrando lógica de scraping**, misturando:
- Responsabilidade de UI (renderização, eventos)
- Responsabilidade de dados (scraping, cache)

---

## ✅ Solução Proposta

### Opção 1: **Service Layer** (recomendado)

Criar um **WeekActivitiesService** que orquestra scraping e cache.

**Novo arquivo**: `features/courses/services/WeekActivitiesService.js`

```javascript
export class WeekActivitiesService {
  /**
   * Obter atividades de uma semana (com cache)
   * @param {Object} week
   * @param {'DOM' | 'QuickLinks'} method
   * @returns {Promise<Array>}
   */
  static async getActivities(week, method = 'DOM') {
    // Cache: retorna se já scraped
    if (week.items && week.method === method) {
      return week.items;
    }
    
    // Scraping
    const scraper = method === 'QuickLinks' 
      ? QuickLinksScraper 
      : WeekContentScraper;
    
    const items = await scraper.scrape(week.url);
    
    // Atualizar week object
    week.items = items;
    week.method = method;
    
    return items;
  }
}
```

**View refatorada**:
```javascript
// ✅ SOLUÇÃO: View delega para Service
onViewActivities: async (w) => {
  await WeekActivitiesService.getActivities(w, 'DOM');
  navigateTo('DetailsActivitiesWeekView');
},

onViewQuickLinks: async (w) => {
  await WeekActivitiesService.getActivities(w, 'QuickLinks');
  navigateTo('DetailsActivitiesWeekView');
}
```

---

### Opção 2: **Command Pattern**

Usar Commands para encapsular operações de scraping.

```javascript
// Exemplo: ScrapeWeekCommand
class ScrapeWeekCommand {
  constructor(week, method) {
    this.week = week;
    this.method = method;
  }
  
  async execute() {
    // Lógica de scraping aqui
  }
}
```

---

## 📂 Arquivos Afetados

| Arquivo | Tipo de Mudança | LOC |
|---------|-----------------|-----|
| `features/courses/services/WeekActivitiesService.js` | **[CRIAR]** Novo serviço | +60 |
| `features/courses/views/CourseWeeksView/index.js` | Refatorar callbacks | -15 |
| `features/courses/tests/WeekActivitiesService.test.js` | **[CRIAR]** Testes | +80 |

**Total**: ~125 LOC

---

## 🎁 Benefícios

- ✅ **SRP**: View só renderiza UI
- ✅ **Testabilidade**: Service isolado testável
- ✅ **Reuso**: Outros lugares podem usar o Service
- ✅ **Manutenibilidade**: Lógica de scraping centralizada

---

## ✅ Critérios de Aceitação

- [x] `WeekActivitiesService` criado
- [x] CourseWeeksView delega scraping para Service
- [x] Testes unitários do Service passando
- [x] Cache de `week.items` continua funcionando
- [x] Ambos métodos (DOM e QuickLinks) suportados
- [x] Lint e type-check passando

---

## 📝 Notas

- Esta refatoração NÃO altera comportamento (Green-Green Refactor)
- Seguir TDD: escrever testes do Service ANTES de implementar
- Considerar mover lógica de cache para `CourseRepository` no futuro

---

**Criado em**: 2025-12-23  
**Relacionado a**: [features/courses/README.md](file:///home/sant/extensaoUNIVESP/features/courses/README.md) - Linha 92-94
