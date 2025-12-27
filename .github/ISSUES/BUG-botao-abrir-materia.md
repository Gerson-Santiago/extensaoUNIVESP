# BUG: Botão "Abrir Matéria" Falha em HomeView

**Status**: ⚠️ **EM INVESTIGAÇÃO** (Auditoria 2025-12-27)  
**Prioridade**: Média  
**Afeta**: Botão "Abrir Matéria" (todos os cursos)  
**Nota de Auditoria**: Mensagem de erro "Aba já aberta" não encontrada no código. Possível resolução indireta via refatoração de `Tabs.js`. Necessita validação manual do cenário.
  

---

## 🐛 Descrição do Bug

Ao tentar abrir o AVA Cursos pela **HomeView** após navegar em semanas, o botão informa que "já tem aba aberta" mas não funciona corretamente.

---

## 📝 Cenário de Reprodução

### Passos:
1. ✅ Abrir extensão → Home → Inglês → Semana 5
2. ✅ Chrome abre aba: `ava.univesp.br/...ingles/semana5`
3. ✅ Voltar para Home (botão ←)
4. ✅ Clicar no botão principal do curso "Inglês" (ícone 📚)
5. ❌ **BUG**: Mensagem "Aba já aberta" mas não navega

### Resultado Esperado:
- Ou abre AVA Cursos (página principal)
- Ou vai para aba já aberta (se existir)

### Resultado Atual:
- Mostra mensagem mas não faz nada
- Usuário fica sem ação

---

## 🔍 Causa Provável

**Arquivo**: `features/courses/components/CourseCard.js` (ou HomeView)

Lógica atual:
```javascript
// ❌ PROBLEMA: detecta aba de SEMANA como aba de CURSO
onclick: async () => {
  const tabs = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });
  
  if (tabs.length > 0) {
    // Detecta aba de semana e para aqui
    alert('Aba já aberta');
    return;
  }
  
  // Nunca chega aqui...
  chrome.tabs.create({ url: courseUrl });
}
```

**Problema**: 
- Query muito ampla (`*://ava.univesp.br/*`)
- Não diferencia: página do curso VS página de semana

---

## 🎯 Solução Sugerida

### Opção 1: **Sempre abrir curso** (simples)
```javascript
onclick: () => {
  chrome.tabs.create({ url: course.url });
}
```

### Opção 2: **Reuso inteligente** (melhor UX)
```javascript
onclick: async () => {
  // Buscar aba COM EXATAMENTE a URL do curso
  const tabs = await chrome.tabs.query({ url: course.url });
  
  if (tabs.length > 0) {
    // Focar na aba do curso
    await chrome.tabs.update(tabs[0].id, { active: true });
  } else {
    // Abrir nova aba
    await chrome.tabs.create({ url: course.url });
  }
}
```

### Opção 3: **Permitir usuário escolher**
- Botão normal: abre/foca aba do curso
- Shift+Click: força nova aba
- Ctrl+Click: abre em background

---

## 📂 Arquivos Relacionados

- `features/courses/components/CourseCard.js`
- `features/courses/views/HomeView/index.js`
- `shared/utils/Tabs.js`

---

## ✅ Critérios de Aceitação

- [ ] Botão "Abrir Matéria" sempre funciona
- [ ] Não mostra "já aberta" para abas de semana
- [ ] Diferencia: página curso vs página semana
- [ ] UX clara: usuário sabe o que acontecerá

---

## 🔗 Issues Relacionadas

- Relacionado com: `BUG-navegacao-abas.md`
- Ambos problemas de gerenciamento de abas

---

## 📝 Notas

- Problema identificado em 2025-12-23
- Bloqueia acesso rápido ao AVA Cursos
- Frustrante para usuário (botão não faz nada)

---

**Sugestão**: Refatorar gerenciamento de abas de forma unificada em `Tabs.js`:
```javascript
// Centralizador
class TabManager {
  async openCourse(courseUrl) { }
  async openWeek(weekUrl, courseId) { }
  async findTabByCourse(courseId) { }
  async findTabByUrl(url) { }
}
```

---

**Criado em**: 2025-12-23  
**Reportado por**: Usuário durante testes
