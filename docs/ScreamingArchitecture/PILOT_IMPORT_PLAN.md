# 🗺️ Plano Detalhado: Piloto de Importação (Full Screaming Package)

Este documento detalha a migração da feature "Importação" com **Nomes Explícitos** e **Testes Integrados** (Colocation).

> **Objetivo**: A pasta `features/import` deve conter TODO o universo da importação: Código + Testes. Nada fica de fora.

---

## 1. Árvore de Diretórios Final

```text
extensaoUNIVESP/
├── features/
│   └── import/
│       ├── components/
│       │   └── BatchImportModal.js
│       ├── logic/
│       │   └── BatchImportFlow.js
│       ├── services/
│       │   └── BatchScraper.js
│       ├── tests/                    # 🆕 Testes moram aqui agora!
│       │   ├── BatchScraper.test.js
│       │   └── BatchImportModal.test.js
│       └── index.js
```

---

## 2. Movimentação Completa (Código + Testes)

| Tipo | Arquivo Original (Origem) | Novo Local (Destino) |
| :--- | :--- | :--- |
| **Código** | `sidepanel/services/BatchImportFlow.js` | `features/import/logic/BatchImportFlow.js` |
| **Código** | `sidepanel/logic/batchScraper.js` | `features/import/services/BatchScraper.js` |
| **Código** | `sidepanel/components/Modals/BatchImportModal.js` | `features/import/components/BatchImportModal.js` |
| **Teste** | `tests/batchScraper.test.js` | `features/import/tests/BatchScraper.test.js` |
| **Teste** | `tests/BatchImportModal_Render.test.js` | `features/import/tests/BatchImportModal.test.js` |

---

## 3. Estratégia Green-Green (Ajuste de Testes)

Ao mover os testes para dentro da feature, os imports relativos mudam drasticamente.

#### Exemplo: `BatchScraper.test.js`
*   **Antes (`tests/`)**: `import ... from '../sidepanel/logic/batchScraper.js'`
*   **Depois (`features/import/tests/`)**: `import ... from '../services/BatchScraper.js'`

> Importante: O arquivo `checks/imports.test.js` (geral) precisará ser atualizado para saber que esses arquivos de teste mudaram de lugar.

---

## 4. Checklist de Execução

1.  [ ] **Branch**: Criar `refactor/import-feature`.
2.  [ ] **Estrutura**: Criar toda a árvore de pastas em `features/import`.
3.  [ ] **Mover Código**: `git mv` nos arquivos de produção.
4.  [ ] **Mover Testes**: `git mv` nos arquivos de teste.
5.  [ ] **Refatorar Imports**: Corrigir caminhos dentro dos testes (agora eles estão "vizinhos" do código).
6.  [ ] **Verificar**: `npm test` ✅.
7.  [ ] **Consumidor**: Ajustar `sidepanel.js`.
