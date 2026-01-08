# [ISSUE-047] Refatoração Arquitetural: WeeksManager.js

---
**Type:** ♻️ Refactor  
**Priority:** 🟢 Low  
**Status:** 📋 Open  
**Component:** Architecture/WeeksManager  
**Effort:** 3-5 days  
**Labels:** `refactor` `architecture` `tech-debt`
---


## Contexto
O arquivo `WeeksManager.js` tornou-se um ponto de alta complexidade no sistema (Code Bloat). Atualmente, ele viola o Princípio de Responsabilidade Única (SRP) ao acumular múltiplas responsabilidades distintas.

## Problemas Identificados
1.  **Responsabilidade Mista**: Gerencia renderização de DOM, lógica de estado (ActiveWeek), persistência (Auto-Pin/Storage) e orquestração de serviços.
2.  **Acoplamento**: Dependência direta de `chrome.storage` e `document`, dificultando testes unitários isolados.
3.  **Complexidade**: Funções como `render()` e `showPreview()` são extensas e misturam níveis de abstração.

## Plano de Ação

- [ ] **Criar `WeeksStorageService.js`**:
    - Abstrair toda a lógica de `autoPinLastWeek` e `persistLastWeek`.
    - Interface limpa: `getLastWeek()`, `setLastWeek(n)`.

- [ ] **Criar `WeeksRenderer.js`**:
    - Abstrair a manipulação direta do DOM (`createElement`, `replaceChildren`).
    - Receber dados puros e retornar elementos ou fragmentos.

- [ ] **Refatorar `WeeksManager.js`**:
    - Transformar em um Controlador leve que apenas coordena os serviços e o renderer.

## Benefícios
- Facilidade de teste (Mocking de Storage e Renderer).
- Código mais legível e manutenível conforme **ADR-000-A (Screaming Architecture)**.
