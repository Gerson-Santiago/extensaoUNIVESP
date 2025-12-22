# Issue #010: DetailsActivitiesWeekView - Índice Navegável de Atividades

**Status**: 🟡 Em Progresso (95% - Debugging Scraping)  
**Prioridade**: Alta  
**Estimativa**: 8h  
**Tempo Gasto**: ~8h  
**Branch**: `feat/issue-010-details-activities-view`

---

## 📋 Objetivo

Criar view de **índice navegável** de atividades da semana com scroll automático até elementos específicos no AVA.

### Funcionalidade Principal
- Listar atividades na ordem DOM original
- Ícones visuais por tipo (🎬 Videoaula, 📝 Quiz, 📄 Texto, etc.)
- Botão [Ir →] que faz scroll automático até a atividade na página do AVA
- Highlight visual temporário (2s) no elemento

---

## ✅ O Que Foi Implementado

### 1. TaskCategorizer (`features/courses/logic/TaskCategorizer.js`)
**Responsabilidade**: Classificar atividades por tipo semântico.

```javascript
export function categorizeTask(task) {
  // Classifica: VIDEOAULA, QUIZ, VIDEO_BASE, TEXTO_BASE, APROFUNDANDO, OUTROS
  // Extrai número (ex: "Videoaula 3" → number: 3)
}
```

**Testes**: ✅ 7/7 passando

---

### 2. DetailsActivitiesWeekView (`features/courses/views/DetailsActivitiesWeekView/index.js`)
**Responsabilidade**: Exibir lista de atividades com navegação por scroll.

**Features**:
- Renderização de lista ordenada (ordem DOM)
- Ícone por tipo de atividade
- Botão [Ir →] com scroll automático via `chrome.tabs` + `scrollIntoView()`
- Highlight amarelo temporário após scroll

**Testes**: ✅ 4/4 passando

---

### 3. Integração com CourseWeeksView
**Arquivo**: `features/courses/components/WeekItem.js`

Adicionado botão:
```javascript
// Botão de Ver Atividades (novo - Issue #010)
const activitiesBtn = document.createElement('button');
activitiesBtn.textContent = '🔍 Atividades';
activitiesBtn.onclick = (e) => {
  e.stopPropagation();
  if (callbacks.onViewActivities) callbacks.onViewActivities(week);
};
```

---

### 4. Router Integration (`sidepanel/sidepanel.js`)
```javascript
const detailsActivitiesWeekView = new DetailsActivitiesWeekView({
  onBack: () => layout.navigateTo('courseDetails'),
});

// Callback em CourseWeeksView
onViewActivities: async (week) => {
  // Scrape content if not loaded
  if (!week.items) {
    const items = await WeekContentScraper.scrapeWeekContent(week.url);
    week.items = items;
  }
  detailsActivitiesWeekView.setWeek(week);
  layout.navigateTo('weekActivities');
}
```

---

## 🐛 Problema Atual (Blocker)

### Sintoma
View exibe "Nenhuma atividade encontrada" mesmo com atividades visíveis no AVA.

### Causas Possíveis
1. **Scraping retorna vazio**: `WeekContentScraper.scrapeWeekContent()` pode não estar encontrando elementos
2. **Seletor desatualizado**: `li[id^="contentListItem:"]` pode não corresponder ao DOM atual do AVA
3. **Timing**: `await` pode não estar aguardando scraping completar antes de navegar
4. **Tab incorreta**: Scraping pode estar buscando em tab diferente da semana correta

### Próximos Passos (Debug)
- [ ] Adicionar `console.log` no scraping para verificar retorno
- [ ] Verificar se seletor `li[id^="contentListItem:"]` ainda é válido no AVA
- [ ] Testar scraping manualmente via DevTools
- [ ] Verificar se `week.url` está correto ao clicar em [Ver Atividades]

---

## 📦 Arquivos Criados/Modificados

### Novos Arquivos
- ✅ `features/courses/logic/TaskCategorizer.js`
- ✅ `features/courses/tests/TaskCategorizer.test.js`
- ✅ `features/courses/views/DetailsActivitiesWeekView/index.js`
- ✅ `features/courses/tests/DetailsActivitiesWeekView.test.js`
- ✅ `docs/specs/SPEC-v2.8.0_GESTAO_AVANCADA.md`

### Modificados
- ✅ `features/courses/components/WeekItem.js` (botão [Ver Atividades])
- ✅ `features/courses/views/CourseWeeksView/index.js` (callback + scraping)
- ✅ `sidepanel/sidepanel.js` (router integration)

---

## 📊 Critérios de Aceite

- [x] Lista atividades na ordem DOM original
- [x] Ícones visuais por tipo
- [x] Botão [Ir →] implementado com scroll automático
- [x] Highlight visual (2s) após scroll
- [x] Testes unitários (11/11 passando - 100%)
- [x] Botão [Ver Atividades] em CourseWeeksView
- [x] Router integrado no sidepanel
- [ ] **Navegação end-to-end funcionando** ❌ (Bloqueado por bug de scraping)

---

## 🔄 Commits Realizados

1. `feat(courses): implementa DetailsActivitiesWeekView com scroll automatico`
2. `feat(courses): adiciona botao Ver Atividades para navegacao`
3. `feat(sidepanel): integra DetailsActivitiesWeekView no router`
4. `fix(courses): scrape week content antes de navegar para DetailsActivitiesWeekView`
5. `docs(specs): atualiza SPEC v2.8.0 para refletir progresso real (95%)`

**Total**: 6 commits na branch

---

## 🎯 Valor de Negócio

### Caso de Uso
Estudante quer revisar "Videoaula 3" de uma semana com 15+ atividades:
- **ANTES**: Abre AVA → Scrolla manualmente → Procura (30-60s)
- **DEPOIS**: [Ver Atividades] → Clica [Ir →] na Videoaula 3 → Scroll automático! (5s)

**Economia**: ~50s por navegação ✅

---

## 📝 Notas Técnicas

### Por que não melhorar CourseWeekTasksView?
São views **complementares**, não duplicadas:
- `CourseWeekTasksView`: Foco em STATUS e PROGRESSO (checklist)
- `DetailsActivitiesWeekView`: Foco em NAVEGAÇÃO RÁPIDA (índice)

### Melhorias Futuras (Após Fix)
- Renomear botões para evitar confusão ([Progresso] vs [Índice])
- Cache de scraping para evitar múltiplas chamadas
- Loading state durante scraping
- Fallback visual se scraping falhar
