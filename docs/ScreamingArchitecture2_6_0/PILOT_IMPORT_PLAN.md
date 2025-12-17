# 🗺️ Plano Detalhado: Piloto de Importação

Este documento detalha **exatamente** o que será movido, criado e alterado durante a Fase 2 (Piloto da Screaming Architecture).

---

## 1. Árvore de Diretórios (Target Tree)

O objetivo é criar uma estrutura autossuficiente em `features/import`.

```text
extensaoUNIVESP/
├── features/
│   └── import/
│       ├── components/
│       │   └── ImportModal.js       # UI: O Modal de seleção
│       ├── logic/
│       │   └── ImportController.js  # Lógica: O antigo 'BatchImportFlow'
│       ├── services/
│       │   └── Scraper.js           # Infra: Scripts de coleta (DOM)
│       └── index.js                 # Public API (Exporta Controller e Modal)
```

---

## 2. Movimentação de Arquivos (De -> Para)

Esta tabela define a origem e o destino de cada arquivo. **Nenhum código será deletado**, apenas movido.

| Arquivo Original (Origem) | Novo Arquivo (Destino) | Mudança de Nome? |
| :--- | :--- | :--- |
| `sidepanel/services/BatchImportFlow.js` | `features/import/logic/ImportController.js` | **Sim** (Reflete responsabilidade real) |
| `sidepanel/logic/batchScraper.js` | `features/import/services/Scraper.js` | **Sim** (Generalização) |
| `sidepanel/components/Modals/BatchImportModal.js` | `features/import/components/ImportModal.js` | **Sim** (Simplificação) |

> **Nota:** `ImportModal.js` manterá dependência de `sidepanel/components/Modals/Modal.js` (Shared) temporariamente, até a Fase 1 (Shared UI) ser concluída.

---

## 3. Revisão dos Testes (Impacto)

Os testes existentes **não serão movidos** agora (ficam em `tests/`), mas seus **imports** precisarão ser atualizados imediatamente para evitar quebra ("Green-Green").

### Arquivos Afetados:

#### A. `tests/batchScraper.test.js`
*   **Onde quebra:** Linhas de `import ... from '../sidepanel/logic/batchScraper.js'`
*   **Correção:**
    ```javascript
    // Antes
    import { scrapeAvailableTerms } from '../sidepanel/logic/batchScraper.js';
    
    // Depois
    import { scrapeAvailableTerms } from '../features/import/services/Scraper.js';
    ```

#### B. `tests/BatchImportModal_Render.test.js`
*   **Onde quebra:** Importação da classe modal.
*   **Correção:**
    ```javascript
    // Antes
    import { BatchImportModal } from '../sidepanel/components/Modals/BatchImportModal.js';
    
    // Depois
    import { ImportModal } from '../features/import/components/ImportModal.js';
    ```

#### C. `tests/imports.test.js`
*   **Onde quebra:** Lista de verificação de arquivos (`filesToVerify`).
*   **Correção:** Atualizar os caminhos na array de verificação para apontar para `features/import/...`.

---

## 4. Integração (Consumers)

Quem usa esses arquivos hoje? Precisamos atualizar as referências em:

1.  **`sidepanel/sidepanel.js` (O "Main")**:
    *   Substituir instâncias de `BatchImportModal` e `BatchImportFlow` pelas versões importadas de `features/import/index.js`.

---

## 5. Checklist de Execução

1.  [ ] Criar branch `refactor/import-feature`.
2.  [ ] Criar pastas `features/import/{components,logic,services}`.
3.  [ ] Mover arquivos (git mv).
4.  [ ] **CRÍTICO**: Rodar script de substituição de imports nos testes.
5.  [ ] Rodar `npm test` (Deve passar).
6.  [ ] Atualizar `sidepanel.js`.
7.  [ ] Teste Manual: Abrir modal de importação e verificar se carrega cursos.
