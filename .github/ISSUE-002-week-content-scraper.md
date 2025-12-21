# Issue #2: Criar WeekContentScraper (Scraping AVA)

**Epic**: #EPIC-v2.8.0  
**Fase**: 1 - Foundation  
**Prioridade**: CRÍTICA  
**Esforço**: 4h  
**Categoria**: 🏆 CORE

---

## 📝 Descrição

Implementar serviço para extrair tarefas/conteúdos de uma semana do AVA, lendo status dos botões "Revisto"/"Marca Revista".

---

## 🎯 Acceptance Criteria

- [ ] Classe `WeekContentScraper` criada em `features/courses/services/`
- [ ] Método `scrapeWeekContent(weekUrl)` retorna `items[]`
- [ ] Detecta status: "Revisto" → DONE, "Marca Revista" → TODO
- [ ] Detecta tipo: quiz/document/video pelo ícone
- [ ] Testes mockando DOM do AVA (`contentListItem:_ID_`)
- [ ] Error handling com console.error

---

## 🔧 Implementação (TDD)

### Step 1: Criar Teste (RED)
```javascript
// features/courses/services/WeekContentScraper.test.js
describe('WeekContentScraper', () => {
  it('should extract items from AVA DOM', () => {
    document.body.innerHTML = `
      <li id="contentListItem:_123_1">
        <h3><a href="/test">Videoaula 1</a></h3>
        <img class="item_icon" src="/document_on.svg">
        <a class="button-5">Revisto</a>
      </li>
    `;
    
    const items = WeekContentScraper.extractItemsFromDOM();
    
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Videoaula 1');
    expect(items[0].status).toBe('DONE');
    expect(items[0].type).toBe('document');
  });
  
  it('should map "Marca Revista" to TODO', () => {
    document.body.innerHTML = `
      <li id="contentListItem:_456_1">
        <h3>Quiz</h3>
        <a class="button-5">Marca Revista</a>
      </li>
    `;
    
    const items = WeekContentScraper.extractItemsFromDOM();
    expect(items[0].status).toBe('TODO');
  });
});
```

### Step 2: Implementar (GREEN)
**Arquivo**: `features/courses/services/WeekContentScraper.js`

Ver SPEC seção 2.4 para código completo.

**Principais métodos**:
- `scrapeWeekContent(weekUrl)` - Abre aba e faz scraping
- `extractItemsFromDOM()` - Função injetada no DOM
- `detectType(iconSrc)` - Detecta tipo de conteúdo
- `openWeekTab(url)` - Usa Tabs.openOrSwitchTo
- `waitForLoad(tabId)` - Aguarda carregamento

### Step 3: Validar
```bash
npm test -- WeekContentScraper.test.js
npm run lint
```

---

## 📚 Referências

- SPEC: Seção 2.4 (código completo)
- Serviço similar: `ScraperService.js` (extrai semanas)
- .cursorrules: Linha 39-43 (Workflow Nova Feature)

---

## 🚨 Atenção

> [!WARNING]
> Este serviço depende da estrutura DOM do AVA. Se o AVA mudar, os seletores CSS (`contentListItem:`, `.button-5`) podem quebrar.

**Mitigação**: Testes com mock garantem que lógica está correta.

---

## ✅ Definition of Done

- [ ] Código implementado e testado
- [ ] Testes com cobertura ≥90%
- [ ] Mock de chrome.scripting.executeScript
- [ ] Error handling com try/catch
- [ ] `npm run lint` - Limpo
- [ ] Commit: `feat(courses): adiciona WeekContentScraper para scraping AVA`
