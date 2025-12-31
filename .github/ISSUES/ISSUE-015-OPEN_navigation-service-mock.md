# 🧪 TEST-COV: Mock de Infraestrutura para NavigationService

**Status:** 📋 Planejado (v2.9.6)
**Prioridade:** Média (Infrastructure)
**Componentes:** `NavigationService`, `chrome.scripting`
**Tipo:** Testes / Infraestrutura

---

## 🔗 Relacionado

**ISSUE Pai:** [ISSUES_v2.9.6](./ISSUES_v2.9.6.md)

O `NavigationService` tem apenas 29.62% de cobertura porque sua lógica principal executa dentro do contexto da página (`executeScript`), ambiente difícil de testar com Jest padrão.

---

## 📋 Problema Atual

### **Dependência de `chrome.scripting`:**
O serviço injeta funções na aba ativa. Os testes atuais falham ao tentar simular isso sem um setup robusto de mocks.
Partes críticas não testadas:
- Lógica de scroll e detecção de altura da página.
- Retries e Timeouts.
- Tratamento de erros de injeção.

## 📐 Padrões Arquiteturais Obrigatórios
- **[ADR 000-C: Padrão AAA](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)**: Essencial para clareza em testes com mocks complexos de Chrome.

---

## ✅ Solução Proposta

### **Estratégia de Mocking:**
1.  **Mock da API Chrome:** Criar um mock completo para `chrome.scripting.executeScript` que simula o retorno de resultados da função injetada.
2.  **Testes de Funções Injetadas:** As funções que são enviadas para o browser (ex: `scrollToBottom`) devem ser exportadas isoladamente para serem testadas unitariamente num ambiente JSDOM local, garantindo que a lógica *dentro* da injeção funciona.

---

## 🛠️ Implementação Proposta

### **Estrutura de Teste:**

```javascript
// NavigationService.js
export const injectedScrollLogic = () => { /* ... */ }

// NavigationService.test.js
import { injectedScrollLogic } from '../NavigationService';

// Testar a função isolada
test('injectedScrollLogic deve rolar a página', () => {
    document.body.style.height = '2000px';
    injectedScrollLogic();
    expect(window.scrollY).toBeGreaterThan(0);
});

// Testar o serviço integrando com o mock
test('NavigationService deve chamar executeScript', async () => {
    chrome.scripting.executeScript.mockResolvedValue([{ result: true }]);
    await navigationService.autoScroll();
    expect(chrome.scripting.executeScript).toHaveBeenCalled();
});
```

---

## 🧪 Plano de Testes

### **Cenários a Cobrir:**
1.  **Injeção Sucesso:** Script roda e retorna valor.
2.  **Timeout:** Script trava ou página não carrega.
3.  **Permissão Negada:** Erro de extensão sem permissão na aba.
4.  **Lógica Visual:** Verificar se o cálculo de scroll atinge o final da página (simulado).

---

## ✅ Critérios de Sucesso

- [ ] Mocks de `chrome.scripting` implementados em `jest.setup.js` ou helper.
- [ ] Funções injetadas exportadas e testadas unitariamente com JSDOM.
- [ ] Cobertura de statements do `NavigationService.js` > 60%.

---

**Tags:** `//ISSUE-navigation-mock-coverage` | **Tipo:** Testing | **Versão:** 2.9.6
**Criado:** 2025-12-31 | **Autor:** Prof. Antigravity
