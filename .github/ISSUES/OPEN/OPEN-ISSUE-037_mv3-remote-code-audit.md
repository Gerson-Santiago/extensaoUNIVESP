# 🛡️ ISSUE-037: Remotely Hosted Code Prohibition Audit

**Status:** 📋 Aberta  
**Prioridade:** 🔴 Crítica (Instant Rejection Risk)  
**Componente:** `All Files`  
**Versão:** v2.10.0+

---

## 🎯 Objetivo
Garantir **zero código remoto** (remotely hosted code) conforme exigido pelo Manifest V3, evitando rejeição instantânea por "Blue Argon" ou "Red Lithium".

## 📖 Contexto: A Regra Mais Estrita do MV3

**Proibição Absoluta:** Todo código JavaScript executado pela extensão DEVE estar no pacote `.crx` submetido.

### ❌ Violações Comuns
```javascript
// ❌ PROIBIDO: Carregar script de CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
document.head.appendChild(script);

// ❌ PROIBIDO: Fetch + eval
fetch('https://myserver.com/analytics.js')
  .then(r => r.text())
  .then(code => eval(code)); // Dupla violação!

// ❌ PROIBIDO: Injetar Google Analytics externo
```

**Consequência:** Rejeição imediata. Google não pode revisar código que muda após aprovação.

## 🛠️ Auditoria Necessária

### 1. Grep por Padrões Proibidos
```bash
# Buscar por fetch de .js
rg "fetch.*\\.js" --type js

# Buscar por createElement('script')
rg "createElement.*script" --type js

# Buscar por eval ou Function
rg "eval\\(|new Function" --type js
```

### 2. Verificar Dependências
- **Bibliotecas externas:** Se usado (ex: Chart.js), DEVE estar em `libs/` local.
- **CDN:** Nunca usar `<script src="https://cdn...">`.

### 3. Content Security Policy
- Verificar se o manifest define CSP restritiva (padrão MV3 já é restritivo).
- **Teste:** Se conseguir injetar `<script src="external">`, há violação.

### 4. 🛡️ Exceção Permitida: CSS
- **Permitido:** Carregar fontes do Google Fonts via CSS (`@import url(...)`).
- **Proibido:** Carregar scripts mesmo que sejam "só UI".

## ✅ Critérios de Aceite
- [ ] Zero resultado para grep de `fetch(*.js)`.
- [ ] Zero `eval()` ou `new Function()`.
- [ ] Todas as libs em `node_modules` ou empacotadas localmente.

---

**Relacionado:** [Remotely Hosted Code](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#remotely-hosted-code)  
**Tags:** `//ISSUE-mv3-remote-code` | **Tipo:** Security/Compliance
