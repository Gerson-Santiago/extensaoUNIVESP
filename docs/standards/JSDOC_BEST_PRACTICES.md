# 📘 JSDoc Best Practices - Central Univesp

**Status:** Padrão Oficial  
**Versão:** 1.0  
**Data:** 02/01/2026  
**Contexto:** Vanilla JS + JSDoc como fundação de Type Safety

---

## 🎯 Filosofia: Vanilla JS Bem Documentado > Framework Mal Implementado

**Por que Vanilla JS + JSDoc?**
- ✅ **Performance:** Zero overhead de transpilação/bundling
- ✅ **Segurança:** Superfície de ataque menor (sem dependências externas)
- ✅ **Manutenibilidade:** Código simples é código auditável
- ✅ **Chrome Extension Compliance:** CWS prefere código legível (não bundled)

**Referência:** ADR-012 (Security-First), ADR-000-B (Type Safety)

---

## 📋 Regras Obrigatórias de JSDoc

### Regra 1: ZERO Tipos Genéricos em Produção
```javascript
// ❌ PROIBIDO
/**
 * @param {*} data - Genérico demais
 * @param {Object} config - Genérico demais
 */
function process(data, config) {}

// ✅ CORRETO
/**
 * @typedef {Object} CourseData
 * @property {string} id - Identificador único do curso
 * @property {string} name - Nome do curso
 * @property {number} weekCount - Número de semanas
 */

/**
 * @typedef {Object} ProcessConfig
 * @property {boolean} validateSchema - Se deve validar schema
 * @property {number} timeout - Timeout em ms
 */

/**
 * Processa dados de curso
 * @param {CourseData} data - Dados do curso
 * @param {ProcessConfig} config - Configuração
 * @returns {SafeResult<CourseData>}
 */
function process(data, config) {}
```

---

### Regra 2: SafeResult Pattern para Operações Assíncronas
```javascript
/**
 * @typedef {Object} SafeResult
 * @property {boolean} success - Se operação foi bem-sucedida
 * @property {T} [value] - Valor retornado (se success=true)
 * @property {string} [error] - Mensagem de erro (se success=false)
 * @template T
 */

// ✅ EXEMPLO: Fetch de Dados
/**
 * Busca curso por ID
 * @param {string} courseId - ID do curso
 * @returns {Promise<SafeResult<CourseData>>}
 */
async function fetchCourse(courseId) {
  try {
    const data = await chrome.storage.local.get(courseId);
    if (!data[courseId]) {
      return { success: false, error: 'Curso não encontrado' };
    }
    return { success: true, value: data[courseId] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Referência:** ADR-003 (SafeResult Pattern)

---

### Regra 3: Documentar Side Effects
```javascript
// ✅ EXPLÍCITO sobre mutação
/**
 * Adiciona atividade à lista de semanas
 * @param {WeekData[]} weeks - Array de semanas (MUTADO)
 * @param {Activity} activity - Atividade a adicionar
 * @returns {void}
 * @mutates weeks - Modifica array original
 */
function addActivityToWeek(weeks, activity) {
  weeks[activity.weekIndex].activities.push(activity);
}

// ✅ MELHOR: Sem mutação
/**
 * Retorna nova lista de semanas com atividade adicionada
 * @param {WeekData[]} weeks - Array de semanas (NÃO MUTADO)
 * @param {Activity} activity - Atividade a adicionar
 * @returns {WeekData[]} - Novo array com atividade
 * @pure - Função pura, sem side effects
 */
function withActivity(weeks, activity) {
  return weeks.map((week, index) => 
    index === activity.weekIndex
      ? { ...week, activities: [...week.activities, activity] }
      : week
  );
}
```

---

### Regra 4: Enums como Object.freeze
```javascript
// ✅ CORRETO: Enum tipado e imutável
/**
 * @typedef {'loading' | 'success' | 'error'} FetchStatus
 */

/**
 * Estados possíveis de fetch
 * @enum {FetchStatus}
 * @readonly
 */
const FetchStatus = Object.freeze({
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
});

/**
 * @param {FetchStatus} status - Status atual
 */
function handleStatus(status) {
  switch (status) {
    case FetchStatus.LOADING: // Autocomplete funciona!
      // ...
  }
}
```

---

### Regra 5: Validação de Tipos em Runtime
```javascript
/**
 * Valida se objeto é CourseData válido
 * @param {unknown} obj - Objeto a validar
 * @returns {obj is CourseData} - Type guard
 */
function isCourseData(obj) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.weekCount === 'number'
  );
}

// USO
/**
 * @param {unknown} rawData - Dados não validados
 * @returns {SafeResult<CourseData>}
 */
function parseCourse(rawData) {
  if (!isCourseData(rawData)) {
    return { success: false, error: 'Dados inválidos' };
  }
  // Agora TypeScript/JSDoc SABE que rawData é CourseData
  return { success: true, value: rawData };
}
```

**Referência:** SPEC-019 (Backup Schema Validation)

---

## 🔒 Boas Práticas de Segurança em JSDoc

### 1. Documentar Inputs Não Confiáveis
```javascript
/**
 * Renderiza título de curso
 * @param {string} courseTitle - Título do curso (UNTRUSTED: vem do AVA)
 * @returns {HTMLElement}
 * @security XSS - Usa textContent, não innerHTML
 */
function renderCourseTitle(courseTitle) {
  const h1 = document.createElement('h1');
  h1.textContent = courseTitle; // ✅ Escapa automaticamente
  return h1;
}
```

### 2. Marcar Funções Críticas
```javascript
/**
 * Executa factory reset
 * @returns {Promise<void>}
 * @danger DESTRUTIVO - Apaga TODOS os dados
 * @requires confirmação do usuário via modal
 */
async function executeFactoryReset() {
  await chrome.storage.local.clear();
  chrome.runtime.reload();
}
```

---

## 📦 Estrutura de Arquivo Padrão

```javascript
// ========================================
// TIPOS (no topo do arquivo)
// ========================================

/**
 * @typedef {Object} CourseData
 * @property {string} id
 * @property {string} name
 * @property {WeekData[]} weeks
 */

/**
 * @typedef {Object} WeekData
 * @property {number} weekNumber
 * @property {Activity[]} activities
 */

// ========================================
// CONSTANTES
// ========================================

/** @const {number} - Timeout padrão em ms */
const DEFAULT_TIMEOUT = 5000;

// ========================================
// CLASSE OU FUNÇÕES
// ========================================

/**
 * Serviço de scraping de cursos
 * @class
 */
export class ScraperService {
  /**
   * @param {ProcessConfig} config - Configuração
   */
  constructor(config) {
    /** @private @type {ProcessConfig} */
    this.config = config;
  }

  /**
   * Scrape curso por ID
   * @param {string} courseId
   * @returns {Promise<SafeResult<CourseData>>}
   * @public
   */
  async scrapeCourse(courseId) {
    // ...
  }
}
```

---

## 🧪 Testes e JSDoc

```javascript
// ========================================
// TESTE: AAA Pattern com JSDoc
// ========================================

/**
 * @test Deve retornar erro se courseId inválido
 */
describe('ScraperService.scrapeCourse', () => {
  it('deve retornar SafeResult.failure para courseId vazio', async () => {
    // Arrange
    const service = new ScraperService({ validateSchema: true });
    
    // Act
    const result = await service.scrapeCourse('');
    
    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toContain('courseId inválido');
  });
});
```

---

## ✅ Checklist de Code Review (Type Safety)

- [ ] **Zero `@type {*}` ou `@type {Object}` em código de produção?**
- [ ] **Todos os `@typedef` têm propriedades documentadas?**
- [ ] **Funções assíncronas retornam `SafeResult` ou `Promise<SafeResult>`?**
- [ ] **Enums usam `Object.freeze` e `@enum`?**
- [ ] **Inputs não confiáveis marcados com `@security` ou `UNTRUSTED`?**
- [ ] **Funções destrutivas marcadas com `@danger`?**

---

## 📊 Ferramentas de Validação

### 1. TypeScript Check (Opcional)
```bash
# Adicionar ao package.json (sem transpilar)
"scripts": {
  "type-check": "tsc --noEmit --allowJs --checkJs src/**/*.js"
}
```

### 2. JSDoc Lint
```bash
# Verificar JSDoc válido
npm install --save-dev eslint-plugin-jsdoc
```

---

## 🎯 Exemplos de Referência (Onde Ver)

- **SafeResult:** `shared/patterns/SafeResult.js` (se existir)
- **Type Guard:** `features/settings/domain/BackupSchema.js` (SPEC-019)
- **Enums:** `shared/constants/FetchStatus.js` (exemplo futuro)

---

**Aprovação:** ✅ QA Lead (02/01/2026)  
**Próxima Revisão:** Após SPEC-031 (Type Safety Hardening) ser implementada

---

## 📝 Notas Finais

> "TypeScript é excelente, mas JSDoc bem feito oferece 80% dos benefícios com 20% da complexidade."

**Vantagens de JSDoc sobre TypeScript para Chrome Extensions:**
1. CWS não precisa revisar código transpilado (mais rápido de aprovar)
2. Zero build step = menos pontos de falha
3. Mais fácil de auditar para segurança (código fonte = código executado)

**Quando Considerar TypeScript:**
- Projeto >50k linhas de código
- Equipe >5 desenvolvedores
- Necessidade de interfaces complexas (union types avançados)

**Para este projeto (Central Univesp):**
- ~10k linhas estimadas → **JSDoc é suficiente** ✅
