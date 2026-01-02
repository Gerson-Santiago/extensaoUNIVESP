# 🛡️ ISSUE-039: Content Script Security Audit (SeiLoginContentScript)

**Status:** 📋 Aberta  
**Prioridade:** 🔴 Crítica (Security/Data Protection)  
**Componente:** `features/session/scripts/SeiLoginContentScript.js`  
**Versão:** v2.10.0+

---

## 🎯 Objetivo
Auditar a segurança do content script de autofill do SEI, garantindo que não introduz vetores de XSS, injeta dados com segurança e respeita princípios de privilégio mínimo.

## 📖 Contexto: Autofill = Dados Sensíveis

O `SeiLoginContentScript.js` é injetado em `https://sei.univesp.br/*` e preenche campos de login automaticamente. Isso envolve:
- **Dados sensíveis:** RA (Registro Acadêmico), potencialmente CPF.
- **Manipulação do DOM:** Seleciona inputs e preenche valores.

**Risco:** Se o script usar `innerHTML` ou não validar seletores, pode ser explorado para XSS.

---

## 🛠️ Auditoria Necessária

### 1. Análise de Injeção de Dados
**Verificar:**
- [ ] O script usa `element.value = data` (seguro) OU `innerHTML` (inseguro)?
- [ ] Dados recuperados do `chrome.storage` são validados antes do uso?

```javascript
// ✅ SEGURO
inputElement.value = storedRA;

// ❌ INSEGURO
inputElement.innerHTML = `<span>${storedRA}</span>`;
```

### 2. Seleção de Elementos
**Verificar:**
- [ ] Seletores CSS são específicos (ex: `input[name="username"]`) ou genéricos (`input`)?
- [ ] Se o SEI mudar estrutura, o script falha graciosamente ou quebra?

### 3. Armazenamento de Credenciais
**Verificar:**
- [ ] RA/CPF são armazenados em `chrome.storage.local` (não criptografado)?
- [ ] Se sim, adicionar criptografia (Issue-019 relacionada)?

**Regra MV3 (Relatório Seção 8.1):**  
> "Dados sensíveis devem ser criptografados antes do armazenamento."

### 4. Permissions Mínimas
**Verificar:**
- [ ] Content script está restrito a `https://sei.univesp.br/*` (manifest.json linha 23)?
- [ ] Não está vazando para outros domínios?

### 5. 🛡️ Testes de Segurança
- **Cenário 1:** Injetar HTML malicioso no storage. O script executa ou sanitiza?
- **Cenário 2:** Alterar estrutura do SEI (simular). O script falha sem erros fatais?

---

## ✅ Critérios de Aceite
- [ ] Zero uso de `innerHTML` no `SeiLoginContentScript.js`.
- [ ] Dados do storage validados (tipo string, não HTML).
- [ ] Credenciais criptografadas OU plano de criptografia documentado.
- [ ] Testes de segurança passam (injection test).

---

**Relacionado:** Issue-030 (XSS), Issue-019 (Encryption), ADR-012 (Security-First)  
**Tags:** `//ISSUE-content-script-security` | **Tipo:** Security/Audit
