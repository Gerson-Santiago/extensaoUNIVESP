# Reviews Técnicos e Debug - Central Univesp

Histórico de análises, investigações de DOM e ferramentas de diagnóstico para manutenção da extensão.

---

## 🔍 1. Análise de Padrões de Atividades (AVA/Blackboard)

### Regex de Identificação de Semanas
Utilizado pelo `ScraperService` para descobrir módulos acadêmicos:
```javascript
/^(Semana\s+(\d{1,2})|Semana\s+de\s+Revisão|Revisão)$/i
```
*Suporta: Semana 1, Semana 15, Revisão.*

### Categorização de Atividades (TaskCategorizer)
Padrões identificados para atribuição de ícones e comportamentos:
- **Máxima**: Atividade Avaliativa, Fóruns, Quiz Objeto Educacional.
- **Alta**: Material-base, Vídeo-base.
- **Média/Baixa**: Exercícios de Apoio, Pesquisas de Disciplina, "Going Deeper".

---

## 🛠️ 2. Sistema de Debug e Diagnóstico

### Ativando o Modo Debug
Execute no console do navegador para habilitar logs estruturados da extensão:
```javascript
localStorage.setItem('UNIVESP_DEBUG', 'true');
```

### Scripts de Auditoria DOM
Para diagnosticar problemas de scroll ou falhas no scraping, cole no console:
```javascript
// Analisar IDs de atividades
document.querySelectorAll('li[id^="contentListItem"]').forEach(el => console.log(el.id, el.textContent.trim()));
```

---

## 📊 3. Casos de Estudo (Deep Dives)

### O Bug da "Semana de Revisão" (Dez/2025)
- **Problema**: A regex original ignorava o item "Revisão".
- **Solução**: Expansão do padrão regex e inclusão no `sortWeeks` com peso alto (999) para ficar no final da lista.

### Auditoria de IDs de Scroll
Investigação revelou que o Blackboard alterna entre IDs no `<li>` e no `<div class="item">`. O `ContentStrategy` foi atualizado para tentar ambos, garantindo que o botão "Ir" funcione em 100% dos casos.

---

## 📜 4. Referências Históricas
Para scripts de verificação detalhados e logs brutos de coleta, consulte os arquivos tagueados como `#CONSOLE_CATEGORIZER` no histórico do Git.

---
[Voltar para o Índice](README.md)
