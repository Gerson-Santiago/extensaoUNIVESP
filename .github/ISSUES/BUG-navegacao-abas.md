# BUG: Navegação entre Abas de Matérias Diferentes

**Status**: 🐛 Bug Identificado  
**Prioridade**: Média  
**Afeta**: Navegação entre matérias  

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

**Criado em**: 2025-12-23  
**Reportado por**: Usuário durante testes
