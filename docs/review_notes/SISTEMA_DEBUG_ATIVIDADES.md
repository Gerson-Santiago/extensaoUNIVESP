# 🔍 Sistema de Debug de Atividades do AVA

> **Versão:** 2.9.1  
> **Última atualização:** 2025-12-29  
> **Status:** ✅ Correção de scroll implementada + Logs estruturados

---

## 📑 Índice

1. [Visão Geral](#-visão-geral)
2. [Guia Rápido](#-guia-rápido-5-minutos)
3. [Padrões e Estrutura](#-padrões-e-estrutura)
4. [Dados dos Logs](#-dados-completos-dos-logs)
5. [Workflow de Análise](#-workflow-de-análise)
6. [Adicionar Novos Padrões](#-como-adicionar-novos-padrões)
7. [Histórico de Correções](#-histórico-de-correções)

---

## 🎯 Visão Geral

Este sistema permite coletar dados sobre **atividades do AVA que não estão sendo categorizadas**, para criar novos padrões regex e melhorar a categorização automática.

### Problema Resolvido

**Antes:** Algumas atividades (Quiz, Atividade Avaliativa) tinham `id = "unknown"` → botão "Ir" não funcionava  
**Depois:** Todas as atividades usam `contentId` corretamente → scroll funciona ✅

### Sistemas Interligados

O código trabalha com **dois sistemas independentes**:

1. **Extração de ID** (para scroll) → Baseado em estrutura DOM
2. **Categorização** (para ícones/tipos) → Baseado em regex de nomes

---

## ⚡ Guia Rápido (5 minutos)

### 1. Ativar Debug

No **console do navegador** (F12):

```javascript
localStorage.setItem('UNIVESP_DEBUG', 'true');
```

### 2. Navegar no AVA

- Abra diferentes matérias
- Clique em "Ver Atividades" em várias semanas
- Os logs aparecem **automaticamente** no console

### 3. O Que Você Vai Ver

```javascript
// ✅ Atividade reconhecida
[13:25:45.123] [TaskCategorizer] ✅ Categorizada: VIDEOAULA
{
  courseName: "Inglês I",
  weekName: "Semana 1",
  name: "Videoaula 1",
  type: "VIDEOAULA",
  number: 1,
  id: "_12345_1"
}

// ⚠️ Atividade NÃO reconhecida (ESTUDAR ESTA!)
[13:25:45.234] [TaskCategorizer] ⚠️ Atividade NÃO categorizada (OUTROS)
{
  courseName: "Inglês I",
  weekName: "Semana 1",
  name: "Atividade Avaliativa",    // ← Use para criar regex!
  type: "pdf",
  contentId: "_67890_1",
  id: "_67890_1",
  url: "https://apps.univesp.br/..."
}
```

### 4. Desativar

```javascript
localStorage.removeItem('UNIVESP_DEBUG');
```

---

## 🏗️ Padrões e Estrutura

### Sistema 1: Extração de ID (Para Scroll)

**Não usa regex!** Procura por IDs específicos na estrutura HTML:

```javascript
// ContentStrategy.js - extractContentId()
extractContentId(element) {
  // Tentativa 1: ID no <li> principal
  if (element.id && element.id.startsWith('contentListItem:')) {
    return element.id.replace('contentListItem:', '');
  }
  
  // Tentativa 2: ID no <div class="item"> interno
  const itemDiv = element.querySelector('.item');
  if (itemDiv && itemDiv.id) {
    return itemDiv.id;
  }
  
  return null;
}
```

**Estruturas DOM esperadas:**

```html
<!-- ✅ Padrão 1: ID no LI -->
<li id="contentListItem:_12345_1">
  <div class="item">
    <h3><a href="...">Videoaula 1</a></h3>
  </div>
</li>

<!-- ✅ Padrão 2: ID no DIV interno -->
<li class="activity">
  <div class="item" id="_67890_1">
    <h3><a href="...">Quiz da Videoaula 1</a></h3>
  </div>
</li>
```

**Resultado:** `contentId = "_12345_1"` ou `"_67890_1"`

---

### Sistema 2: Categorização (Para Ícones/Tipos)

**Usa regex!** Analisa o **nome** da atividade:

```javascript
// TaskCategorizer.js - Padrões atuais
const patterns = {
  QUIZ: /Quiz\s+da\s+Videoaula\s+(\d+)/i,      // "Quiz da Videoaula 5"
  VIDEOAULA: /Videoaula\s+(\d+)/i,            // "Videoaula 3"
  VIDEO_BASE: /Video-base/i,                  // "Video-base em Material-base"
  TEXTO_BASE: /Texto-base/i,                  // "Texto-base"
  APROFUNDANDO: /Aprofundando\s+o\s+Tema/i,   // "Aprofundando o Tema"
};
```

**Exemplos de categorização:**

| Nome da Atividade | Regex Match | Tipo | Número |
|-------------------|-------------|------|--------|
| `"Videoaula 1"` | `VIDEOAULA` | `VIDEOAULA` | `1` |
| `"Quiz da Videoaula 5"` | `QUIZ` | `QUIZ` | `5` |
| `"Video-base em Material-base"` | `VIDEO_BASE` | `VIDEO_BASE` | `null` |
| `"Atividade Avaliativa"` | Nenhum | `OUTROS` | `null` |

---

## 📊 Dados Completos dos Logs

### ✅ Atividades Categorizadas (Match com Regex)

| Campo | Descrição | Exemplo | Sempre? |
|-------|-----------|---------|---------|
| `courseName` | Nome da matéria | `"Inglês I"` | ✅ |
| `weekName` | Nome da semana | `"Semana 1"` | ✅ |
| `name` | Nome da atividade | `"Videoaula 1"` | ✅ |
| `type` | Tipo categorizado | `"VIDEOAULA"` | ✅ |
| `number` | Número extraído | `1` | ⚠️ Se aplicável |
| `id` | ID final usado | `"_12345_1"` | ✅ |

---

### ⚠️ Atividades NÃO Categorizadas (OUTROS)

| Campo | Descrição | Exemplo | Sempre? |
|-------|-----------|---------|---------|
| `courseName` | Nome da matéria | `"Inglês I"` | ✅ |
| `weekName` | Nome da semana | `"Semana 1"` | ✅ |
| `name` | **Nome original do AVA** | `"Atividade Avaliativa"` | ✅ |
| `type` | Tipo da strategy | `"pdf"`, `"video"` | ✅ |
| `contentId` | ID do DOM | `"_67890_1"` | ⚠️ Se encontrado |
| `id` | ID final | `"_67890_1"` ou `"unknown"` | ✅ |
| `url` | URL completa | `"https://apps.univesp.br/..."` | ✅ |

**⭐ Campo mais importante:** `name` - Use para criar novos padrões regex!

---

## 🎣 Workflow de Análise

### 1. Coletar Dados

Navegue em **várias matérias e semanas** diferentes:

```
⚠️ Inglês I → Semana 1 → "Atividade Avaliativa"
⚠️ Inglês I → Semana 2 → "Atividade Avaliativa"
⚠️ Matemática → Semana 1 → "Atividade Avaliativa"
⚠️ História → Semana 3 → "Tarefa da Semana 3"
⚠️ História → Semana 4 → "Tarefa da Semana 4"
⚠️ Física → Semana 1 → "Fórum de Dúvidas"
```

### 2. Identificar Padrões

**Nome exato repetido:**
- `"Atividade Avaliativa"` sempre igual → Criar regex específico

**Nome com variação:**
- `"Tarefa da Semana X"` → Regex com captura de número

### 3. Propor Regex

| Nome Coletado | Padrão Proposto | Tipo |
|---------------|-----------------|------|
| `Atividade Avaliativa` | `/Atividade\s+Avaliativa/i` | `ATIVIDADE_AVALIATIVA` |
| `Tarefa da Semana X` | `/Tarefa\s+da\s+Semana\s+(\d+)/i` | `TAREFA` |
| `Fórum de Dúvidas` | `/Fórum\s+de\s+Dúvidas/i` | `FORUM_DUVIDAS` |
| `Material Complementar` | `/Material\s+Complementar/i` | `MATERIAL_COMPLEMENTAR` |

---

## 🛠️ Como Adicionar Novos Padrões

### 1. Editar `TaskCategorizer.js`

```javascript
// features/courses/logic/TaskCategorizer.js

const patterns = {
  // Padrões existentes
  QUIZ: /Quiz\s+da\s+Videoaula\s+(\d+)/i,
  VIDEOAULA: /Videoaula\s+(\d+)/i,
  VIDEO_BASE: /Video-base/i,
  TEXTO_BASE: /Texto-base/i,
  APROFUNDANDO: /Aprofundando\s+o\s+Tema/i,
  
  // ⭐ ADICIONE NOVOS AQUI (ordem importa!)
  ATIVIDADE_AVALIATIVA: /Atividade\s+Avaliativa/i,
  TAREFA: /Tarefa\s+da\s+Semana\s+(\d+)/i,
  FORUM_DUVIDAS: /Fórum\s+de\s+Dúvidas/i,
};
```

**⚠️ ORDEM IMPORTA!** Mais específico primeiro:
- ✅ `QUIZ` antes de `VIDEOAULA` (pois "Quiz da Videoaula" contém "Videoaula")
- ✅ Padrões com número antes de genéricos

### 2. Criar Testes

```javascript
// features/courses/tests/logic/TaskCategorizer.test.js

it('deve categorizar Atividade Avaliativa', () => {
  const task = { name: 'Atividade Avaliativa', contentId: '_123_1' };
  const result = categorizeTask(task);
  
  expect(result.type).toBe('ATIVIDADE_AVALIATIVA');
  expect(result.number).toBeNull();
  expect(result.id).toBe('_123_1');
});
```

### 3. Executar Testes

```bash
npm test -- TaskCategorizer.test.js
```

### 4. (Opcional) Adicionar Ícones

```javascript
// features/courses/views/DetailsActivitiesWeekView/ActivityItemFactory.js

static getTypeIcon(type) {
  const icons = {
    videoaula: '🎥',
    quiz: '📝',
    forum: '💬',
    
    // ⭐ NOVOS ÍCONES
    atividade_avaliativa: '📋',
    tarefa: '📄',
    forum_duvidas: '❓',
    
    desconhecido: '📌',
  };
  return icons[type.toLowerCase()] || icons.desconhecido;
}
```

---

## 📜 Histórico de Correções

### 2025-12-29 - Correção do Scroll + Logs Estruturados

#### Problema Identificado

Botão "Ir" não funcionava para:
- ❌ Quiz de Semana N (item vinculado)
- ❌ Atividade Avaliativa
- ⚠️ Alguns Videoaula Semana N

#### Causa Raiz

**Inconsistência no `TaskCategorizer.js` (linha 67):**

```javascript
// ❌ ANTES - Fallback OUTROS
id: task.id || 'unknown'  // Ignorava task.contentId!

// ✅ DEPOIS - Fallback OUTROS
id: task.contentId || task.id || 'unknown'
```

Linhas 36 e 57 usavam `task.contentId` corretamente, mas linha 67 (fallback) não.

#### Modificações Implementadas

**1. Correção do Bug (`TaskCategorizer.js`):**
- ✅ Linha 67: Agora usa `task.contentId || task.id || 'unknown'`
- ✅ Todas as atividades têm ID correto para scroll

**2. Sistema de Logging (`Logger.debug`):**
- ✅ Import do `Logger` em `TaskCategorizer.js`
- ✅ Logs para atividades categorizadas (✅)
- ✅ Logs para atividades não categorizadas (⚠️ OUTROS)
- ✅ Tag `/**#CONSOLE_CATEGORIZER*/` para identificação

**3. Contexto de Semana/Matéria:**
- ✅ `ActivityRenderer` aceita contexto `{ courseName, weekName }`
- ✅ `TaskCategorizer` recebe e loga contexto
- ✅ `DetailsActivitiesWeekView` passa dados de semana/matéria
- ✅ Logs agora mostram origem completa dos dados

**4. Novas Strategies com `contentId`:**
- ✅ `ContentStrategy.extractContentId()` implementado
- ✅ Todas as strategies retornam `contentId`
- ✅ `VideoStrategy`, `QuizStrategy`, `ResourceStrategy`, etc.

#### Arquivos Modificados

```
features/courses/logic/TaskCategorizer.js
features/courses/services/WeekContentScraper/strategies/
  ├── ContentStrategy.js
  ├── ForumStrategy.js
  ├── QuizStrategy.js
  ├── ResourceStrategy.js
  ├── UrlStrategy.js
  └── VideoStrategy.js
features/courses/views/DetailsActivitiesWeekView/
  ├── ActivityRenderer.js
  └── index.js
```

#### Validação

- ✅ **7/7 testes** passaram em `TaskCategorizer.test.js`
- ✅ Bug do scroll corrigido
- ✅ Logs estruturados funcionando
- ✅ Contexto (matéria/semana) implementado

---

## ✅ Checklist de Uso

**Setup Inicial:**
- [ ] Debug ativado (`localStorage.setItem('UNIVESP_DEBUG', 'true')`)
- [ ] Console do navegador aberto (F12)

**Coleta de Dados:**
- [ ] Navegado em 3-5 matérias diferentes
- [ ] Visualizado atividades de várias semanas
- [ ] Coletado nomes de atividades `⚠️ OUTROS`

**Análise:**
- [ ] Identificado padrões que se repetem
- [ ] Criado regex para padrões comuns
- [ ] Adicionado ao `TaskCategorizer.js`

**Validação:**
- [ ] Criado testes para novos padrões
- [ ] Executado `npm test -- TaskCategorizer.test.js`
- [ ] Todos os testes passando

**Opcional:**
- [ ] Adicionado ícones customizados
- [ ] Documentado novos padrões

---

## 📌 Notas Importantes

1. **Performance:** Logs só aparecem com `UNIVESP_DEBUG=true` → Sem impacto em produção
2. **Tag de identificação:** `/**#CONSOLE_CATEGORIZER*/` marca os logs do categorizador
3. **Ordem dos padrões:** Mais específico **antes** de genérico
4. **Testes:** Sempre criar testes ao adicionar novos padrões
5. **Contexto:** Logs agora mostram matéria e semana de origem

---

## 🔗 Referências

- **Arquivo principal:** `features/courses/logic/TaskCategorizer.js`
- **Strategies:** `features/courses/services/WeekContentScraper/strategies/`
- **View:** `features/courses/views/DetailsActivitiesWeekView/`
- **Testes:** `features/courses/tests/logic/TaskCategorizer.test.js`
- **Logger:** `shared/utils/Logger.js`

---

**Última revisão:** 2025-12-29  
**Versão:** 2.9.1
