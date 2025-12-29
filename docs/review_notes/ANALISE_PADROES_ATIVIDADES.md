# 📊 Análise de Padrões de Ativid ades NÃO Categorizadas

**Data da coleta:** 2025-12-29  
**Fonte:** logs_2.txt  
**Total de atividades não categoric:** ~80+ ocorrências (com duplicatas)

---

## 🔬 Método de Análise

### 1. **Extração e Normalização**
- Regex: `name: '([^']+)'` para extrair nomes
- Remoção de duplicatas
- Contagem de frequência

### 2. **Agrupamento por Padrões**
- **Padrões exatos:** Nomes idênticos em diferentes semanas/matérias
- **Padrões com variação:** Nomes com número de semana variável
- **Padrões parciais:** Prefixos/sufixos comuns

### 3. **Priorização**
- Alta frequência = Alta prioridade
- Padrões consistentes > Padrões inconsistentes

---

## 🎯 Padrões Identificados (Ordenado por Prioridade)

### ⭐ **PRIORIDADE MÁXIMA** (Aparecem em TODAS as semanas)

#### 1. **Atividade Avaliativa**
**Ocorrências:** 10+ (todas as matérias/semanas)  
**Padrão:** Sempre `"Semana X - Atividade Avaliativa"` ou `"Semana X - Atividade avaliativa"`

**Exemplos:**
```
✓ Semana 1 - Atividade Avaliativa
✓ Semana 7 - Atividade Avaliativa
✓ Semana 6 - Atividade Avaliativa
✓ Semana 2 - Atividade avaliativa  ← minúscula!
```

**Regex Proposto:**
```javascript
ATIVIDADE_AVALIATIVA: /Atividade\s+[Aa]valiativa/i
```

**Ícone:** `📋` (clipboard/avaliação)

---

#### 2. **Fórum Temático**
**Ocorrências:** 8+  
**Padrão:** `"Semana X - Fórum Temático"` ou `"Semana X - Fórum temático"`

**Exemplos:**
```
✓ Semana 1 - Fórum temático - Congressos internacionais...
✓ Semana 7 - Fórum Temático: Tecendo textos...
✓ Semana 6 - Fórum Temático - Preparação: tenha a faca...
✓ Semana 3 - Fórum Temático - A cópia, sem indicar a fonte...
```

**Regex Proposto:**
```javascript
FORUM_TEMATICO: /Fórum\s+[Tt]emático/i
```

**Ícone:** `💬` (discussão)

---

#### 3. **Fórum de Dúvidas**
**Ocorrências:** 10+  
**Padrão:** Exato `"Fórum de dúvidas das semanas 1-7"`

**Exemplos:**
```
✓ Fórum de dúvidas das semanas 1-7 Marca Revista
✓ Fórum de dúvidas das semanas 1-7
```

**Regex Proposto:**
```javascript
FORUM_DUVIDAS: /Fórum\s+de\s+dúvidas/i
```

**Ícone:** `❓` (dúvidas)

---

#### 4. **Quiz Objeto Educacional**
**Ocorrências:** 8+  
**Padrão:** `"Semana X - Quiz Objeto Educacional Semana X"`

**Exemplos:**
```
✓ Semana 1 - Quiz Objeto Educacional Semana 1 -
✓ Semana 7 - Quiz Objeto Educacional Semana 7 -
✓ Semana 2 - Quiz de objeto educacional Para exer  ← diferente!
```

**Regex Proposto:**
```javascript
QUIZ_OBJETO_EDUCACIONAL: /Quiz\s+(?:de\s+)?[Oo]bjeto\s+[Ee]ducacional/i
```

**Ícone:** `🎮` (interativo/educacional)

---

### ⭐ **PRIORIDADE ALTA**

#### 5. **Material-base**
**Ocorrências:** 4+  
**Padrão:** `"Material-base - [título]"`

**Exemplos:**
```
✓ Material-base - How to write an abstract | Megan Morgan | wikiHow
✓ Material-base - Present perfect exercises | Perfect English Grammar
✓ Material de apoio - Estratégias de leitura acadêmica | REA Univesp
```

**Regex Proposto:**
```javascript
MATERIAL_BASE: /Material(?:-|\s+de\s+)(?:base|apoio)/i
```

**Ícone:** `📚` (material complementar)

---

#### 6. **Vídeo-base**
**Ocorrências:** 4+  
**Padrão:** `"Vídeo-base - [título]"`

**Exemplos:**
```
✓ Vídeo-base - Conjuntos Numéricos | Univesp...
✓ Vídeo-base - Radiciação e potenciação | Univesp...
```

**Regex Proposto:**
```javascript
VIDEO_BASE: /Vídeo-base/i
```

**Ícone:** `🎬` (vídeo complementar)

---

### ⭐ **PRIORIDADE MÉDIA**

#### 7. **Exercício de Apoio**
**Ocorrências:** 3+  
**Padrão:** `"Exercício de Apoio"`

**Exemplos:**
```
✓ Exercício de Apoio Exercício de Apoio
✓ Exercício de Apoio - Iniciando no mundo da ciência: a leitura como base
```

**Regex Proposto:**
```javascript
EXERCICIO_APOIO: /Exercício\s+de\s+Apoio/i
```

**Ícone:** `✏️` (exercício)

---

#### 8. **Avaliação Institucional**
**Ocorrências:** 2+  
**Padrão:** `"Semana X - Avaliação Institucional"`

**Exemplos:**
```
✓ Semana 7 - Avaliação Institucional Semana 7 - Avaliação Institu...
```

**Regex Proposto:**
```javascript
AVALIACAO_INSTITUCIONAL: /Avaliação\s+Institucional/i
```

**Ícone:** `📊` (pesquisa/avaliação)

---

#### 9. **Pesquisa (Feedback)**
**Ocorrências:** 3+  
**Padrão:** `"Semana X - 2025.4 - Pesquisa | Disciplina"`

**Exemplos:**
```
✓ Semana 6 - 2025.4 - Pesquisa | Disciplina - LET100
✓ Semana 6 - 2025.4 - Pesquisa | Disciplina - INT100
```

**Regex Proposto:**
```javascript
PESQUISA_DISCIPLINA: /Pesquisa\s+\|\s+Disciplina/i
```

**Ícone:** `📝` (pesquisa/feedback)

---

###  **PRIORIDADE BAIXA** (Padrões Específicos/Raros)

#### 10. **Going Deeper**
**Ocorrências:** 6+  
**Padrão:** Exato `"Going Deeper Going Deeper"`

**Regex Proposto:**
```javascript
GOING_DEEPER: /Going\s+Deeper/i
```

**Ícone:** `🔍` (aprofundamento)

---

#### 11. **What's Coming Next**
**Ocorrências:** 6+  
**Padrão:** Exato `"What's coming next What's coming next"`

**Regex Proposto:**
```javascript
WHATS_COMING_NEXT: /What'?s\s+coming\s+next/i
```

**Ícone:** `⏭️` (próximos passos)

---

#### 12. **Em Síntese**
**Ocorrências:** 4+  
**Padrão:** `"Em Síntese"` ou `"Em síntese"`

**Regex Proposto:**
```javascript
EM_SINTESE: /Em\s+[Ss]íntese/i
```

**Ícone:** `📌` (resumo)

---

## ⚠️ Casos Especiais e Inconsistências

### 1. **Semana X Semana X – Formato**
**Problema:** Título duplicado, provavelmente erro de scraping  
**Ocorrências:** Todas as semanas  
**Solução:** Pode ser **IGNORADO** (provavelmente é um container/separador)

**Exemplo:**
```
✗ Semana 1 Semana 1 – Formato
✗ Semana 7 Semana 7
```

**Ação:** Não criar regex, investigar se é necessário categorizar

---

### 2. **Inconsistência de Capitalização**
**Problema:** `"Atividade Avaliativa"` vs `"Atividade avaliativa"`

**Solução:** Usar flag `/i` (case-insensitive) em todos os regex

---

## 📋 Tabela de Priorização para Implementação

| Prioridade | Tipo | Ocorrências | Implementar? |
|------------|------|-------------|--------------|
| 🔴 **MÁXIMA** | `ATIVIDADE_AVALIATIVA` | 10+ | ✅ SIM |
| 🔴 **MÁXIMA** | `FORUM_TEMATICO` | 8+ | ✅ SIM |
| 🔴 **MÁXIMA** | `FORUM_DUVIDAS` | 10+ | ✅ SIM |
| 🔴 **MÁXIMA** | `QUIZ_OBJETO_EDUCACIONAL` | 8+ | ✅ SIM |
| 🟠 **ALTA** | `MATERIAL_BASE` | 4+ | ✅ SIM |
| 🟠 **ALTA** | `VIDEO_BASE` | 4+ | ✅ SIM |
| 🟡 **MÉDIA** | `EXERCICIO_APOIO` | 3+ | ⚠️ Considerar |
| 🟡 **MÉDIA** | `AVALIACAO_INSTITUCIONAL` | 2+ | ⚠️ Considerar |
| 🟡 **MÉDIA** | `PESQUISA_DISCIPLINA` | 3+ | ⚠️ Considerar |
| 🟢 **BAIXA** | `GOING_DEEPER` | 6+ | ❓ Opcional |
| 🟢 **BAIXA** | `WHATS_COMING_NEXT` | 6+ | ❓ Opcional |
| 🟢 **BAIXA** | `EM_SINTESE` | 4+ | ❓ Opcional |

---

## 🎯 Recomendação de Implementação

### **Fase 1:** Padrões Máxima Prioridade (4 regex)
```javascript
const patterns = {
  // Existentes...
  QUIZ: /Quiz\s+da\s+Videoaula\s+(\d+)/i,
  VIDEOAULA: /Videoaula\s+(\d+)/i,
  VIDEO_BASE: /Video-base/i,
  TEXTO_BASE: /Texto-base/i,
  APROFUNDANDO: /Aprofundando\s+o\s+Tema/i,
  
  // ⭐ FASE 1: MÁXIMA PRIORIDADE
  ATIVIDADE_AVALIATIVA: /Atividade\s+[Aa]valiativa/i,
  FORUM_TEMATICO: /Fórum\s+[Tt]emático/i,
  FORUM_DUVIDAS: /Fórum\s+de\s+dúvidas/i,
  QUIZ_OBJETO_EDUCACIONAL: /Quiz\s+(?:de\s+)?[Oo]bjeto\s+[Ee]ducacional/i,
};
```

### **Fase 2:** Padrões Alta Prioridade (2 regex)
```javascript
  MATERIAL_BASE: /Material(?:-|\s+de\s+)(?:base|apoio)/i,
  VIDEO_BASE_COMPLEMENTAR: /Vídeo-base/i,  // Diferenciar de VIDEO_BASE já existente
```

### **Fase 3:** Padrões Médios/Baixos (6 regex) - Opcional
```javascript
  EXERCICIO_APOIO: /Exercício\s+de\s+Apoio/i,
  AVALIACAO_INSTITUCIONAL: /Avaliação\s+Institucional/i,
  PESQUISA_DISCIPLINA: /Pesquisa\s+\|\s+Disciplina/i,
  GOING_DEEPER: /Going\s+Deeper/i,
  WHATS_COMING_NEXT: /What'?s\s+coming\s+next/i,
  EM_SINTESE: /Em\s+[Ss]íntese/i,
```

---

## 🧪 Próximos Passos

1. ✅ **Implementar Fase 1** (4 regex de máxima prioridade)
2. ✅ **Criar testes unitários** para os novos padrões
3. ✅ **Adicionar ícones** no `ActivityItemFactory.js`
4. ⚠️ **Testar no AVA real** com logs ativados
5. ⚠️ **Validar** se categorização está correta
6. 🔄 **Iterar** implementando Fase 2/3 conforme necessário

---

**Metodologia de Análise Utilizada:**
- ✅ Contagem de frequência
- ✅ Agrupamento por similaridade
- ✅ Priorização por ocorrência
- ✅ Identificação de inconsistências
- ✅ Teste de padrões regex contra exemplos reais
