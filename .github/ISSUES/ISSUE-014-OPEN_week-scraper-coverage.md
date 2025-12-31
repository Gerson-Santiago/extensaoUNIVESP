# 🧪 TEST-COV: Cobertura de Parsers WeekContentScraper

**Status:** 📋 Planejado (v2.9.6)
**Prioridade:** Média (Quality/Robustness)
**Componentes:** `WeekContentScraper`
**Tipo:** Testes / Parsing

---

## 🔗 Relacionado

**ISSUE Pai:** [ISSUES_v2.9.6](./ISSUES_v2.9.6.md)

O scraper de conteúdo semanal possui parsers internos complexos com baixa cobertura (31.34%). Falhas aqui comprometem a extração de dados das disciplinas.

---

## 📋 Problema Atual

### **Cobertura Baixa em Lógica Crítica:**
- **Linhas 201-251:** Funções que interpretam o DOM bruto para extrair metadados de atividades e vídeos.
- **Risco:** Mudanças sutis no HTML do AVA podem quebrar a extração sem que os testes atuais acusem, pois dependemos muito de mocks que assumem que o seletor funciona.

## 📐 Padrões Arquiteturais Obrigatórios
- **[ADR 000-C: Padrão AAA](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)**: Estruturar testes com Arrange-Act-Assert.

---

## ✅ Solução Proposta

### **Testes Baseados em Fixtures:**
Criar uma bateria de testes que utilizam trechos reais (sanitizados) de HTML do AVA como input para os parsers.

1.  **Extração de Parsers:** Se as funções de parsing forem privadas/injetadas e difíceis de testar, refatorá-las para `utils/domParsers.js` ou expô-las para testes.
2.  **Fixtures HTML:** Criar arquivos `.html` ou strings constantes representando diferentes estados de uma semana de aula (com vídeo, sem vídeo, com quiz, texto misto).

---

## 🛠️ Implementação Proposta

### **Refatoração (Opcional mas recomendada):**
Mover lógica pura de extração para fora da classe principal se estiver muito acoplada.

### **Novos Casos de Teste:**
`features/courses/services/__tests__/WeekContentParser.test.js`

```javascript
import { parseWeekContent } from '../WeekContentScraper'; // ou método interno exposto
import htmlFixture from './fixtures/week-with-video.html';

test('deve extrair URL de vídeo corretamente de um iframe', () => {
    const output = parseWeekContent(htmlFixture);
    expect(output.videos).toHaveLength(1);
    expect(output.videos[0].title).toBe('Aula 1');
});
```

---

## 🧪 Plano de Testes

### **Cenários a Cobrir:**
1.  **Semana Padrão:** Texto + Vídeo + PDF.
2.  **Semana de Avaliação:** Apenas Quiz (Link externo).
3.  **Semana Vazia/Feriado:** Tratamento de listas vazias.
4.  **IDs Duplicados:** Garantir unicidade dos IDs gerados.
5.  **HTML Malformado:** Tags não fechadas ou atributos faltantes (resiliência).

---

## ✅ Critérios de Sucesso

- [ ] Conjunto de fixtures HTML criado (mínimo 3 variações).
- [ ] Lógica de parsing (linhas 201-251) coberta por testes unitários.
- [ ] Cobertura de statements do `WeekContentScraper.js` > 80%.

---

**Tags:** `//ISSUE-week-content-parser-coverage` | **Tipo:** Testing | **Versão:** 2.9.6
**Criado:** 2025-12-31 | **Autor:** Prof. Antigravity
