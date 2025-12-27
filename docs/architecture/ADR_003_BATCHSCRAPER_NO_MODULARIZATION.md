# ADR-003: Não Modularizar BatchScraper (Injected Code Constraint)

## Status
✅ **Aceito** (2025-12-27, Documentado Retroativamente)

## Contexto

O `BatchScraper` (`features/courses/import/services/BatchScraper/`) é responsável por importação em lote de cursos do AVA. Utiliza **chrome.scripting.executeScript** para injetar código JavaScript na página do AVA.

**Problema**: Durante refatoração de scrapers (v2.8.x), consideramos aplicar **Strategy Pattern** no BatchScraper assim como fizemos no `WeekContentScraper`.

**Limitação Técnica Descoberta**: Código injetado via `chrome.scripting.executeScript` **não pode usar imports ES6** (Manifest V3).

---

## Decisão

**NÃO modularizar** `BatchScraper/index.js`.

Manter código monolítico (~380 linhas) em arquivo único com:
- Funções injetadas auto-contidas
- Helpers internos
- Documentação clara via README

---

## Alternativas Consideradas

### Opção A: Modularizar com Strategy Pattern (REJEITADA)

**Proposta**:
```javascript
// TermScanner.js
export class TermScanner { ... }

// CourseDeepScraper.js  
export class CourseDeepScraper { ... }

// index.js
import { TermScanner } from './TermScanner.js';
```

**Por que rejeitada**:
- ❌ `chrome.scripting.executeScript` serializa a função e exec uta no contexto da página
- ❌ Página do AVA não tem acesso aos módulos da extensão
- ❌ Imports falhariam com erro `Cannot use import statement outside a module`

**Evidência técnica**:
```javascript
// Não funciona:
await chrome.scripting.executeScript({
  target: { tabId },
  func: () => {
    import { helper } from './helper.js'; // ❌ ERRO!
  }
});
```

### Opção B: Usar Bundler (Webpack/Vite) (REJEITADA)

**Proposta**: Bundlar múltiplos arquivos em um único antes de injetar

**Por que rejeitada**:
- ❌ Adiciona complexidade de build desnecessária
- ❌ Projeto usa Vanilla JS sem bundler por filosofia (simplicidade)
- ❌ BatchScraper já é razoavelmente legível (~380 linhas bem organizadas)
- ❌ Custo/benefício baixo (1 arquivo vs setup de bundler)

### Opção C: Injetar Múltiplos Scripts Sequenciais (REJEITADA)

**Proposta**: Injetar helper1.js → helper2.js → main.js

**Por que rejeitada**:
- ❌ Ordem de execução não garantida
- ❌ Namespace pollution (variáveis globais)
- ❌ Performance: 3+ injeções vs 1

---

## Solução Aceita: Refatoração Organizacional

**O que fizemos**:

1. **Isolamento Semântico**:
   - Movemos para pasta dedicada: `BatchScraper/`
   - Arquivo principal: `BatchScraper/index.js`

2. **Documentação Explícita**:
   - README.md com WARNING sobre limitação técnica
   - Linhas 77-87 do README explicam restrição

3. **Organização Interna**:
   ```javascript
   // 2 funções injetadas principais
   function DOM_scanTermsAndCourses_Injected() { ... }
   function DOM_deepScrapeSelected_Injected() { ... }
   
   // Helper interno
   function extractWeeksFromHTML(html) { ... }
   
   // 2 wrappers exportados
   export async function scrapeAvailableTerms(tabId) { ... }
   export async function processSelectedCourses(tabId, courses) { ... }
   ```

4. **Testes Separados**:
   - `BatchScraper.test.js` (integração dos wrappers)
   - `BatchScraper_DOM.test.js` (lógica DOM isolada)

---

## Consequências

### ✅ Positivas (O que ganhamos)

1. **Funcionalidade Garantida**:
   - Código injeta corretamente sem errors
   - Sem dependências de bundler

2. **Simplicidade Mantida**:
   - Zero build steps adicionais
   - Vanilla JS puro (filosofia do projeto)

3. **Rastreabilidade**:
   - WARNING explícito no README
   - Futuros desenvolvedores não tentarão refatorar incorretamente

4. **Testabilidade Preservada**:
   - Testes separados mantêm cobertura
   - Mocks funcionam corretamente

### ⚠️ Negativas (Trade-offs Aceitos)

1. **Arquivo Grande**:
   - ~380 linhas (vs ideal ~200)
   - **Mitigação**: Organização clara com seções comentadas

2. **Sem Strategy Pattern**:
   - Não aplicamos padrão usado em `WeekContentScraper`
   - **Mitigação**: Inconsistência aceitável devido a restrição técnica

3. **Duplicação de Helpers**:
   - Funções como `extractWeeksFromHTML` duplicadas (também existem em outros scrapers)
   - **Mitigação**: Trade-off necessário para injeção funcionar

**Aceitamos** porque:
- Restrição é da plataforma (Chrome Extension API), não nossa escolha
- Alternativas (bundler, scripts sequenciais) têm custo > benefício
- 380 linhas ainda é gerenciável com boa documentação

---

## Guidance para Futuros Desenvolvedores

### ❌ NÃO FAÇA:
```javascript
// Não tente extrair em módulos separados
import { Scanner } from './Scanner.js'; // ❌ Não funciona em injected code
```

### ✅ FAÇA:
```javascript
// Organize internamente com funções bem nomeadas
function DOM_scanTermsAndCourses_Injected() {
  // Helper interno auto-contido
  function parseCourseTerm(displayId) { ... }
  
  // Lógica principal
  const courses = Array.from(cards).map(parseCourseTerm);
}
```

### 📚 Se REALMENTE precisar modularizar:

**Única opção viável**: Adicionar bundler (Webpack/Vite)

1. Instalar: `npm install --save-dev vite`
2. Configurar: Build específico para `BatchScraper/`
3. Output: Arquivo único bundled
4. Injetar: Output bundled

**Custo**: Adiciona complexidade ao projeto  
**ROI**: Baixo para ~380 linhas

**Decisão**: Não justifica (revisado 2025-12-27)

---

## Referências

- **README**: [BatchScraper/README.md](file:///home/sant/extensaoUNIVESP/features/courses/import/services/BatchScraper/README.md) (linhas 77-87)
- **Chrome Docs**: [chrome.scripting.executeScript](https://developer.chrome.com/docs/extensions/reference/api/scripting#method-executeScript)
- **Manifest V3 Limitations**: Content scripts isolation

---

## Revisões

| Data | Mudança |
|------|---------|
| ~2025-12-XX | Decisão original tomada durante refatoração |
| 2025-12-27 | ADR criado retroativamente para formalizar decisão |

---

**Assinatura**: ADR-003 | Decisão Arquitetural Técnica (Injected Code Constraint)
