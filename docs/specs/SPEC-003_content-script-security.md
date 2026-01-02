# SPEC-003: Content Script Security Audit (SeiLoginContentScript)

**ID:** SPEC-003  
**Epic Parent:** EPIC-001 (Segurança e Conformidade MV3)  
**Prioridade:** 🔴 Crítica (Dados Sensíveis)  
**Estimativa:** 2 dias  
**Status:** 📋 Aberta  
**Owner:** Security Engineer + Dev Team  
**QA Reviewer:** QA Lead  
**Data:** 02/01/2026

---

## 🎯 Objetivo de Negócio

Auditar e fortalecer a segurança do content script `SeiLoginContentScript.js`, que lida com **dados sensíveis** (RA, potencialmente CPF) no autofill do Sistema Eletrônico de Informações (SEI).

**Justificativa ADR-012:**
> "Input Validation: Todo dado externo (AVA, usuário, storage) DEVE ser validado antes de uso."

**Justificativa CWS:**
> "If your product collects sensitive personal information, you must securely collect, store, and transmit all credit card and other sensitive personal information" (Accepting Payment / Data Handling)

---

## 📖 Contexto Técnico

### Arquivo em Audit
**Localização:** `features/session/scripts/SeiLoginContentScript.js`  
**Injection Point:** `manifest.json` linha 21-27:
```json
"content_scripts": [{
  "matches": ["https://sei.univesp.br/*"],
  "js": ["features/session/scripts/SeiLoginContentScript.js"],
  "run_at": "document_idle"
}]
```

**Funcionalidade:** Preenche campos de login do SEI automaticamente com dados do `chrome.storage.local`.

---

### Vetores de Ataque Potenciais

1. **XSS Injection (se usa innerHTML)**
   - RA malicioso: `<script>steal_session()</script>`
   - Risco: Código executado no contexto do SEI

2. **Storage Tampering**
   - Atacante local altera `chrome.storage.local` com dados maliciosos
   - Risco: Dados injetados no SEI sem validação

3. **Credential Exposure**
   - RA/CPF armazenados sem criptografia
   - Risco: Acesso físico ao disco expõe credenciais

---

## 📋 Requisitos Funcionais

### RF-001: Validação de Seleção de Elementos
**Objetivo:** Garantir que seletores CSS são específicos e robustos.

**Verificação:**
```javascript
// ❌ RUIM (genérico)
const input = document.querySelector('input');

// ✅ BOM (específico)
const raInput = document.querySelector('input[name="ra"]');
const cpfInput = document.querySelector('input[name="cpf"]');
```

**Critério:**
- [ ] Seletores usam atributos `name` ou `id` específicos (não apenas tipo de elemento).
- [ ] Se SEI mudar estrutura, script falha graciosamente (não quebra toda a extensão).

---

### RF-002: Validação de Dados do Storage
**Objetivo:** Garantir que dados lidos do `chrome.storage` são validados antes de injetar no DOM.

**Código Esperado:**
```javascript
// ✅ SEGURO
chrome.storage.local.get(['ra'], (result) => {
  const ra = result.ra;
  
  // Validação 1: Tipo
  if (typeof ra !== 'string') {
    console.error('RA inválido (tipo)');
    return;
  }
  
  // Validação 2: Formato (RA UNIVESP é numérico)
  if (!/^\d{7}$/.test(ra)) {
    console.error('RA inválido (formato)');
    return;
  }
  
  // Validação 3: Escapamento
  raInput.value = ra; // ✅ value é seguro (não innerHTML)
});
```

**Critérios:**
- [ ] Dados validados ANTES de uso (tipo + formato).
- [ ] Regex de validação específico (RA UNIVESP: 7 dígitos).
- [ ] Nenhum uso de `innerHTML` para injetar dados.

---

### RF-003: Fail-Safe em Caso de Erro
**Objetivo:** Script não deve quebrar o SEI se validação falhar.

**Código Esperado:**
```javascript
try {
  // lógica de autofill
} catch (error) {
  Logger.error('SeiLoginContentScript falhou', { error });
  // NÃO bloqueia o usuário de fazer login manualmente
}
```

**Critérios:**
- [ ] Erros são logados (Observable via `Logger.js` - ADR-005).
- [ ] Usuário pode continuar login manualmente se autofill falhar.

---

## 🔒 Requisitos Não-Funcionais

### RNF-001: Criptografia de Dados Sensíveis (ADR-012)
**Estado Atual:** `chrome.storage.local` **NÃO é criptografado no disco**.

**Decisão de Arquitetura:**
- **Opção A (Curto Prazo):** Aceitar risco (storage é isolado por extensão, mas não criptografado).
- **Opção B (Longo Prazo):** Implementar criptografia usando Web Crypto API antes de salvar.

**Para esta SPEC (v2.10.0):**
- [ ] Documentar limitação no README: "RA é armazenado localmente de forma não criptografada."
- [ ] Planejar Issue-041 para criptografia (pós-v2.10.0).

### RNF-002: Princípio de Privilégio Mínimo
- Content script deve rodar APENAS em `https://sei.univesp.br/*` (já configurado).
- **Validação:** Nenhum access a outros domínios via `manifest.json`.

---

## ✅ Critérios de Aceite (Testáveis)

### CA-001: Code Inspection
```bash
# ❌ NÃO pode usar innerHTML
rg "innerHTML" features/session/scripts/SeiLoginContentScript.js
# Resultado esperado: vazio

# ✅ DEVE validar tipo de dados
rg "typeof.*===.*'string'" features/session/scripts/SeiLoginContentScript.js
# Resultado esperado: encontrado
```

### CA-002: Injection Test (Manual)
**Cenário:** Injetar HTML malicioso no storage.

```javascript
// No console do DevTools da extensão:
chrome.storage.local.set({ 
  ra: '<img src=x onerror=alert("XSS")>' 
}, () => {
  // Navegar para https://sei.univesp.br
  // ESPERADO: RA não injeta tag <img>, apenas texto bruto no input
});
```

**Resultado Esperado:**
- Campo RA contém string literal `<img src=x...>` (não executa).
- Nenhum alert é disparado.

### CA-003: Structure Change Resilience Test
**Cenário:** Simular mudança de estrutura do SEI.

```javascript
// Modificar temporariamente seletor no código:
const raInput = document.querySelector('input[name="RA_ANTIGO"]'); // Não existe
```

**Resultado Esperado:**
- Script loga erro: "Elemento não encontrado".
- SEI continua funcional (usuário pode fazer login manual).

---

## 📦 Entregáveis

1. **Código Auditado:**
   - [ ] `SeiLoginContentScript.js` revisado e corrigido (se necessário).

2. **Testes:**
   - [ ] Teste de injeção XSS (manual).
   - [ ] Teste de resiliência (manual).

3. **Documentação:**
   - [ ] Atualizar README com nota sobre storage não-criptografado.
   - [ ] Criar Issue-041 para roadmap de criptografia (se aprovado).

---

## 🧪 Plano de Testes

### Teste 1: Validação de RA Malicioso
```javascript
// Arrange
chrome.storage.local.set({ ra: '<script>alert(1)</script>' });

// Act
// Navegar para https://sei.univesp.br e aguardar autofill

// Assert
const raInput = document.querySelector('input[name="ra"]');
expect(raInput.value).toBe('<script>alert(1)</script>'); // Texto literal
expect(document.querySelector('script')).toBeNull(); // Nenhuma tag injetada
```

### Teste 2: RA Inválido (Formato)
```javascript
// Arrange
chrome.storage.local.set({ ra: 'ABC1234' }); // Não numérico

// Act
// Tentar autofill

// Assert
// Verificar no console: "RA inválido (formato)"
// Campo permanece vazio
```

---

## 🔗 Dependencies

| Dependency | Tipo | Bloqueador? |
|------------|------|-------------|
| ADR-012 aprovado | Governança | ❌ Não |
| Chrome Web Crypto API (para criptografia futura) | Técnica | ❌ Não (fora de escopo v2.10.0) |
| Issue-039 fechada | Rastreamento | ✅ Sim (esta SPEC fecha Issue-039) |

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| SEI muda estrutura HTML | Média | Médio | Seletores específicos + graceful degradation |
| Storage não criptografado expõe RA | Baixa | Alto | Documentar limitação + planejar criptografia v2.11.0 |
| Validação de regex falha com RAs futuros | Baixa | Baixo | Tornar regex configurável (se aplicável) |

---

## 📅 Timeline Sugerido

| Dia | Atividade |
|-----|-----------|
| **D1** | Code inspection + implementar validações (se necessário) |
| **D2** | Testes de injeção XSS + resiliência + documentação |

---

**Aprovação QA Lead:** ✅ SPEC completa. Prioridade ALTA devido a dados sensíveis. Executar em paralelo com SPEC-001.
