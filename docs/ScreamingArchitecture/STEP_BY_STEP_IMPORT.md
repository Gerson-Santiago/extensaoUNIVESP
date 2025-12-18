# 👣 Passo a Passo: Execução Piloto (Importação)

Este documento quebra a "Fase 2" em micro-tarefas executáveis. Cada passo deve ser validado antes de ir para o próximo.

## 🏁 0. Preparação (Branching)
- [x] 0.1. Deletar branch remota lixo (`refactor/screaming-architecture`).
- [x] 0.2. Criar e mudar para `refactor/import-feature` a partir de `dev`.

## 🏗️ 1. Infraestrutura (Skeleton)
- [x] 1.1. Criar pasta `features/import/components`.
- [x] 1.2. Criar pasta `features/import/logic`.
- [x] 1.3. Criar pasta `features/import/services`.
- [x] 1.4. Criar pasta `features/import/tests` (Colocation!).

## 🚚 2. Movimentação (The Move)
> *Nota: Usar `git mv` para preservar histórico.*

- [x] 2.1. Mover `BatchImportModal.js` -> `features/import/components/`.
- [x] 2.2. Mover `BatchImportFlow.js` -> `features/import/logic/`.
- [x] 2.3. Mover `batchScraper.js` -> `features/import/services/BatchScraper.js` (Renomear para PascalCase).
- [x] 2.4. Mover `batchScraper.test.js` -> `features/import/tests/BatchScraper.test.js`.
- [x] 2.5. Mover `BatchImportModal_Render.test.js` -> `features/import/tests/BatchImportModal.test.js`.

## 🩹 3. Cirurgia (Refactoring Imports)
- [x] 3.1. Ajustar imports dentro de `BatchImportFlow.js` (apontando para novo service e modal).
- [x] 3.2. Ajustar imports dentro de `BatchImportModal.js` (apontando para novo logic).
- [x] 3.3. Ajustar imports dentro de `BatchScraper.js` (se houver).
- [x] 3.4. **CRÍTICO:** Ajustar imports nos arquivos de TESTE (`features/import/tests/*.test.js`).

## 🧪 4. Validação (Green Check)
- [x] 4.1. Rodar `npm test features/import`.
- [x] 4.2. Se passar, criar `features/import/index.js` (Public API).

## 🔌 5. Integração (Wiring)
- [x] 5.1. Atualizar `sidepanel.js` para importar de `features/import`.
- [x] 5.2. Rodar Teste Manual (Abrir extensão e clicar em Importar).
- [x] 5.3. Commit Final.
