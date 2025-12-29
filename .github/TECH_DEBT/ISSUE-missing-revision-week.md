# ISSUE: Inconsistência na Captura da "Semana de Revisão" (v2.9.1)

**Status:** Aberto | **Gravidade:** Média | **Alvo:** v2.10.x

### 🎯 Descrição
Atualmente, o `ScraperService.js` utiliza um Regex restrito que captura apenas links iniciados por "Semana" seguido de número. Isso causa a omissão da "Semana de Revisão", presente em quase todas as matérias ao final do bimestre.

### 🔍 Causa Técnica
O regex atual em `ScraperService.js` (e na função injetada) é:
```javascript
const weekRegex = /^Semana\s+(\d{1,2})$/i;
```
Ele ignora nomes como "Revisão", "REVISÃO" ou "revisão".

### 🚀 Solução Proposta
1. **Regex Musculoso**: Expandir para `/(^Semana\s+\d{1,2}$|^Revisão$)/i`.
2. **Ordenação Inteligente**: Ajustar o algoritmo de sort em `ScraperService.js` para garantir que a Revisão seja sempre o último item da lista (atribuindo um peso fixo, ex: 99).

---
*Relacionado ao Ciclo de Estabilização v2.9.1*
