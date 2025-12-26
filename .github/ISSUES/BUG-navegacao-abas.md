# BUG: Navegação entre Abas de Matérias Diferentes

**Status**: 🚧 Parcialmente Resolvido (Auditoria 2025-12-26)  
**Prioridade**: Média  
**Afeta**: Navegação entre matérias  
**Resolução**: `Tabs.js` refatorado com lógica de `course_id` - Necessita validação manual  

---

## 🐛 Descrição do Bug

Ao navegar entre semanas de **matérias diferentes**, o Chrome reusa a aba errada e faz reload com conteúdo incorreto.

---

## 📝 Cenário de Reprodução

### Passos:
1. ✅ Abrir extensão → Inglês → Semana 3
2. ✅ Chrome abre aba: `ava.univesp.br/...ingles/semana3`
3. ✅ Voltar para extensão (aba do AVA fica aberta)
4. ✅ Clicar em Matemática → Semana 4
5. ❌ **BUG**: Chrome volta para aba de Inglês e faz reload com semana 4 de matemática

### Resultado Esperado:
- Nova aba para Matemática
- Ou reuso correto (se mesma matéria)

### Resultado Atual:
- Reusa aba de Inglês (errado!)
- Conteúdo misturado

---

## 🔍 Causa Provável

**Arquivo**: `shared/utils/Tabs.js` (ou similar)

Lógica atual:
```javascript
// ❌ PROBLEMA: query muito amplo
chrome.tabs.query({ url: '*://ava.univesp.br/*' })
// Retorna QUALQUER aba do AVA (não filtra por matéria)
```

**Deveria**:
```javascript
// ✅ SOLUÇÃO: filtrar por matéria específica
chrome.tabs.query({ url: targetUrl })
// Ou verificar se URL contém o course_id correto
```

---

## 🎯 Solução Sugerida

### Opção 1: **Abrir sempre nova aba**
- Simples, mas pode poluir navegador

### Opção 2: **Reuso inteligente** (recomendado)
```javascript
async function openOrSwitchToWeek(weekUrl) {
  // Extrair course_id da URL
  const courseId = extractCourseId(weekUrl);
  
  // Buscar aba com MESMA matéria
  const tabs = await chrome.tabs.query({ 
    url: `*://ava.univesp.br/*course_id=${courseId}*` 
  });
  
  if (tabs.length > 0) {
    // Reusar aba da mesma matéria
    await chrome.tabs.update(tabs[0].id, { url: weekUrl, active: true });
  } else {
    // Nova aba para matéria diferente
    await chrome.tabs.create({ url: weekUrl });
  }
}
```

---

## 📂 Arquivos Relacionados

- `shared/utils/Tabs.js` (ou arquivo de gerenciamento de abas)
- `features/courses/views/CourseWeeksView/index.js` (callbacks)
- `features/courses/views/DetailsActivitiesWeekView/index.js` (scrollToActivity)

---

## ✅ Critérios de Aceitação

- [ ] Navegação entre matérias diferentes abre nova aba
- [ ] Navegação dentro da mesma matéria reusa aba corretamente
- [ ] Não há reload em aba errada
- [ ] Testado: Inglês → Matemática → Inglês

---

## 📝 Notas

- Problema identificado em 2025-12-23
- Afeta UX mas não impede funcionalidade
- Pode confundir usuário (conteúdo errado temporariamente)

---

## 📌 Nota de Auditoria (2025-12-26)

**Evidências de Resolução Encontradas**:

O arquivo [`Tabs.js`](file:///home/sant/extensaoUNIVESP/shared/utils/Tabs.js) foi significativamente refatorado desde a criação deste bug:

1. **Linhas 15-20**: Extração automática de `course_id` e `content_id` da URL
2. **Linhas 38-47**: Lógica de busca priorizada:
   - Primeiro: Match por `course_id` + `content_id`
   - Segundo: Match apenas por `course_id`
3. **Linhas 63-73**: Safety check que REJEITA match se `course_id` for diferente

**Implementação atual**:
```javascript
// Se a aba candidata tem um course_id, E a URL alvo tem OUTRO, rejeita.
const tabCourseMatch = t.url.match(/course_id=([^&]+)(&|$)/);
const tabCourseId = tabCourseMatch ? tabCourseMatch[1] : null;

if (tabCourseId && targetCourseId && tabCourseId !== targetCourseId) {
  return false; // Rejeita match (IDs conflitantes)
}
```

**Status Recomendado**: 🚧 Parcialmente Resolvido
- ✅ Lógica implementada corretamente
- ⚠️ Falta teste de regressão automatizado
- ⚠️ Necessita validação manual do usuário

**Ação Sugerida**: 
1. Criar teste de regressão em `tests/integration/navigation.integration.test.js`
2. Validar manualmente o cenário: Inglês S3 → Matemática S4
3. Se confirmado resolvido, mover para "Bugs Resolvidos"

---

**Criado em**: 2025-12-23  
**Reportado por**: Usuário durante testes  
**Auditado em**: 2025-12-26

