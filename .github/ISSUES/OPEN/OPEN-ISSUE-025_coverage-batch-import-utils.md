# 📝 ISSUE-025: Refatoração e Cobertura - Import em Lote & Utils Fundamentais

**Status:** 📋 Aberta
**Prioridade:** 🔴 Alta (Critical Path)
**Componente:** `Import`, `Shared/Utils`
**Versão:** v2.9.7 (Estabilização)

---

## 🎯 Objetivo

Eliminar "pontos cegos" críticos na base de código garantindo que as utilidades fundamentais (DOM, Compressão) e o motor de importação em lote (`BatchScraper`) tenham cobertura de testes superior a 80%, seguindo o padrão AAA e JSDoc estrito.

---

## 📖 Contexto

O relatório de cobertura de 01/01/2026 revelou lacunas perigosas em áreas que sustentam a operação da extensão:
### 📉 Baseline Atual (01/01/2026)

| Componente | % Stmts | % Branch | Gap Principal |
|------------|:-------:|:--------:|---------------|
| `BatchScraper.js` | 67.41% | 67.50% | Linhas 320-419 (Core Logic) |
| `ChunkedStorage.js` | 53.75% | 69.23% | Tratamento de Erros/Quota |
| `QuickLinksScraper.js` | 48.05% | 80.00% | Descoberta de Recursos |
| `BatchImportModal.js` | 51.03% | 100%* | UI Interaction (*Falso Positivo) |

Baixa cobertura nessas áreas significa que mudanças na estrutura da UNIVESP ou no navegador podem quebrar a extensão de forma silenciosa.

---

## 🛠️ Requisitos Técnicos

### 1. Refatoração de Lógica (Unit-Tested)
- Isolar lógicas de scraping puro em funções testáveis independentes do DOM global em `BatchScraper`.
- Garantir que `DomUtils` tenha mocks de JSDOM robustos.

### 2. Implementação de Testes (AAA Pattern)
- Criar/Expandir arquivos `.test.js` para cada componente citado.
- Usar fixtures de HTML reais da UNIVESP para os scrapers.

### 3. JSDoc Strict
- Documentar todos os retornos de `BatchScraper` usando o `SafeResult` pattern (ADR-003).

### 4. Storage Resilience
- Implementar testes para `ChunkedStorage` simulando falhas de quota do `chrome.storage`.
- Validar recomposição de chunks corrompidos.

---

## ✅ Critérios de Aceite

- [ ] `features/courses/import/services/BatchScraper` com coverage > 85%
- [ ] `shared/utils/CompressionUtils` com coverage > 90%
- [ ] `shared/utils/DomUtils` com coverage > 90%
- [ ] `features/courses/services/QuickLinksScraper` com coverage > 80%
- [ ] `shared/utils/ChunkedStorage` com coverage > 90%
- [ ] Nenhum erro de tipo detectado pelo `npm run type-check`.

---

## 🧪 Plano de Verificação

1. Executar `npm run test:coverage` e verificar os percentuais dos arquivos alvo.
2. Garantir que `npm run verify` passe sem warnings.

---

**Tags:** `//ISSUE-quality-core` | **Tipo:** Refactor/Quality | **Sprint:** v2.9.7-Quality-Stabilization
**Relatada por:** IA do Projeto | **Data:** 01/01/2026
