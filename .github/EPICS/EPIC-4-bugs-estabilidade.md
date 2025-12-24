# EPIC 4: Bugs e Estabilidade

**Status**: 🐛 Correção  
**Prioridade**: Alta  
**Owner**: Equipe de Engenharia  

---

## 🎯 Objetivo

Resolver **bugs conhecidos** que afetam experiência do usuário, garantindo estabilidade e confiabilidade da extensão.

---

## 📋 Escopo

### Problema

Bugs funcionais identificados durante uso real:
- Navegação entre abas incorreta
- Botões que falham em contextos específicos

Embora não impeçam uso, **degradam UX** e causam confusão.

---

## 🗂️ Issues Incluídas

### 1. [BUG-navegacao-abas.md](file:///home/sant/extensaoUNIVESP/.github/ISSUES/BUG-navegacao-abas.md)

**Problema**: Navegação entre matérias diferentes reusa aba errada

**Cenário**:
1. Abrir Inglês → Semana 3
2. Chrome abre aba do AVA
3. Voltar para extensão
4. Abrir Matemática → Semana 4
5. ❌ **BUG**: Chrome volta para aba de Inglês!

**Causa**: `chrome.tabs.query` muito amplo (busca qualquer aba AVA)

**Solução proposta**:
```javascript
// Filtrar por course_id específico
const tabs = await chrome.tabs.query({ 
  url: `*://ava.univesp.br/*course_id=${courseId}*` 
});
```

**Impacto**: Pequeno (lógica de Tabs.js)  
**Estimativa**: 1-2 horas

---

### 2. [BUG-botao-abrir-materia.md](file:///home/sant/extensaoUNIVESP/.github/ISSUES/BUG-botao-abrir-materia.md)

**Problema**: Botão "Abrir Matéria" falha quando aba de semana está aberta

**Cenário**:
1. Estar em `CourseWeeksView` (semanas)
2. Clicar em "Abrir Matéria"
3. ❌ **BUG**: Falha ou comportamento inesperado

**Causa**: Callback assume que week.url existe, mas pode ser undefined

**Solução proposta**:
- Validar `week.url` antes de chamar `Tabs.openOrSwitchTo`
- Fallback para `course.url` se necessário

**Impacto**: Pequeno (callback de View)  
**Estimativa**: 1 hora

---

## 🎁 Benefícios

- ✅ **UX consistente**: Navegação previsível
- ✅ **Confiabilidade**: Sem surpresas ao trocar matérias
- ✅ **Profissionalismo**: Menos bugs = mais confiança

---

## ✅ Critérios de Aceitação

### BUG-navegacao-abas
- [ ] Navegação Inglês → Matemática abre nova aba
- [ ] Navegação dentro da mesma matéria reusa aba
- [ ] Não há reload em aba errada
- [ ] Testado: Inglês → Matemática → Inglês

### BUG-botao-abrir-materia
- [ ] Botão funciona em qualquer contexto
- [ ] Validação de URL implementada
- [ ] Fallback para course.url
- [ ] Testado manualmente

---

## 📊 Progresso

```
[░░░░░░░░░░] 0%
```

**Concluído**: 0/2 bugs  
**Total estimado**: 2-3 horas

---

## 🔗 Dependências

- Independente de outros EPICs
- Pode ser feito em paralelo
- Alta prioridade (afeta UX)

---

## 📝 Notas

- Bugs não são críticos (workarounds existem)
- Impacto baixo em código (correções pontuais)
- Devem ser resolvidos antes de v2.8.0 GA

---

**Criado em**: 2025-12-23  
**Relacionado a**: [SPEC-v2.8.0.md](file:///home/sant/extensaoUNIVESP/.github/SPEC-v2.8.0.md)
