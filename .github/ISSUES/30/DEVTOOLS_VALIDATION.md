# Ferramentas DevTools Profissionais - Validação XSS Issue-030

Versão: v2.11.0
Data: 2026-01-04
Status: Planejamento
Nível: Profissional Extremo / High Skills

----------

## Objetivo

Criar infraestrutura profissional de validação XSS usando Chrome DevTools Protocol (CDP) e APIs avançadas para garantir segurança extrema na eliminação de innerHTML.

----------

## Chrome DevTools Protocol (CDP)

### Visão Geral

O CDP permite controle profundo sobre o Chrome através de protocolo JSON-RPC via WebSocket. Oferece acesso a:

- DOM manipulation e inspection
- JavaScript debugging profundo
- Network monitoring
- Security analysis
- Performance profiling
- Console API avançada

### Domínios CDP Relevantes para XSS

#### 1. DOM Domain
Inspeção profunda da árvore DOM em tempo real.

```javascript
// Conectar ao CDP
const CDP = require('chrome-remote-interface');

async function auditDOM() {
  const client = await CDP();
  const {DOM, Runtime} = client;
  
  await DOM.enable();
  await Runtime.enable();
  
  // Obter documento root
  const {root} = await DOM.getDocument();
  
  // Buscar todos os elementos com innerHTML
  const result = await Runtime.evaluate({
    expression: `
      Array.from(document.querySelectorAll('*'))
        .filter(el => el.innerHTML !== el.textContent)
        .map(el => ({
          tag: el.tagName,
          innerHTML: el.innerHTML,
          textContent: el.textContent
        }))
    `,
    returnByValue: true
  });
  
  console.log('Elementos com innerHTML:', result.result.value);
}
```

#### 2. Runtime Domain
Execução e análise de JavaScript em tempo real.

```javascript
// Verificar uso de innerHTML em runtime
async function detectInnerHTMLUsage() {
  const client = await CDP();
  const {Runtime} = client;
  
  await Runtime.enable();
  
  // Monkey-patch innerHTML globalmente
  await Runtime.evaluate({
    expression: `
      (function() {
        const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(
          Element.prototype, 
          'innerHTML'
        ).set;
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
          set: function(value) {
            console.error('[XSS AUDIT] innerHTML usage detected!', {
              element: this.tagName,
              value: value,
              stack: new Error().stack
            });
            
            // Bloquear ou permitir baseado em critérios
            if (value.includes('<script>')) {
              throw new Error('XSS attempt blocked!');
            }
            
            return originalInnerHTMLSetter.call(this, value);
          }
        });
      })();
    `
  });
}
```

#### 3. Security Domain
Análise de violações de segurança.

```javascript
// Monitorar violações CSP e XSS
async function monitorSecurityIssues() {
  const client = await CDP();
  const {Security} = client;
  
  await Security.enable();
  
  // Listener para violações de segurança
  Security.securityStateChanged((params) => {
    console.log('Security state:', params);
  });
  
  Security.certificateError((params) => {
    console.error('Certificate error:', params);
  });
}
```

#### 4. Network Domain
Monitoramento de injeção via rede.

```javascript
// Interceptar e analisar respostas HTTP
async function auditNetworkResponses() {
  const client = await CDP();
  const {Network} = client;
  
  await Network.enable();
  
  Network.responseReceived(async (params) => {
    const {response, requestId} = params;
    
    // Obter corpo da resposta
    const {body} = await Network.getResponseBody({requestId});
    
    // Verificar padrões XSS
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];
    
    for (const pattern of xssPatterns) {
      if (pattern.test(body)) {
        console.warn('[XSS] Padrão suspeito detectado na resposta:', {
          url: response.url,
          pattern: pattern.source
        });
      }
    }
  });
}
```

----------

## Chrome Extension APIs

### 1. chrome.debugger API

Permite anexar ao protocolo CDP diretamente da extensão.

```javascript
// manifest.json
{
  "permissions": ["debugger"],
  "background": {
    "service_worker": "background.js"
  }
}

// background.js - Debugger attachment
async function attachDebugger(tabId) {
  const target = {tabId};
  const version = '1.3';
  
  await chrome.debugger.attach(target, version);
  
  // Enviar comandos CDP
  const result = await chrome.debugger.sendCommand(target, 'Runtime.evaluate', {
    expression: 'document.querySelectorAll("[onclick]").length'
  });
  
  console.log('Elementos com onclick:', result.result.value);
}

// Listener de eventos CDP
chrome.debugger.onEvent.addListener((source, method, params) => {
  if (method === 'Runtime.consoleAPICalled') {
    console.log('[Console]', params.args);
  }
});
```

### 2. devtools.panels

Cria painel customizado nas DevTools.

```javascript
// devtools.html
<!DOCTYPE html>
<html>
  <script src="devtools.js"></script>
</html>

// devtools.js
chrome.devtools.panels.create(
  'XSS Audit',
  'icons/xss-icon.png',
  'panel.html',
  (panel) => {
    console.log('Painel XSS criado');
  }
);

// panel.html - Interface do painel
<!DOCTYPE html>
<html>
<head>
  <title>XSS Security Audit</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    .violation { color: red; font-weight: bold; }
    .safe { color: green; }
  </style>
</head>
<body>
  <h1>XSS Security Audit - Issue-030</h1>
  <button id="scan">Scan DOM for innerHTML</button>
  <div id="results"></div>
  
  <script src="panel.js"></script>
</body>
</html>

// panel.js
document.getElementById('scan').addEventListener('click', async () => {
  const tabId = chrome.devtools.inspectedWindow.tabId;
  
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      const violations = [];
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        // Verificar se innerHTML foi usado
        if (el.innerHTML !== el.textContent && el.children.length > 0) {
          violations.push({
            tag: el.tagName,
            html: el.innerHTML.substring(0, 100)
          });
        }
      });
      
      return violations;
    })()
  `, (result, isException) => {
    if (!isException) {
      displayResults(result);
    }
  });
});

function displayResults(violations) {
  const results = document.getElementById('results');
  
  if (violations.length === 0) {
    results.innerHTML = '<p class="safe">✓ Nenhuma violação de innerHTML detectada!</p>';
  } else {
    results.innerHTML = `
      <p class="violation">⚠ ${violations.length} violações detectadas:</p>
      <ul>
        ${violations.map(v => `<li>${v.tag}: ${v.html}</li>`).join('')}
      </ul>
    `;
  }
}
```

### 3. devtools.inspectedWindow

Executa código na página inspecionada.

```javascript
// Executar audit na página atual
chrome.devtools.inspectedWindow.eval(`
  (function auditXSS() {
    const report = {
      innerHTMLUsage: [],
      unsafeAttributes: [],
      suspiciousScripts: []
    };
    
    // 1. Detectar innerHTML
    document.querySelectorAll('*').forEach(el => {
      if (el.innerHTML && el.innerHTML.includes('<')) {
        report.innerHTMLUsage.push({
          element: el.tagName,
          location: el.id || el.className
        });
      }
    });
    
    // 2. Detectar atributos perigosos
    const dangerousAttrs = ['onclick', 'onerror', 'onload'];
    dangerousAttrs.forEach(attr => {
      document.querySelectorAll(\`[\${attr}]\`).forEach(el => {
        report.unsafeAttributes.push({
          element: el.tagName,
          attribute: attr,
          value: el.getAttribute(attr)
        });
      });
    });
    
    // 3. Detectar scripts inline
    document.querySelectorAll('script:not([src])').forEach(script => {
      report.suspiciousScripts.push({
        content: script.textContent.substring(0, 100)
      });
    });
    
    return report;
  })()
`, (result, isException) => {
  console.log('XSS Audit Report:', result);
});
```

----------

## Estratégia de Validação Profissional

### Nível 1: Validação Estática (Build Time)

```bash
# 1. Grep avançado com ripgrep
rg "innerHTML\s*=" --type js --glob '!**/*.test.js' -A 3 -B 3

# 2. ESLint custom rule
# .eslintrc.js
rules: {
  'no-inner-html': 'error'
}

# 3. TypeScript checker (se usar TS)
tsc --noEmit
```

### Nível 2: Validação Dinâmica (Runtime)

```javascript
// Monkey-patching global para detectar violações
(function installXSSMonitor() {
  const originalInnerHTML = Object.getOwnPropertyDescriptor(
    Element.prototype,
    'innerHTML'
  );
  
  Object.defineProperty(Element.prototype, 'innerHTML', {
    set: function(value) {
      // Log em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.warn('[XSS Monitor] innerHTML usage:', {
          element: this,
          value: value,
          stack: new Error().stack
        });
      }
      
      // Bloquear em produção
      if (process.env.NODE_ENV === 'production') {
        throw new Error('innerHTML is forbidden in production!');
      }
      
      return originalInnerHTML.set.call(this, value);
    },
    get: originalInnerHTML.get
  });
})();
```

### Nível 3: Validação com DevTools (Manual QA)

```javascript
// Executar no DevTools Console
(function auditXSSCompliance() {
  console.group('📊 Issue-030 XSS Compliance Audit');
  
  // 1. Verificar DOMSafe usage
  const domSafeUsage = performance.getEntriesByType('measure')
    .filter(m => m.name.includes('DOMSafe'));
  console.log('DOMSafe usage:', domSafeUsage.length, 'calls');
  
  // 2. Verificar innerHTML violations
  const violations = Array.from(document.querySelectorAll('*'))
    .filter(el => {
      const desc = Object.getOwnPropertyDescriptor(el, 'innerHTML');
      return desc && desc.set !== undefined;
    });
  console.log('innerHTML setters found:', violations.length);
  
  // 3. Verificar textContent usage
  const textContentUsage = Array.from(document.querySelectorAll('*'))
    .filter(el => el.textContent && !el.innerHTML);
  console.log('✓ textContent usage:', textContentUsage.length, 'elements');
  
  console.groupEnd();
})();
```

### Nível 4: Validação Automatizada (E2E)

```javascript
// Puppeteer com CDP
const puppeteer = require('puppeteer');

async function e2eXSSAudit() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Anexar ao CDP
  const client = await page.target().createCDPSession();
  
  await client.send('Runtime.enable');
  await client.send('Security.enable');
  
  // Monitorar violações
  const violations = [];
  
  client.on('Runtime.consoleAPICalled', (event) => {
    if (event.type === 'error' && event.args[0].value.includes('innerHTML')) {
      violations.push(event);
    }
  });
  
  // Navegar e testar
  await page.goto('chrome-extension://[ID]/index.html');
  
  // Executar testes
  await page.evaluate(() => {
    // Tentar usar innerHTML (deve falhar)
    try {
      document.body.innerHTML = '<div>test</div>';
      return false; // Não deveria chegar aqui
    } catch (e) {
      return true; // Esperado - innerHTML bloqueado
    }
  });
  
  console.log('XSS Audit:', violations.length === 0 ? 'PASSED' : 'FAILED');
  
  await browser.close();
}
```

----------

## Implementação Recomendada

### Phase 1: DevTools Panel (Immediate)

1. Criar painel "XSS Audit" nas DevTools
2. Scan automático de innerHTML usage
3. Relatório visual de violações

### Phase 2: CDP Integration (Short-term)

1. Integrar chrome.debugger API
2. Monitoramento runtime de innerHTML
3. Alertas em tempo real

### Phase 3: Automated Testing (Mid-term)

1. Suite de testes E2E com Puppeteer + CDP
2. CI/CD integration
3. Regression testing automático

----------

## Critérios de Validação Profissional

- [ ] Zero innerHTML em production code (validado via grep)
- [ ] Zero violações runtime (monitorado via CDP)
- [ ] 100% cobertura de testes XSS
- [ ] DevTools panel operacional
- [ ] CI/CD com validação automática
- [ ] Documentação completa de ferramentas

----------

## Referências

- Chrome DevTools Protocol: https://chromedevtools.github.io/devtools-protocol/
- chrome.debugger API: https://developer.chrome.com/docs/extensions/reference/debugger/
- devtools.panels: https://developer.chrome.com/docs/extensions/reference/devtools_panels/
- Puppeteer CDP: https://pptr.dev/
- OWASP XSS Prevention: https://cheatsheetseries.owasp.org/

----------

Mantido por: Equipe de Arquitetura
Última Atualização: 2026-01-04
Status: Planejamento - Aguardando aprovação para implementação
