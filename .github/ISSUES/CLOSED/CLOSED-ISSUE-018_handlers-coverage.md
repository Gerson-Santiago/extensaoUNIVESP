# 🧪 TEST-COV: Cobertura de Handlers de UI (Clear/Refresh)

**Status:** ✅ Concluído (v2.9.6)
**Prioridade:** Imediata (Critical/User Flow)
**Componentes:** `ClearHandler.js`, `RefreshHandler.js`
**Tipo:** Testes / UI Logic
**Resolvido em:** 31/12/2025

---

## 🔗 Relacionado

**ISSUE Pai:** [ISSUES_v2.9.x](./ISSUES-OPEN-v2.9.x-Maintenance.md)

Identificado na auditoria de 31/12 que os handlers de interação da UI possuem **0% de cobertura de funções**. Eles controlam a limpeza de cache e atualização manual, fluxos críticos para o usuário.

---

## 📋 Problema Atual

### **Cobertura de Funções: 0%**
- `ClearHandler.js`: Responsável por limpar o storage e resetar a view.
- `RefreshHandler.js`: Dispara o refresh manual via UI.

Ambos contêm lógica de estado (loading, success, error) e interação com o DOM/Services que está totalmente descoberta. Se um handler falhar, o botão clica e "nada acontece" ou a UI trava.

## 📐 Padrões Arquiteturais Obrigatórios
- **[ADR 000-C: Padrão AAA](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)**: handlers devem testar `click` (Act) e verificar mudanças de DOM (Assert).

---

## ✅ Solução Proposta

### **Testes Unitários com Mocks de DOM:**
Como são handlers de UI acoplados a elementos HTML, devemos testar:
1.  **Binding:** O evento de click dispara a função?
2.  **Estado:** O botão entra em estado `loading`? Retorna ao normal após sucesso?
3.  **Delegação:** Chama o `RefresherService` ou `StorageService` corretamente?
4.  **Feedback:** Exibe o `Toaster` de sucesso/erro?

---

## 🛠️ Implementação Proposta

### **Exemplo para `RefreshHandler.test.js`:**

```javascript
import { RefreshHandler } from '../RefreshHandler';

test('clique deve disparar refresh e atualizar UI', async () => {
    // Arrange
    const btn = document.createElement('button');
    const refresherMock = { refresh: jest.fn().mockResolvedValue() };
    const handler = new RefreshHandler(btn, refresherMock);

    // Act
    btn.click();

    // Assert
    expect(btn.classList).toContain('loading'); // Verifica estado visual
    expect(refresherMock.refresh).toHaveBeenCalled(); // Verifica delegação
    
    await waitForPromises();
    expect(btn.classList).not.toContain('loading'); // Verifica cleanup
});
```

---

## 🧪 Plano de Testes

### **Cenários a Cobrir:**
1.  **Sucesso no Refresh:** UI bloqueia -> Serviço roda -> UI libera -> Toast Sucesso.
2.  **Erro no Refresh:** UI bloqueia -> Serviço falha -> UI libera -> Toast Erro.
3.  **Clear Cache:** Confirmação (se houver) -> Limpeza Storage -> Reload da Lista.

---

## ✅ Critérios de Sucesso

- [ ] Arquivos de teste criados para ambos os handlers.
- [ ] 100% de cobertura de funções (handlers são pequenos).
- [ ] Validação de transições de estado visual (loading spinners).

---


## 🔗 GitHub Issue

- **Status:** N/A  
- **Link:** Issue local concluída
- **Data:** -

---
**Tags:** `//ISSUE-ui-handlers-coverage` | **Tipo:** Testing | **Versão:** 2.9.6
**Criado:** 2025-12-31 | **Autor:** IA do Projeto
