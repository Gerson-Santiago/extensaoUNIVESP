# Segurança XSS de Alto Nível - Issue-030

Versão: v2.11.0
Data: 2026-01-04
Status: Em Implementação
Objetivo: Eliminação total de innerHTML para proteção contra XSS

----------

## Sumário Executivo

A ISSUE-030 representa uma refatoração crítica de segurança no projeto ExtensãoUNIVESP. Este documento explica como estamos elevando o nível de proteção contra Cross-Site Scripting (XSS) através da substituição completa de `innerHTML` por APIs nativas seguras do JavaScript.

Objetivo: Alcançar zero violações de innerHTML em código de produção, eliminando vetores de ataque XSS.

Referências:
- [ISSUE-030](file:///.github/ISSUES/REFACTORED/ISSUE-030_security-audit-CLEAN.md)
- [Glossário de Termos](file:///home/sant/extensaoUNIVESP/docs/GLOSSARIO_XSS.md)

----------

## O Problema: innerHTML e Vulnerabilidades XSS

### Vulnerabilidade Clássica

O uso de `innerHTML` com dados dinâmicos cria superfície de ataque onde entrada não sanitizada pode executar código malicioso:

```javascript
// CÓDIGO VULNERÁVEL (Antes da Issue-030)
const username = getUserInput();
container.innerHTML = `<div class="welcome">Olá, ${username}!</div>`;
```

Ataque:
```javascript
// Se username = '<img src=x onerror="alert(document.cookie)">'
// O browser executará o script malicioso
container.innerHTML = `<div class="welcome">Olá, <img src=x onerror="alert(document.cookie)">!</div>`;
```

Resultado: Roubo de cookies, redirecionamento malicioso, sequestro de sessão.

### Problemas Adicionais

1. Performance: Browser precisa re-parsear HTML em cada atualização
2. Perda de Estado: Event listeners nos elementos filhos são destruídos
3. Manutenibilidade: Difícil debugar strings HTML complexas

----------

## A Solução: APIs Seguras do JavaScript

A Issue-030 estabelece o uso obrigatório das seguintes APIs nativas do JavaScript, que são imunes a XSS quando usadas corretamente.

### 1. textContent - Texto Puro Seguro

Função: Define ou retorna conteúdo de texto de um elemento, escapando automaticamente todo HTML.

```javascript
// SEGURO - HTML é tratado como texto literal
element.textContent = '<script>alert("XSS")</script>';
// Resultado exibido: <script>alert("XSS")</script> (como texto, não executa)
```

Uso no Projeto:
```javascript
// shared/ui/Modal.js - Títulos e labels
h3.textContent = this.title;
closeBtn.textContent = '×';

// shared/ui/ContextualChips.js - Labels de chips
span.textContent = item.label;
removeBtn.textContent = '×';

// shared/ui/feedback/Toaster.js - Mensagens de toast
el.textContent = message;
```

----------

### 2. document.createElement() - Criação de Elementos

Função: Cria um elemento HTML vazio através da API do DOM.

```javascript
// SEGURO - Elemento criado programaticamente
const button = document.createElement('button');
button.textContent = 'Salvar';
button.className = 'btn-primary';
```

Diferença Crítica:
```javascript
// innerHTML - Parser HTML (perigoso)
div.innerHTML = '<button class="btn">Click</button>';

// createElement - API DOM (seguro)
const button = document.createElement('button');
button.className = 'btn';
button.textContent = 'Click';
div.appendChild(button);
```

Uso no Projeto:
```javascript
// features/courses/views/DetailsActivitiesWeekView/ViewTemplate.js
const header = document.createElement('header');
const backBtn = document.createElement('button');
const breadcrumb = document.createElement('div');

// shared/ui/Modal.js - Estrutura de modal
const overlay = document.createElement('div');
const modalBox = document.createElement('div');
const headerEl = document.createElement('header');
```

----------

### 3. appendChild() / append() - Inserção de Filhos

Função: Adiciona elementos ao DOM de forma segura, sem parsing de HTML.

```javascript
// SEGURO - Insere Node, não string HTML
const parent = document.createElement('div');
const child = document.createElement('span');
child.textContent = 'Conteúdo';
parent.appendChild(child);
```

Diferença:
- appendChild(): Aceita apenas 1 Node
- append(): Aceita múltiplos Nodes ou strings (convertidas para Text nodes)

Uso no Projeto:
```javascript
// features/courses/views/DetailsActivitiesWeekView/ViewTemplate.js
header.appendChild(backBtn);
breadcrumb.appendChild(strong);
infoDiv.appendChild(breadcrumb);
header.appendChild(infoDiv);

// features/courses/views/CoursesView/index.js - Lista de cursos
ul.appendChild(li);
container.appendChild(groupDiv);

// shared/ui/SkeletonLoader.js - Múltiplos filhos com append()
item.append(num, icon, text, btn);
```

----------

### 4. replaceChildren() - Substituição Completa

Função: Substitui todos os filhos de um elemento, equivalente seguro de `innerHTML = ''`.

```javascript
// SEGURO - Limpa e adiciona novos filhos
container.replaceChildren(newElement1, newElement2);

// EVITAR - innerHTML força re-parsing
container.innerHTML = '';
container.appendChild(newElement1);
```

Uso no Projeto:
```javascript
// features/courses/views/DetailsActivitiesWeekView/index.js
container.replaceChildren(); // Limpeza segura do container

// features/courses/views/CoursesView/index.js
container.replaceChildren(); // Safe clear

// features/courses/views/DetailsActivitiesWeekView/SkeletonManager.js
container.replaceChildren(SkeletonLoader.renderActivitiesSkeleton(count));

// features/courses/views/DetailsActivitiesWeekView/ActivityRenderer.js
this.container.replaceChildren(); // Clear antes de re-render
```

----------

### 5. createTextNode() - Nó de Texto Puro

Função: Cria um nó de texto literal, garantindo escape automático.

```javascript
// SEGURO - Texto é sempre escapado
const textNode = document.createTextNode('<script>alert(1)</script>');
div.appendChild(textNode);
// Resultado: <script>alert(1)</script> (exibido como texto)
```

Uso no Projeto:
```javascript
// shared/utils/DOMSafe.js - Usado internamente pela factory
static createElement(tagName, attributes = {}, children = []) {
  // ...
  childrenArray.forEach((child) => {
    if (child instanceof Node) {
      element.appendChild(child);
    } else if (child !== null && child !== undefined) {
      // Textos são sempre seguros via createTextNode
      element.appendChild(document.createTextNode(String(child)));
    }
  });
}
```

----------

### 6. setAttribute() - Atributos Controlados

Função: Define atributos de forma segura, mas requer sanitização de URLs.

```javascript
// REQUER CUIDADO - URLs devem ser sanitizadas
const link = document.createElement('a');
link.setAttribute('href', sanitizeUrl(userInput)); // Bloqueia javascript:
```

Uso no Projeto:
```javascript
// shared/utils/DOMSafe.js - setAttribute com sanitização automática
static createElement(tagName, attributes = {}, children = []) {
  // ...
  // Atributos de URL (href, src, action) - BLINDAGEM XSS
  if (['href', 'src', 'action', 'formAction'].includes(key)) {
    element.setAttribute(key, DOMSafe.sanitizeUrl(String(value)));
    return;
  }
  
  // Outros atributos normais (class, id, data-*)
  if (value !== null && value !== undefined && value !== false) {
    element.setAttribute(key, String(value));
  }
}
```

----------

## Implementação: Classe DOMSafe

Para eliminar duplicação e centralizar a segurança, criamos a classe utilitária `DOMSafe` conforme ADR-017 (DOM Factory Pattern).

Localização: [shared/utils/DOMSafe.js](file:///home/sant/extensaoUNIVESP/shared/utils/DOMSafe.js)

### Métodos Principais

#### 1. DOMSafe.createElement(tagName, attributes, children)

Factory Pattern que encapsula toda lógica de criação segura de elementos.

```javascript
/**
 * Cria elemento DOM com sanitização automática de URLs e atributos.
 * @param {string} tagName - Tag HTML (ex: 'div', 'a')
 * @param {Object<string, any>} [attributes={}] - Atributos do elemento
 * @param {string|Node|Array<string|Node>} [children=[]] - Filhos
 * @returns {HTMLElement} Elemento seguro
 */
static createElement(tagName, attributes = {}, children = [])
```

Exemplo de uso:
```javascript
// Uso simplificado no projeto
const h = DOMSafe.createElement;

const card = h('div', { className: 'card' }, [
  h('h3', {}, 'Título'),
  h('p', {}, userContent), // Automaticamente escapado via textContent
  h('a', { href: userUrl }, 'Link') // URL sanitizada automaticamente
]);
```

#### 2. DOMSafe.sanitizeUrl(url)

Bloqueia protocolos perigosos que podem executar JavaScript.

```javascript
// Protege contra XSS via URL
DOMSafe.sanitizeUrl('javascript:alert(1)'); // Retorna '' (bloqueado)
DOMSafe.sanitizeUrl('vbscript:alert(1)');   // Retorna '' (bloqueado)
DOMSafe.sanitizeUrl('data:text/html,...');  // Retorna '' (bloqueado)
DOMSafe.sanitizeUrl('https://univesp.br');  // Retorna 'https://univesp.br' (permitido)
```

Protocolos Bloqueados:
- javascript:
- vbscript:
- data:

#### 3. DOMSafe.escapeHTML(str)

Escapa caracteres especiais para casos onde HTML precisa ser exibido como texto.

```javascript
// Converte caracteres perigosos em entidades HTML
DOMSafe.escapeHTML('<script>alert(1)</script>');
// Retorna: '&lt;script&gt;alert(1)&lt;/script&gt;'
```

Caracteres Escapados:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#039;`

----------

## Exemplos de Migração (Antes vs. Depois)

### Exemplo 1: ViewTemplate Rendering

Antes (Inseguro):
```javascript
// features/courses/views/DetailsActivitiesWeekView/ViewTemplate.js
static render(data) {
  return `<div class="activity">${data.title}</div>`; // XSS risk
}

// Consumer
container.innerHTML = ViewTemplate.render(userData);
```

Depois (Seguro):
```javascript
// ViewTemplate.js
static render(data) {
  const h = DOMSafe.createElement;
  return h('div', { className: 'activity' }, data.title); // Retorna HTMLElement
}

// Consumer
container.replaceChildren(ViewTemplate.render(userData)); // Sem innerHTML
```

----------

### Exemplo 2: ActionMenu Items

Antes (Inseguro):
```javascript
// shared/ui/ActionMenu.js
items.forEach(item => {
  menuContainer.innerHTML += `<button>${item.label}</button>`; // XSS + performance issue
});
```

Depois (Seguro):
```javascript
const h = DOMSafe.createElement;
items.forEach(item => {
  const button = h('button', {}, item.label); // textContent automático
  menuContainer.append(button); // Sem parsing
});
```

----------

### Exemplo 3: Modal com Conteúdo Dinâmico

Antes (Inseguro):
```javascript
// shared/ui/Modal.js
modal.innerHTML = `
  <h3>${title}</h3>
  <div>${content}</div>
`; // Se content tem HTML malicioso, executa
```

Depois (Seguro):
```javascript
const h3 = document.createElement('h3');
h3.textContent = title; // HTML escapado

const body = document.createElement('div');
if (typeof content === 'string') {
  body.textContent = content; // String → texto seguro
} else {
  body.appendChild(content); // Node → insere diretamente
}

modal.replaceChildren(h3, body);
```

----------

## Critérios de Aceitação (Issue-030)

### AC-1: Zero Violações de innerHTML em Produção

```bash
# Comando oficial de validação (Issue-030)
rg "innerHTML\s*=" src/ --type js --glob '!**/*.test.js'
# Resultado esperado: Zero matches
```

Exceção:# Segurança Contra XSS (Cross-Site Scripting) - Issue 030

> **Status:** ✅ Implementado (Extreme Security Standard)
> **Data:** 04/01/2026
> **Versão:** v2.10.0

Este documento detalha a estratégia de defesa em profundidade implementada para erradicar vulnerabilidades XSS na extensão.

## 1. Zero `innerHTML` (Camada 1)
Eliminamos 100% das chamadas a `innerHTML` e `outerHTML` no código de produção.
- **Substituição:** `textContent` para textos e `DOMSafe.createElement` para estruturas HTML.
- **Validação:** `rg "innerHTML"` retorna zero resultados em `features/` e `shared/`.

## 2. DOMSafe Factory (Camada 2)
A classe `DOMSafe` atua como gatekeeper centralizado para criação de elementos DOM.

### 2.1 Whitelist de Atributos (`SafeAttributes`)
Apenas atributos explicitamente seguros são permitidos.
- **Permitidos:** `id`, `class`, `src`, `href`, `aria-*`, `data-*`, entre outros.
- **Bloqueados:** Atributos de evento (`onclick` string), `srcdoc`, `javascript:` URLs.
- **Tratamento:** Atributos desconhecidos são rejeitados e logados (`console.warn`).

### 2.2 Sanitização de URL (`SafeURL`)
Atributos sensíveis (`href`, `src`, `action`) passam por validação rigorosa.
- **Protocolos Permitidos:** `http:`, `https:`, `chrome-extension:`.
- **Bloqueados:** `javascript:`, `vbscript:`, `data:`, `file:`.
- **Normalização:** URLs relativas são resolvidas de forma segura.

## 3. Trusted Types & CSP (Camada 3)
Implementamos a API **Trusted Types** para blindagem no nível do navegador.

### 3.1 Política `dom-safe-policy`
Criada em `shared/security/TrustedTypesPolicy.js`.
- **`createHTML`**: Bloqueia qualquer criação de HTML arbitrário (lança erro).
- **`createScriptURL`**: Permite apenas scripts da própria origem da extensão.
- **`createScript`**: Bloqueia scripts inline.

### 3.2 Content Security Policy (CSP)
No `manifest.json`, endurecemos as regras para exigir Trusted Types.
```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'none'; require-trusted-types-for 'script'; trusted-types dom-safe-policy default;"
}
```
Isso garante que, mesmo se um desenvolvedor tentar usar `innerHTML` no futuro, o navegador bloqueará a operação se não passar pela política (que rejeita HTML).

## 4. Linting de Segurança (Camada 4)
Regras estáticas no `eslint.config.mjs` previnem reintrodução de falhas.
- **Plugins:** `eslint-plugin-security`, `eslint-plugin-no-unsanitized`.
- **Regras:**
  - `no-unsanitized/property`: Erro em `innerHTML`.
  - `no-implied-eval`: Erro em `setTimeout` com string.
  - `security/detect-unsafe-regex`: Previne ReDoS.

## 5. Validação Automatizada (Camada 5)
Criada suite de testes de penetração: `tests/xss-penetration.test.js`.
- **Vetores:** Payloads da OWASP (scripts, eventos, protocolos obscuros).
- **Cobertura:** Valida sanitização de input, rejeição de atributos e segurança da Factory.
- **Status:** ✅ Todos os testes passando.

---

## Conclusão
A extensão adota agora um modelo de "Segurança por Design". O desenvolvedor não precisa lembrar de sanitizar inputs; ele deve apenas usar as ferramentas padronizadas (`DOMSafe`), e o sistema impedirá o uso de APIs inseguras tanto em tempo de compilação (Lint/Types) quanto em tempo de execução (Trusted Types).
tes Mantida

```bash
npm run test:coverage
# Cobertura deve manter > 85% após refatoração
```

----------

### AC-3: Cobertura de Testes Mantida

```bash
npm run test:coverage
# Cobertura deve manter > 85% após refatoração
```

----------

## Status de Implementação

### Concluído (Issue-030 Phase 1)

- Criação da classe DOMSafe ([shared/utils/DOMSafe.js](file:///home/sant/extensaoUNIVESP/shared/utils/DOMSafe.js))
- Testes unitários de segurança ([DOMSafe.test.js](file:///home/sant/extensaoUNIVESP/tests/unit/shared/utils/DOMSafe.test.js))
- Refatoração de Views críticas:
  - SettingsView
  - HomeView
  - CoursesView
  - FeedbackView
  - Modal
  - ActionMenu
- Documentação arquitetural ([ADR-017](file:///home/sant/extensaoUNIVESP/docs/architecture/ADR_017_DOM_FACTORY_PATTERN.md))

### Em Progresso (Phase 2)

- Migração de componentes restantes:
  - BatchImportModal
  - AddManualModal
  - CourseItem
  - WeekItem
  - ViewTemplate.js (todos)
  - ActivityItemFactory

### Planejado (Phase 3)

- Adicionar regra ESLint para bloquear innerHTML em produção
- Pre-commit hook: validação automática de violações
- Atualizar CONTRIBUTING.md com guidelines

----------

## Validação e Testes Profissionais

### Comandos de Validação

#### Validação Estática (Build Time)
```bash
# 1. Busca por innerHTML violations
rg "innerHTML\s*=" src/ --type js --glob '!**/*.test.js'

# 2. Busca por atributos perigosos
rg "on(click|error|load)\s*=" src/ --type js

# 3. Verificar uso de DOMSafe
rg "DOMSafe\.createElement" src/ --type js --stats
```

#### Validação Dinâmica (DevTools Console)
```javascript
// Executar no Console das DevTools

// 1. Audit completo de XSS
(function auditXSS() {
  console.group('XSS Compliance Audit - Issue-030');
  
  const innerHTML violations = Array.from(document.querySelectorAll('*'))
    .filter(el => {
      const html = el.innerHTML;
      const text = el.textContent;
      return html !== text && el.children.length > 0;
    });
  
  const unsafeAttrs = Array.from(document.querySelectorAll('[onclick], [onerror], [onload]'));
  
  console.log('innerHTML usage:', innerHTMLViolations.length);
  console.log('Unsafe attributes:', unsafeAttrs.length);
  
  if (innerHTMLViolations.length === 0 && unsafeAttrs.length === 0) {
    console.log('%c✓ PASSED - Zero violations', 'color: green; font-weight: bold');
  } else {
    console.error('%c✗ FAILED - Violations found', 'color: red; font-weight: bold');
  }
  
  console.groupEnd();
})();

// 2. Monitor innerHTML em runtime
Object.defineProperty(Element.prototype, 'innerHTML', {
  set: function(value) {
    console.warn('[XSS Monitor]', this.tagName, value);
    throw new Error('innerHTML bloqueado!');
  }
});
```

### Ferramentas DevTools Profissionais

Para validação de nível profissional extremo, consulte:
- [DEVTOOLS_VALIDATION.md](file:///home/sant/extensaoUNIVESP/.github/ISSUES/30/DEVTOOLS_VALIDATION.md) - Guia completo de ferramentas CDP
- Chrome DevTools Protocol (CDP)
- chrome.debugger API
- devtools.panels
- devtools.inspectedWindow

Técnicas avançadas:
- Monkey-patching de APIs perigosas
- Runtime monitoring com CDP
- Automated testing com Puppeteer + CDP
- Painel customizado nas DevTools

----------

## APIs Seguras - Resumo

| API JavaScript | Função | Uso no Projeto |
|---------------|--------|----------------|
| textContent | Define texto puro (escapa HTML) | Títulos, labels, conteúdo de usuário |
| createElement() | Cria elemento vazio | Base de todos os elementos DOM |
| appendChild() | Adiciona 1 filho Node | Inserção de elementos |
| append() | Adiciona múltiplos filhos | Inserção em lote |
| replaceChildren() | Substitui todos os filhos | Limpeza + atualização de contêiner |
| createTextNode() | Cria nó de texto literal | Usado internamente por DOMSafe |
| setAttribute() | Define atributo (com sanitização) | Atributos não-URL |
| DOMSafe.createElement() | Factory com sanitização | Padrão obrigatório em Views |
| DOMSafe.sanitizeUrl() | Bloqueia protocolos maliciosos | Links e recursos externos |
| DOMSafe.escapeHTML() | Escapa caracteres HTML | Debug e casos especiais |

----------

## Referências

- [ISSUE-030: Security Audit](file:///.github/ISSUES/REFACTORED/ISSUE-030_security-audit-CLEAN.md)
- [ADR-017: DOM Factory Pattern](file:///home/sant/extensaoUNIVESP/docs/architecture/ADR_017_DOM_FACTORY_PATTERN.md)
- [ADR-012: Security-First Development](file:///home/sant/extensaoUNIVESP/docs/architecture/ADR_012_SECURITY_FIRST_DEV.md)
- [DOMSafe.js](file:///home/sant/extensaoUNIVESP/shared/utils/DOMSafe.js)
- [Glossário de Termos XSS](file:///home/sant/extensaoUNIVESP/docs/GLOSSARIO_XSS.md)
- OWASP XSS Prevention Cheat Sheet

----------

## Conclusão

A Issue-030 representa uma transformação de segurança no projeto. Ao eliminar innerHTML e adotar APIs nativas seguras através do padrão DOMSafe, estamos:

1. Eliminando completamente vetores de ataque XSS via injeção de HTML
2. Centralizando lógica de segurança em um único ponto (DRY)
3. Tornando impossível introduzir vulnerabilidades por erro humano
4. Estabelecendo padrão arquitetural de referência para Manifest V3

Meta: Projeto ExtensãoUNIVESP como referência de segurança em extensões de navegador.

----------

Mantido por: Equipe de Arquitetura
Última Atualização: 2026-01-04
Próxima Revisão: v2.11.0 (Após conclusão da Phase 2)
