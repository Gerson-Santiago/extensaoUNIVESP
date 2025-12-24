# TECH_DEBT: Avaliar Breadcrumb como Estado Global

**Status**: 🤔 Análise Técnica Necessária  
**Prioridade**: Média  
**Estimativa**: 2-3 horas (análise + POC)  

---

## 🎯 Problema

O **Breadcrumb** está **duplicado** em múltiplos objetos de estado, criando:
- ❌ Redundância de dados (`week.courseName`)
- ❌ Dificuldade de manter consistência
- ❌ Acoplamento entre objetos (Week precisa conhecer Course)

---

## 🔍 Estado Atual

### Estrutura de Dados

```javascript
// Course
{
  id: "LET100",
  name: "Inglês - LET100",  // ← Fonte da verdade
  weeks: [...]
}

// Week (dentro de Course.weeks[])
{
  name: "Semana 1",
  url: "...",
  items: [...],
  courseName: "Inglês - LET100"  // ❌ DUPLICADO!
}
```

### Onde é Usado

**1. DetailsActivitiesWeekView**
```javascript
// Breadcrumb: "Inglês - LET100 > Semana 1 > Atividades"
<div class="breadcrumb">${this.week.courseName || 'Matéria'}</div>
```

**2. CourseWeeksView**
```javascript
// Passa courseName ao navegar
w.courseName = this.course.name;  // ← Duplicação manual
```

---

## 🤔 Análise Técnica

### Opção 1: **Estado Local** (atual, com limpeza)

Manter `week.courseName`, mas garantir que seja:
- ✅ **Injetado consistentemente** (sempre passar no callback)
- ✅ **Documentado** (JSDoc `@typedef`)

**Prós**:
- Simples de manter
- Não requer refatoração grande

**Contras**:
- Ainda é duplicação de dados
- Pode desincronizar se course.name mudar

---

### Opção 2: **Router Context** (centralizado)

Criar um **AppRouter** que mantém contexto de navegação:

```javascript
class AppRouter {
  constructor() {
    this.navigationStack = [];
  }
  
  navigateTo(view, context) {
    this.navigationStack.push({ view, context });
    this.currentContext = context;
  }
  
  getBreadcrumb() {
    // Constrói breadcrumb do stack
    return this.navigationStack.map(s => s.context.label);
  }
}

// Uso:
router.navigateTo('CourseWeeksView', { 
  course: course,
  label: course.name 
});

router.navigateTo('DetailsActivitiesWeekView', { 
  week: week,
  label: week.name 
});

// Breadcrumb automático:
router.getBreadcrumb(); // ["Inglês - LET100", "Semana 1"]
```

**Prós**:
- ✅ Fonte única de verdade
- ✅ Breadcrumb automático
- ✅ Histórico de navegação (back button)

**Contras**:
- Mais complexo
- Refatoração de todas as views

---

### Opção 3: **Computed Property** (via getter)

Week não armazena `courseName`, mas tem acesso ao Course pai:

```javascript
class Week {
  constructor(data, parentCourse) {
    this.name = data.name;
    this.url = data.url;
    this._course = parentCourse;  // Referência ao pai
  }
  
  get courseName() {
    return this._course?.name || 'Matéria';
  }
  
  get breadcrumb() {
    return `${this.courseName} > ${this.name}`;
  }
}
```

**Prós**:
- Sem duplicação de dados
- Sempre sincronizado

**Contras**:
- Week acoplado a Course (circular reference?)
- Requer refatoração do modelo

---

## 🎯 Recomendação

### **Curto Prazo**: Opção 1 (Limpeza)
1. Documentar `week.courseName` no `@typedef`
2. Garantir injeção consistente em todos callbacks
3. Adicionar validação/teste

### **Médio Prazo**: Opção 2 (Router Context)
1. Criar POC de `AppRouter`
2. Avaliar benefícios vs esforço
3. Implementar se aprovado

---

## 📂 Arquivos Relacionados

- `features/courses/views/CourseWeeksView/index.js` (linha 290)
- `features/courses/views/DetailsActivitiesWeekView/index.js` (linha 264)
- `features/courses/models/Week.js` (modelo de dados)

---

## ✅ Critérios de Decisão

- [ ] Análise de trade-offs documentada
- [ ] POC de Router Context criado (se necessário)
- [ ] Decisão arquitetural tomada (ADR)
- [ ] Implementação planejada ou rejeitada

---

## 📝 Notas

- Esta é uma **questão de design**, não bug funcional
- Impacto em UX é zero, foco em manutenibilidade
- Considerar também para `grades` feature (mesmo problema?)

---

**Criado em**: 2025-12-23  
**Baseado em**: Feedback do usuário sobre estado duplicado
