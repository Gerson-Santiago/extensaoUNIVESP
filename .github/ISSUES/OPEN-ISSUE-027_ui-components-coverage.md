# 📝 ISSUE-027: Coverage & Quality - UI Critical Components

**Status:** 📋 Aberta
**Prioridade:** ⏺️ Média (Quality Debt)
**Componente:** `UI/Courses`, `UI/Import`
**Versão:** v2.9.8 (Polimento)

---

## 🎯 Objetivo

Garantir a robustez dos componentes de interface mais complexos da extensão (`WeekItem` e `BatchImportModal`), elevando sua cobertura de testes para > 80% e validando interações críticas (expandir/colapsar, importar, cancelar).

---

## 📖 Contexto

O relatório de coverage de 01/01/2026 apontou fragilidade em componentes visuais que contêm lógica de negócios importante:

1.  **BatchImportModal (51.03%):**
    - Este modal controla o fluxo crítico de importação em lote.
    - Falhas aqui podem impedir o usuário de carregar seus dados ou travar a UI em estados inconsistentes.
    - As linhas 50-91 (setup de UI) e 153-216 (event listeners complexos) estão descobertas.

2.  **WeekItem (54.62%):**
    - Componente central da visualização do curso.
    - Responsável por renderizar status de progresso e expandir detalhes.
    - As linhas de renderização condicional (88-108) e manipulação de eventos (24-46) estão descobertas.

### 📊 Baseline Atual (01/01/2026)

| Componente | % Stmts (Volume) | % Branch (Lógica) | Uncovered Lines |
|------------|:----------------:|:-----------------:|-----------------|
| `BatchImportModal.js` | **51.03%** | 100%* | 50-91, 153-216 |
| `WeekItem.js` | **54.62%** | 66.66% | 24-46, 88-108 |

*> O 100% em Branch do BatchImportModal é enganoso pois o código não executado (linhas 50-91) contém lógica de UI não avaliada.*

---

## 🛠️ Requisitos Técnicos

### 1. Testes de Interação (Event Simulation)
- Usar `testing-library` ou simulação de eventos manuais robusta.
- **WeekItem:** Testar clique para expandir, renderização de ícones de status (concluído/pendente), e formatação de datas.
- **BatchImportModal:** Testar clique em "Importar", "Cancelar", validação de input de texto (JSON), e exibição de mensagens de erro.

### 2. Mocks de Serviços
- Mockar `CourseService` e `ImportService` para isolar a lógica da UI.
- Garantir que o modal lida corretamente com promessas rejeitadas (erros de importação).

### 3. Acessibilidade (Bônus)
- Verificar se os componentes mantêm atributos ARIA básicos durante as mudanças de estado.

---

## ✅ Critérios de Aceite

- [ ] `features/courses/components/WeekItem.js` com coverage > 85%
- [ ] `features/courses/import/components/BatchImportModal.js` com coverage > 85%
- [ ] Testes validam cenários de sucesso e erro (caminhos tristes).
- [ ] Nenhum mock vazando para outros testes (limpeza no teardown).

---

## 🧪 Plano de Verificação

1. Executar `npm run test:coverage` focando nos arquivos de UI.
2. Validar que as interações funcionam manualmente após refatoração se houver mudanças de código produtivo.

---

**Tags:** `//ISSUE-ui-quality` | **Tipo:** Test/Quality | **Sprint:** v2.9.8
**Relatada por:** IA do Projeto | **Data:** 01/01/2026
