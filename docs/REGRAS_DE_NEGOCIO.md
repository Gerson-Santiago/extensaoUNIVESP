# Regras de Negócio (Business Domain Rules)

> **Princípio:** Código é a fonte da verdade. Este documento reflete o comportamento **REAL** implementado na v2.9.1.

---

## 1. Organização Acadêmica

### 1.1 Agrupamento por Termo Acadêmico

**Implementação:** [`CourseGrouper.js`](file:///home/sant/extensaoUNIVESP/features/courses/logic/CourseGrouper.js#L3-53)

**Regra:**
Cursos são agrupados por período letivo no formato "Ano/Semestre - Xº Bimestre" (ex: "2025/1 - 2º Bimestre").

**Decisões de Negócio:**
1. **Extração Automática:** O sistema detecta o período a partir do nome do curso usando `parseTerm()`
2. **Grupo Especial:** Cursos sem período identificável vão para grupo "Outros"
3. **Ordenação:** Mais recente primeiro (sortKey decrescente: 202524 > 202514)
4. **Invariante:** Grupo "Outros" SEMPRE aparece no final (sortKey = 0)

**Exemplo:**
```javascript
// Input: [Curso 2025S1B2, Curso 2025S1B1, Curso sem ID]
// Output: [
//   { title: "2025/1 - 2º Bimestre", courses: [...] },
//   { title: "2025/1 - 1º Bimestre", courses: [...] },
//   { title: "Outros", courses: [...] }
// ]
```

---

### 1.2 Parsing de Períodos Letivos

**Implementação:** [`TermParser.js`](file:///home/sant/extensaoUNIVESP/features/courses/logic/TermParser.js#L1-53)

**Regra:**
Extração automática de **ano**, **semestre** e **bimestre** de strings arbitrárias.

**Padrões Suportados:**
- Texto: `"2025/2 - 4º Bimestre"`
- Código: `"2025S2B4"`
- Misto: `"Curso 2025/1 - 1º Bim"`

**Decisões de Negócio:**
1. **Regex Pattern Matching:** Busca ano (YYYY), semestre (/S ou S), bimestre (º ou B)
2. **SortKey Alfanumérico:** Formato YYYYST (ex: 202524 = Ano 2025, Sem 2, Bim 4)
3. **Fallback:** Se não encontrar padrão → `{ year: 0, semester: 0, term: 0, sortKey: 0 }`

**Invariante:**
- SortKey = 0 sempre implica período não identificável

---

## 2. Gestão de Tarefas

### 2.1 Categorização Automática de Tarefas

**Implementação:** [`TaskCategorizer.js`](file:///home/sant/extensaoUNIVESP/features/courses/logic/TaskCategorizer.js#L21-70)

**Regra:**
Classificação automática de atividades por tipo baseado no título.

**Tipos Reconhecidos (em ordem de prioridade):**
1. **QUIZ** - "Quiz da Videoaula X"
2. **VIDEOAULA** - "Videoaula X"
3. **VIDEO_BASE** - "Video-base"
4. **TEXTO_BASE** - "Texto-base"
5. **APROFUNDANDO** - "Aprofundando o Tema"
6. **OUTROS** - Fallback

**Decisões de Negócio:**
1. **Prioridade importa:** QUIZ deve ser detectado ANTES de VIDEOAULA (mais específico primeiro)
2. **Extração de número:** "Videoaula 3" → `{ type: 'VIDEOAULA', number: 3 }`
3. **Case insensitive:** "quiz" = "Quiz" = "QUIZ"
4. **Validação:** Tarefa sem name/title → tipo = OUTROS

**Invariante:**
- Toda tarefa SEMPRE recebe um tipo, nunca pode ser `null`

---

### 2.2 Dual Source de Progresso de Atividades

**Implementação:** [`ActivityProgress.js`](file:///home/sant/extensaoUNIVESP/features/courses/models/ActivityProgress.js#L24-87)

**Regra:**
Progresso de atividade pode vir de **duas fontes independentes**:
1. **AVA Scraped** - Detectado automaticamente no AVA (TODO/DOING/DONE)
2. **User Toggle** - Marcado manualmente pelo aluno na extensão

**Decisões de Negócio:**
1. **Diferenciação por Flag:** `markedByUser` indica se foi toggle manual
2. **Factory Methods:**
   - `ActivityProgress.fromScraped(activityId, status)` → `markedByUser: false`
   - `ActivityProgress.fromUserToggle(activityId, isCompleted)` → `markedByUser: true`
3. **ID Composto:** `courseId_weekId_elementId` garante unicidade

**Estados Permitidos:**
- `TODO` - Não iniciada
- `DOING` - Em progresso
- `DONE` - Concluída

**Invariantes:**
1. ID deve seguir formato `{courseId}_{weekId}_{elementId}`
2. `lastUpdated` obrigatório (timestamp)
3. `status` deve ser um dos 3 valores permitidos

---

## 3. Persistência e Cache

### 3.1 Dual Storage Strategy (v2.9.1)

**Implementação:**
- [`ActivityRepository.js`](file:///home/sant/extensaoUNIVESP/features/courses/repositories/ActivityRepository.js) - localStorage
- [`ActivityProgressRepository.js`](file:///home/sant/extensaoUNIVESP/features/courses/repositories-progress/ActivityProgressRepository.js) - sync storage

**Regra:**
Sistema usa **2 storages separados** para otimizar sincronização e quota.

**Decisões de Negócio:**

| Tipo de Dado | Storage | Quota | Sincroniza? | Justificativa |
|:---|:---|:---:|:---:|:---|
| **Atividades (volumosas)** | `chrome.storage.local` | 5MB | ❌ | Performance local, evita re-scraping |
| **Progresso (leve)** | `chrome.storage.sync` | 100KB | ✅  | Sincronizar checkmarks entre dispositivos |
| **Configurações** | `chrome.storage.sync` | 100KB | ✅ | Email, RA, preferências |

**Invariantes:**
1. Atividades NUNCA vão para sync (proteção de quota)
2. Progresso SEMPRE vai para sync (UX cross-device)
3. Chave localStorage: `activities_{courseId}_{contentId}` (isolamento por semana)

---

### 3.2 Auto-Save de Atividades Scrapeadas

**Implementação:** [`WeekActivitiesService.js`](file:///home/sant/extensaoUNIVESP/features/courses/services/WeekActivitiesService.js)

**Regra:**
Atividades extraídas do AVA são **persistidas imediatamente** após scraping bem-sucedido.

**Decisões de Negócio:**
1. **Cache-First:** UI sempre tenta carregar de `ActivityRepository` antes de scrapear
2. **Invalidação:** Cache não expira automaticamente (deve ser limpo manualmente)
3. **Chave única:** `activities_{courseId}_{weekId}` permite invalidação granular

**Invariante:**
- Se scraping retornar `success: true`, dados DEVEM ser salvos antes de retornar à UI

---

## 4. Error Handling (Business Rules)

### 4.1 SafeResult Pattern (v2.9.1)

**Implementação:** [`ErrorHandler.js`](file:///home/sant/extensaoUNIVESP/shared/utils/ErrorHandler.js), usado em [`WeekActivitiesService.js`](file:///home/sant/extensaoUNIVESP/features/courses/services/WeekActivitiesService.js)

**Regra:**
Services críticos **não lançam exceptions**. Retornam objeto de resultado estruturado.

**Contrato SafeResult:**
```javascript
{
  success: boolean,  // true = sucesso, false = erro
  data: T | null,    // resultado (null se erro)
  error: Error | null // erro (null se sucesso)
}
```

**Decisões de Negócio:**
1. **Wrapper `trySafe()`:** Envolve Promises perigosas e retorna SafeResult
2. **Consumo Seguro:** UI verifica `success` antes de acessar `data`
3. **Logging:** Erros são logados mas não quebram fluxo

**Invariantes:**
- Se `success === false` → `data === null` E `error !== null`
- Se `success === true` → `error === null` E `data !== null`

**Referência:** [`ADR_005_SAFERESULT_PATTERN.md`](file:///home/sant/extensaoUNIVESP/docs/architecture/ADR_005_SAFERESULT_PATTERN.md)

---

## 5. Navegação e UX

### 5.1 Unicidade de Tabs (Anti-Duplicação)

**Implementação:** [`Tabs.js`](file:///home/sant/extensaoUNIVESP/shared/utils/Tabs.js)

**Regra:**
Sistema previne abertura de **abas duplicadas** para o mesmo recurso (Curso, Semana).

**Decisões de Negócio:**
1. **Verificação por URL:** Busca aba existente com URL correspondente
2. **Ação em Match:** Foca aba existente (não cria nova)
3. **Ação em No-Match:** Cria nova aba

**Invariante:**
- Máximo 1 aba por URL de recurso UNIVESP

---

### 5.2 Container Freshness (Anti DOM Zombie) (v2.9.1)

**Implementação:** [`DetailsActivitiesWeekView/index.js`](file:///home/sant/extensaoUNIVESP/features/courses/views/DetailsActivitiesWeekView/index.js)

**Regra:**
Renderer de atividades **sempre recebe container DOM fresco** (atual), nunca cacheia container órfão.

**Decisões de Negócio:**
1. **Sempre Novo Renderer:** `new ActivityRenderer(container)` em toda renderização
2. **Query Fresh:** `this.element?.querySelector('#activitiesContainer')` busca elemento VISÍVEL
3. **NÃO Cachear:** Proibido armazenar `this.activityRenderer` como propriedade

**Invariante:**
- Container passado ao renderer DEVE ser elemento anexado ao DOM visível

**Proteção:** 5 testes de regressão em [`rendering-regression.test.js`](file:///home/sant/extensaoUNIVESP/features/courses/tests/views/DetailsActivitiesWeekView/rendering-regression.test.js)

### 5.3 Navegação de Scroll Robusta (v2.9.1)

**Implementação:** [`NavigationService.js`](file:///home/sant/extensaoUNIVESP/shared/services/NavigationService.js)

**Regra:**
Sistema garante que o scroll para uma atividade ocorra mesmo em condições de carregamento lento do DOM.

**Decisões de Negócio:**
1. **MutationObserver:** Monitora o DOM por até 10s se o elemento não for encontrado imediatamente.
2. **Estratégias de Seleção:** Tenta múltiplos seletores (`[data-id]`, `[id]`, `[name]`).
3. **Feedback Visual:** Pisca o elemento em dourado após o scroll para confirmação visual.

**Invariante:**
- O scroll só é considerado falho após o timeout de 10s sem o elemento aparecer no DOM.

**Referência:** [`ADR_007_ROBUST_SCROLL_NAVIGATION.md`](file:///home/sant/extensaoUNIVESP/docs/architecture/ADR_007_ROBUST_SCROLL_NAVIGATION.md)

---

## Referências Técnicas

- [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- [Clean Architecture (Robert C. Martin)](https://www.goodreads.com/book/show/18043011-clean-architecture)
- [`ADR_005: SafeResult Pattern`](file:///home/sant/extensaoUNIVESP/docs/architecture/ADR_005_SAFERESULT_PATTERN.md)
- [`ADR_006: Container Freshness`](file:///home/sant/extensaoUNIVESP/docs/architecture/ADR_006_CONTAINER_FRESHNESS.md)

---

**Última Auditoria:** 2025-12-29 (v2.9.1)  
**Próxima Revisão:** Sempre que houver mudança em lógica de domínio
