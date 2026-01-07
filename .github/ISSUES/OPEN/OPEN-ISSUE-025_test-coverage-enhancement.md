# 🧪 ISSUE-025: Cobertura de Testes: Core Logic e UI Components

**Status:** 📋 Aberta
**Prioridade:** ⏺️ Média
**Componentes:** `Features`, `SharedUI`, `TestSuites`

---

## 🎯 Objetivo (Unificado)
Alcançar a meta de 85% de **Branch Coverage** global, com foco em componentes de UI e utilitários de importação em lote que possuem lógica condicional densa.
*Absorve: ISSUE-025 e ISSUE-027.*

## 📝 Descrição e Requisitos

### 1. Utilitários de Lógica (Core)
- [ ] Aumentar cobertura nos utilitários de `BatchImport`.
- [ ] Testar casos de borda em `ScraperService` e `TaskCategorizer` (ex: nomes de atividades mal formatados).
- [ ] Garantir 100% de cobertura nos algoritmos de ordenação e filtro.

### 2. Componentes de UI (Vistas)
- [ ] Implementar testes de integração para `ContextualChips` e `ActivityRenderer`.
- [ ] Validar comportamento do `sidePanel` em diferentes estados de carregamento.
- [ ] Garantir que mudanças no DOM (scraping progress) não quebrem a UI.

### 3. Métrica de Intencionalidade (Branch Coverage)
- [ ] Focar em testar todos os caminhos `else` e blocos `catch` para garantir que erros sejam tratados com intencionalidade, conforme as diretrizes de Engenharia.

---
**Tags:** `//ISSUE-test-coverage-unified` | **Sprint:** v2.10.x-Quality
